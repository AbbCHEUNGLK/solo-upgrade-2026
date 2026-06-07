// writer.js — Substack archive + reader + editor
// 3 tabs: 已發佈 / 在寫 / Ideas
// 點 row 可以 read，點 ✏️ 可以 edit，點 + 加新 可以新建

const _wui = {
  activeTab: 'published',   // 'published' | 'drafting' | 'idea'
  viewingPostId: null,      // 喺 reading view 時 set
  editingPostId: null,      // 'new' = 新建；string = 編輯現有
};

const _tabConfig = {
  published: { emoji: '📚', label: '已發佈' },
  drafting:  { emoji: '✍️', label: '在寫' },
  idea:      { emoji: '💡', label: 'Ideas' },
};

// ─── 主 render dispatch ────────────────────────────

function renderWriter() {
  if (_wui.viewingPostId) return _renderReader();
  if (_wui.editingPostId) return _renderEditor();
  return _renderList();
}

// ─── 合併 file-sourced + Supabase posts ──────────

function _allPosts() {
  // File posts（read-only，從 posts/manifest.js 嚟）— 標記 source: 'file'
  const filePosts = (window.PUBLISHED_POSTS || []).map(p => ({ ...p, source: 'file' }));
  const fileIds = new Set(filePosts.map(p => p.id));
  // Supabase posts — 如果 ID 同 file 衝突，file 嘅 wins
  const supabasePosts = Storage.getPosts()
    .filter(p => !fileIds.has(p.id))
    .map(p => ({ ...p, source: 'supabase' }));
  return [...filePosts, ...supabasePosts];
}

// ─── List view (3 tabs + post cards) ───────────────

function _renderList() {
  const posts = _allPosts();
  const counts = {
    published: posts.filter(p => p.status === 'published').length,
    drafting:  posts.filter(p => p.status === 'drafting').length,
    idea:      posts.filter(p => p.status === 'idea').length,
  };
  const filtered = posts
    .filter(p => p.status === _wui.activeTab)
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const tabsHtml = ['published', 'drafting', 'idea'].map(t => {
    const c = _tabConfig[t];
    const active = _wui.activeTab === t ? ' active' : '';
    return `<button class="writer-tab${active}" onclick="switchWriterTab('${t}')">${c.emoji} ${c.label} ${counts[t]}</button>`;
  }).join('');

  document.getElementById('page-area').innerHTML = `
<div class="page-inner">
  <div style="margin-bottom:24px">
    <div class="page-eyebrow">SUBSTACK WRITER</div>
    <div class="page-title">Substack Writer</div>
    <div class="page-sub-text">私人 archive · 每星期 1 篇結構化長文</div>
  </div>

  <div class="writer-tabs">
    ${tabsHtml}
    <button class="writer-new-btn" onclick="openWriterEditor('new')">+ 加新</button>
  </div>

  ${filtered.length === 0
    ? `<div class="writer-empty">
         <div class="writer-empty-icon">${_tabConfig[_wui.activeTab].emoji}</div>
         <div class="writer-empty-text">仲未有 ${_tabConfig[_wui.activeTab].label} 嘅 post</div>
         <div class="writer-empty-hint">撳 [+ 加新] 開始</div>
       </div>`
    : `<div class="writer-list">${filtered.map(_postCard).join('')}</div>`
  }
</div>`;
}

