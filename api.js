// utils/api.js — Claude API 呼叫
// 改 model 或加 system prompt 只需動這個檔案

const API = {
  MODEL: 'claude-sonnet-4-20250514',

  async call(messages, system = '') {
    const body = { model: this.MODEL, max_tokens: 1000, messages };
    if (system) body.system = system;
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error ${res.status}`);
    }
    const data = await res.json();
    return data.content.filter(b => b.type === 'text').map(b => b.text).join('');
  },
};

// ─── 共用 HTML helpers ───────────────────────
function esc(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function fmt(t) {
  return esc(t).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
}
function showTyping(containerId) {
  const el = document.getElementById(containerId); if (!el) return;
  const d = document.createElement('div');
  d.id = containerId + '-typing'; d.className = 'msg ai';
  d.innerHTML = '<div class="av ai">AI</div><div class="bubble"><div class="tdots"><span></span><span></span><span></span></div></div>';
  el.appendChild(d); el.scrollTop = el.scrollHeight;
}
function hideTyping(containerId) {
  document.getElementById(containerId + '-typing')?.remove();
}
function fmtFeedback(t) {
  const secs = [
    { e: '⭐', l: '做得好嘅地方' }, { e: '🎯', l: '理解準確度' },
    { e: '✏️', l: '表達清晰度' },  { e: '🔧', l: '最重要嘅改進點' },
    { e: '💡', l: '更好嘅表達示範' }, { e: '🚀', l: '下次練習建議' },
  ];
  let html = '', cur = '', cs = null;
  for (const line of esc(t).split('\n')) {
    const f = secs.find(s => line.includes(s.e));
    if (f) {
      if (cs && cur.trim()) html += fbBlock(cs, cur.trim());
      cs = f; cur = '';
    } else { cur += line + '\n'; }
  }
  if (cs && cur.trim()) html += fbBlock(cs, cur.trim());
  return html || `<div class="ai-block">${fmt(t)}</div>`;
}
function fbBlock(s, content) {
  const body = content.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>').trim();
  return `<div class="fb-item">
    <div class="fb-label-row"><span>${s.e}</span><span class="fb-label">${s.l}</span></div>
    <div class="fb-text">${body}</div>
  </div>`;
}
