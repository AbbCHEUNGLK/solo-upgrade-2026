# 獨自升級 2026

## 檔案結構

```
solo-upgrade-2026/
├── index.html          ← HTML 骨架，加新頁面在這裡加 <script>
├── style.css           ← 所有樣式，改 UI 只動這個
├── app.js              ← 導航邏輯、打卡 streak
├── pages/
│   ├── home.js         ← 首頁
│   ├── daily.js        ← 每日任務（改任務清單在 TASKS 陣列）
│   ├── session.js      ← Storytelling（改 AI 角色在 PHASES 陣列）
│   ├── ldr.js          ← Learn → Re-tell
│   └── certs.js        ← 認證追蹤（改認證列表在 CERTS 陣列）
└── utils/
    ├── api.js          ← Claude API + HTML helpers
    └── storage.js      ← localStorage 封裝
```

## 常見更新場景

| 想改什麼 | 動哪個檔案 |
|---------|-----------|
| 改顏色 / 字體 / 間距 | `style.css` |
| 改任務清單 | `pages/daily.js` → `TASKS` 陣列 |
| 改 Storytelling phase | `pages/session.js` → `PHASES` 陣列 |
| 加新認證 | `pages/certs.js` → `CERTS` 陣列 |
| 改 AI 用嘅 model | `utils/api.js` → `API.MODEL` |
| 加新頁面 | 建 `pages/xxx.js` → `index.html` 加 `<script>` → `app.js` 加 route |

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
