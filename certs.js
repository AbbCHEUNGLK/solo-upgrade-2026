// certs.js — 專業認證追蹤
// 改認證列表只需動 CERTS 陣列

const CERTS = [
  { id:'gda', logo:'📊', name:'Google Data Analytics',    sub:'Coursera · Professional Certificate', base:35 },
  { id:'ant', logo:'🤖', name:'Anthropic AI Courses',     sub:'Claude & Prompt Engineering',         base:20 },
  { id:'ibm', logo:'🔵', name:'IBM Data Science',         sub:'Coursera · Professional Certificate', base:0  },
  { id:'gai', logo:'☁️', name:'Google Generative AI',     sub:'Google Cloud Skills Boost',           base:0  },
  { id:'msa', logo:'🪟', name:'Microsoft AI Fundamentals',sub:'AI-900 · Microsoft Learn',            base:0  },
  { id:'gpm', logo:'📋', name:'Google Project Management',sub:'Coursera · Professional Certificate', base:0  },
];

const COURSES = [
  { id:'c101',  logo:'🎓', name:'Claude 101',       sub:'Anthropic Skilljar', base:100 },
  { id:'cc101', logo:'⌨️', name:'Claude Code 101',  sub:'Anthropic Skilljar', base:100 },
  { id:'ccw',   logo:'🤝', name:'Claude Cowork',    sub:'Anthropic Skilljar', base:30  },
];

const POSTS = [
  { id:'p1', name:'Week 1 · LinkedIn — AI 學習分享',      date:'本週內' },
  { id:'p2', name:'Week 2 · Substack — 知識輸出第一篇',  date:'第 2 週' },
  { id:'p3', name:'Week 3 · LinkedIn — 實際應用案例',     date:'第 3 週' },
  { id:'p4', name:'Week 4 · Substack — 月度總結反思',    date:'第 4 週' },
];

function renderCerts() {
  const cp = Storage.getCertProg();
  const pd = Storage.getPostsDone();
  const ch = Storage.getCourseHighlights();

  document.getElementById('page-area').innerHTML = `
<div class="page-inner">
  <div style="margin-bottom:24px">
    <div class="page-eyebrow">3 個月目標：2–3 個高價值 Certificate</div>
    <div class="page-title">專業認證</div>
  </div>

  <div class="cert-grid">
    ${CERTS.map(c => {
      const p = cp[c.id] !== undefined ? cp[c.id] : c.base;
      const s = p === 100 ? 'done' : p > 0 ? 'wip' : 'todo';
      const label = { done:'完成', wip:'進行中', todo:'待開始' }[s];
      return `
      <div class="cert-card">
        <div class="cert-card-top">
          <span class="cert-logo">${c.logo}</span>
          <span class="cert-badge badge-${s}">${label}</span>
        </div>
        <div class="cert-name">${c.name}</div>
        <div class="cert-sub">${c.sub}</div>
        <div class="cert-bar"><div class="cert-fill" style="width:${p}%"></div></div>
        <div class="cert-foot">
          <span class="cert-pct-text">${p}% 完成</span>
          <div class="cert-adj">
            <button class="cert-adj-btn" onclick="certAdj('${c.id}',-10)">−</button>
            <button class="cert-adj-btn" onclick="certAdj('${c.id}',10)">+</button>
          </div>
        </div>
      </div>`;
    }).join('')}
  </div>

  <div style="margin-top:32px">
    <div class="section-heading">Anthropic Skilljar Courses</div>
  </div>

  <div class="cert-grid">
    ${COURSES.map(c => {
      const p = cp[c.id] !== undefined ? cp[c.id] : c.base;
      const s = p === 100 ? 'done' : p > 0 ? 'wip' : 'todo';
      const label = { done:'完成', wip:'進行中', todo:'待開始' }[s];
      const note = ch[c.id] || '';
      const noteLabel = note.trim() ? '📝 我嘅重點' : '📝 我嘅重點（未加）';
      return `
      <div class="cert-card">
        <div class="cert-card-top">
          <span class="cert-logo">${c.logo}</span>
          <span class="cert-badge badge-${s}">${label}</span>
        </div>
        <div class="cert-name">${c.name}</div>
        <div class="cert-sub">${c.sub}</div>
        <div class="cert-bar"><div class="cert-fill" style="width:${p}%"></div></div>
        <div class="cert-foot">
          <span class="cert-pct-text">${p}% 完成</span>
          <div class="cert-adj">
            <button class="cert-adj-btn" onclick="courseAdj('${c.id}',-10)">−</button>
            <button class="cert-adj-btn" onclick="courseAdj('${c.id}',10)">+</button>
          </div>
        </div>
        <div class="course-notes">
          <div class="course-notes-label">${noteLabel}</div>
          <textarea class="course-notes-input" id="cn-${c.id}" rows="4"
            placeholder="貼喺 Cowork chat 整理好嘅重點..."
          >${esc(note)}</textarea>
          <button class="course-notes-save" onclick="saveCourseNote('${c.id}')">💾 儲存</button>
        </div>
      </div>`;
    }).join('')}
  </div>

  <div class="output-section" style="margin-top:32px">
    <div class="output-header">
      <div class="output-header-title">每週知識輸出</div>
      <div class="output-header-sub">LinkedIn · Substack — 分享學到嘅知識</div>
    </div>
    ${POSTS.map(p => `
    <div class="output-item${pd.includes(p.id) ? ' done' : ''}" onclick="postToggle('${p.id}')">
      <div class="output-chk">
        <svg width="8" height="6" viewBox="0 0 8 6" fill="none"
          style="display:${pd.includes(p.id) ? 'block' : 'none'}">
          <path d="M1 3l2 2L7 1" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <span class="output-name">${p.name}</span>
      <span class="output-date">${p.date}</span>
    </div>`).join('')}
  </div>
</div>`;
}

function certAdj(id, delta) {
  const cp = Storage.getCertProg();
  const base = CERTS.find(c => c.id === id)?.base || 0;
  cp[id] = Math.max(0, Math.min(100, (cp[id] !== undefined ? cp[id] : base) + delta));
  Storage.setCertProg(cp);
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
  // 短暫 visual feedback
  const btn = textarea.parentElement.querySelector('.course-notes-save');
  if (btn) {
    const orig = btn.innerHTML;
    btn.innerHTML = '✓ 已儲存';
    btn.style.color = 'var(--green, #2da06b)';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.color = '';
    }, 1500);
  }
}

function postToggle(id) {
  const pd = Storage.getPostsDone();
  const i = pd.indexOf(id);
  i >= 0 ? pd.splice(i, 1) : pd.push(id);
  Storage.setPostsDone(pd);
  renderCerts();
}
