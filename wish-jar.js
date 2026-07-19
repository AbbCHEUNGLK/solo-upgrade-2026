// wish-jar.js — Wish Jar page (Concern 3, 2026-07-18)
// 森之魔女 pastel aesthetic scoped 喺 .jar-scope class 內。
// Missions source = Storage.getMissions() (all 7: 5 daily + 2 opportunity)
// Wishes CRUD + seed default Kindle wish 於首次進入時
// Strike bonus + weekly cap toast/popup 押後 Concern 4

const _JAR_SEED_KINDLE = {
  id: 'w-kindle-default',
  name: 'Kindle 電子閱讀器',
  price: 1500,
  emoji: '📖',
  status: 'ongoing',
  createdAt: new Date().toISOString().slice(0, 10),
  savedAmount: 0,
};

async function _seedWishIfEmpty() {
  const wishes = Storage.getWishes();
  const state = Storage.getJarState() || {};

  if (wishes.length === 0) {
    await Storage.setWishes([{ ..._JAR_SEED_KINDLE }]);
    state.currentWishId = _JAR_SEED_KINDLE.id;
    await Storage.setJarState(state);
  } else if (!state.currentWishId) {
    // wishes 有但冇 currentWishId — 揀第一個 ongoing 或第一個
    const pick = wishes.find(w => w.status === 'ongoing') || wishes[0];
    if (pick) {
      state.currentWishId = pick.id;
      if (pick.status !== 'ongoing') {
        await Storage.updateWish(pick.id, { status: 'ongoing' });
      }
      await Storage.setJarState(state);
    }
  }
}

function _wjEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

function _wjFmtDate(iso) {
  if (!iso) return '';
  const m = iso.match(/^\d{4}-(\d{2})-(\d{2})$/);
  return m ? `${+m[1]}月${+m[2]}日` : iso;
}

function _wjJarSvg(progress) {
  // progress = 0-1，控制 potion bottle 內 liquid 高度
  const p = Math.min(1, Math.max(0, progress));
  const liquidTopY = 190 - 132 * p; // bottle interior top ~58, bottom ~190
  return `
<svg viewBox="0 0 160 210" width="140" height="185" aria-label="Wish jar at ${Math.round(p * 100)}%">
  <ellipse cx="80" cy="140" rx="72" ry="65" fill="#D4C5E8" opacity="0.25"/>
  <rect x="62" y="20" width="36" height="18" rx="3" fill="#8B6F47" stroke="#5A4A38" stroke-width="2"/>
  <rect x="65" y="14" width="30" height="8" rx="2" fill="#A08160" stroke="#5A4A38" stroke-width="1.5"/>
  <rect x="65" y="38" width="30" height="20" fill="#F5EDD6" stroke="#8B6F47" stroke-width="2"/>
  <path d="M55 58 Q35 68 35 105 L35 165 Q35 190 80 190 Q125 190 125 165 L125 105 Q125 68 105 58 Z"
        fill="#FFFDF7" stroke="#8B6F47" stroke-width="2.5"/>
  <clipPath id="wjBottleShape"><path d="M55 58 Q35 68 35 105 L35 165 Q35 190 80 190 Q125 190 125 165 L125 105 Q125 68 105 58 Z"/></clipPath>
  <g clip-path="url(#wjBottleShape)">
    <rect x="30" y="${liquidTopY}" width="100" height="200" fill="#D4A85A"/>
    <path d="M30 ${liquidTopY} Q45 ${liquidTopY - 4} 60 ${liquidTopY} T90 ${liquidTopY} T130 ${liquidTopY} L130 ${liquidTopY + 8} L30 ${liquidTopY + 8} Z" fill="#E8B84A" opacity="0.6"/>
    <circle cx="55" cy="175" r="3" fill="#FFF7E8" opacity="0.7"/>
    <circle cx="90" cy="180" r="2" fill="#FFF7E8" opacity="0.7"/>
    <circle cx="70" cy="185" r="1.5" fill="#FFF7E8" opacity="0.5"/>
  </g>
  <rect x="55" y="108" width="50" height="32" rx="4" fill="#F3C6C6" stroke="#C48A8A" stroke-width="1.5" opacity="0.92"/>
  <text x="80" y="122" text-anchor="middle" font-family="Klee One, serif" font-size="10" fill="#5A4A38">Wish</text>
  <text x="80" y="135" text-anchor="middle" font-family="Inter, sans-serif" font-size="9" font-weight="600" fill="#8B6F47">${Math.round(p * 100)}%</text>
  <text x="15" y="42" font-size="14" fill="#D4A85A">✦</text>
  <text x="140" y="58" font-size="12" fill="#D4A85A">✧</text>
  <text x="10" y="92" font-size="10" fill="#9080B0">★</text>
  <text x="147" y="102" font-size="10" fill="#7FA97A">✦</text>
  <text x="150" y="152" font-size="8" fill="#D4A85A">✧</text>
  <text x="5" y="148" font-size="8" fill="#C48A8A">✦</text>
  <path d="M130 28 Q123 31 123 38 Q123 45 130 48 Q127 43 127 38 Q127 33 130 28 Z" fill="#D4A85A"/>
</svg>`;
}

