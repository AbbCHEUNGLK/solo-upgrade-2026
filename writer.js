// writer.js — Substack Writer Studio
// 5 段式 template，每段 AI 同時做 research / structure / editor

const STAGES = [
  {
    key: 'hook',
    num: '01',
    label: 'Hook',
    title: '開場：用數字建立 authority',
    desc: '一個有 weight 嘅 stat 或 market data，令讀者第一句就停低',
    placeholder: '例：根據 Fortune Business Insights 2026 報告，vanilla 佔全球雪糕市場 30.49%，是所有口味中最高的…',
    aiRole: 'research',
    helperLabel: '幫我搵相關數據',
    helperPrompt: (topic, content) =>
      `用戶想寫一篇 Substack post，主題：「${topic}」。

請幫佢搵 2-3 個有 authority 嘅數字或 market data 作為文章開場 hook。要求：
- 來源要 traceable（具體期刊、研究機構、市場報告名）
- 數字要 specific（百分比、人數、年份）
- 對普通讀者有 surprise factor

繁體中文回答，每個 stat 用一句寫，附帶來源。`,
  },
  {
    key: 'framework',
    num: '02',
    label: 'Framework',
    title: '拆解：將 topic 變成可驗證嘅 dimensions',
    desc: '將模糊嘅 quality 拆成 3-4 個 signal，每個都有清楚 criteria',
    placeholder: '例：Dimension 1: Vanilla Nuance（看 specks 同 lingering）/ Dimension 2: Dairy Richness（看成份表第二材料）…',
    aiRole: 'structure',
    helperLabel: '幫我拆 framework',
    helperPrompt: (topic, content) =>
      `用戶寫緊一篇關於「${topic}」嘅 Substack post，需要將個 topic 拆解成 3-4 個 evaluation dimensions。

${content ? `用戶現有嘅 draft：\n${content}\n\n基於呢啲，` : ''}請用提問方式引導用戶：
1. 提出 3-4 條 critical questions 幫用戶識別應該用咩 dimensions
2. 每條問題要具體、可以 actionable
3. 最後提供一個 sample framework 作參考

繁體中文，tone 似一個 thinking partner。`,
  },
  {
    key: 'science',
    num: '03',
    label: 'Science',
    title: '深入：背後嘅 mechanism 同 research',
    desc: '搵 2-3 個 peer-reviewed studies 或 scientific principle 解釋現象',
    placeholder: '例：Overrun（充氣率）嘅 cost engineering、天然 vanilla 200-500 種化合物 vs 人工 vanillin 單一化合物…',
    aiRole: 'research',
    helperLabel: '幫我搵 research papers',
    helperPrompt: (topic, content) =>
      `用戶寫緊「${topic}」相關嘅 Substack post，需要 science / mechanism 嘅深度 backing。

${content ? `用戶現有嘅 draft：\n${content}\n\n` : ''}請幫佢：
1. 列出 2-3 個相關嘅 peer-reviewed studies 或 scientific principle
2. 每個附帶具體 citation（作者、年份、期刊）
3. 解釋呢個 mechanism 點解 relevant
4. 提示用戶有冇遺漏嘅關鍵概念

繁體中文，包含必要嘅英文術語。`,
  },
  {
    key: 'counter',
    num: '04',
    label: 'Counter-intuitive',
    title: '反直覺：surface 一個讀者意外嘅 finding',
    desc: '一個 challenge conventional wisdom 嘅 evidence，配上 critical caveat',
    placeholder: '例：Harvard 190,000 人 cohort 發現每週食 2 次以上雪糕嘅人，第 2 型糖尿病風險低 22%——但係 observational study，可能係 lifestyle confounding…',
    aiRole: 'critical',
    helperLabel: '幫我搵 counter-intuitive evidence',
    helperPrompt: (topic, content) =>
      `用戶寫緊「${topic}」相關嘅 Substack post，需要一個 counter-intuitive section 提升文章嘅 intellectual depth。

${content ? `用戶現有嘅 draft：\n${content}\n\n` : ''}請：
1. 搵一個會 surprise 讀者嘅 finding 或 study
2. 提供具體 citation
3. 重要：同時 surface critical caveats（observational vs causal、sample limitations、confounding factors）
4. 提示用戶點樣 frame 呢個 tension 而唔失去 credibility

繁體中文，rigorous 但 accessible 嘅 tone。`,
  },
  {
    key: 'closing',
    num: '05',
    label: 'Closing',
    title: '收結：將 analysis 連結到讀者生活',
    desc: '從 framework 提升到 transferable mental model，再以一個 emotional anchor 收尾',
    placeholder: '例：人工香精永遠複製唔到天然 vanilla 數百種化合物嘅 nuances——就跟人一樣，我們身上嗰啲複雜層次先係最珍貴…',
    aiRole: 'editor',
    helperLabel: '幫我 polish 收結',
    helperPrompt: (topic, content) =>
      `用戶寫緊「${topic}」嘅 Substack post，需要寫一個有 emotional resonance 嘅結尾。

${content ? `用戶嘅 draft：\n${content}\n\n` : ''}請：
1. 評估而家嘅 closing 有冇 emotional payoff
2. 提供 2-3 個改寫示範，每個用唔同 angle（philosophical / personal / actionable）
3. 提示用戶最後一句應該係 image 定 action，唔好係 conclusion

繁體中文，參考李堅翔 / Maggie Appleton 嗰種「平實但有後勁」嘅風格。`,
  },
];

