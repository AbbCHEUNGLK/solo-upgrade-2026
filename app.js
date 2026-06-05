// app.js — 導航 + 初始化
// 加新頁面：1) 建 pages/xxx.js  2) 在 index.html 加 <script>  3) 在這裡加一行

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

// ─── 導航 ───────────────────────────────────
function go(page) {
  document.querySelectorAll('.nav-item, .mn-item').forEach(el => {
    el.classList.toggle('active', !!el.getAttribute('onclick')?.includes("'" + page + "'"));
  });
  document.getElementById('bc-page').textContent = PAGE_NAMES[page];
  const renders = { home: renderHome, daily: renderDaily, session: renderSession, ldr: renderLDR, certs: renderCerts };
  renders[page]?.();
  updateTopProgress();
  return false;
}

// ─── 本週打卡 ───────────────────────────────
function renderStreak() {
  const labels = ['一','二','三','四','五','六','日'];
  const dow = new Date().getDay();
  const todayIdx = dow === 0 ? 6 : dow - 1;
  const data = Storage.getStreak();
  document.getElementById('streak-row').innerHTML = labels.map((l, i) => {
    const cls = 'sdot' + (data.includes(i) ? ' on' : '') + (i === todayIdx ? ' today' : '');
    return `<div class="${cls}" onclick="toggleStreak(${i})">${l}</div>`;
  }).join('');
}
function toggleStreak(i) {
  const data = Storage.getStreak();
  data.includes(i) ? data.splice(data.indexOf(i), 1) : data.push(i);
  Storage.setStreak(data);
  renderStreak();
}

// ─── 啟動 ───────────────────────────────────
renderStreak();
go('home');