async function renderWishJar() {
  await _seedWishIfEmpty();
  const wishes = Storage.getWishes();
  const state = Storage.getJarState() || {};
  const missions = Storage.getMissions();
  const tasksDone = Storage.getTasksDone();

  const currentWish = wishes.find(w => w.id === state.currentWishId);
  const comingWishes = wishes.filter(w => w.id !== state.currentWishId && w.status !== 'completed');
  const completedWishes = wishes.filter(w => w.status === 'completed');

  const savedAmt = currentWish?.savedAmount || 0;
  const progress = currentWish ? savedAmt / currentWish.price : 0;
  const isFull = currentWish && savedAmt >= currentWish.price;

  document.getElementById('page-area').innerHTML = `
<style>
  .jar-scope {
    font-family: 'Klee One', 'Zen Maru Gothic', 'Inter', system-ui, sans-serif;
    color: #4A3D3A;
    padding: 32px 24px;
    max-width: 720px;
    margin: 0 auto;
    line-height: 1.6;
  }
  .jar-scope * { box-sizing: border-box; }
  .jar-scope .wj-eyebrow { font-size: 12px; color: #8B7A6B; letter-spacing: 3px; margin-bottom: 4px; }
  .jar-scope .wj-title { font-size: 28px; font-weight: 600; margin: 0 0 24px; color: #5A4A38; display: flex; align-items: center; gap: 12px; }
  .jar-scope .wj-title .moon { font-size: 22px; color: #D4A85A; }

  .jar-scope .jar-hero {
    background: linear-gradient(180deg, #F5EDD6 0%, #FFF7E8 100%);
    border-radius: 24px; padding: 24px; margin-bottom: 20px;
    border: 1.5px dashed #8B6F47;
    position: relative; overflow: hidden;
  }
  .jar-scope .stars-tr, .jar-scope .stars-bl {
    position: absolute; font-size: 14px; letter-spacing: 6px; pointer-events: none;
  }
  .jar-scope .stars-tr { top: 14px; right: 18px; color: #D4A85A; }
  .jar-scope .stars-bl { bottom: 14px; left: 18px; color: #9080B0; font-size: 12px; }
  .jar-scope .jar-current { text-align: center; font-size: 12px; color: #8B7A6B; letter-spacing: 3px; margin-bottom: 6px; }
  .jar-scope .jar-wish { text-align: center; font-size: 18px; font-weight: 600; color: #5A4A38; margin-bottom: 4px; }
  .jar-scope .jar-wish .price { color: #A88035; margin-left: 8px; font-family: 'Inter', sans-serif; }
  .jar-scope .jar-svg-wrap { display: flex; justify-content: center; margin: 6px 0; }
  .jar-scope .jar-progress { max-width: 380px; margin: 8px auto 0; }
  .jar-scope .progress-track { height: 8px; background: white; border-radius: 4px; overflow: hidden; border: 1px solid #F3C6C6; }
  .jar-scope .progress-fill { height: 100%; background: linear-gradient(90deg, #B5D3B0 0%, #D4A85A 100%); border-radius: 4px; transition: width 0.5s ease; }
  .jar-scope .progress-text { text-align: center; font-size: 13px; color: #8B7A6B; margin-top: 8px; letter-spacing: 1px; }
  .jar-scope .progress-text .earned { color: #A88035; font-weight: 600; font-size: 15px; font-family: 'Inter', sans-serif; }
  .jar-scope .jar-empty { text-align: center; padding: 24px; color: #8B7A6B; font-size: 14px; line-height: 1.8; }
  .jar-scope .jar-full-cta {
    display: block; margin: 14px auto 0; padding: 10px 24px;
    background: #D4A85A; color: white; border: none; border-radius: 20px;
    font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer;
  }
  .jar-scope .jar-full-cta:hover { background: #A88035; }

  .jar-scope .section-title { font-size: 16px; font-weight: 600; color: #5A4A38; margin: 28px 0 12px; display: flex; align-items: center; gap: 8px; }
  .jar-scope .section-title .icon { color: #D4A85A; }

  .jar-scope .mission {
    background: white; border: 1.5px solid #F5EDD6; border-radius: 14px;
    padding: 14px 16px; margin-bottom: 8px;
    display: flex; align-items: center; gap: 12px; transition: all 0.2s;
  }
  .jar-scope .mission:hover { border-color: #B5D3B0; background: #FFFDF7; transform: translateY(-1px); }
  .jar-scope .mission.done { background: #F5EDD6; opacity: 0.75; }
  .jar-scope .mission-check {
    width: 26px; height: 26px; border-radius: 50%; border: 2px solid #B5D3B0;
    background: white; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; color: white; font-size: 14px; font-weight: 700;
  }
  .jar-scope .mission.done .mission-check { background: #B5D3B0; border-color: #7FA97A; }
  .jar-scope .mission-body { flex: 1; min-width: 0; }
  .jar-scope .mission-name { font-size: 15px; color: #4A3D3A; }
  .jar-scope .mission-meta { font-size: 11px; color: #8B7A6B; letter-spacing: 1px; margin-top: 2px; }
  .jar-scope .mission-reward {
    font-size: 15px; font-weight: 600; color: #A88035;
    padding: 6px 14px; background: #F5EDD6; border-radius: 12px;
    border: 1px dashed #D4A85A; font-family: 'Inter', sans-serif; white-space: nowrap;
  }
  .jar-scope .mission.opportunity {
    border-left: 3px solid #9080B0;
    background: linear-gradient(90deg, rgba(212,197,232,0.15) 0%, white 30%);
  }
  .jar-scope .mission.opportunity .mission-reward {
    background: #D4C5E8; border-color: #9080B0; color: #6B4E71; border-style: solid;
  }
  .jar-scope .mission.opportunity.done { background: #F5EDD6; }

  .jar-scope .wishes-scroll {
    background: #F5EDD6; border-radius: 16px; padding: 22px 20px;
    border: 1.5px solid #8B6F47; position: relative;
  }
  .jar-scope .wishes-scroll::before, .jar-scope .wishes-scroll::after {
    content: ''; position: absolute; left: 0; right: 0; height: 8px;
    background: repeating-linear-gradient(90deg, #8B6F47 0 6px, transparent 6px 14px);
    opacity: 0.35;
  }
  .jar-scope .wishes-scroll::before { top: 6px; }
  .jar-scope .wishes-scroll::after { bottom: 6px; }
  .jar-scope .wish-section-label { font-size: 12px; color: #8B7A6B; letter-spacing: 2px; margin: 14px 0 8px; }
  .jar-scope .wish-section-label:first-child { margin-top: 0; }
  .jar-scope .wish-item {
    background: white; border-radius: 12px; padding: 12px 14px; margin-bottom: 8px;
    display: flex; align-items: center; gap: 12px; border: 1px solid #F5EDD6;
  }
  .jar-scope .wish-item.completed { opacity: 0.7; }
  .jar-scope .wish-item .emoji { font-size: 22px; }
  .jar-scope .wish-item-body { flex: 1; min-width: 0; }
  .jar-scope .wish-item-name { font-size: 14px; color: #4A3D3A; }
  .jar-scope .wish-item-name .price { color: #A88035; font-family: 'Inter', sans-serif; }
  .jar-scope .wish-item-meta { font-size: 11px; color: #8B7A6B; margin-top: 2px; }
  .jar-scope .wish-actions { display: flex; gap: 6px; flex-shrink: 0; }
  .jar-scope .btn-mini {
    font-size: 11px; padding: 5px 10px; border-radius: 12px;
    border: 1px solid #8B6F47; background: white; color: #8B6F47;
    cursor: pointer; font-family: inherit; transition: all 0.15s;
  }
  .jar-scope .btn-mini:hover { background: #FFF7E8; }
  .jar-scope .btn-mini.danger { border-color: #C48A8A; color: #C48A8A; }
  .jar-scope .btn-mini.danger:hover { background: rgba(243,198,198,0.2); }
  .jar-scope .add-wish {
    width: 100%; padding: 12px; border: 2px dashed #7FA97A; background: transparent;
    border-radius: 12px; color: #7FA97A; cursor: pointer; font-family: inherit;
    font-size: 14px; margin-top: 8px;
  }
  .jar-scope .add-wish:hover { background: rgba(181,211,176,0.15); }
  .jar-scope .footer-note {
    text-align: center; font-size: 12px; color: #8B7A6B; margin-top: 28px;
    padding: 16px; background: rgba(212,197,232,0.3); border-radius: 12px;
    letter-spacing: 1px; line-height: 1.8;
  }
</style>

<div class="jar-scope">

<div class="wj-eyebrow">SOLO UPGRADE · 願望</div>
<h1 class="wj-title"><span class="moon">☾</span> 願望罐 · Wish Jar</h1>

<div class="jar-hero">
  <div class="stars-tr">✦ ✧ ★</div>
  <div class="stars-bl">✧ ✦</div>
  ${currentWish ? `
    <div class="jar-current">◈ 現正實現 ◈</div>
    <div class="jar-wish">${_wjEsc(currentWish.emoji || '🎁')} ${_wjEsc(currentWish.name)} <span class="price">$${currentWish.price.toLocaleString()}</span></div>
    <div class="jar-svg-wrap">${_wjJarSvg(progress)}</div>
    <div class="jar-progress">
      <div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, progress * 100).toFixed(1)}%"></div></div>
      <div class="progress-text">已儲 <span class="earned">$${savedAmt.toLocaleString()}</span> / $${currentWish.price.toLocaleString()} · ${Math.min(100, Math.round(progress * 100))}%</div>
      ${isFull ? `<button class="jar-full-cta" onclick="wjCompleteWish('${_wjEsc(currentWish.id)}')">✧ 已達成，入手！ ✧</button>` : ''}
    </div>
  ` : `
    <div class="jar-empty">☾ 未有進行中嘅心願<br><br>去下面「心願卷軸」揀一個做進行中，<br>或者「+ 加新心願」開始你嘅旅程 ✧</div>
  `}
</div>

<div class="section-title"><span class="icon">✦</span> 今日 mission</div>
${missions.map(m => {
  const done = tasksDone.includes(m.id);
  return `
