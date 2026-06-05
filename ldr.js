// pages/ldr.js — Learn → Digest → Re-tell
// 改練習流程只需動這個檔案

let lStep = 0, lType = 'article', lCore = '', lInput = '', lOneline = '', lConnect = '', lRetell = '';

function renderLDR() {
  document.getElementById('page-area').innerHTML = `
<div class="page-inner" style="max-width:680px">
  <div style="margin-bottom:20px">
    <div class="page-eyebrow">Feynman Technique</div>
    <div class="page-title">Learn → Re-tell</div>
  </div>
  <div class="ldr-steps">
    ${['INPUT','DIGEST','RE-TELL','FEEDBACK'].map((l, i) => `
    <div class="ldr-step${i < lStep ? ' done' : i === lStep ? ' active' : ''}">
      <div class="ls-num">Step ${i + 1}</div>
      <div class="ls-label">${l}</div>
    </div>`).join('')}
  </div>
  <div id="ldr-body"></div>
</div>`;
  lRenderBody();
}

function lRenderBody() {
  const el = document.getElementById('ldr-body'); if (!el) return;
  // sync step indicators
  document.querySelectorAll('.ldr-step').forEach((s, i) => {
    s.className = 'ldr-step' + (i < lStep ? ' done' : i === lStep ? ' active' : '');
  });
  el.innerHTML = [lInputHTML, lDigestHTML, lRetellHTML, lFeedHTML][lStep]();
}

function lInputHTML() { return `
<div class="card">
  <div class="card-header">
    <div><div class="card-title">輸入學習內容</div><div class="card-sub">貼入文章、筆記，或描述你學到嘅內容</div></div>
    <span class="card-tag">Step 01</span>
  </div>
  <div class="card-body">
    <div class="type-pills">
      ${[['article','📄 文章/筆記'],['podcast','🎧 Podcast/影片'],['concept','💡 概念/想法'],['case','💼 商業案例']]
        .map(([v, l]) => `<button class="type-pill${lType===v?' sel':''}" onclick="lSetType('${v}',this)">${l}</button>`)
        .join('')}
    </div>
    <textarea class="inp" id="l-in" placeholder="貼入原文、摘要，或用幾句話描述你剛學到嘅內容…" rows="5">${lInput}</textarea>
    <div class="tip">不需要貼整篇文。3–5 句摘要就夠，關鍵是你理解了什麼。</div>
    <div class="btn-row"><button class="btn btn-primary" onclick="lGenDigest()">提取核心 →</button></div>
  </div>
</div>`; }

function lDigestHTML() { return `
<div class="card">
  <div class="card-header">
    <div><div class="card-title">消化 & 確認理解</div><div class="card-sub">AI 提煉核心，你補充自己的理解</div></div>
    <span class="card-tag">Step 02</span>
  </div>
  <div class="card-body">
    <div class="field-group">
      <span class="field-label">核心觀點（AI 提煉）</span>
      <div class="ai-block${lCore ? '' : ' loading'}" id="l-core">
        ${lCore ? fmt(lCore) : '<div class="tdots"><span></span><span></span><span></span></div>'}
      </div>
    </div>
    <hr class="section-rule">
    <div class="field-group">
      <span class="field-label">用一句話解釋核心意思</span>
      <textarea class="inp" id="l-one" placeholder="假設對方完全不懂，用最簡單的語言…" rows="2">${lOneline}</textarea>
    </div>
    <div class="field-group">
      <span class="field-label">同你的工作 / 生活有咩關聯？</span>
      <textarea class="inp" id="l-con" placeholder="這讓我聯想到…" rows="2">${lConnect}</textarea>
    </div>
    <div class="btn-row">
      <button class="btn btn-ghost" onclick="lStep=0;lRenderBody()">← 返回</button>
      <button class="btn btn-primary" onclick="lToRetell()">準備 Re-tell →</button>
    </div>
  </div>
</div>`; }