// 狀態
let wStage = 0;
let wTopic = '';
let wContent = Array(STAGES.length).fill('');
let wAiOutput = Array(STAGES.length).fill('');
let wLoading = false;

function renderWriter() {
  document.getElementById('page-area').innerHTML = `
<div class="page-inner" style="max-width:760px">
  <div style="margin-bottom:20px">
    <div class="page-eyebrow">Substack Writer Studio</div>
    <div class="page-title">5 段式 BCG-style Long-form</div>
  </div>

  <div class="topic-bar">
    <span class="topic-label">📌 主題</span>
    <input type="text" class="topic-input" id="w-topic" placeholder="例：點樣揀 vanilla 雪糕"
      value="${esc(wTopic)}" oninput="wTopic=this.value">
    <button class="btn btn-ghost btn-sm" onclick="wExport()">📄 匯出</button>
  </div>

  <div class="writer-steps">
    ${STAGES.map((s, i) => `
    <div class="ws-step${i < wStage ? ' done' : i === wStage ? ' active' : ''}"
      onclick="wGoStage(${i})">
      <div class="ws-num">${s.num}</div>
      <div class="ws-label">${s.label}</div>
    </div>`).join('')}
  </div>

  <div id="w-panel"></div>
</div>`;
  renderStagePanel();
}

