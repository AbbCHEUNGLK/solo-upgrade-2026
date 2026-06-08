// ldr.js — Learn → Re-tell archive (read-only)
// Feynman Technique session log
// Source: window.RETELL_SESSIONS（posts/manifest.js）

function renderLDR() {
  const items = (window.RETELL_SESSIONS || []).slice()
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const body = items.length === 0
    ? `<div class="writer-empty">
         <div class="writer-empty-icon">📖</div>
         <div class="writer-empty-text">仲未有 Re-tell session</div>
         <div class="writer-empty-hint">睇完 / 讀完一樣嘢，喺 Cowork chat 同我用自己嘅話 re-tell，我幫你 feedback + 記入 archive</div>
       </div>`
    : `<div class="writer-list">${items.map(_retellCard).join('')}</div>`;

  document.getElementById('page-area').innerHTML = `
<style>
  .retell-card-readonly { cursor: default; }
  .retell-card-readonly:hover { background: var(--bg); border-color: var(--border); }
  .retell-step-strip {
    display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap;
  }
  .retell-step-pill {
    font-size: 11px; padding: 3px 10px;
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 99px; color: var(--text3);
    font-weight: 500;
    letter-spacing: .02em;
  }
  .retell-card-source {
    font-size: 12px; color: var(--text2);
    background: var(--bg2); border-left: 3px solid var(--orange);
    padding: 6px 12px; border-radius: 0 6px 6px 0;
    margin-top: 8px;
  }
  .retell-card-body {
    font-size: 13.5px; line-height: 1.7; color: var(--text); margin-top: 12px;
  }
  .retell-card-body h2 {
    font-family: 'Lora', serif; font-size: 15px; font-weight: 700;
    margin: 18px 0 6px; color: var(--text);
  }
  .retell-card-body h3 {
    font-size: 13px; font-weight: 600; margin: 12px 0 4px; color: var(--text);
  }
  .retell-card-body p { margin: 0 0 10px; }
  .retell-card-body ul, .retell-card-body ol { padding-left: 20px; margin: 4px 0 10px; }
  .retell-card-body blockquote {
    border-left: 3px solid var(--orange);
    padding: 4px 0 4px 12px; margin: 10px 0;
    color: var(--text2); font-style: italic;
  }
  .retell-card-body strong { font-weight: 600; }
</style>
<div class="page-inner">
  <div style="margin-bottom:24px">
    <div class="page-eyebrow">FEYNMAN TECHNIQUE</div>
    <div class="page-title">Learn → Re-tell</div>
    <div class="page-sub-text">Feynman 4-step archive · Input → Digest → Re-tell → Feedback</div>
  </div>

  <div class="retell-step-strip">
    <span class="retell-step-pill">01 · INPUT</span>
    <span class="retell-step-pill">02 · DIGEST</span>
    <span class="retell-step-pill">03 · RE-TELL</span>
    <span class="retell-step-pill">04 · FEEDBACK</span>
  </div>

  ${body}
</div>`;
}

function _retellCard(item) {
  const md = (typeof _renderMarkdown !== 'undefined')
    ? _renderMarkdown(item.body || '')
    : `<p>${esc(item.body || '')}</p>`;
  const wc = (item.body || '').replace(/\s/g, '').length;
  const title = item.source ? item.source : '(無 source)';

  return `
  <div class="post-card retell-card-readonly">
    <div class="post-card-title">${esc(title)} <span class="post-card-locked" title="由 posts/manifest.js 管理，喺 Cowork chat 講就改">🔒</span></div>
    <div class="post-card-meta">
      <span>${esc(item.date || '無日期')}</span>
      ${wc > 0 ? `<span>· 約 ${wc.toLocaleString()} 字</span>` : ''}
    </div>
    <div class="retell-card-body">${md}</div>
  </div>`;
}
