// utils/storage.js — localStorage 封裝
// 改儲存邏輯只需動這個檔案

const TODAY = new Date().toISOString().slice(0, 10);
const YM    = new Date().toISOString().slice(0, 7);

const Storage = {
  get: (key, fallback) => JSON.parse(localStorage.getItem(key) ?? JSON.stringify(fallback)),
  set: (key, val)      => localStorage.setItem(key, JSON.stringify(val)),

  // 每日任務
  getTasksDone:  ()  => Storage.get('td_' + TODAY, []),
  setTasksDone:  (v) => Storage.set('td_' + TODAY, v),

  // 本週打卡
  getStreak:  ()  => Storage.get('sk_' + YM, []),
  setStreak:  (v) => Storage.set('sk_' + YM, v),

  // 認證進度
  getCertProg:  ()  => Storage.get('cp2', {}),
  setCertProg:  (v) => Storage.set('cp2', v),

  // 每週輸出打卡
  getPostsDone:  ()  => Storage.get('psd', []),
  setPostsDone:  (v) => Storage.set('psd', v),
};
