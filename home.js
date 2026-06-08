// home.js — 首頁
// 改首頁內容只需動這個檔案

const _homeUI = {
  viewedYM: null,       // 'YYYY-MM'；null = 今月
  selectedDate: null,   // 'YYYY-MM-DD'；null = 冇 cell 揀
  firstRender: true,    // 第一次 render 自動揀今日
};

function _currentViewedYM() {
  return _homeUI.viewedYM || new Date().toISOString().slice(0, 7);
}

// ─── Calendar render ──────────────────────────────

function _calLevel(count) {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;  // 4 或 5
}

function _renderCalendar() {
  const ym = _currentViewedYM();
  const [y, m] = ym.split('-').map(Number);
  const firstDay = new Date(y, m - 1, 1);
  const lastDay = new Date(y, m, 0);
  const startWeekday = firstDay.getDay();   // 0 = 日（Sunday）
  const daysInMonth = lastDay.getDate();

  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);

  // Build cells: leading blanks + days
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const count = Storage.getTasksDone(dateKey).length;
    cells.push({ date: dateKey, day: d, count });
  }

  const weekdayLabels = ['日', '一', '二', '三', '四', '五', '六'];
  const monthLabel = `${y} 年 ${m} 月`;

  const cellsHtml = cells.map(cell => {
    if (!cell) return `<div class="cal-cell cal-empty"></div>`;
    const level = _calLevel(cell.count);
    const isToday = cell.date === todayKey;
    const isSelected = cell.date === _homeUI.selectedDate;
    const isFuture = cell.date > todayKey;
    const classes = ['cal-cell', `cal-l${level}`];
    if (isToday) classes.push('cal-today');
    if (isSelected) classes.push('cal-selected');
    if (isFuture) classes.push('cal-future');
    return `<div class="${classes.join(' ')}" onclick="calSelect('${cell.date}')" title="${cell.date} · ${cell.count}/${NTASKS}">${cell.day}</div>`;
  }).join('');

  return `
  <div class="cal-container">
    <div class="cal-header">
      <button class="cal-nav" onclick="calNav(-1)">←</button>
      <div class="cal-title">${monthLabel}</div>
      <button class="cal-nav" onclick="calNav(1)">→</button>
    </div>
    <div class="cal-weekdays">
      ${weekdayLabels.map(l => `<div class="cal-wd">${l}</div>`).join('')}
    </div>
    <div class="cal-grid">
      ${cellsHtml}
    </div>
  </div>
  ${_homeUI.selectedDate ? _renderDayDetail() : ''}`;
}

function _renderDayDetail() {
  const date = _homeUI.selectedDate;
  const todayKey = new Date().toISOString().slice(0, 10);
  const isFuture = date > todayKey;
  const taskIndices = Storage.getTasksDone(date);
  const journalEntry = (typeof window.JOURNAL !== 'undefined' && window.JOURNAL[date]) || null;

  let taskSection;
  if (isFuture) {
    taskSection = `<div class="day-detail-empty">仲未到嘅一日 🌱</div>`;
  } else if (taskIndices.length === 0) {
    taskSection = `<div class="day-detail-empty">呢日仲未完成任何任務</div>`;
  } else {
    const items = taskIndices.map(i => {
      const t = (typeof TASKS !== 'undefined') ? TASKS[i] : null;
      const name = t ? t.name : `Task ${i + 1}`;
      const tag = t && t.tag ? `<span class="day-detail-tag tag-${t.tagClass ? t.tagClass.replace('tag-','') : 'comm'}">${t.tag}</span>` : '';
      return `<div class="day-detail-task">✓ <span class="day-detail-task-name">${name}</span> ${tag}</div>`;
    }).join('');
    taskSection = `
      <div class="day-detail-summary">完成 ${taskIndices.length}/${NTASKS} 任務</div>
      <div class="day-detail-tasks">${items}</div>
    `;
  }

  // Journal section（如果有 entry）
  let journalSection = '';
  if (journalEntry) {
    const renderedMd = (typeof _renderMarkdown !== 'undefined') ? _renderMarkdown(journalEntry) : `<pre>${esc(journalEntry)}</pre>`;
    journalSection = `
      <div class="day-detail-journal-divider"></div>
      <div class="day-detail-journal-label">📔 今日日記</div>
      <div class="day-detail-journal">${renderedMd}</div>
    `;
  } else if (date === todayKey) {
    journalSection = `
      <div class="day-detail-journal-divider"></div>
      <div class="day-detail-journal-empty">📔 今日仲未有日記 — 喺 Cowork chat 同我傾完，我寫入 manifest</div>
    `;
  }

  return `
  <div class="day-detail">
    <div class="day-detail-header">
      <div class="day-detail-date">${date}</div>
      <button class="day-detail-close" onclick="calSelect(null)">×</button>
    </div>
    ${taskSection}
    ${journalSection}
  </div>`;
}

