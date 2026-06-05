// pages/daily.js — 每日任務
// 改任務清單只需動 TASKS 陣列

const TASKS = [
  { id: 0, name: 'AI Storytelling 練習',             time: '15–20 min', tag: '溝通', tagClass: 'tag-comm',
    detail: '<strong>Prompt：</strong>「我想練習 Storytelling。你扮演好奇嘅朋友，我講 2–3 分鐘故事，你問 2 條追問。」' },
  { id: 1, name: 'Self Small Talk 錄音',              time: '5 min',     tag: '溝通', tagClass: 'tag-comm',
    detail: '對自己錄音，講今日一件事，聽返語速和停頓。<br><strong>今日題目：</strong>「最近有沒有改變了我想法的時刻？」' },
  { id: 2, name: 'Article → 啟發總結',               time: '10 min',    tag: '溝通', tagClass: 'tag-comm',
    detail: '讀一篇領域外文章，一句話總結 + 「這篇文章給我的啟發是……」' },
  { id: 3, name: 'Shadowing + Re-tell',              time: '15 min',    tag: '溝通', tagClass: 'tag-comm',
    detail: '選 TED/YouTube 片段跟讀，再用自己的話重講。<br><strong>推薦：</strong>Simon Sinek · Ali Abdaal · Veritasium' },
  { id: 4, name: '朝早：最佳自我想像 + Stoic 準備', time: '5–10 min', tag: '身心', tagClass: 'tag-mind',
    detail: '<strong>練習：</strong>閉眼 2 分鐘，想像 3 個月後最好嘅自己。問：「今日我能做什麼更接近那個版本？」' },
];

function renderDaily() {
  const now = new Date();
  const tasksDone = Storage.getTasksDone();
  document.getElementById('page-area').innerHTML = `
<div class="page-inner">
  <div class="page-title-row">
    <div>
      <div class="page-eyebrow">${now.toLocaleDateString('zh-HK', { month:'long', day:'numeric', weekday:'long' })}</div>
      <div class="page-title">每日任務</div>
    </div>
    <div>
      <div class="daily-pct-badge" id="d-pct">${pct()}%</div>
      <div class="daily-pct-sub"  id="d-sub">${tasksDone.length} / ${NTASKS} 完成</div>
    </div>
  </div>

  <div class="task-list">
    ${TASKS.map((t, i) => `
    <div class="task-item${tasksDone.includes(t.id) ? ' done' : ''}" id="ti-${t.id}">
      <div class="task-check" onclick="toggleTask(${t.id}, event)">
        <svg class="task-check-inner" width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5l2.3 2.3L8 1" stroke="white" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="task-body" onclick="expandTask(${t.id})">
        <span class="task-name">${t.name}</span>
        <div class="task-meta">
          <span class="task-time">⏱ ${t.time}</span>
          <span class="task-tag ${t.tagClass}">${t.tag}</span>
        </div>
      </div>
      <span class="task-expand-btn" onclick="expandTask(${t.id})">···</span>
    </div>
    <div class="task-detail" id="td-${t.id}">
      <div class="task-detail-inner">${t.detail}</div>
    </div>
    ${i === 3 ? '<hr class="divider">' : ''}`).join('')}
  </div>
</div>`;
}

function toggleTask(id, e) {
  e.stopPropagation();
  const tasksDone = Storage.getTasksDone();
  const idx = tasksDone.indexOf(id);
  idx >= 0 ? tasksDone.splice(idx, 1) : tasksDone.push(id);
  Storage.setTasksDone(tasksDone);
  document.getElementById('ti-' + id)?.classList.toggle('done', tasksDone.includes(id));
  updateTopProgress();
  const dp = document.getElementById('d-pct'); const ds = document.getElementById('d-sub');
  if (dp) { dp.textContent = pct() + '%'; ds.textContent = tasksDone.length + ' / ' + NTASKS + ' 完成'; }
}

function expandTask(id) {
  const det = document.getElementById('td-' + id); if (!det) return;
  const open = det.style.maxHeight;
  det.style.maxHeight = open ? null : '160px';
}
