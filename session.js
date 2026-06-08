// session.js — Storytelling Session archive (read-only)
// Source: window.STORYTELLING_SESSIONS（posts/manifest.js）
// 練習喺 Cowork chat 同我做，session 完之後我 append 入 manifest

function renderSession() {
  const items = (window.STORYTELLING_SESSIONS || []).slice()
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const body = items.length === 0
    ? `<div class="writer-empty">
         <div class="writer-empty-icon">🎙</div>
         <div class="writer-empty-text">仲未有 Storytelling session</div>
         <div class="writer-empty-hint">喺 Cowork chat 揀個 topic 同我練，4 phase 走完我寫返入 archive</div>
       </div>`
    : `<div class="writer-list">${items.map(_sessionCard).join('')}</div>`;

  document.getElementById('page-area').innerHTML = `
<style>
  .session-card-readonly { cursor: default; }
  .session-card-readonly:hover { background: var(--bg); border-color: var(--border); }
  .session-phase-strip {
    display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap;
  }
  .session-phase-pill {
    font-size: 11px; padding: 3px 10px;
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 99px; color: var(--text3);
    font-weight: 500;
  }
  .session-card-body {
    font-size: 13.5px; line-height: 1.7; color: var(--text); margin-top: 10px;
  }
  .session-card-body h2 {
    font-family: 'Lora', serif; font-size: 15px; font-weight: 700;
    margin: 18px 0 6px; color: var(--text);
  }
  .session-card-body h3 {
    font-size: 13px; font-weight: 600; margin: 12px 0 4px; color: var(--text);
  }
  .session-card-body p { margin: 0 0 10px; }
  .session-card-body ul, .session-card-body ol { padding-left: 20px; margin: 4px 0 10px; }
  .session-card-body blockquote {
    border-left: 3px solid var(--orange);
    padding: 4px 0 4px 12px; margin: 10px 0;
    color: var(--text2); font-style: italic;
  }
</style>
<div class="page-inner">
  <div style="margin-bottom:24px">
    <div class="page-eyebrow">COMMUNICATION TRACK</div>
    <div class="page-title">Storytelling Session</div>
    <div class="page-sub-text">4-phase 練習 archive · 熱身 → 結構 → 細節 → 整合</div>
  </div>

  <div class="session-phase-strip">
    <span class="session-phase-pill">Phase 1 · 熱身</span>
    <span class="session-phase-pill">Phase 2 · 結構</span>
    <span class="session-phase-pill">Phase 3 · 細節</span>
    <span class="session-phase-pill">Phase 4 · 整合</span>
  </div>

  ${body}
</div>`;
}

function _sessionCard(item) {
  const md = (typeof _renderMarkdown !== 'undefined')
    ? _renderMarkdown(item.body || '')
    : `<p>${esc(item.body || '')}</p>`;
  const wc = (item.body || '').replace(/\s/g, '').length;

  return `
  <div class="post-card session-card-readonly">
    <div class="post-card-title">${esc(item.topic || '(無主題)')} <span class="post-card-locked" title="由 posts/manifest.js 管理，喺 Cowork chat 講就改">🔒</span></div>
    <div class="post-card-meta">
      <span>${esc(item.date || '無日期')}</span>
      ${wc > 0 ? `<span>· 約 ${wc.toLocaleString()} 字</span>` : ''}
    </div>
    <div class="session-card-body">${md}</div>
  </div>`;
}
