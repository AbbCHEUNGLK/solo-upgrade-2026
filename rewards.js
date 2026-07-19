// rewards.js — Wish Jar reward engine
// Public API: earnMission(missionId), unearnMission(missionId)
// Updates jar_state (totalEarned / weeklyEarned / earnLog) + currentWish.savedAmount.
// Weekly rollover included (Sunday = week start, Apple Cal align).
// Concern 4 will add: strike bonus (3d/7d/14d) + weekly cap enforcement.

function _weekStart(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - d.getDay()); // Sunday
  return d.toISOString().slice(0, 10);
}

async function earnMission(missionId) {
  const mission = Storage.getMissions().find(m => m.id === missionId);
  if (!mission) {
    console.warn('earnMission: mission not found for id', missionId);
    return { success: false };
  }

  const state = Storage.getJarState() || {};
  const today = new Date().toISOString().slice(0, 10);
  const wkStart = _weekStart(today);

  // Weekly rollover
  if (state.weekStartDate !== wkStart) {
    state.weekStartDate = wkStart;
    state.weeklyEarned = 0;
  }

  const amount = mission.reward || 0;
  state.totalEarned = (state.totalEarned || 0) + amount;
  state.weeklyEarned = (state.weeklyEarned || 0) + amount;
  state.earnLog = state.earnLog || [];
  state.earnLog.push({
    missionId,
    amount,
    timestamp: new Date().toISOString(),
  });
  await Storage.setJarState(state);

  // Increment current wish savedAmount
  if (state.currentWishId) {
    const w = Storage.getWishes().find(w => w.id === state.currentWishId);
    if (w) {
      await Storage.updateWish(state.currentWishId, {
        savedAmount: (w.savedAmount || 0) + amount,
      });
    }
  }

  return { success: true, amount, newTotal: state.totalEarned };
}

async function unearnMission(missionId) {
  const mission = Storage.getMissions().find(m => m.id === missionId);
  if (!mission) return { success: false };

  const state = Storage.getJarState() || {};
  const amount = mission.reward || 0;
  state.totalEarned = Math.max(0, (state.totalEarned || 0) - amount);
  state.weeklyEarned = Math.max(0, (state.weeklyEarned || 0) - amount);

  // Remove most recent earnLog entry for this mission today
  const today = new Date().toISOString().slice(0, 10);
  const log = state.earnLog || [];
  for (let i = log.length - 1; i >= 0; i--) {
    if (log[i].missionId === missionId && log[i].timestamp.slice(0, 10) === today) {
      log.splice(i, 1);
      break;
    }
  }
  state.earnLog = log;
  await Storage.setJarState(state);

  if (state.currentWishId) {
    const w = Storage.getWishes().find(w => w.id === state.currentWishId);
    if (w) {
      await Storage.updateWish(state.currentWishId, {
        savedAmount: Math.max(0, (w.savedAmount || 0) - amount),
      });
    }
  }

  return { success: true };
}