function lRetellHTML() { return `
<div class="card">
  <div class="card-header">
    <div><div class="card-title">Re-tell — 用自己的話</div><div class="card-sub">不看筆記，用自己語言重新表達</div></div>
    <span class="card-tag">Step 03</span>
  </div>
  <div class="card-body">
    <div class="audience-pill">👔 對象：行業同事 / 面試官</div>
    <div id="l-scene"></div>
    <textarea class="inp" id="l-ret" placeholder="想像係 coffee chat 或面試，對方問：「最近學到什麼有意思的東西？」用自己的話回答…" rows="6">${lRetell}</textarea>
    <div class="tip">費曼原則：解釋不清楚 = 還未真正明白。先試試，不需要完美。</div>
    <div class="btn-row">
      <button class="btn btn-ghost" onclick="lStep=1;lRenderBody()">← 返回</button>
      <button class="btn btn-orange" onclick="lGetFeedback()">獲取反饋 →</button>
    </div>
  </div>
</div>`; }

function lFeedHTML() { return `
<div class="card">
  <div class="card-header">
    <div><div class="card-title">AI 反饋 & 改進建議</div><div class="card-sub">理解準確度 + 表達清晰度</div></div>
    <span class="card-tag">Step 04</span>
  </div>
  <div class="card-body">
    <div id="l-fb"><div class="ai-block loading">分析中… <div class="tdots" style="display:inline-flex"><span></span><span></span><span></span></div></div></div>
    <div class="btn-row" id="l-fb-act" style="display:none">
      <button class="btn btn-ghost" onclick="lStep=2;lRenderBody()">🔄 重新 Re-tell</button>
      <button class="btn btn-primary" onclick="lReset()">儲存 & 新內容 →</button>
    </div>
  </div>
</div>`; }

function lSetType(v, btn) {
  lType = v;
  document.querySelectorAll('.type-pill').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
}

async function lGenDigest() {
  const el = document.getElementById('l-in'); if (!el) return;
  lInput = el.value.trim(); if (!lInput) { alert('請先輸入學習內容'); return; }
  lStep = 1; lCore = ''; lRenderBody();
  const out = document.getElementById('l-core'); if (!out) return;
  try {
    const r = await API.call(
      [{ role:'user', content:`學習內容（${lType}）：\n${lInput}\n\n繁體中文提煉：1.核心觀點(2-3句) 2.最關鍵insight(1句，**加粗**關鍵詞) 3.re-tell用嘅框架/比喻(1句)。換行分隔，簡潔。` }],
      '你係知識提煉專家，繁體中文粵語。'
    );
    lCore = r; out.className = 'ai-block'; out.innerHTML = fmt(r);
  } catch (e) { out.innerHTML = `<span style="color:var(--red)">${e.message}</span>`; }
}

async function lToRetell() {
  lOneline = document.getElementById('l-one')?.value.trim() || '';
  lConnect  = document.getElementById('l-con')?.value.trim() || '';
  lStep = 2; lRenderBody();
  const sc = document.getElementById('l-scene'); if (!sc) return;
  try {
    const r = await API.call(
      [{ role:'user', content:`根據以下內容生成一條面試/職場問題：\n${lCore}\n用戶理解：${lOneline}\n要求：繁體中文，像同事/面試官問，有場景感，30字以內。` }],
      '你係模擬面試官。'
    );
    sc.innerHTML = `<div class="scenario-block"><div class="scenario-eyebrow">Scenario</div><div class="scenario-text">${fmt(r)}</div></div>`;
  } catch (e) { sc.innerHTML = ''; }
}

async function lGetFeedback() {
  const rt = document.getElementById('l-ret'); if (!rt) return;
  lRetell = rt.value.trim(); if (!lRetell || lRetell.length < 20) { alert('請先輸入你的 Re-tell'); return; }
  lStep = 3; lRenderBody();
  const fb = document.getElementById('l-fb'); if (!fb) return;
  try {
    const r = await API.call(
      [{ role:'user', content:`評估Re-tell：\n【核心】${lCore}\n【理解】${lOneline}\n【Re-tell】${lRetell}\n\n繁體中文反饋：\n⭐做得好嘅地方（2個亮點）\n🎯理解準確度\n✏️表達清晰度\n🔧最重要改進點+改寫示範\n💡更好表達示範（2-3句）\n🚀下次練習建議` }],
      '你係Professional Communication教練，繁體中文，具體有建設性。'
    );
    fb.innerHTML = fmtFeedback(r);
    const act = document.getElementById('l-fb-act'); if (act) act.style.display = 'flex';
  } catch (e) { fb.innerHTML = `<div style="color:var(--red)">${e.message}</div>`; }
}

function lReset() {
  lStep = 0; lCore = ''; lInput = ''; lOneline = ''; lConnect = ''; lRetell = '';
  lRenderBody();
}
