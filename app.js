// app.js — 導航 + 初始化

const PAGE_NAMES = {
  home:    '首頁',
  daily:   '每日任務',
  session: 'Storytelling Session',
  ldr:     'Learn → Re-tell',
  writer:  'Substack Writer',
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

function go(page) {
  document.querySelectorAll('.nav-item, .mn-item').forEach(el => {
    el.classList.toggle('active', !!el.getAttribute('onclick')?.includes("'" + page + "'"));
  });
  document.getElementById('bc-page').textContent = PAGE_NAMES[page];
  ({
    home:    renderHome,
    daily:   renderDaily,
    session: renderSession,
    ldr:     renderLDR,
    writer:  renderWriter,
    certs:   renderCerts,
  })[page]?.();
  updateTopProgress();
  return false;
}

function computeStreak() {
  // 連續日有 >=1 task done。今日如果零 task，由琴日開始計（仲未失 streak）
  const today = new Date();
  let count = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const done = Storage.getTasksDone(key).length;
    if (done > 0) {
      count++;
    } else if (i === 0) {
      // 今日仲未做 — 唔當 break，繼續睇琴日
      continue;
    } else {
      break;
    }
  }
  return count;
}

function renderStreak() {
  const streak = computeStreak();
  const titleEl = document.querySelector('.streak-title');
  if (titleEl) titleEl.textContent = 'Daily Streak';
  const row = document.getElementById('streak-row');
  if (row) {
    row.innerHTML = `
      <div class="streak-num"><span class="streak-flame">🔥</span><span class="streak-n">${streak}</span></div>
      <div class="streak-label">${streak === 1 ? 'day' : 'days'} 連續</div>
    `;
  }
}

async function init() {
  document.getElementById('page-area').innerHTML =
    '<div style="padding:48px 56px;color:var(--text3);font-size:13px">載入中…</div>';
  await Storage.load();
  renderStreak();
  go('home');
}

init();