function _postCard(post) {
  const body = post.body || '';
  const snippet = body.replace(/^#+\s/gm, '').replace(/^[-*]\s/gm, '').replace(/^\d+\.\s/gm, '').trim().slice(0, 180);
  const wc = body.replace(/\s/g, '').length;
  const hasUrl = post.substackUrl && post.substackUrl.trim();
  const isFile = post.source === 'file';

  return `
  <div class="post-card" onclick="viewPost('${post.id}')">
    <div class="post-card-title">${esc(post.title || '(未命名)')}${isFile ? ' <span class="post-card-locked" title="由 posts/manifest.js 管理，需要喺 Cowork chat 改">🔒</span>' : ''}</div>
    <div class="post-card-meta">
      <span>${esc(post.date || '無日期')}</span>
      ${wc > 0 ? `<span>· 約 ${wc.toLocaleString()} 字</span>` : ''}
    </div>
    ${snippet ? `<div class="post-card-snippet">${esc(snippet)}…</div>` : ''}
    <div class="post-card-actions" onclick="event.stopPropagation()">
      ${hasUrl ? `<a class="post-card-link" href="${esc(post.substackUrl)}" target="_blank" rel="noopener">↗ Substack</a>` : ''}
      ${isFile ? '' : `<button class="post-card-edit" onclick="openWriterEditor('${post.id}')">✏️ 編輯</button>`}
    </div>
  </div>`;
}

// ─── Reader view ───────────────────────────────────

function _renderReader() {
  const post = _allPosts().find(p => p.id === _wui.viewingPostId);
  if (!post) { _wui.viewingPostId = null; return renderWriter(); }

  const hasUrl = post.substackUrl && post.substackUrl.trim();
  const isFile = post.source === 'file';

  document.getElementById('page-area').innerHTML = `
<div class="reader-view">
  <div class="reader-toolbar">
    <button class="reader-back" onclick="closePost()">← 返回</button>
    <div class="reader-toolbar-right">
      ${hasUrl ? `<a class="reader-substack" href="${esc(post.substackUrl)}" target="_blank" rel="noopener">↗ Substack 原文</a>` : ''}
      ${isFile ? '<span class="reader-locked" title="呢個 post 由 posts/manifest.js 管理，要 edit 請去 Cowork chat 同 Claude 講">🔒 file-sourced</span>' : `<button class="reader-edit" onclick="openWriterEditor('${post.id}')">✏️ 編輯</button>`}
    </div>
  </div>
  <article class="reader-article">
    <h1 class="reader-title">${esc(post.title)}</h1>
    <div class="reader-meta">${esc(post.date || '')}</div>
    <div class="reader-body">${_renderMarkdown(post.body || '')}</div>
  </article>
</div>`;
}

// ─── Editor view ───────────────────────────────────

function _renderEditor() {
  const posts = Storage.getPosts();
  const isNew = _wui.editingPostId === 'new';
  const post = isNew
    ? { id: 'p' + Date.now(), status: _wui.activeTab, title: '', date: new Date().toISOString().slice(0, 10), body: '', substackUrl: '' }
    : posts.find(p => p.id === _wui.editingPostId);
  // 如果 file-sourced post，唔可以 edit — 跳返出去
  if (!post && _wui.editingPostId !== 'new') {
    const filePost = (window.PUBLISHED_POSTS || []).find(p => p.id === _wui.editingPostId);
    if (filePost) {
      alert('呢個 post 由 posts/manifest.js 管理，要 edit 請去 Cowork chat 同 Claude 講。');
      _wui.editingPostId = null;
      return renderWriter();
    }
  }
  if (!post) { _wui.editingPostId = null; return renderWriter(); }

  document.getElementById('page-area').innerHTML = `
<div class="editor-view">
  <div class="reader-toolbar">
    <button class="reader-back" onclick="closeEditor()">← 取消</button>
    <div class="reader-toolbar-right">
      ${!isNew ? `<button class="editor-delete" onclick="deletePost('${post.id}')">🗑 刪除</button>` : ''}
      <button class="editor-save" onclick="savePost('${post.id}', ${isNew})">💾 儲存</button>
    </div>
  </div>

  <div class="editor-form">
    <label class="editor-label">標題</label>
    <input class="editor-input" id="ed-title" value="${esc(post.title)}" placeholder="例如：一勺香草雪糕的解構…">

    <div class="editor-row">
      <div class="editor-col">
        <label class="editor-label">日期</label>
        <input class="editor-input" id="ed-date" type="date" value="${esc(post.date)}">
      </div>
      <div class="editor-col">
        <label class="editor-label">狀態</label>
        <select class="editor-input" id="ed-status">
          <option value="idea"      ${post.status === 'idea'      ? 'selected' : ''}>💡 Idea</option>
          <option value="drafting"  ${post.status === 'drafting'  ? 'selected' : ''}>✍️ 在寫</option>
          <option value="published" ${post.status === 'published' ? 'selected' : ''}>📚 已發佈</option>
        </select>
      </div>
    </div>

    <label class="editor-label">Substack URL（已發佈時填）</label>
    <input class="editor-input" id="ed-url" value="${esc(post.substackUrl || '')}" placeholder="https://abbycheung1.substack.com/p/...">

    <label class="editor-label">內容（Markdown）</label>
    <textarea class="editor-textarea" id="ed-body" rows="24" placeholder="# 標題&#10;&#10;## 引言&#10;...">${esc(post.body || '')}</textarea>
    <div class="editor-hint">支援 Markdown：# 標題、**粗體**、*斜體*、[連結](url)、- bullet、1. number list、&gt; 引用、\`code\`</div>
  </div>
</div>`;
}

// ─── Markdown renderer（極簡版）──────────────────

function _renderMarkdown(md) {
  if (!md) return '';
  const lines = md.split('\n');
  const out = [];
  let inList = null;
  let para = [];

  function flushPara() {
    if (para.length) {
      const text = para.join(' ').trim();
      if (text) out.push(`<p>${_inlineMd(text)}</p>`);
      para = [];
    }
  }
  function flushList() {
    if (inList) { out.push(`</${inList}>`); inList = null; }
  }

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    if (!line.trim()) { flushPara(); flushList(); continue; }

    let m;
    if ((m = line.match(/^### (.+)$/)))  { flushPara(); flushList(); out.push(`<h3>${_inlineMd(m[1])}</h3>`); continue; }
    if ((m = line.match(/^## (.+)$/)))   { flushPara(); flushList(); out.push(`<h2>${_inlineMd(m[1])}</h2>`); continue; }
    if ((m = line.match(/^# (.+)$/)))    { flushPara(); flushList(); out.push(`<h1>${_inlineMd(m[1])}</h1>`); continue; }
    if ((m = line.match(/^\d+\.\s+(.+)$/))) {
      flushPara();
      if (inList !== 'ol') { flushList(); out.push('<ol>'); inList = 'ol'; }
      out.push(`<li>${_inlineMd(m[1])}</li>`);
      continue;
    }
    if ((m = line.match(/^[-*]\s+(.+)$/))) {
      flushPara();
      if (inList !== 'ul') { flushList(); out.push('<ul>'); inList = 'ul'; }
      out.push(`<li>${_inlineMd(m[1])}</li>`);
      continue;
    }
    if ((m = line.match(/^>\s?(.*)$/))) {
      flushPara(); flushList();
      out.push(`<blockquote>${_inlineMd(m[1])}</blockquote>`);
      continue;
    }

    flushList();
    para.push(line);
  }
  flushPara();
  flushList();
  return out.join('\n');
}

function _inlineMd(s) {
  return esc(s)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

// ─── 互動 handlers ─────────────────────────────────

function switchWriterTab(tab) {
  _wui.activeTab = tab;
  _wui.viewingPostId = null;
  _wui.editingPostId = null;
  renderWriter();
}

function openWriterEditor(id) {
  _wui.editingPostId = id;
  _wui.viewingPostId = null;
  renderWriter();
}

function closeEditor() {
  _wui.editingPostId = null;
  renderWriter();
}

function viewPost(id) {
  _wui.viewingPostId = id;
  _wui.editingPostId = null;
  renderWriter();
}

function closePost() {
  _wui.viewingPostId = null;
  renderWriter();
}

async function savePost(id, isNew) {
  const title  = document.getElementById('ed-title').value.trim();
  const date   = document.getElementById('ed-date').value;
  const status = document.getElementById('ed-status').value;
  const url    = document.getElementById('ed-url').value.trim();
  const body   = document.getElementById('ed-body').value;

  if (!title) { alert('請填標題'); return; }

  const posts = Storage.getPosts();
  if (isNew) {
    posts.push({ id, status, title, date, body, substackUrl: url });
  } else {
    const i = posts.findIndex(p => p.id === id);
    if (i >= 0) posts[i] = { ...posts[i], status, title, date, body, substackUrl: url };
  }
  await Storage.setPosts(posts);
  _wui.editingPostId = null;
  _wui.activeTab = status;
  renderWriter();
}

async function deletePost(id) {
  if (!confirm('真係要刪除呢個 post？')) return;
  const posts = Storage.getPosts().filter(p => p.id !== id);
  await Storage.setPosts(posts);
  _wui.editingPostId = null;
  renderWriter();
}
