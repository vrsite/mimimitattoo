console.log('admin.js loaded');
'use strict';

const WORKER_URL = 'https://mimimi-admin-proxy.vadimrobertovich96.workers.dev';

let token = '';

async function api(path, options = {}) {
  const headers = options.headers || {};
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(WORKER_URL + path, Object.assign({}, options, { headers }));
  if (!res.ok) {
    let t = '';
    try { t = await res.text(); } catch (e) {}
    throw new Error('API ' + path + ' failed: ' + res.status + ' ' + t);
  }
  return res;
}

document.getElementById('btnLogin').onclick = async function () {
  const pass = document.getElementById('password').value.trim();
  try {
    const res = await fetch(WORKER_URL + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pass })
    });
    const data = await res.json();
    if (!data.ok) throw new Error('Неверный пароль');
    token = pass;
    localStorage.setItem('admin_token', token);
    document.getElementById('login').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    init();
  } catch (e) {
    document.getElementById('loginError').textContent = e.message || String(e);
  }
};

window.addEventListener('load', function () {
  const saved = localStorage.getItem('admin_token');
  if (saved) {
    token = saved;
    document.getElementById('login').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    init();
  }
});

async function init() {
  await loadEditor();
  await loadImages();

  document.getElementById('btnSaveHtml').onclick = saveEditor;
  document.getElementById('btnUpload').onclick = uploadFiles;
  document.getElementById('btnPublish').onclick = publishDraft;

  var buttons = document.querySelectorAll('.toolbar button[data-cmd]');
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].onclick = function () {
      var cmd = this.getAttribute('data-cmd');
      var iframe = document.getElementById('editor');
      iframe.contentWindow.document.execCommand(cmd, false, null);
      iframe.contentWindow.focus();
    };
  }

  document.getElementById('branch').onchange = async function () {
    await loadEditor();
    await loadImages();
  };
}

function currentBranch() {
  var el = document.getElementById('branch');
  return (el && el.value) ? el.value : 'draft';
}

async function loadEditor() {
  var branch = currentBranch();
  const res = await api('/file?path=index.html&branch=' + encodeURIComponent(branch), { method: 'GET' });
  const html = await res.text();

  var iframe = document.getElementById('editor');
  iframe.srcdoc = html;

  iframe.onload = function () {
    var doc = iframe.contentDocument;
    if (!doc) return;
    doc.body.setAttribute('contenteditable', 'true');
    var style = doc.createElement('style');
    style.textContent = ''
      + '*:focus { outline: 1px dashed #4a90e2; }\n'
      + 'a, button, [onclick] { pointer-events:none; }\n'
      + 'video, iframe, script { pointer-events:none; }\n';
    doc.head.appendChild(style);
  };
}

async function saveEditor() {
  var branch = currentBranch();
  var iframe = document.getElementById('editor');
  var srcDoc = iframe.contentDocument;
  if (!srcDoc) return alert('Editor not ready');

  var doc = srcDoc.cloneNode(true);
  doc.body.removeAttribute('contenteditable');
  var styles = doc.head.querySelectorAll('style');
  for (var i = styles.length - 1; i >= 0; i--) {
    var s = styles[i];
    if ((s.textContent || '').indexOf('*:focus { outline') !== -1) s.remove();
  }

  var serializer = new XMLSerializer();
  var html = serializer.serializeToString(doc);
  if (!/^<!DOCTYPE html/i.test(html)) html = '<!DOCTYPE html>\n' + html;

  var base64 = btoa(unescape(encodeURIComponent(html)));
  await api('/file', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: 'index.html',
      contentBase64: base64,
      branch: branch,
      message: 'Edit index.html via admin (' + branch + ')'
    })
  });
  alert('Сохранено!');
}

async function loadImages() {
  var branch = currentBranch();
  const res = await api('/list-images?branch=' + encodeURIComponent(branch), { method: 'GET' });
  const data = await res.json();
  var cont = document.getElementById('images');
  cont.innerHTML = '';
  var files = data.files || [];
  for (var i = 0; i < files.length; i++) {
    (function (f) {
      var card = document.createElement('div');
      card.className = 'card';

      var img = document.createElement('img');
      img.src = 'https://raw.githubusercontent.com/'
        + encodeURIComponent('vrsite') + '/'
        + encodeURIComponent('mimimitattoo') + '/'
        + encodeURIComponent(branch) + '/'
        + encodeURIComponent('images/portfolio') + '/'
        + encodeURIComponent(f.name);

      var name = document.createElement('div');
      name.className = 'name';
      name.textContent = f.name;

      var btnDel = document.createElement('button');
      btnDel.textContent = 'Удалить';
      btnDel.onclick = async function () {
        if (!confirm('Удалить ' + f.name + '?')) return;
        await api('/delete-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: f.name, branch: branch })
        });
        await loadImages();
      };

      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(btnDel);
      cont.appendChild(card);
    })(files[i]);
  }
}

async function uploadFiles() {
  var branch = currentBranch();
  var inp = document.getElementById('fileInput');
  if (!inp.files.length) { alert('Выберите файлы'); return; }
  for (var i = 0; i < inp.files.length; i++) {
    var file = inp.files[i];
    var fd = new FormData();
    fd.append('file', file);
    fd.append('filename', file.name);
    fd.append('branch', branch);
    await api('/upload-image', { method: 'POST', body: fd });
  }
  alert('Загрузка завершена');
  await loadImages();
}

async function publishDraft() {
  if (!confirm('Опубликовать все изменения из draft в main?')) return;
  const res = await api('/publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Publish draft -> main' })
  });
  const data = await res.json();
  if (!data.ok && !data.merged) {
    alert('Не удалось опубликовать: ' + JSON.stringify(data));
  } else {
    alert('Опубликовано!');
  }
}
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
