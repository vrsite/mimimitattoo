const WORKER_URL = 'https://mimimi-admin-proxy.vadimirobertovich96.workers.dev';

let token = '';

async function api(path, options = {}) {
  const headers = options.headers || {};
  if (token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(WORKER_URL + path, { ...options, headers });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`API ${path} failed: ${res.status} ${t}`);
  }
  return res;
}

document.getElementById('btnLogin').onclick = async () => {
  const pass = document.getElementById('password').value.trim();
  try {
    const res = await fetch(WORKER_URL + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pass }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error('Неверный пароль');
    token = pass;
    localStorage.setItem('admin_token', token);
    document.getElementById('login').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    init();
  } catch (e) {
    document.getElementById('loginError').textContent = e.message;
  }
};

window.addEventListener('load', () => {
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

  document.querySelectorAll('.toolbar button[data-cmd]').forEach(btn => {
    btn.onclick = () => {
      const cmd = btn.getAttribute('data-cmd');
      const iframe = document.getElementById('editor');
      iframe.contentWindow.document.execCommand(cmd, false, null);
      iframe.contentWindow.focus();
    };
  });

  document.getElementById('branch').onchange = async () => {
    await loadEditor();
    await loadImages();
  };
}

function currentBranch() {
  return document.getElementById('branch').value || 'draft';
}

async function loadEditor() {
  const branch = currentBranch();
  const res = await api(`/file?path=index.html&branch=${encodeURIComponent(branch)}`, { method: 'GET' });
  const html = await res.text();

  const iframe = document.getElementById('editor');
  iframe.srcdoc = html;

  iframe.onload = () => {
    const doc = iframe.contentDocument;
    doc.body.setAttribute('contenteditable', 'true');
    const style = doc.createElement('style');
    style.textContent = `
      *:focus { outline: 1px dashed #4a90e2; }
      a, button, [onclick] { pointer-events:none; }
      video, iframe, script { pointer-events:none; }
    `;
    doc.head.appendChild(style);
  };
}

async function saveEditor() {
  const branch = currentBranch();
  const iframe = document.getElementById('editor');
  const doc = iframe.contentDocument.cloneNode(true);
  doc.body.removeAttribute('contenteditable');
  [...doc.head.querySelectorAll('style')].forEach(s => {
    if (s.textContent.includes('*:focus { outline')) s.remove();
  });

  const serializer = new XMLSerializer();
  let html = serializer.serializeToString(doc);
  if (!/^<!DOCTYPE html/i.test(html)) html = '<!DOCTYPE html>\n' + html;

  const base64 = btoa(unescape(encodeURIComponent(html)));
  await api('/file', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      path: 'index.html',
      contentBase64: base64,
      branch,
      message: `Edit index.html via admin (${branch})`,
    }),
  });
  alert('Сохранено!');
}

async function loadImages() {
  const branch = currentBranch();
  const res = await api(`/list-images?branch=${encodeURIComponent(branch)}`, { method: 'GET' });
  const data = await res.json();
  const cont = document.getElementById('images');
  cont.innerHTML = '';
  (data.files || []).forEach(f => {
    const card = document.createElement('div');
    card.className = 'card';
    const img = document.createElement('img');
    img.src = `https://raw.githubusercontent.com/${encodeURIComponent('vrsite')}/${encodeURIComponent('mimimitattoo')}/${encodeURIComponent(branch)}/${encodeURIComponent('images/portfolio')}/${encodeURIComponent(f.name)}`;
    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = f.name;

    const btnDel = document.createElement('button');
    btnDel.textContent = 'Удалить';
    btnDel.onclick = async () => {
      if (!confirm(\`Удалить ${f.name}?\`)) return;
      await api('/delete-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: f.name, branch }),
      });
      await loadImages();
    };

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(btnDel);
    cont.appendChild(card);
  });
}

async function uploadFiles() {
  const branch = currentBranch();
  const inp = document.getElementById('fileInput');
  if (!inp.files.length) return alert('Выберите файлы');
  for (const file of inp.files) {
    const fd = new FormData();
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
    body: JSON.stringify({ message: 'Publish draft → main' }),
  });
  const data = await res.json();
  if (!data.ok && !data.merged) {
    alert('Не удалось опубликовать: ' + JSON.stringify(data));
  } else {
    alert('Опубликовано!');
  }
}