<div class="mission${done ? ' done' : ''}${m.isOpportunity ? ' opportunity' : ''}" id="wj-m-${m.id}">
  <div class="mission-check" onclick="wjToggleMission(${m.id})">${done ? '✓' : ''}</div>
  <div class="mission-body">
    <div class="mission-name">${_wjEsc(m.name)}</div>
    <div class="mission-meta">${_wjEsc(m.category)}${m.isOpportunity ? ' · 機會 mission' : ''}</div>
  </div>
  <div class="mission-reward">+$${m.reward}</div>
</div>`;
}).join('')}

<div class="section-title"><span class="icon">☾</span> 心願卷軸</div>
<div class="wishes-scroll">
  ${currentWish ? `
    <div class="wish-section-label">◈ 進行中</div>
    <div class="wish-item">
      <div class="emoji">${_wjEsc(currentWish.emoji || '🎁')}</div>
      <div class="wish-item-body">
        <div class="wish-item-name">${_wjEsc(currentWish.name)} · <span class="price">$${currentWish.price.toLocaleString()}</span></div>
        <div class="wish-item-meta">開始於 ${_wjFmtDate(currentWish.createdAt)} · 已儲 $${savedAmt.toLocaleString()} · ${Math.min(100, Math.round(progress * 100))}%</div>
      </div>
      <div class="wish-actions">
        <button class="btn-mini danger" onclick="wjDeleteWish('${_wjEsc(currentWish.id)}')" title="刪除">🗑</button>
      </div>
    </div>
  ` : ''}

  ${comingWishes.length > 0 ? `
    <div class="wish-section-label">✧ 心願清單 · Coming to You</div>
    ${comingWishes.map(w => `
      <div class="wish-item">
        <div class="emoji">${_wjEsc(w.emoji || '🎁')}</div>
        <div class="wish-item-body">
          <div class="wish-item-name">${_wjEsc(w.name)} · <span class="price">$${w.price.toLocaleString()}</span></div>
          <div class="wish-item-meta">加入於 ${_wjFmtDate(w.createdAt)}${(w.savedAmount || 0) > 0 ? ` · 暫停中（保留 $${(w.savedAmount||0).toLocaleString()}）` : ''}</div>
        </div>
        <div class="wish-actions">
          <button class="btn-mini" onclick="wjSwitchWish('${_wjEsc(w.id)}')">切換為進行中</button>
          <button class="btn-mini danger" onclick="wjDeleteWish('${_wjEsc(w.id)}')" title="刪除">🗑</button>
        </div>
      </div>
    `).join('')}
  ` : ''}

  ${completedWishes.length > 0 ? `
    <div class="wish-section-label">✦ 已入手 · Got that!</div>
    ${completedWishes.map(w => `
      <div class="wish-item completed">
        <div class="emoji">${_wjEsc(w.emoji || '🎁')}</div>
        <div class="wish-item-body">
          <div class="wish-item-name">${_wjEsc(w.name)} · <span class="price">$${w.price.toLocaleString()}</span></div>
          <div class="wish-item-meta">完成於 ${_wjFmtDate(w.completedAt)}</div>
        </div>
        <div class="wish-actions">
          <button class="btn-mini danger" onclick="wjDeleteWish('${_wjEsc(w.id)}')" title="刪除">🗑</button>
        </div>
      </div>
    `).join('')}
  ` : ''}

  <button class="add-wish" onclick="wjAddWish()">+ 加新心願</button>
</div>

<div class="footer-note">
  ✧ 每個 mission 完成即刻入錢入罐 · 連續 3 / 7 / 14 日 bonus 稍後上線 ✧<br>
  切換 wish 會暫停現有進度，新 wish 從 $0 開始
</div>

</div>`;
}

