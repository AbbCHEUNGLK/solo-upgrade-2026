// certs.js — 專業認證 + Anthropic Courses + 每週輸出
// 改認證列表動 CERTS；改課程動 COURSES；改每週輸出動 POSTS

const CERTS = [
  { id:'gda', logo:'📊', name:'Google Data Analytics',    sub:'Coursera · Professional Certificate', base:35 },
  { id:'ant', logo:'🤖', name:'Anthropic AI Courses',     sub:'Claude & Prompt Engineering',         base:20 },
  { id:'ibm', logo:'🔵', name:'IBM Data Science',         sub:'Coursera · Professional Certificate', base:0  },
  { id:'gai', logo:'☁️', name:'Google Generative AI',     sub:'Google Cloud Skills Boost',           base:0  },
  { id:'msa', logo:'🪟', name:'Microsoft AI Fundamentals',sub:'AI-900 · Microsoft Learn',            base:0  },
  { id:'gpm', logo:'📋', name:'Google Project Management',sub:'Coursera · Professional Certificate', base:0  },
];

const COURSES = [
  { id:'c101',  logo:'🎓', name:'Claude 101',                            sub:'Anthropic Academy', base:100 },
  { id:'cc101', logo:'⌨️', name:'Claude Code 101',                       sub:'Anthropic Academy', base:100 },
  { id:'ccw',   logo:'🤝', name:'Claude Cowork',                         sub:'Anthropic Academy', base:100 },
  { id:'aif',   logo:'🧠', name:'AI Fluency: Framework & Foundations',   sub:'Anthropic Academy', base:100 },
  { id:'bwca',  logo:'🔧', name:'Building with Claude API',              sub:'Anthropic Academy', base:100 },
];

const POSTS = [
  { id:'p1', name:'Week 1 · LinkedIn — AI 學習分享',      date:'本週內' },
  { id:'p2', name:'Week 2 · Substack — 知識輸出第一篇',  date:'第 2 週' },
  { id:'p3', name:'Week 3 · LinkedIn — 實際應用案例',     date:'第 3 週' },
  { id:'p4', name:'Week 4 · Substack — 月度總結反思',    date:'第 4 週' },
];

// ─── UI 狀態（in-memory，唔同步雲端）───────────────
const _ui = {
  expandedSections: new Set(['certs', 'courses', 'posts']),  // 預設全展開
  expandedRows: new Set(),                                    // 預設冇 row 展開
};

const _statusLabel = { done:'完成', wip:'進行中', todo:'待開始' };
function _statusOf(p) { return p === 100 ? 'done' : p > 0 ? 'wip' : 'todo'; }

// ─── 渲染 helpers ──────────────────────────────────

function _sectionHeader(secId, title, sub, count, total) {
  const exp = _ui.expandedSections.has(secId);
  return `
  <div class="section-card-header" onclick="toggleSection('${secId}')">
    <div class="sch-left">
      <div class="sch-title">${title}</div>
      ${sub ? `<div class="sch-sub">${sub}</div>` : ''}
    </div>
    <div class="sch-right">
      <span class="sch-count">${count} of ${total}</span>
      <span class="sch-chevron ${exp ? 'open' : ''}">▾</span>
    </div>
  </div>`;
}

function _progressRow(item, kind, cp, ch) {
  const p = cp[item.id] !== undefined ? cp[item.id] : item.base;
  const s = _statusOf(p);
  const expanded = _ui.expandedRows.has(item.id);
  const adjFn = kind === 'course' ? 'courseAdj' : 'certAdj';

  let body = '';
  if (expanded) {
    body += `
    <div class="row-body">
      <div class="row-progress-bar"><div class="row-progress-fill" style="width:${p}%"></div></div>
      <div class="row-progress-controls">
        <span class="row-progress-pct">${p}%</span>
        <div class="row-adj">
          <button class="row-adj-btn" onclick="event.stopPropagation();${adjFn}('${item.id}',-10)">−</button>
          <button class="row-adj-btn" onclick="event.stopPropagation();${adjFn}('${item.id}',10)">+</button>
        </div>
      </div>`;

    if (kind === 'course') {
      const note = ch[item.id] || '';
      body += `
      <div class="row-notes">
        <div class="row-notes-label">📝 我嘅重點</div>
        <textarea class="row-notes-input" id="cn-${item.id}" rows="5"
          placeholder="貼喺 Cowork chat 整理好嘅重點..."
          onclick="event.stopPropagation()"
        >${esc(note)}</textarea>
        <button class="row-notes-save" onclick="event.stopPropagation();saveCourseNote('${item.id}')">💾 儲存</button>
      </div>`;
    }
    body += `</div>`;
  }

  return `
  <div class="list-row ${expanded ? 'expanded' : ''}" onclick="toggleRow('${item.id}')">
    <div class="row-head">
      <div class="row-logo">${item.logo}</div>
      <div class="row-main">
        <div class="row-name">${item.name}</div>
        <div class="row-sub">${item.sub}</div>
      </div>
      <div class="row-meta">
        <span class="row-pct">${p}%</span>
        <span class="row-status badge-${s}">${_statusLabel[s]}</span>
        <span class="row-chevron ${expanded ? 'open' : ''}">▸</span>
      </div>
    </div>
    ${body}
  </div>`;
}

