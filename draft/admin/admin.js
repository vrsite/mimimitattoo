// ========== НАСТРОЙКИ ==========
const API_URL = 'https://mimimi-admin-proxy.vadimrobertovich96.workers.dev';

// Эти элементы должны существовать в admin/index.html
const editor = document.getElementById('editor');           // <iframe id="editor">
const pathInput = document.getElementById('path');          // <input id="path" value="index.html">
const branchSelect = document.getElementById('branch');     // <select id="branch"> (draft/main)
const reloadBtn = document.getElementById('reload');        // <button id="reload">Обновить</button>

// ========== ВСПОМОГАТЕЛЬНЫЕ ==========
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
  // 1) Удаляем все <script>...</script>, чтобы избежать предупреждений в sandbox-iframe
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  // Также удалим одиночные теги <script src=...> если встречаются
  html = html.replace(/<script\b[^>]*>(?:\s*<\/script>)?/gi, '');

  // 2) Вставляем <base href="..."> в <head>, чтобы относительные пути работали
  if (/<head[^>]*>/i.test(html)) {
    html = html.replace(/<head([^>]*)>/i, `<head$1><base href="${baseHref}">`);
  } else {
    html = `<head><base href="${baseHref}"></head>` + html;
  }
  return html;
}

// ========== ОСНОВНАЯ ФУНКЦИЯ ПРЕДПРОСМОТРА ==========
async function loadEditor() {
  const path = (pathInput?.value || 'index.html').trim() || 'index.html';
  const branch = (branchSelect?.value || 'draft').trim() || 'draft';

  // 1) Получаем файл из GitHub через воркер
  const resp = await api(`/file?path=${encodeURIComponent(path)}&branch=${encodeURIComponent(branch)}`);

  // 2) Готовим baseHref на ваш GitHub Pages для выбранной ветки
  const baseHref = `https://vrsite.github.io/mimimitattoo/${branch}/`;

  // 3) Чистим скрипты + добавляем <base>, чтобы картинки, CSS и видео грузились корректно
  const html = injectBaseAndStripScripts(resp.content || '', baseHref);

  // 4) Помещаем в iframe через srcdoc (скрипты уже вырезаны — ошибок sandbox не будет)
  if (editor) {
    editor.srcdoc = html;
  }
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
async function init() {
  try {
    await loadEditor();
  } catch (e) {
    console.error('Failed to load editor:', e);
    alert('Не удалось загрузить страницу: ' + e.message);
  }
  // Обработчики для обновления
  reloadBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    loadEditor().catch(console.error);
  });
  branchSelect?.addEventListener('change', () => loadEditor().catch(console.error));
  pathInput?.addEventListener('change', () => loadEditor().catch(console.error));
}

document.addEventListener('DOMContentLoaded', init);
