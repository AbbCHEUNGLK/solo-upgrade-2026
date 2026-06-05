// pages/session.js — Storytelling Session
// 改 AI 角色或 phase 數量只需動 PHASES

const PHASES = [
  { label: '熱身',  desc: '開口建立自信',
    sys: '你係Storytelling練習教練，繁體中文粵語。扮演好奇嘅朋友，邀請用戶講一件最近印象深刻嘅事。每次只問1條問題，80字以內。用戶講完先重複最有趣細節，再追問。' },
  { label: '結構',  desc: '情境 → 衝突 → 解決',
    sys: '你係Storytelling教練，繁體中文粵語。引導用戶用「情境→衝突→解決」3幕結構講故事，完成後指出最強部分。100字以內。' },
  { label: '細節',  desc: "Show, don't tell",
    sys: "你係Storytelling教練，繁體中文粵語。練習Show don't tell，請用戶加入具體畫面、感受、細節，示範改寫示例。100字以內。" },
  { label: '整合',  desc: '完整故事 + 反饋',
    sys: '你係Storytelling教練，繁體中文粵語。邀請用戶完整講一個故事，然後給結構化反饋：⭐亮點（2個）/ 🔧改進（1-2條）/ 💡總結 / 🎯下次建議。' },
];

// 狀態（每次進入頁面保留，刷新重置）
let sPhase = 0, sMsgCount = 0, sChatHistory = [], sLoading = false, sPhaseUnlocked = false;

function renderSession() {
  document.getElementById('page-area').innerHTML = `
<div class="page-inner" style="max-width:780px">
  <div style="margin-bottom:16px">
    <div class="page-eyebrow">Communication Track</div>
    <div class="page-title">Storytelling Session</div>
  </div>

  <div class="session-progress">
    ${PHASES.map((p, i) => `
    <div class="sp-step${i < sPhase ? ' done' : i === sPhase ? ' active' : ''}">
      <div class="sp-num">Phase ${i + 1}</div>
      <div class="sp-label">${p.label}</div>
    </div>`).join('')}
  </div>

  <div class="chat-box">
    <div class="chat-header">
      <div>
        <div class="chat-phase-label">Phase ${sPhase + 1} · ${PHASES[sPhase].label}</div>
        <div class="chat-phase-desc">${PHASES[sPhase].desc}</div>
      </div>
      <button class="next-btn" id="s-next" onclick="sNextPhase()" disabled>
        ${sPhase < PHASES.length - 1 ? '下一階段 →' : '完成 ✓'}
      </button>
    </div>
    <div class="messages" id="s-msgs"></div>
    <div class="chat-inputbar">
      <textarea id="s-in" placeholder="輸入你的回應…" rows="1"
        onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();sSend()}"
        oninput="this.style.height='auto';this.style.height=Math.min(this.scrollHeight,100)+'px'"></textarea>
      <button class="send-btn" id="s-send" onclick="sSend()">
        <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
      </button>
    </div>
  </div>
</div>`;

  if (sChatHistory.length === 0) sShowStarters();
}

function sShowStarters() {
  const el = document.getElementById('s-msgs'); if (!el) return;
  const d = document.createElement('div');
  d.innerHTML = `<div style="font-size:12.5px;color:var(--text3);margin-bottom:8px">選一個起點開始，或自由輸入</div>
  <div class="starter-row">
    <div class="starter-chip" onclick="sUseStarter(this,'最近一件讓我印象深刻的事')">📖 最近印象深刻的事</div>
    <div class="starter-chip" onclick="sUseStarter(this,'工作或學習上遇到嘅一個挑戰')">💼 一個工作挑戰</div>
    <div class="starter-chip" onclick="sUseStarter(this,'有一次我幫助別人的故事')">✅ 幫助別人的故事</div>
  </div>`;
  el.appendChild(d);
}

function sUseStarter(el, val) {
  el.closest('div').closest('div').remove();
  document.getElementById('s-in').value = val;
  document.getElementById('s-in').focus();
}

async function sSend() {
  const inp = document.getElementById('s-in');
  const txt = inp.value.trim();
  if (!txt || sLoading) return;
  inp.value = ''; inp.style.height = 'auto';
  inp.disabled = true; document.getElementById('s-send').disabled = true; sLoading = true;

  sAddMsg('user', esc(txt).replace(/\n/g, '<br>'));
  sChatHistory.push({ role: 'user', content: txt });
  sMsgCount++;

  showTyping('s-msgs');
  try {
    const reply = await API.call(sChatHistory, PHASES[sPhase].sys);
    hideTyping('s-msgs');
    sAddMsg('ai', fmt(reply));
    sChatHistory.push({ role: 'assistant', content: reply });
    if (sMsgCount >= 2 && !sPhaseUnlocked) {
      sPhaseUnlocked = true;
      const b = document.getElementById('s-next'); if (b) b.disabled = false;
    }
  } catch (e) {
    hideTyping('s-msgs');
    sAddMsg('ai', `<span style="color:var(--red)">${e.message}</span>`);
  }
  inp.disabled = false; document.getElementById('s-send').disabled = false; sLoading = false; inp.focus();
}

function sAddMsg(role, html) {
  const el = document.getElementById('s-msgs'); if (!el) return;
  const d = document.createElement('div'); d.className = 'msg ' + role;
  d.innerHTML = `<div class="av ${role}">${role === 'user' ? '你' : 'AI'}</div><div class="bubble">${html}</div>`;
  el.appendChild(d); el.scrollTop = el.scrollHeight;
}

async function sNextPhase() {
  if (sPhase >= PHASES.length - 1) { sFinish(); return; }
  sPhase++; sChatHistory = []; sMsgCount = 0; sPhaseUnlocked = false;
  renderSession();
  setTimeout(async () => {
    showTyping('s-msgs');
    try {
      const r = await API.call([{ role:'user', content:'請開始這個階段，用粵語引導我。' }], PHASES[sPhase].sys);
      hideTyping('s-msgs'); sAddMsg('ai', fmt(r)); sChatHistory.push({ role:'assistant', content:r });
    } catch (e) { hideTyping('s-msgs'); }
  }, 300);
}

function sFinish() {
  const el = document.getElementById('s-msgs'); if (!el) return;
  const d = document.createElement('div');
  d.innerHTML = `<div style="padding:14px 16px;background:var(--green-bg);border:1px solid #b8e0cc;border-radius:8px;margin-top:4px">
    <div style="font-size:12px;font-weight:600;color:var(--green);margin-bottom:4px">Session 完成 ✓</div>
    <div style="font-size:13px;color:var(--text2);line-height:1.6">恭喜完成 ${PHASES.length} 個階段！明日帶一個<strong style="color:var(--text)">工作場景故事</strong>重練第 3–4 階段。</div>
  </div>`;
  el.appendChild(d); el.scrollTop = el.scrollHeight;
  document.getElementById('s-next').disabled = true;
  document.getElementById('s-in').disabled = true;
  document.getElementById('s-send').disabled = true;
}