// ─── Calendar handlers ────────────────────────────

function calNav(delta) {
  const ym = _currentViewedYM();
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  _homeUI.viewedYM = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  _homeUI.selectedDate = null;
  renderHome();
}

function calSelect(date) {
  _homeUI.selectedDate = (date === _homeUI.selectedDate || date === null) ? null : date;
  renderHome();
}

// ─── 主 render ────────────────────────────────────

function renderHome() {
  const now = new Date();
  const g = now.getHours() < 12 ? '早安' : (now.getHours() < 18 ? '下午好' : '晚上好');
  const dateStr = now.toLocaleDateString('zh-HK', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });

  // 第一次 render 自動揀今日，等 day detail panel 一打開就顯示今日 review
  if (_homeUI.firstRender) {
    _homeUI.firstRender = false;
    if (!_homeUI.selectedDate) _homeUI.selectedDate = now.toISOString().slice(0, 10);
  }

  document.getElementById('page-area').innerHTML = `
<div class="page-home">
  <div class="page-eyebrow">${dateStr}</div>
  <div class="home-title">${g}，<em>繼續升級</em>。</div>
  <div class="home-motto">「給我勇氣去改變我能改變的事，給我雅量去接受我不能改變的事，給我智慧去區分這兩件事。」</div>

  <div class="section-heading" style="margin-top:32px">快速開始</div>
  <div class="home-quick-row">
    <div class="home-cards">
      <div class="home-card" onclick="go('daily')">
        <span class="hc-icon">✅</span>
        <div class="hc-name">每日任務</div>
        <div class="hc-sub">${Storage.getTasksDone().length}/${NTASKS} 完成 · ${pct()}%</div>
      </div>
      <div class="home-card" onclick="go('session')">
        <span class="hc-icon">🎙</span>
        <div class="hc-name">Storytelling Session</div>
        <div class="hc-sub">4 階段 · 約 25 分鐘</div>
      </div>
      <div class="home-card" onclick="go('ldr')">
        <span class="hc-icon">📖</span>
        <div class="hc-name">Learn → Re-tell</div>
        <div class="hc-sub">貼文章 · 消化 · 輸出</div>
      </div>
    </div>
    <aside class="home-cal-aside">
      ${_renderCalendar()}
    </aside>
  </div>

  <div class="section-heading" style="margin-top:32px">長期目標</div>
  <div class="goal-list">
    ${[
      ['進入國際公司',  'AI / Tech / Business 相關專業職位'],
      ['深耕專業技能',  '成為 AI + Communication 領域高手'],
      ['取得碩士學位',  '特定領域，建立學術根基'],
      ['長期：博士學位','研究型或實務型，深度貢獻領域'],
    ].map(([title, sub], i) => `
    <div class="goal-item">
      <span class="goal-num">0${i + 1}</span>
      <div><div class="goal-title">${title}</div><div class="goal-sub">${sub}</div></div>
    </div>`).join('')}
  </div>
</div>`;
}
