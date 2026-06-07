// home.js — 首頁
// 改首頁內容只需動這個檔案

function renderHome() {
  const now = new Date();
  const g = now.getHours() < 12 ? '早安' : (now.getHours() < 18 ? '下午好' : '晚上好');
  const dateStr = now.toLocaleDateString('zh-HK', { year:'numeric', month:'long', day:'numeric', weekday:'long' });

  document.getElementById('page-area').innerHTML = `
<div class="page-home">
  <div class="page-eyebrow">${dateStr}</div>
  <div class="home-title">${g}，<em>繼續升級</em>。</div>
  <div class="home-motto">「給我勇氣去改變我能改變的事，給我雅量去接受我不能改變的事，給我智慧去區分這兩件事。」</div>

  <div class="section-heading">快速開始</div>
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

  <div class="section-heading">長期目標</div>
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
