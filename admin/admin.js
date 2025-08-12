// ===== КОНФИГ =====
const API_URL = 'https://mimimi-admin-proxy.vadimrobertovich96.workers.dev';
const AUTH_KEY = 'mimimiAdminOK';
const CONTENT_ROOT = ''; // сайт публикуется из корня ветки main

// ЭЛЕМЕНТЫ
const app = document.getElementById('app');

// Login UI
const loginView = document.getElementById('loginView');
const loginBtn = document.getElementById('loginBtn');
const loginResetBtn = document.getElementById('loginReset');
const adminPasswordEl = document.getElementById('adminPassword');
const loginError = document.getElementById('loginError');
const togglePwdBtn = document.getElementById('togglePwd');

// Header
const logoutBtn = document.getElementById('logoutBtn');

// Files
const refreshFilesBtn = document.getElementById('refreshFiles');
const filesUl = document.getElementById('filesUl');
const filesCount = document.getElementById('filesCount');

// Editor
const editPath = document.getElementById('editPath');
const loadFileBtn = document.getElementById('loadFileBtn');
const saveFileBtn = document.getElementById('saveFileBtn');
const fileContent = document.getElementById('fileContent');
const fileShaEl = document.getElementById('fileSha');
const commitMessageEl = document.getElementById('commitMessage');
const editor = document.getElementById('editor');

// Images
const imagesDirInput = document.getElementById('imagesDir');
const refreshImagesBtn = document.getElementById('refreshImages');
const uploadInput = document.getElementById('uploadInput');
const uploadBtn = document.getElementById('uploadBtn');
const imagesGrid = document.getElementById('imagesGrid');

console.log('admin.js loaded v37');

// ===== API =====
async function api(path, opts = {}) {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    method: opts.method || 'GET',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    cache: 'no-store',
    credentials: 'include'
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch {}
  if (!res.ok) {
    const msg = `API ${path} failed: ${res.status} ${text}`;
    console.error(msg);
    throw new Error(msg);
  }
  return data;
}

// ===== Утилиты =====
function joinPath(...parts) {
  return parts.filter(Boolean).join('/').replace(/\/{2,}/g, '/');
}

// Базовый URL сайта для корректного предпросмотра (автоматически убираем /admin/…)
const SITE_BASE = (() => {
  try {
    const u = new URL(document.baseURI);
    const parts = u.pathname.split('/').filter(Boolean);
    const i = parts.indexOf('admin');
    const root = i >= 0 ? '/' + parts.slice(0, i).join('/') + '/' : '/';
    return `${u.origin}${root}`;
  } catch {
    return window.location.origin + '/';
  }
})();