// ─── Mission toggle from Wish Jar tab（sync 埋 tasks_done）─────
async function wjToggleMission(id) {
  const tasksDone = Storage.getTasksDone();
  const idx = tasksDone.indexOf(id);
  if (idx >= 0) {
    tasksDone.splice(idx, 1);
    await Storage.setTasksDone(tasksDone);
    await unearnMission(id);
  } else {
    tasksDone.push(id);
    await Storage.setTasksDone(tasksDone);
    await earnMission(id);
  }
  updateTopProgress();
  renderWishJar();
}

// ─── Wish CRUD ─────────────────────────────────────────────
async function wjAddWish() {
  const emoji = prompt('揀個 emoji（Enter 用 🎁）', '🎁');
  if (emoji === null) return;
  const name = prompt('心願名稱：');
  if (!name || !name.trim()) return;
  const priceStr = prompt('價錢（$）：');
  if (priceStr === null) return;
  const price = parseFloat(String(priceStr).replace(/[^\d.]/g, ''));
  if (!price || price <= 0) { alert('請輸入有效嘅價錢'); return; }

  const wishes = Storage.getWishes();
  const hasOngoing = wishes.some(w => w.status === 'ongoing');
  const newWish = {
    id: 'w-' + Date.now(),
    name: name.trim(),
    price,
    emoji: emoji || '🎁',
    status: hasOngoing ? 'coming' : 'ongoing',
    createdAt: new Date().toISOString().slice(0, 10),
    savedAmount: 0,
  };
  wishes.push(newWish);
  await Storage.setWishes(wishes);

  if (!hasOngoing) {
    const state = Storage.getJarState() || {};
    state.currentWishId = newWish.id;
    await Storage.setJarState(state);
  }

  renderWishJar();
}

