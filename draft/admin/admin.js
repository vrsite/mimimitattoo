// ========== НАСТРОЙКИ ==========
const API_URL = 'https://mimimi-admin-proxy.vadimrobertovich96.workers.dev';

// ЭЛЕМЕНТЫ
const branchSelect = document.getElementById('branch');
const logoutBtn = document.getElementById('logoutBtn');

// Файлы
const refreshFilesBtn = document.getElementById('refreshFiles');
const filesUl = document.getElementById('filesUl');

// Редактор
const editPath = document.getElementById('editPath');
const loadFileBtn = document.getElementById('loadFileBtn');
const saveFileBtn = document.getElementById('saveFileBtn');
const fileContent = document.getElementById('fileContent');
const fileShaEl = document.getElementById('fileSha');
const commitMessageEl = document.getElementById('commitMessage');
const editor = document.getElementById('editor');

// Картинки
const imagesDirInput = document.getElementById('imagesDir');
const refreshImagesBtn = document.getElementById('refreshImages');
const uploadInput = document.getElementById('uploadInput');
const uploadBtn = document.getElementById('uploadBtn');
const imagesGrid = document.getElementById('imagesGrid');

console.log('admin.js loaded');

// ========== API ==========
async function api(path, opts = {}) {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    method: opts.method || 'GET',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* not JSON */ }
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status} ${text}`);
  return data;
}

// ========== ВСПОМОГАТЕЛЬНЫЕ ==========
function currentBranch() {
  return (branchSelect?.value || 'main').trim() || 'main';
}

function injectBaseAndStripScripts(html, baseHref) {
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script\b[^>]*>(?:\s*<\/script>)?/gi, '');
  if (/<head[^>]*>/i.test(html)) {
    html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${baseHref}">`);
  } else {
    html = `<head><base href="${baseHref}"></head>` + html;
  }
  return html;
}

// ========== Список файлов ==========
async function loadFilesList() {
  const branch = currentBranch();
  const data = await api(`/list-files?branch=${encodeURIComponent(branch)}`);
  const files = (data.files || []).filter(f =>
    !/^admin\//i.test(f.path) && // чтобы не правили саму админку случайно
    !/^images\//i.test(f.path)   // изображения в другом разделе
  );

  filesUl.innerHTML = '';
  if (!files.length) {
    filesUl.innerHTML = `<li class="muted">Файлов не найдено</li>`;
    return;
  }

  for (const f of files) {
    const li = document.createElement('li');
    li.textContent = f.path;
    li.addEventListener('click', async () => {
      // визуально активный
      Array.from(filesUl.children).forEach(x => x.classList.remove('active'));
      li.classList.add('active');
      editPath.value = f.path;
      await loadFileForEdit();
    });
    filesUl.appendChild(li);
  }

  // автоселект index.html, если есть
  const idx = Array.from(filesUl.children).find(li => li.textContent === 'index.html');
  if (idx) idx.click();
}

// ========== Редактор файлов ==========
let currentSha = null;

async function loadFileForEdit() {
  const branch = currentBranch();
  const path = (editPath?.value || '').trim();
  if (!path) return;
  const resp = await api(`/file?path=${encodeURIComponent(path)}&branch=${encodeURIComponent(branch)}`);
  currentSha = resp.sha || null;
  fileContent.value = resp.content || '';
  fileShaEl.textContent = currentSha ? `sha: ${currentSha.slice(0, 7)}…` : '';
  // предпросмотр
  const baseHref = `https://vrsite.github.io/mimimitattoo/${branch}/`;
  const html = injectBaseAndStripScripts(resp.content || '', baseHref);
  if (editor) editor.srcdoc = html;
}

async function saveFile() {
  const branch = currentBranch();
  const path = (editPath?.value || '').trim();
  const content = fileContent.value ?? '';
  const message = (commitMessageEl?.value || '').trim() || `Update ${path}`;
  if (!path) return alert('Выберите файл слева');

  const resp = await api(`/file`, {
    method: 'PUT',
    body: { path, branch, content, message, ...(currentSha ? { sha: currentSha } : {}) }
  });
  currentSha = resp.content?.sha || resp.sha || null;
  fileShaEl.textContent = currentSha ? `sha: ${currentSha.slice(0, 7)}…` : '';
  alert('Сохранено. Изменения на главном сайте появятся через 10–60 секунд (кеш GitHub Pages).');
  await loadFileForEdit().catch(console.error);
}