function injectBaseAndStripScripts(html, baseHref) {
  html = (html || '').replace(/<script[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<script\b[^>]*>(?:\s*<\/script>)?/gi, '');
  if (/<head[^>]*>/i.test(html)) {
    html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${baseHref}">`);
  } else {
    html = `<head><base href="${baseHref}"></head>` + html;
  }
  return html;
}

function showApp() {
  loginView.style.display = 'none';
  app.style.visibility = 'visible';
}
function showLogin() {
  app.style.visibility = 'hidden';
  loginView.style.display = 'flex';
  adminPasswordEl.value = '';
  adminPasswordEl.focus();
  loginError.style.display = 'none';
}

// ===== Аутентификация =====
async function doLogin() {
  const pwd = (adminPasswordEl.value || '').trim();
  if (!pwd) return;
  try {
    const d = await api('/login', { method: 'POST', body: { password: pwd } });
    if (d?.ok) {
      sessionStorage.setItem(AUTH_KEY, '1');
      showApp();
      await initAfterLogin();
    } else {
      loginError.textContent = 'Неверный пароль. Попробуйте снова.';
      loginError.style.display = 'block';
      adminPasswordEl.focus();
    }
  } catch {
    loginError.textContent = 'Ошибка входа. Проверьте соединение и попробуйте снова.';
    loginError.style.display = 'block';
  }
}
function doLogout() {
  sessionStorage.removeItem(AUTH_KEY);
  api('/logout', { method: 'POST', body: {} }).finally(() => showLogin());
}

// ===== Файлы =====
let currentSha = null;

async function loadFilesList() {
  const data = await api(`/list-files?branch=${encodeURIComponent('main')}`);
  const prefix = CONTENT_ROOT ? `${CONTENT_ROOT}/` : '';
  const allow = /\.(html?|css|js)$/i;
  const files = (data.files || [])
    .filter(f => f.path.startsWith(prefix))
    .filter(f => allow.test(f.path))
    .filter(f => !/^admin\//i.test(f.path.slice(prefix.length)));

  files.sort((a,b) => a.path.localeCompare(b.path));
  filesUl.innerHTML = '';
  filesCount.textContent = String(files.length);

  if (!files.length) {
    filesUl.innerHTML = `<li class="muted">Файлов не найдено${CONTENT_ROOT ? ` в ${CONTENT_ROOT}/` : ''}</li>`;
    return;
  }

  for (const f of files) {
    const displayPath = f.path.slice(prefix.length);
    const li = document.createElement('li');
    li.innerHTML = `<span>${displayPath}</span><span class="tag">${(f.size || 0)}b</span>`;
    li.addEventListener('click', async () => {
      Array.from(filesUl.children).forEach(x => x.classList.remove('active'));
      li.classList.add('active');
      editPath.value = displayPath;
      await loadFileForEdit();
    });
    filesUl.appendChild(li);
  }

  const idx = Array.from(filesUl.children).find(li => li.textContent.trim().startsWith('index.html'));
  if (idx) idx.click();
}

async function loadFileForEdit() {
  const displayPath = (editPath?.value || '').trim();
  if (!displayPath) return;
  const fullPath = joinPath(CONTENT_ROOT, displayPath);
  const resp = await api(`/file?path=${encodeURIComponent(fullPath)}&branch=${encodeURIComponent('main')}`);
  currentSha = resp.sha || null;
  fileContent.value = resp.content || '';
  fileShaEl.textContent = currentSha ? `sha: ${currentSha.slice(0,7)}…` : '';

  const html = injectBaseAndStripScripts(resp.content || '', SITE_BASE);
  editor.srcdoc = html;
}

async function saveFile() {
  const displayPath = (editPath?.value || '').trim();
  if (!displayPath) return alert('Выберите файл слева');
  const fullPath = joinPath(CONTENT_ROOT, displayPath);
  const content = fileContent.value ?? '';
  const message = (commitMessageEl?.value || '').trim() || `Update ${fullPath}`;

  const resp = await api(`/file`, {
    method: 'PUT',
    body: { path: fullPath, branch: 'main', content, message, ...(currentSha ? { sha: currentSha } : {}) }
  });
  currentSha = resp.content?.sha || resp.sha || null;
  fileShaEl.textContent = currentSha ? `sha: ${currentSha.slice(0,7)}…` : '';
  alert('Сохранено. Обновление сайта займёт 10–60 секунд (кеш GitHub Pages).');
  await loadFileForEdit().catch(console.error);
}

// ===== Изображения =====
async function loadImages() {
  const dir = (imagesDirInput?.value || 'images/portfolio').trim();
  const resp = await api(`/list-images?dir=${encodeURIComponent(dir)}&branch=${encodeURIComponent('main')}`);
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
          body: { path: it.path, branch: 'main', sha: it.sha, message: `Delete ${it.path}` }
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
      body: { dir, branch: 'main', name: file.name, contentBase64: b64, message: `Add ${dir}/${file.name}` }
    });
  }
  uploadInput.value = '';
  await loadImages().catch(console.error);
}

// ===== Инициализация =====
async function initAfterLogin() {
  await loadFilesList().catch(console.error);
  await loadImages().catch(console.error);

  refreshFilesBtn?.addEventListener('click', () => loadFilesList().catch(console.error));
  loadFileBtn?.addEventListener('click', () => loadFileForEdit().catch(console.error));
  saveFileBtn?.addEventListener('click', () => saveFile().catch(console.error));
  refreshImagesBtn?.addEventListener('click', () => loadImages().catch(console.error));
  uploadBtn?.addEventListener('click', () => uploadSelectedFiles().catch(console.error));
  logoutBtn?.addEventListener('click', doLogout);
}

function initLoginUI() {
  togglePwdBtn?.addEventListener('click', () => {
    const t = adminPasswordEl.type === 'password' ? 'text' : 'password';
    adminPasswordEl.type = t;
    togglePwdBtn.textContent = t === 'password' ? 'Показать' : 'Скрыть';
  });
  loginBtn?.addEventListener('click', doLogin);
  loginResetBtn?.addEventListener('click', () => { adminPasswordEl.value=''; loginError.style.display='none'; adminPasswordEl.focus(); });
  adminPasswordEl?.addEventListener('keydown', (e) => { if (e.key === 'Enter') doLogin(); });
}

document.addEventListener('DOMContentLoaded', async () => {
  initLoginUI();
  const ok = sessionStorage.getItem(AUTH_KEY) === '1';
  if (ok) { showApp(); await initAfterLogin(); } else { showLogin(); }
});