function renderStagePanel() {
  const s = STAGES[wStage];
  const c = document.getElementById('w-panel');
  if (!c) return;
  // sync step indicators
  document.querySelectorAll('.ws-step').forEach((el, i) => {
    el.className = 'ws-step' + (i < wStage ? ' done' : i === wStage ? ' active' : '');
  });

  c.innerHTML = `
<div class="card">
  <div class="card-header">
    <div>
      <div class="card-title">${s.title}</div>
      <div class="card-sub">${s.desc}</div>
    </div>
    <span class="card-tag">Stage ${s.num}</span>
  </div>
  <div class="card-body">

    <div class="ai-helper-box">
      <button class="btn btn-orange btn-sm" onclick="wAiHelp()" ${wLoading?'disabled':''}>
        🤖 ${s.helperLabel}
      </button>
      <span class="ai-helper-hint">AI 會根據你嘅主題同 draft 給建議</span>
    </div>

    <div class="ai-output-box" id="w-ai-out" style="display:${wAiOutput[wStage]?'block':'none'}">
      <div class="ai-output-label">💡 AI 建議</div>
      <div class="ai-output-body">${wAiOutput[wStage] ? fmt(wAiOutput[wStage]) : ''}</div>
    </div>

    <div class="field-group" style="margin-top:14px">
      <span class="field-label">你嘅內容</span>
      <textarea class="inp" id="w-content" rows="8" placeholder="${esc(s.placeholder)}"
        oninput="wContent[wStage]=this.value">${esc(wContent[wStage])}</textarea>
    </div>

    <div class="writer-actions">
      <button class="btn btn-ghost" onclick="wPrev()" ${wStage===0?'disabled':''}>← 上一段</button>
      <button class="btn btn-ghost btn-sm" onclick="wPolish()" ${wLoading?'disabled':''}>
        ✨ Polish 呢段
      </button>
      <button class="btn btn-primary" onclick="wNext()" ${wStage===STAGES.length-1?'disabled':''}>
        下一段 →
      </button>
    </div>
  </div>
</div>

${wStage === STAGES.length - 1 ? `
<div class="card" style="margin-top:14px">
  <div class="card-header">
    <div>
      <div class="card-title">🏁 完成</div>
      <div class="card-sub">合成 final draft 同生成 reference list</div>
    </div>
  </div>
  <div class="card-body">
    <div class="btn-row">
      <button class="btn btn-primary" onclick="wAssemble()">📜 合成 Final Draft</button>
      <button class="btn btn-ghost" onclick="wGenRefs()">📚 生成 References</button>
    </div>
    <div id="w-final" style="margin-top:14px"></div>
  </div>
</div>` : ''}
`;
}

// ─── Stage Navigation ─────────────────────────
function wGoStage(i) { wStage = i; renderStagePanel(); }
function wPrev() { if (wStage > 0) { wStage--; renderStagePanel(); } }
function wNext() { if (wStage < STAGES.length - 1) { wStage++; renderStagePanel(); } }

// ─── AI Helper ────────────────────────────────
async function wAiHelp() {
  if (!wTopic.trim()) { alert('請先輸入主題'); return; }
  const s = STAGES[wStage];
  const out = document.getElementById('w-ai-out');
  const body = document.getElementById('w-ai-out')?.querySelector('.ai-output-body');
  if (out) {
    out.style.display = 'block';
    body.innerHTML = '<div class="tdots"><span></span><span></span><span></span></div>';
  }
  wLoading = true;
  try {
    const prompt = s.helperPrompt(wTopic, wContent[wStage]);
    const r = await API.call(
      [{ role: 'user', content: prompt }],
      '你係專業嘅 Substack 寫作助手，協助用戶寫深度 long-form post。語言：繁體中文 + 必要英文術語。'
    );
    wAiOutput[wStage] = r;
    if (body) body.innerHTML = fmt(r);
  } catch (e) {
    if (body) body.innerHTML = `<span style="color:var(--red)">${e.message}</span>`;
  }
  wLoading = false;
}

// ─── Polish ───────────────────────────────────
async function wPolish() {
  const content = wContent[wStage]?.trim();
  if (!content || content.length < 30) { alert('請先寫返呢段先做 polish'); return; }
  const s = STAGES[wStage];
  wLoading = true;
  const out = document.getElementById('w-ai-out');
  const body = out?.querySelector('.ai-output-body');
  if (out) {
    out.style.display = 'block';
    body.innerHTML = '<div class="tdots"><span></span><span></span><span></span></div>';
  }
  try {
    const r = await API.call(
      [{ role: 'user', content: `以下係用戶寫嘅 Substack post 「${s.label}」section（主題：${wTopic}）：

${content}

請用 editor 嘅角色：
1. 評估 tone、structure、density
2. 提出 2-3 個 specific 改進建議
3. 提供一個改寫示範（保留用戶 voice）

繁體中文，參考 BCG/McKinsey level 嘅 professional analysis tone，但保留 personal touch。` }],
      '你係專業 Substack editor，幫用戶 polish 文章但保留佢嘅 voice。'
    );
    wAiOutput[wStage] = r;
    if (body) body.innerHTML = fmt(r);
  } catch (e) {
    if (body) body.innerHTML = `<span style="color:var(--red)">${e.message}</span>`;
  }
  wLoading = false;
}