function _postRow(post, isDone) {
  return `
  <div class="list-row post-row ${isDone ? 'done' : ''}" onclick="postToggle('${post.id}')">
    <div class="row-head">
      <div class="row-checkbox">
        <svg width="10" height="8" viewBox="0 0 8 6" fill="none"
          style="display:${isDone ? 'block' : 'none'}">
          <path d="M1 3l2 2L7 1" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="row-main">
        <div class="row-name">${post.name}</div>
      </div>
      <div class="row-meta">
        <span class="row-date">${post.date}</span>
      </div>
    </div>
  </div>`;
}

// ─── 主 render ────────────────────────────────────

function renderCerts() {
  const cp = Storage.getCertProg();
  const pd = Storage.getPostsDone();
  const ch = Storage.getCourseHighlights();

  const certDone   = CERTS.filter(c   => (cp[c.id] !== undefined ? cp[c.id] : c.base) === 100).length;
  const courseDone = COURSES.filter(c => (cp[c.id] !== undefined ? cp[c.id] : c.base) === 100).length;

  document.getElementById('page-area').innerHTML = `
<div class="page-inner">
  <div style="margin-bottom:24px">
    <div class="page-eyebrow">3 個月目標：2–3 個高價值 Certificate</div>
    <div class="page-title">專業認證</div>
  </div>

  <div class="section-card">
    ${_sectionHeader('certs', '🏆 專業認證', '長期目標', certDone, CERTS.length)}
    ${_ui.expandedSections.has('certs') ? `
    <div class="section-card-body">
      ${CERTS.map(c => _progressRow(c, 'cert', cp, ch)).join('')}
    </div>` : ''}
  </div>

  <div class="section-card">
    ${_sectionHeader('courses', '🎓 Anthropic Skilljar Courses', '逐個課程進度同重點筆記', courseDone, COURSES.length)}
    ${_ui.expandedSections.has('courses') ? `
    <div class="section-card-body">
      ${COURSES.map(c => _progressRow(c, 'course', cp, ch)).join('')}
    </div>` : ''}
  </div>

  <div class="section-card">
    ${_sectionHeader('posts', '✍️ 每週知識輸出', 'LinkedIn · Substack — 分享學到嘅知識', pd.length, POSTS.length)}
    ${_ui.expandedSections.has('posts') ? `
    <div class="section-card-body">
      ${POSTS.map(p => _postRow(p, pd.includes(p.id))).join('')}
    </div>` : ''}
  </div>
</div>`;
}

// ─── 互動 handlers ─────────────────────────────────

function toggleSection(secId) {
  if (_ui.expandedSections.has(secId)) _ui.expandedSections.delete(secId);
  else _ui.expandedSections.add(secId);
  renderCerts();
}

function toggleRow(rowId) {
  if (_ui.expandedRows.has(rowId)) _ui.expandedRows.delete(rowId);
  else _ui.expandedRows.add(rowId);
  renderCerts();
}

async function certAdj(id, delta) {
  const cp = Storage.getCertProg();
  const base = CERTS.find(c => c.id === id)?.base || 0;
  cp[id] = Math.max(0, Math.min(100, (cp[id] !== undefined ? cp[id] : base) + delta));
  await Storage.setCertProg(cp);
  renderCerts();
}

async function courseAdj(id, delta) {
  const cp = Storage.getCertProg();
  const base = COURSES.find(c => c.id === id)?.base || 0;
  cp[id] = Math.max(0, Math.min(100, (cp[id] !== undefined ? cp[id] : base) + delta));
  await Storage.setCertProg(cp);
  renderCerts();
}

async function saveCourseNote(id) {
  const textarea = document.getElementById('cn-' + id);
  if (!textarea) return;
  const ch = Storage.getCourseHighlights();
  ch[id] = textarea.value;
  await Storage.setCourseHighlights(ch);
  const btn = textarea.parentElement.querySelector('.row-notes-save');
  if (btn) {
    const orig = btn.innerHTML;
    btn.innerHTML = '✓ 已儲存';
    btn.style.color = 'var(--green)';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.color = '';
    }, 1500);
  }
}

async function postToggle(id) {
  const pd = Storage.getPostsDone();
  const i = pd.indexOf(id);
  i >= 0 ? pd.splice(i, 1) : pd.push(id);
  await Storage.setPostsDone(pd);
  renderCerts();
}
