// storage.js — Supabase 雲端同步版本
// 進度會自動同步到所有裝置

const SUPABASE_URL = 'https://hkkyyuhchdkfakjjrthq.supabase.co';
const SUPABASE_KEY = 'sb_publishable_4lQ6JasfuyWHon8eDOrKmg_gi1XDPUb';
const USER_ID      = 'default';
const TODAY        = new Date().toISOString().slice(0, 10);
const YM           = new Date().toISOString().slice(0, 7);

// ─── 本地快取（離線時仍可用）───────────────────
let _cache = {
  tasks_done: {},   // { '2026-06-05': [0,1,2] }
  streak:     {},   // { '2026-06': [0,1,4] }
  cert_prog:  {},
  posts_done: [],
  course_hl:  {},   // { c101: '整理咗嘅 markdown text', ... }
  posts:      [],   // Substack posts archive: [{ id, status, title, date, body, substackUrl }, ...]
};

// ─── Supabase fetch helper ──────────────────────
async function _sbFetch(method, body) {
  const url = `${SUPABASE_URL}/rest/v1/progress?user_id=eq.${USER_ID}`;
  const res = await fetch(url, {
    method,
    headers: {
      'apikey':        SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type':  'application/json',
      'Prefer':        method === 'POST' ? 'resolution=merge-duplicates' : 'return=minimal',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  // fetch() 唔會 throw on HTTP error，要手動 check
  if (!res.ok) {
    const errText = await res.text().catch(() => '(no body)');
    console.error('🔴 Supabase request failed:', { status: res.status, body: errText });
    throw new Error(`Supabase ${method} ${res.status}: ${errText}`);
  }
  return res;
}

// ─── 啟動時從雲端載入 ──────────────────────────
const Storage = {
  async load() {
    try {
      const res  = await fetch(
        `${SUPABASE_URL}/rest/v1/progress?user_id=eq.${USER_ID}&select=*`,
        { headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY } }
      );
      const rows = await res.json();
      if (rows.length > 0) {
        const r    = rows[0];
        _cache.tasks_done = r.tasks_done || {};
        _cache.streak     = r.streak     || {};
        _cache.cert_prog  = r.cert_prog  || {};
        _cache.posts_done = r.posts_done || [];
        _cache.course_hl  = r.course_hl  || {};
        _cache.posts      = r.posts      || [];
      }
    } catch (e) {
      console.warn('Supabase load failed, using local cache:', e);
    }
  },

  async _save() {
    try {
      await _sbFetch('POST', {
        user_id:    USER_ID,
        tasks_done: _cache.tasks_done,
        streak:     _cache.streak,
        cert_prog:  _cache.cert_prog,
        posts_done: _cache.posts_done,
        course_hl:  _cache.course_hl,
        posts:      _cache.posts,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Supabase save failed:', e);
    }
  },

  // ─── 每日任務 ──────────────────────────────
  getTasksDone(date) {
    return _cache.tasks_done[date || TODAY] || [];
  },
  async setTasksDone(v) {
    _cache.tasks_done[TODAY] = v;
    await this._save();
  },

  // ─── 本週打卡 ──────────────────────────────
  getStreak() {
    return _cache.streak[YM] || [];
  },
  async setStreak(v) {
    _cache.streak[YM] = v;
    await this._save();
  },

  // ─── 認證進度 ──────────────────────────────
  getCertProg() {
    return _cache.cert_prog || {};
  },
  async setCertProg(v) {
    _cache.cert_prog = v;
    await this._save();
  },

  // ─── 每週輸出打卡 ──────────────────────────
  getPostsDone() {
    return _cache.posts_done || [];
  },
  async setPostsDone(v) {
    _cache.posts_done = v;
    await this._save();
  },

  // ─── Anthropic Courses 重點筆記 ────────────
  getCourseHighlights() {
    return _cache.course_hl || {};
  },
  async setCourseHighlights(v) {
    _cache.course_hl = v;
    await this._save();
  },

  // ─── Substack Posts archive ────────────────
  getPosts() {
    return _cache.posts || [];
  },
  async setPosts(v) {
    _cache.posts = v;
    await this._save();
  },
};
