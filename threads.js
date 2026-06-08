// threads.js — Thread posts archive (short-form)
// Source: window.THREAD_POSTS（喺 posts/manifest.js）
// 由 Claude 喺 Cowork chat 直接 maintain；read-only in app

function renderThread() {
  const posts = (window.THREAD_POSTS || []).slice()
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const body = posts.length === 0
    ? `<div class="writer-empty">
         <div class="writer-empty-icon">🧵</div>
         <div class="writer-empty-text">仲未有 Thread post</div>
         <div class="writer-empty-hint">喺 Cowork chat 同我分享，我寫入 manifest.js</div>
       </div>`
    : `<div class="writer-list">${posts.map(_threadCard).join('')}</div>`;

  document.getElementById('page-area').innerHTML = `
<style>
  .thread-card-body {
    font-size: 14.5px;
    line-height: 1.75;
    color: var(--text);
    margin-top: 10px;
  }
  .thread-card-body p { margin: 0 0 10px; }
  .thread-card-body blockquote {
    border-left: 3px solid var(--orange);
    padding: 6px 0 6px 14px;
    margin: 10px 0;
    color: var(--text2);
    font-family: 'Lora', serif;
    font-style: italic;
    font-size: 15px;
    line-height: 1.7;
  }
  .thread-card-body strong { font-weight: 600; }
  .thread-card-no-url {
    font-size: 11.5px;
    color: var(--text3);
    font-style: italic;
  }
  .thread-card-readonly { cursor: default; }
  .thread-card-readonly:hover {
    background: var(--bg);  /* 抵消 post-card 嘅 hover */
    border-color: var(--border);
  }
</style>
<div class="page-inner">
  <div style="margin-bottom:24px">
    <div class="page-eyebrow">THREAD ARCHIVE</div>
    <div class="page-title">Thread</div>
    <div class="page-sub-text">Short-form posts · 即興 reflection / quote / observation</div>
  </div>

  ${body}
</div>`;
}

function _threadCard(post) {
  const wc = (post.content || '').replace(/\s/g, '').length;
  const hasUrl = post.threadsUrl && post.threadsUrl.trim();
  const md = (typeof _renderMarkdown !== 'undefined')
    ? _renderMarkdown(post.content || '')
    : `<p>${esc(post.content || '')}</p>`;

  return `
  <div class="post-card thread-card-readonly">
    <div class="post-card-meta">
      <span>${esc(post.date || '無日期')}</span>
      ${wc > 0 ? `<span>· ${wc} 字</span>` : ''}
      <span class="post-card-locked" title="由 posts/manifest.js 管理，喺 Cowork chat 講就改">🔒</span>
    </div>
    <div class="thread-card-body">${md}</div>
    ${hasUrl
      ? `<div class="post-card-actions">
           <a class="post-card-link" href="${esc(post.threadsUrl)}" target="_blank" rel="noopener">↗ Threads</a>
         </div>`
      : `<div class="post-card-actions">
           <span class="thread-card-no-url">未補 Threads URL</span>
         </div>`}
  </div>`;
}