// ─── Assemble Final Draft ────────────────────
async function wAssemble() {
  const fc = document.getElementById('w-final');
  if (!fc) return;
  if (!wContent.some(c => c.trim())) { alert('請先填寫各段內容'); return; }
  fc.innerHTML = '<div class="ai-block loading">合成中… <div class="tdots" style="display:inline-flex"><span></span><span></span><span></span></div></div>';
  try {
    const sections = STAGES.map((s, i) => `## ${s.num}. ${s.label}\n${wContent[i] || '(空白)'}`).join('\n\n');
    const r = await API.call(
      [{ role: 'user', content: `以下係用戶嘅 Substack post draft（主題：${wTopic}），請合成做一篇連貫嘅 long-form post：

${sections}

要求：
- 加返 title、subtitle、適當嘅小標題
- 段落之間加 transition sentence 令文章 flow 順
- 保留用戶嘅 voice、所有 citation 同數字
- 末尾保留結尾段
- 直接輸出完整 markdown，唔需要額外解釋

參考 BCG/McKinsey product breakdown 風格。` }],
      '你係專業 Substack editor，將 sectioned draft 合成連貫文章。'
    );
    fc.innerHTML = `<div class="final-draft">${fmt(r)}</div>
    <div class="btn-row" style="margin-top:12px">
      <button class="btn btn-ghost btn-sm" onclick="wCopyFinal()">📋 複製到剪貼板</button>
    </div>
    <textarea id="w-final-raw" style="display:none">${esc(r)}</textarea>`;
  } catch (e) {
    fc.innerHTML = `<div style="color:var(--red)">${e.message}</div>`;
  }
}

function wCopyFinal() {
  const ta = document.getElementById('w-final-raw');
  if (!ta) return;
  navigator.clipboard.writeText(ta.value).then(() => alert('已複製！可直接 paste 入 Substack editor'));
}

// ─── References Generation ──────────────────
async function wGenRefs() {
  const fc = document.getElementById('w-final');
  if (!fc) return;
  fc.innerHTML = '<div class="ai-block loading">生成 references… <div class="tdots" style="display:inline-flex"><span></span><span></span><span></span></div></div>';
  try {
    const allContent = STAGES.map((s, i) => `[${s.label}]\n${wContent[i]}`).join('\n\n');
    const r = await API.call(
      [{ role: 'user', content: `以下係 Substack post 草稿（主題：${wTopic}）：

${allContent}

請抽取所有提到嘅 sources（研究、報告、學者、期刊），用 academic reference 格式列出：
- 期刊文章：作者, 年份, 標題, 期刊
- 市場報告：機構, 年份, 報告名
- 書籍：作者, 年份, 書名

繁體 + 英文標準格式。唔好杜撰，只列出文中有提到嘅 sources。` }],
      '你係嚴謹嘅 academic editor，幫用戶整理 reference list。'
    );
    fc.innerHTML = `<div class="ai-block">${fmt(r)}</div>`;
  } catch (e) {
    fc.innerHTML = `<div style="color:var(--red)">${e.message}</div>`;
  }
}

// ─── Export ──────────────────────────────────
function wExport() {
  const sections = STAGES.map((s, i) => `## ${s.num}. ${s.label}\n\n${wContent[i] || '(空白)'}`).join('\n\n---\n\n');
  const md = `# ${wTopic || '(未命名)'}\n\n${sections}`;
  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `substack-${(wTopic || 'draft').slice(0, 30)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