async function wjDeleteWish(id) {
  const wish = Storage.getWishes().find(w => w.id === id);
  if (!wish) return;
  const isCurrent = Storage.getJarState()?.currentWishId === id;
  const msg = `確定刪除「${wish.name}」？${isCurrent ? '\n\n（呢個係進行中嘅心願，刪除後進度會清空）' : ''}`;
  if (!confirm(msg)) return;

  const wishes = Storage.getWishes().filter(w => w.id !== id);
  await Storage.setWishes(wishes);

  const state = Storage.getJarState() || {};
  if (state.currentWishId === id) {
    // 自動揀下一個非 completed 嘅 wish 做 ongoing
    const next = wishes.find(w => w.status !== 'completed');
    if (next) {
      state.currentWishId = next.id;
      if (next.status !== 'ongoing') {
        await Storage.updateWish(next.id, { status: 'ongoing' });
      }
    } else {
      state.currentWishId = null;
    }
    await Storage.setJarState(state);
  }

  renderWishJar();
}

async function wjSwitchWish(newId) {
  const state = Storage.getJarState() || {};
  const oldId = state.currentWishId;

  // 舊 ongoing 變 paused（savedAmount 保留）
  if (oldId && oldId !== newId) {
    const old = Storage.getWishes().find(w => w.id === oldId);
    if (old && old.status === 'ongoing') {
      await Storage.updateWish(oldId, { status: 'paused' });
    }
  }

  await Storage.updateWish(newId, { status: 'ongoing' });
  state.currentWishId = newId;
  await Storage.setJarState(state);

  renderWishJar();
}

async function wjCompleteWish(id) {
  const wish = Storage.getWishes().find(w => w.id === id);
  if (!wish) return;
  if (!confirm(`確定入手「${wish.name}」？呢個心願會 mark 為完成，跟住可以揀下一個 target。`)) return;

  await Storage.updateWish(id, {
    status: 'completed',
    completedAt: new Date().toISOString().slice(0, 10),
  });

  const state = Storage.getJarState() || {};
  const wishes = Storage.getWishes();
  const next = wishes.find(w => w.status !== 'completed' && w.id !== id);
  if (next) {
    if (next.status !== 'ongoing') {
      await Storage.updateWish(next.id, { status: 'ongoing' });
    }
    state.currentWishId = next.id;
  } else {
    state.currentWishId = null;
  }
  await Storage.setJarState(state);

  renderWishJar();
}
