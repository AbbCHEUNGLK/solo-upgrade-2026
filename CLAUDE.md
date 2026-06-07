# CLAUDE.md — 獨自升級 2026 Workflow Protocol

> 呢個 file 係我同 Claude 合作嘅 working agreement。每次開新 chat，叫 Claude `read CLAUDE.md` 即可 sync 返成套 protocol。

---

## Project Context

**Repo:** `github.com/AbbCHEUNGLK/solo-upgrade-2026`
**Live:** `abbcheunglk.github.io/solo-upgrade-2026`
**Tech stack:** Vanilla HTML/CSS/JS（無 framework）· Supabase（cloud sync）· Claude API（in-app AI features）

**File structure（根目錄 flat layout）:**

```
index.html        — HTML 骨架
style.css         — 所有樣式
app.js            — 導航邏輯
storage.js        — Supabase + localStorage
api.js            — Claude API + format helpers
home.js / daily.js / session.js / ldr.js / writer.js / certs.js — 各頁面
```

---

## EPCC Workflow（每次改動必須跟）

### 1. Explore（搞清楚 context）

開始任何改動之前，Claude 會：

- 問清楚要改邊個 file、為咩要改
- 如果 context 唔夠，主動問返我（唔好 assume）
- 引用返我之前提過嘅 design decisions（唔好突然轉風格）

**我嘅責任：** 提供具體背景，唔好寫「改下 UI」呢種 vague request。

---

### 2. Plan（寫個 plan 俾我 review）

任何超過 10 行嘅改動，Claude 會先出一個 plan：

- 改邊幾個 file
- 每個 file 改咩
- 有冇 trade-off / breaking change

**我先 approve / push back，先寫 code。** 唔好直接出成 1000 行 code 俾我先發現方向錯。

---

### 3. Code（寫 + 解釋）

寫 code 嘅時候：

- 一次改一個 concern（唔好 mix UI + logic + bug fix）
- 解釋每個重要 decision 背後嘅 reasoning
- 用我熟嘅 vocabulary（中英混合，唔需要過度 formal）

---

### 4. Commit（清楚交代點上 GitHub）

每次改完，Claude 會明確講：

- 邊個 file 要 overwrite / 新建
- Commit message 建議用咩
- 上 GitHub 之後點 verify（refresh app 應該見到咩）

---

## Context-Saving Rules

### ✅ Be Specific

具體 prompt = 慳 context = 改得快 + 改得啱

| ❌ Vague | ✅ Specific |
|---------|-----------|
| 「improve UI」 | 「task card hover 加 subtle scale」 |
| 「加新 feature」 | 「Writer 頁面加 word count」 |
| 「整靚啲」 | 「sidebar 字細 1px、間距加 2px」 |

### ✅ Reference Existing Code

唔好叫我「rewrite 個 daily page」如果你只係想改幾行——直接話「daily.js 第幾段嘅 TASKS 陣列加一個項目」。

### ✅ One Concern Per Turn

一次 chat 講一件事。「同時改 UI + 加 feature + fix bug」會令 Claude 分散 attention，質量下降。

---

## Design Principles（已確立嘅 decisions）

呢啲嘢已經拍板，Claude 唔好突然提議改：

1. **Aesthetic：** Notion / Todoist 風格——乾淨、輕量 border、minimal shadow
2. **Color accent：** 暖橙 (`#e57c3a`) 做主色，唔用 neon / saturated colors
3. **Font：** Inter（內文）+ Lora（serif headings）
4. **Language：** 繁體中文 + 英文術語混合（保留 framework / dimension / signal 呢類詞）
5. **No frameworks：** 唔用 React / Vue / Tailwind——vanilla JS 易維護易部署
6. **File layout：** Flat 根目錄結構（唔用 pages/ 同 utils/ subfolder）

---

## Substack Writing Voice（用於 Writer 頁面）

當 Claude 幫我寫 Substack post：

1. **Tone reference：** 李堅翔 + Maggie Appleton——平實、有溫度、知識密度高
2. **Structure：** 5 段式（Hook → Framework → Science → Counter-intuitive → Closing）
3. **Citation 要 traceable：** 真實作者、年份、期刊；唔好杜撰
4. **長度 default：** 中等 1,500–2,000 字（除非另外指明）
5. **Audience：** 台灣 + 香港 + 海外華文讀者——用書面中文，避免太港式口語

---

## What to AVOID

- ❌ 一次出超過 3 個 file 嘅大改動（除非我明確要求）
- ❌ 突然改 design language（顏色、字體、layout）
- ❌ 加新 dependency / library（保持 vanilla）
- ❌ Refactor 我冇要求嘅 code（即使你覺得可以更好）
- ❌ 假設我記得幾日前嘅對話 detail（我會忘記，主動 reference 返）

---

## Quick Commands（我會用嘅 shortcuts）

- **「read CLAUDE.md」** → sync workflow protocol
- **「explore mode」** → 你只 ask question 唔寫 code
- **「plan first」** → 出 plan 等我 approve 先 code
- **「one file only」** → 強制只改一個 file
- **「ship it」** → 我已 approve，出最終 code

---

*Last updated: 2026-06-06*
