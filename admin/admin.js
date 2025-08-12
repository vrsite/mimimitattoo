// ========== НАСТРОЙКИ ==========
const API_URL = 'https://mimimi-admin-proxy.vadimrobertovich96.workers.dev';

// ЭЛЕМЕНТЫ
const editor = document.getElementById('editor');
const branchSelect = document.getElementById('branch');
const pathInput = document.getElementById('path');
const reloadBtn = document.getElementById('reload');

// Редактор текстовых файлов
const editPath = document.getElementById('editPath');
const loadFileBtn = document.getElementById('loadFileBtn');
const saveFileBtn = document.getElementById('saveFileBtn');
const fileContent = document.getElementById('fileContent');
const fileShaEl = document.getElementById('fileSha');
const commitMessageEl = document.getElementById('commitMessage');

// Портфолио
const imagesDirInput = document.getElementById('imagesDir');
const refreshImagesBtn = document.getElementById('refreshImages');
const uploadInput = document.getElementById('uploadInput');
const uploadBtn = document.getElementById('uploadBtn');
const imagesGrid = document.getElementById('imagesGrid');

// ========== ВСПОМОГАТЕЛЬНЫЕ ==========
console.log('admin.js loaded');

async function api(path, opts = {}) {
  const url = `${API_URL}${path}`;
  const res = await fetch(url, {
    method: opts.method || 'GET',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    body: opts.body ? JSON.stringify(opts.body) : undefined
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* text not JSON */ }
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status} ${text}`);
  }
  return data;
}

function injectBaseAndStripScripts(html, baseHref) {
  // 1) Удаляем любые <script>...</script>
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  // и одиночные <script ...></script> без тела
  html = html.replace(/<script\b[^>]*>(?:\s*<\/script>)?/gi, '');
  // 2) Вставляем <base> в <head>, чтобы относительные пути работали
  if (/<head[^>]*>/i.test(html)) {
    html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${baseHref}">`);
  } else {
    html = `<head><base href="${baseHref}"></head>` + html;
  }
  return html;
}

// ========== ПРЕДПРОСМОТР ==========
async function loadPreview() {
  const path = (pathInput?.value || 'index.html').trim() || 'index.html';
  const branch = (branchSelect?.value || 'draft').trim() || 'draft';
  const resp = await api(`/file?path=${encodeURIComponent(path)}&branch=${encodeURIComponent(branch)}`);
  const baseHref = `https://vrsite.github.io/mimimitattoo/${branch}/`;
  const html = injectBaseAndStripScripts(resp.content || '', baseHref);
  if (editor) editor.srcdoc = html;
}

// ========== РЕДАКТОР ФАЙЛОВ ==========
let currentSha = null;

async function loadFileForEdit() {
  const branch = (branchSelect?.value || 'draft').trim() || 'draft';
  const path = (editPath?.value || '').trim();
  if (!path) return alert('Укажите путь к файлу');
  const resp = await api(`/file?path=${encodeURIComponent(path)}&branch=${encodeURIComponent(branch)}`);
  currentSha = resp.sha || null;
  fileContent.value = resp.content || '';
  fileShaEl.textContent = currentSha ? `sha: ${currentSha.slice(0, 7)}…` : '';
}

async function saveFile() {
  const branch = (branchSelect?.value || 'draft').trim() || 'draft';
  const path = (editPath?.value || '').trim();
  const content = fileContent.value ?? '';
  const message = (commitMessageEl?.value || '').trim() || `Update ${path}`;
  if (!path) return alert('Укажите путь к файлу');

  const resp = await api(`/file`, {
    method: 'PUT',
    body: { path, branch, content, message, ...(currentSha ? { sha: currentSha } : {}) }
  });
  alert('Сохранено');
  // после сохранения обновим sha
  currentSha = resp.content?.sha || resp.sha || null;
  await loadPreview().catch(console.error);
}

// ========== КАРТИНКИ ==========
async function loadImages() {
  const branch = (branchSelect?.value || 'draft').trim() || 'draft';
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
    const actions = document.createElement('div');
    actions.className = 'row';
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
    actions.appendChild(delBtn);
    meta.appendChild(name);
    meta.appendChild(actions);
    card.appendChild(img);
    card.appendChild(meta);
    imagesGrid.appendChild(card);
  }
}

function dataUrlToBase64(u) {
  // data:image/png;base64,AAAA -> AAAA
  const i = u.indexOf('base64,');
  return i >= 0 ? u.slice(i + 7) : u;
}

async function uploadSelectedFiles() {
  const branch = (branchSelect?.value || 'draft').trim() || 'draft';
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
      body: {
        dir, branch,
        name: file.name,
        contentBase64: b64,
        message: `Add ${dir}/${file.name}`
      }
    });
  }
  uploadInput.value = '';
  await loadImages().catch(console.error);
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
async function init() {
  // Предпросмотр
  await loadPreview().catch(console.error);
  reloadBtn?.addEventListener('click', (e) => { e.preventDefault(); loadPreview().catch(console.error); });
  branchSelect?.addEventListener('change', () => { loadPreview().catch(console.error); loadImages().catch(console.error); });

  // Редактор файлов
  editPath.value = pathInput.value || 'index.html';
  loadFileBtn?.addEventListener('click', () => loadFileForEdit().catch(console.error));
  saveFileBtn?.addEventListener('click', () => saveFile().catch(console.error));

  // Картинки
  refreshImagesBtn?.addEventListener('click', () => loadImages().catch(console.error));
  uploadBtn?.addEventListener('click', () => uploadSelectedFiles().catch(console.error));

  // Первичная загрузка
  await loadFileForEdit().catch(console.error);
  await loadImages().catch(console.error);
}

document.addEventListener('DOMContentLoaded', init);