// ========== Картинки ==========
async function loadImages() {
  const branch = currentBranch();
  const dir = (imagesDirInput?.value || 'images/portfolio').trim();
  const resp = await api(`/list-images?dir=${encodeURIComponent(dir)}&branch=${encodeURIComponent(branch)}`);
  const list = resp.images || [];
  imagesGrid.innerHTML = '';
  if (!list.length) {
    imagesGrid.innerHTML = `<div class="muted">Нет файлов в ${dir}</div>`;
    return;
  }
  for (const it of list) {
    const card = document.createElement('div');
    card.className = 'card';
    const img = document.createElement('img');
    img.src = it.download_url;
    img.alt = it.name;
    const meta = document.createElement('div');
    meta.className = 'meta';
    const name = document.createElement('div');
    name.textContent = it.name;
    const delBtn = document.createElement('button');
    delBtn.className = 'danger';
    delBtn.textContent = 'Удалить';
    delBtn.addEventListener('click', async () => {
      if (!confirm(`Удалить ${it.name}?`)) return;
      try {
        await api(`/delete-image`, {
          method: 'DELETE',
          body: { path: it.path, branch, sha: it.sha, message: `Delete ${it.path}` }
        });
        await loadImages();
      } catch (e) {
        alert('Не удалось удалить: ' + e.message);
      }
    });
    meta.appendChild(name);
    meta.appendChild(delBtn);
    card.appendChild(img);
    card.appendChild(meta);
    imagesGrid.appendChild(card);
  }
}

function dataUrlToBase64(u) {
  const i = u.indexOf('base64,');
  return i >= 0 ? u.slice(i + 7) : u;
}

async function uploadSelectedFiles() {
  const branch = currentBranch();
  const dir = (imagesDirInput?.value || 'images/portfolio').trim();
  const files = Array.from(uploadInput.files || []);
  if (!files.length) return alert('Выберите файлы');
  for (const file of files) {
    const b64 = await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(dataUrlToBase64(String(r.result || '')));
      r.onerror = () => reject(r.error || new Error('read error'));
      r.readAsDataURL(file);
    });
    await api(`/upload-image`, {
      method: 'POST',
      body: { dir, branch, name: file.name, contentBase64: b64, message: `Add ${dir}/${file.name}` }
    });
  }
  uploadInput.value = '';
  await loadImages().catch(console.error);
}

// ========== Логин/Логаут (очень простой) ==========
function ensureLoggedIn() {
  const ok = localStorage.getItem('mimimiAdminOK') === '1';
  if (!ok) {
    const pwd = prompt('Введите пароль администратора');
    if (!pwd) { alert('Пароль не введён'); location.href = '../'; return; }
    // проверим на бэке (можно и не проверять — но пусть будет)
    api('/login', { method: 'POST', body: { password: pwd } })
      .then(d => {
        if (d?.ok) {
          localStorage.setItem('mimimiAdminOK', '1');
          initAfterLogin();
        } else {
          alert('Неверный пароль');
          location.href = '../';
        }
      })
      .catch(() => { alert('Ошибка входа'); location.href = '../'; });
  } else {
    initAfterLogin();
  }
}

function logout() {
  localStorage.removeItem('mimimiAdminOK');
  api('/logout', { method: 'POST', body: {} }).finally(() => {
    location.reload();
  });
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
async function initAfterLogin() {
  // Список файлов
  await loadFilesList().catch(console.error);

  // Картинки
  await loadImages().catch(console.error);

  // Слушатели
  refreshFilesBtn?.addEventListener('click', () => loadFilesList().catch(console.error));
  loadFileBtn?.addEventListener('click', () => loadFileForEdit().catch(console.error));
  saveFileBtn?.addEventListener('click', () => saveFile().catch(console.error));
  refreshImagesBtn?.addEventListener('click', () => loadImages().catch(console.error));
  uploadBtn?.addEventListener('click', () => uploadSelectedFiles().catch(console.error));
  branchSelect?.addEventListener('change', () => { loadFilesList().catch(console.error); loadImages().catch(console.error); });
  logoutBtn?.addEventListener('click', logout);
}

document.addEventListener('DOMContentLoaded', ensureLoggedIn);
