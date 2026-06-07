# 獨自升級 2026

## 檔案結構

```
solo-upgrade-2026/
├── index.html       ← HTML 骨架，加新頁面在這裡加 <script>
├── style.css        ← 所有樣式，改 UI 只動這個
├── app.js           ← 導航邏輯、打卡 streak
├── storage.js       ← Supabase + localStorage（雲端同步進度）
├── api.js           ← Claude API 呼叫
├── home.js          ← 首頁
├── daily.js         ← 每日任務（改任務清單在 TASKS 陣列）
├── session.js       ← Storytelling Session（改 phase 在 PHASES 陣列）
├── ldr.js           ← Learn → Digest → Re-tell
├── writer.js        ← Substack Writer
├── certs.js         ← 認證追蹤（改認證列表在 CERTS 陣列）
├── CLAUDE.md        ← Claude 合作 protocol
└── README.md
```

**Flat 根目錄結構** — 所有 file 直接放 root，唔分 `pages/` 或 `utils/` subfolder（方便維護同部署）。

## 常見更新場景

| 想改什麼 | 動哪個檔案 |
|---------|-----------|
| 改顏色 / 字體 / 間距 | `style.css` |
| 改任務清單 | `daily.js` → `TASKS` 陣列 |
| 改 Storytelling phase | `session.js` → `PHASES` 陣列 |
| 加新認證 | `certs.js` → `CERTS` 陣列 |
| 改 AI 用嘅 model | `api.js` → `API.MODEL` |
| 改 Substack 寫作邏輯 | `writer.js` |
| 改雲端同步邏輯 | `storage.js` |
| 加新頁面 | 建 `xxx.js` → `index.html` 加 `<script>` → `app.js` 加 route |

## Deploy 到 GitHub Pages

```bash
# 第一次
git init
git add .
git commit -m "init"
git remote add origin https://github.com/你的用戶名/solo-upgrade-2026.git
git push -u origin main

# 之後每次更新
git add .
git commit -m "update: 描述改了什麼"
git push
# GitHub Pages 約 30 秒後自動更新
```

GitHub repo → Settings → Pages → Source: main branch → Save
