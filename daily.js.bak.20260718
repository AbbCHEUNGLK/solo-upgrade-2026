// daily.js — 每日任務 · Version 2026.07 (Lalamove-onboarding phase)
// 改任務清單只需動 TASKS 陣列
// 每個 task 有 lens 欄，keyed by weekday (sun-sat)，係「今日 focus」rotation
// Historical tasks_done indices refer to task at that id AT THE TIME of check;
// Version 2026.07 shipped 2026-07-10 (Fri) — 保留 id 0-4 索引，語意重寫。

const WEEKDAYS = ['sun','mon','tue','wed','thu','fri','sat'];

function _todayKey() {
  return WEEKDAYS[new Date().getDay()];
}

const TASKS = [
  {
    id: 0,
    name: '朝早三步儀式',
    time: '8 min',
    tag: '身心',
    tagClass: 'tag-mind',
    detail: '<strong>三步：</strong>①自我最佳想像 2 min → ②言靈抄寫 / 念誦 → ③今日戰略 scenario prep（預想今日可能遇到嘅混沌 + 你嘅 response）',
    lens: {
      sun: '<strong>Weekly reflection</strong> — 上週有咩 compound 咗？下週想帶邊個 momentum 入去？',
      mon: '<strong>權威場域校準</strong> — 「I own my space, I own my pace」（將 gravitas 寫入當日代碼）',
      tue: '<strong>User empathy 開機</strong> — 「What would surprise a first-time user of my product?」',
      wed: '<strong>Team culture radar</strong> — 「Culture 係我唔喺個房嗰陣發生嘅嘢」',
      thu: '<strong>決策 velocity</strong> — 「Bias toward action, refine later」',
      fri: '<strong>Week residue 清理</strong> — 「What can I close today 令週末乾淨？」',
      sat: '<strong>Wild card</strong> — 揀一句你今週最感應嘅句子',
    }
  },
  {
    id: 1,
    name: '專業課程 微學習',
    time: '15 min',
    tag: '學習',
    tagClass: 'tag-comm',
    detail: '<strong>Current tracks：</strong>(a) Coursera Fintech Innovations Specialization · (b) Anthropic AI Capabilities & Limitations 收尾 · (c) 之後 Adyen Academy。<br><strong>策略：</strong>15 min consume + 1 條 takeaway，唔強求進度。',
    lens: {
      sun: '<strong>Weekly digest</strong> — 上週學過嘅嘢，揀 1 件試教俾非行內朋友聽',
      mon: '<strong>Coursera Payment Tech</strong> — video 或 reading chapter',
      tue: '<strong>Coursera</strong> — case study 深讀，對應返 Lalamove real scenario',
      wed: '<strong>Anthropic AI Capabilities</strong> — 收尾 chapter',
      thu: '<strong>Coursera</strong> — quiz / exercise 做一段',
      fri: '<strong>Industry deep read</strong> — Adyen Academy 或 payments 業界深度文',
      sat: '<strong>Follow the thread</strong> — 本週有 momentum 想追嘅一條線索',
    }
  },
  {
    id: 2,
    name: 'PM Window Shopping',
    time: '10–15 min',
    tag: '學習',
    tagClass: 'tag-comm',
    detail: '每日 1 個 Fintech / Payment app，用 PM lens 拆解：「如果我係呢個 product PM，資源擺喺邊？呢個 feature 划算嗎？」<br><strong>Purpose：</strong>將「格價式」defense mechanism → commercial intuition 訓練。',
    lens: {
      sun: '<strong>Retro</strong> — 本週睇過嘅 5 個 app，最 stick 得嘅嗰個嘅原因？',
      mon: '<strong>Admin console + permissions</strong> — Ripple / Airwallex / Currencycloud',
      tue: '<strong>Onboarding UX</strong> — Wise / Revolut / N26 新 user 前 60 秒',
      wed: '<strong>Pricing / monetization</strong> — Stripe / Adyen public pricing pages',
      thu: '<strong>Compliance UX</strong> — Sumsub / Onfido / Persona KYC flows',
      fri: '<strong>Wild card</strong> — 你 curious 邊個 app 都得',
      sat: '<strong>Merchant-side</strong>（Lalamove 直接相關）— Shopify Payments / Square merchant portal',
    }
  },
  {
    id: 3,
    name: 'AI Storytelling 練習',
    time: '15–20 min',
    tag: '溝通',
    tagClass: 'tag-comm',
    detail: '<strong>Prompt：</strong>「我想練習 Storytelling。你扮演好奇嘅朋友，我講 2–3 分鐘故事，你問 2 條追問。」<br><strong>Focus：</strong>用今日 lens 揀 storytelling subject，唔好齋抽象 topic。',
    lens: {
      sun: '<strong>本週 win storytelling</strong> — 揀本週一個 work moment，練 3 分鐘',
      mon: '<strong>Pitch rehearsal</strong> — 你今日想 pitch 嘅一個 real idea',
      tue: '<strong>Concept explanation</strong> — 解釋一個 Fintech concept 俾非行內朋友',
      wed: '<strong>Objection handling</strong> — Rehearse handle 一個 stakeholder 反對意見',
      thu: '<strong>Future scenario</strong> — 你未來 role 中一個 hypothetical situation',
      fri: '<strong>Feynman drill</strong> — 本週學到嘅 concept，用 3 句話講一次',
      sat: '<strong>Wild card</strong> — 自由講',
    }
  },
  {
    id: 4,
    name: '一期一會筆記',
    time: '10 min',
    tag: '溝通',
    tagClass: 'tag-comm',
    detail: '收工後 MUJI 清風房，2–3 lines 觀察筆記。<br><strong>Purpose：</strong>累積成 Stakeholder Map + Substack seed pool。<br><strong>Format：</strong>紙筆或 Notes app，一次一 moment，唔要寫成 article。',
    lens: {
      sun: '<strong>Stakeholder Map 補</strong> — 邊個 stakeholder profile 仲空？補一補',
      mon: '<strong>Authority figures</strong> — lead / skip-level 嘅 communication style signal',
      tue: '<strong>End-user proxy</strong> — 有冇聽到 real customer complaint / feedback？',
      wed: '<strong>Team culture signals</strong> — 邊種 behaviour 得到 reward？邊種 silently punished？',
      thu: '<strong>決策 velocity</strong> — 今日一個 decision 用咗幾耐先落實？',
      fri: '<strong>Week residue</strong> — 本週最 uncomfortable 嘅 conversation moment',
      sat: '<strong>自由觀察</strong> — 咩都可以',
    }
  },
];

function _lensFor(task) {
  return task.lens?.[_todayKey()] || '';
}

function renderDaily() {
  const now = new Date();
  const tasksDone = Storage.getTasksDone();
  document.getElementById('page-area').innerHTML = `
<style>
  .task-lens {
    font-size: 12px;
    color: var(--orange);
    margin-top: 4px;
    line-height: 1.5;
  }
  .task-lens strong {
    color: var(--orange);
    font-weight: 600;
  }
  .task-item.done .task-lens {
    color: var(--text3);
  }
  .task-item.done .task-lens strong {
    color: var(--text3);
  }
</style>
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
    ${TASKS.map((t, i) => {
      const lens = _lensFor(t);
      return `
    <div class="task-item${tasksDone.includes(t.id) ? ' done' : ''}" id="ti-${t.id}">
      <div class="task-check" onclick="toggleTask(${t.id}, event)">
        <svg class="task-check-inner" width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5l2.3 2.3L8 1" stroke="white" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="task-body" onclick="expandTask(${t.id})">
        <span class="task-name">${t.name}</span>
        ${lens ? `<div class="task-lens">今日 focus: ${lens}</div>` : ''}
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
    ${i === 0 ? '<hr class="divider">' : ''}`;
    }).join('')}
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
