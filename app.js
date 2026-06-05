// app.js — 導航 + 初始化

const PAGE_NAMES = {
  home:    '首頁',
  daily:   '每日任務',
  session: 'Storytelling Session',
  ldr:     'Learn → Re-tell',
  certs:   '專業認證',
};

const NTASKS = 5;

function pct() {
  return Math.round(Storage.getTasksDone().length / NTASKS * 100);
}

function updateTopProgress() {
  const p = pct();
  const circ = 2 * Math.PI * 7;
  document.getElementById('prog-arc').style.strokeDashoffset = circ * (1 - p / 100);
  document.getElementById('prog-label').textContent = '今日 ' + p + '%';
  document.getElementById('nc-daily').textContent = Storage.getTasksDone().length + '/' + NTASKS;
}

// ─── 導航 ────────────────────────────────────
function go(page) {
  document.querySelectorAll('.nav-item, .mn-item').forEach(el => {
    el.classList.toggle('active', !!el.getAttribute('onclick')?.includes("'" + page + "'"));
  });
  document.getElementById('bc-page').textContent = PAGE_NAMES[page];
  ({ home: renderHome, daily: renderDaily, session: renderSession, ldr: renderLDR, certs: renderCerts })[page]?.();
  updateTopProgress();
  return false;
}

// ─── 本週打卡 ────────────────────────────────
function renderStreak() {
  const labels   = ['一','二','三','四','五','六','日'];
  const dow      = new Date().getDay();
  const todayIdx = dow === 0 ? 6 : dow - 1;
  const data     = Storage.getStreak();
  document.getElementById('streak-row').innerHTML = labels.map((l, i) => {
    const cls = 'sdot' + (data.includes(i) ? ' on' : '') + (i === todayIdx ? ' today' : '');
    return `<div class="${cls}" onclick="toggleStreak(${i})">${l}</div>`;
  }).join('');
}

async function toggleStreak(i) {
  const data = Storage.getStreak();
  data.includes(i) ? data.splice(data.indexOf(i), 1) : data.push(i);
  await Storage.setStreak(data);
  renderStreak();
}

// ─── 啟動：先從 Supabase 載入再 render ───────
async function init() {
  // 先顯示 loading 避免白屏
  document.getElementById('page-area').innerHTML =
    '<div style="padding:48px 56px;color:var(--text3);font-size:13px">載入中…</div>';

  await Storage.load();   // 從 Supabase 同步最新進度

  renderStreak();
  go('home');
}

init();
