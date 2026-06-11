// posts/manifest.js — Published posts archive
// 呢個 file 由 Claude 喺 Cowork chat 直接 maintain
// 每次有新 published post，加多一個 entry，commit + push 就 deploy

window.PUBLISHED_POSTS = [
  {
    id: 'vanilla-2026-06-06',
    status: 'published',
    title: '一勺香草雪糕的解構：四個維度、三組研究，與一段被低估的童年記憶',
    date: '2026-06-06',
    substackUrl: 'https://abbycheung1.substack.com/p/3ad',
    body: `為什麼 vanilla 永遠是全球銷量第一？為什麼專家會把 Häagen-Dazs 評為「let me down」？為什麼哈佛追蹤了二十萬人，最後發現吃雪糕的人糖尿病風險反而較低？這篇 post 嘗試用一個 product breakdown 的視角，重新理解這個我們從小吃到大的甜品。

## 引言：被低估的日常

根據 Fortune Business Insights 2026 年的報告，vanilla 佔全球雪糕市場 30.49% 的份額，是所有口味中最高的。在北美市場這個比例更達到 34.3%（Market Data Forecast, 2025）。即使在創新口味爆發的時代——matcha、ube、pandan、salted caramel——vanilla 仍然穩坐第一。

這個數字本身就值得深思。在一個崇尚 novelty 的消費時代，為什麼最「平凡」的口味反而最受歡迎？

最近我看了 Epicurious 一條 Vanilla Ice Cream 專家盲測影片，三位 ice cream 專家試遍了從 Häagen-Dazs 到 Halo Top 的十六款 vanilla。本來只是消遣，但看完之後我發現，這條片其實在做一件事：將一個被我們日常輕視的產品，重新拆解出它的複雜性。

## 一、Product Breakdown：專家如何用四個維度評估一勺雪糕

三位專家評價任何一款 vanilla ice cream，都會回到四個 dimensions。這套框架本身就是一個 product analysis 的範本——將模糊的「好不好吃」拆解成可以驗證的 signals。

### Dimension 1: Vanilla 的品質與細微層次（Nuance）

**Signal 1（視覺顆粒）**：vanilla bean specks——那些黑色的小顆粒。沒有黑點，多半代表用了 artificial vanillin 或低成本 vanilla extract；有黑點，才可能是真正的 vanilla bean。

**Signal 2（色澤基礎）**：偏黃色代表加了 egg yolk——這是 French style ice cream 的標誌。蛋黃本身是天然的乳化劑，能取代化學 stabilizer，但同時也帶入蛋香，所以 vanilla 味必須夠 strong 才能 hold 得住。

**Signal 3（餘韻長短）**：香味的 Lingering（延展性）——優質的天然香草入口後，會在鼻腔與喉嚨深處留下 floral（花香調）且層次豐富的 aftertaste。而低質量產品則如專家所言：「Fades very quickly.」（風味一秒消失）。

### Dimension 2: 奶香的濃郁度（Dairy Richness）

評估方法簡單到讓人意外：看成份表材料。

在食品標籤法規下，成分是按添加量由高到低排列的。如果第一是 Cream（鮮乳酪），第二是 Milk（牛奶），這是一個健康的結構。

如果第二個材料變成了 Skim milk（脫脂牛奶），產品的質感就會立刻打折扣。在盲測中，定位 Premium（高端）的 Häagen-Dazs 便是輸在這裡——其成分表第二位是脫脂牛奶，導致專家入口後的直覺反饋是「Way too light, almost watery.」（太輕薄，甚至像水）。

### Dimension 3: 甜度的平衡（Sweetness Calibration）

優秀產品的 Benchmark 是「連續吃兩球，味覺不會被 overwhelm」。

在這個維度上，**Invert sugar（轉化糖）**是一把雙刃劍。它能製造極佳的絲滑感並防止冷凍過程中的冰晶結晶，但過量使用會留下具備化學感的甜膩 aftertaste。

更明顯的 Noise（雜音）來自代糖。追求低卡路里的功能性品牌（如 Halo Top、Friendly's）引入了 Stevia（甜葉菊）或 Erythritol（赤蘚糖醇）來 hack 降卡數據。然而，代糖在舌尖引起的甜味受體反應存在延遲與異味，造成味覺上的缺陷。

### Dimension 4: 質地與口感（Texture & Mouthfeel）

這個維度的 Sub-signals 包括：有沒有冰晶（Ice crystals）、在舌尖融化的速度、以及是否呈現 Velvety（天鵝絨般絲滑）的物理包覆感。脂肪含量高的產品，風味會在舌尖停留得更久。

但這裡有一個悖論：過度 stabilized 的雪糕反而會失去味道。專家形容 Edy's 是「so stabilized that nothing can melt on your tongue」——你的舌頭根本來不及感受味道，雪糕已經滑落喉嚨。

## 二、Science Behind：為什麼「貴的雪糕」真的有差？

雪糕本質上是一個 three-phase emulsion（三相乳化體）——由 ice crystals、fat globules、糖溶液與 air bubbles 組成的複雜系統。理解這個系統，就理解了為什麼售價差異往往來自一個被消費者忽略的指標。

### Overrun（空氣膨脹率）：高毛利背後的 Cost Engineering

**Overrun（空氣含量）**是雪糕製造業的核心商業指標，指在冷凍攪拌過程中，打入產品中的空氣相對於原液的體積比例。

高級品牌的 overrun 通常控制在 20–30%，意味著結構緊密、乳香濃郁、融化速度慢。

平價品牌的 overrun 可以高達 80–100%——也就是說，最終產品有一半是空氣。

這就是為什麼專家試 Briers 的時候會說「literally bubbles like popping out」。平價雪糕之所以能在競爭激烈的 FMCG 市場維持低價並實現長期生存，是因為它們真正賣的不是 Cream，而是透過高 Overrun 販售 Air-to-cream ratio。換句話說：你買的那一桶 ice cream，可能有一半的錢是付給空氣。

### 天然 Vanilla Bean vs 人工 Vanillin：兩百倍的複雜度差距

這是我覺得最 striking 的對比。

一根真正的天然香草莢（Vanilla bean），其內部含有 **200 至 500 種** 不同的揮發性芳香化合物（Aromatic compounds），交織出 floral、woody、creamy、subtly smoky 等多重 notes。當你品嚐它時，這些複雜的有機分子（包括醛類、醇類、酚類）會在你舌頭的味覺受體和鼻腔的嗅覺受體（Olfactory receptors）上，以不同的速率結合並解離。所以你會感受到味道的「展開」（unfolding）——你先聞到花香，入口後轉為木質調，最後化為溫暖的煙燻感。

相較之下，人工合成的香草精（Vanillin），本質上只是單一的化學化合物：4-hydroxy-3-methoxybenzaldehyde（4-羥基-3-甲氧基苯甲醛）。它濃度高、穩定、成本只有天然 vanilla 的 1/40。它能精準擊中你的甜味記憶，但無法重現天然香草那種「隨時間推移而逐層展開」的層次感。

這個物理原理在很多領域都同樣成立——音樂領域中 Analog（類比黑膠）與 Digital（數位音檔）的顆粒感差異、攝影中 Film（膠卷）與 Sensor（數位感光元件）的色彩寬容度、乃至設計領域中 Handcraft（手工藝）與 AI-generated（AI 生成）的細微差別。有效率的東西往往能快速佔領市場，但有深度的東西才能在歷史中留存。

## 三、Behavioral Science：為什麼 vanilla 永遠是全球第一

如果說產品维度的拆解給了我們理性的框架，那麼行為科學（Behavioral Science）則揭示了 Vanilla 坐穩全球第一王座的感性根基。這背後，藏着兩層深刻的記憶交織。

### Vanillin 與母乳的隱藏連結

1999 年，德國 Constance University 的 Haller、Rummel、Henneberg、Pollmer 和 Köster 在 *Chemical Senses* 期刊發表了一篇 landmark study：他們追蹤了 133 位成年參與者，發現 67% 嬰兒時期食用過「添加了香草風味（Vanilla-flavored）配方奶」的人，成年後仍然偏好含 vanillin 的食物（即使是 ketchup 這類不應該有 vanilla 味的食物）。

這個現象在心理學與神經科學上有一個專有名詞：**Sensory Conditioning（感官制約）**。

關鍵的科學事實是：母乳本身是一個高度開放的傳遞媒介，它會忠實地傳遞母親日常飲食中的芳香化合物——這在 2021 年 Debong et al. 發表於 *Molecular Nutrition & Food Research* 的研究中得到進一步證實。同時，全球絕大多數的嬰兒配方奶粉，為了改善原本略帶腥味的牛乳蛋白風味，都會下意識添加微量的 Vanillin（Xi et al., 2023, *Foods*）。

換言之，幾乎每一個現代人——無論東方西方——在生命的最初幾個月，舌頭和鼻腔都接觸過 vanilla 香氣。這份早期記憶被烙印在 olfactory cortex（嗅覺皮層）裡，成為我們對「安全」、「溫暖」、「被無條件照顧」的感官錨定（Sensory anchor）。

臨床醫學界甚至將這個原理直接應用於早產兒的急救——多項臨床研究發現，在早產嬰兒的保溫箱中引入穩定的 Vanillin 氣味刺激，能顯著減少早產兒呼吸暫停（Apnea）的發生率（Marlier, Gaugler & Messer, 2005, *Pediatrics*；Edraki et al., 2013）。Vanilla 的味道，字面意義上能讓嬰兒「安心呼吸」。

### 後天層面：有意識的童年回憶與情感獎勵

除了先天的神經科學制約，當我們慢慢長大，有了有意識的童年回憶時，這種安全感的連結被進一步賦予了社會學意義。

你記不記得小時候，雪糕總是在我們最高興、最放鬆、或者最需要被肯定（Positive reinforcement）的時候出現？

- 可能是小學放暑假的午後，外面的蟬鳴聲很吵，你大汗淋漓地跑回家，打開冰箱時得到的那份消暑獎勵。
- 可能是去完公園跑到筋疲力盡、衣服被汗水濕透時，父母遞給你的那支用來補充體力的香草雪糕。
- 又或者是考試成績好、聽話時，作為一種被大人世界讚許的「物質儀式」。

那些關於「獎勵」、「玩樂」和「無憂無慮」的童年畫面，在行為心理學中屬於 **Emotional reward association（情感獎勵聯結）**。在我們長大的過程裡，雪糕已不知不覺中跟一些美好的時刻完美扣連在了一起。

所以長大後，難怪很多人說 Vanilla Ice Cream 是最療癒的 Comfort Food（療癒食物）。當代消費市場研究也印證了這一點：根據 Mordor Intelligence 2025 年的消費者調查，68% 的受訪者表示自己在面對生活壓力時，更偏好「具有 Nostalgic（懷舊/童年）元素」的甜品。

我們長大後吃香草雪糕，很多時候舌尖嚐的不只是味覺上的甜度，而是大腦在下意識地尋找那份被無條件包容的安全感，去重新喚醒那個曾經被好好獎勵、被愛着的自己。

## 四、Counter-Intuitive Evidence：哈佛那個讓研究員都困惑的發現

如果前面三段是在解釋「已知」的系統，那麼這一段則是用反直覺的醫學數據，挑戰我們對健康與放縱的「既定認知」。

### Harvard 二十萬人 cohort 的反直覺結果

1986 年起，Harvard School of Public Health 啟動了三個 longitudinal cohort：Nurses' Health Study、Nurses' Health Study II、Health Professionals Follow-Up Study，這三個研究總共追蹤了將近 **190,000 名** 參與者，橫跨數十年，是全球營養流行病學（Nutritional epidemiology）領域最被信賴、樣本量最乾淨的數據集之一。

在分析乳製品攝入（Dairy intake）與第 2 型糖尿病（Type 2 Diabetes）風險的數據時，研究團隊發現了一個讓所有人目瞪口呆的 Signal：**每週食用 2 次或以上 Ice cream 的人，其第 2 型糖尿病的風險反而降低了約 12% 至 22%**。

這個結果在多個 cohort 中重複出現，研究員自己也覺得不可思議。Mark Pereira（時任 Harvard Medical School assistant professor）後來在接受 *The Atlantic* 訪問時說了一句很有名的話：

> We analyzed the hell out of the data. I still to this day don't have an answer for it.

2018 年，哈佛大學的博士生 Andres Ardisson Korat 在其博士論文中進一步揭示了一個更反直覺的現象：在已經罹患第 2 型糖尿病的患者中，每天適量吃半杯 Ice cream 的人，其長期的心血管疾病（CVD）風險反而顯著降低。

### 如何用諮詢思維去解讀這個「醫學奇蹟」？

這裡有一個在 Data Science 和市場調研中都極其關鍵的 **Critical Caveat（核心限制）**：這是一個 Observational Study（觀察性研究），而非 Randomized Controlled Trial（隨機對照臨床試驗）。**Correlation does not imply causation（相關性並不等同於因果關係）。** 雪糕本身並不是降血糖的神藥。

哈佛研究團隊後來給出最合理的科學解釋，在於 **Lifestyle confounding（生活模式的干擾因子）**。

在宏觀統計中，這群人通常具備以下特徵：

- 整體飲食較均衡（不是 binge-restrict cycle）
- 心理壓力較低
- 對食物有 healthy relationship，不過度壓抑也不過度放縱
- 整體 socioeconomic status 較高，擁有更好的醫療資源 Access 與均衡的膳食結構

換言之，真正起作用的可能不是 ice cream 本身，而是 ice cream 所代表的那種「平衡的生活方式」。

那些懂得偶爾停下來、給自己一球真正高質量雪糕的人——他們同時也是懂得管理 stress、維持 work-life balance、不會把自己逼到極端的人。

## 結尾：回到一勺雪糕

兜了一大圈，我想說的其實很簡單。

我們對 vanilla 雪糕的偏愛，本質上都是在尋找一份被治癒的安全感。

- 從 Product 的角度來看，人工香精（Vanillin）成本極低、表現穩定、能一秒精準擊中你的味覺，但它永遠複製不了天然香草莢（Vanilla Bean）那兩百多種有機化合物在時光中交織出的 Subtle nuances（細微層次）。
- 從 Science 的角度來看，懂得適時允許自己吃一球高密度、成分純粹的好雪糕的人，往往也是最懂得在失控的世界裡照顧好自己的人。

其實人也是一樣。

我們每個人身上那些複雜的層次、不完美的痕跡、在成長中留下來的那些難以被單一標籤簡化的多面性——這才是我們作為活生生的人，最珍貴、最溫暖、最具有深度的地方。我們不需要像人工合成物那樣為了追求極致的效率，而把自己格式化成單一的維度。

今晚如果累了，不用對自己太苛刻。

暫時放下手頭上那些複雜的架構與指標，去樓下超市選一杯成分純粹、高密度的香草雪糕吧。

好好犒賞一下那個在 2026 年，一直在努力生活、一直在升級、卻也需要被好好愛護的自己。

## References

1. Fortune Business Insights (2026). Ice Cream Market Size, Share, Trends Report. Vanilla segment data.
2. Market Data Forecast (2025). North America Ice Cream Market Report.
3. Haller, R., Rummel, C., Henneberg, S., Pollmer, U., & Köster, E.P. (1999). The influence of early experience with vanillin on food preference later in life. *Chemical Senses*, 24, 465–467.
4. Marlier, L., Gaugler, C., & Messer, J. (2005). Olfactory stimulation prevents apnea in premature newborns. *Pediatrics*, 115, 83–88.
5. Debong, M.W., et al. (2021). Dietary Linalool is Transferred into the Milk of Nursing Mothers. *Molecular Nutrition & Food Research*.
6. Pereira, M.A., et al. (2002). Dairy consumption, obesity, and the insulin resistance syndrome in young adults: the CARDIA Study. *JAMA*, 287(16), 2081-2089.
7. Ardisson Korat, A.V. (2018). Dairy products and cardiometabolic health outcomes. Doctoral dissertation, Harvard T.H. Chan School of Public Health.
8. Mordor Intelligence (2025). Ice Cream Market Size, Share & Growth Report 2026-2031.
9. Xi, Y., et al. (2023). Assessing Sensory Attributes and Properties of Infant Formula Milk Powder. *Foods*, 12(5), 997.
10. Epicurious (2024). Pro Chefs Blind Taste Test Every Vanilla Ice Cream | The Taste Panel. YouTube.`,
  },
];

// ─── Daily journal / brainstorm ─────────────────────────
// Keyed by date (YYYY-MM-DD). 我喺 Cowork chat 每日寫一篇 summary
// 同 insight，commit + push 就喺 calendar 日詳細 panel 入面 show。

window.JOURNAL = {
  '2026-06-08': `## 今日 build 咗

- 認證 page 重新 design：3 個 section 統一用 accordion card pattern
- Substack Writer 大改：3 tabs archive / reader / editor，markdown rendering
- Calendar widget + day detail，by date 揭返每日 record
- Sidebar streak widget 換成 daily streak counter
- Files-as-source-of-truth：published posts 由 \`posts/manifest.js\` 直接 source
- Home page 重整：cards stacked、auto-select today、journal markdown
- **新 Output：Thread subpage**——short-form post archive，同 Substack 並列

## 第 1 篇進咗 archive

> 一勺香草雪糕的解構：四個維度、三組研究，與一段被低估的童年記憶

✓ 已 backfill 入 manifest.js，喺 已發佈 tab 見到

## 今日 Thread 第 1 篇

> 李堅翔博士曾寫過一段很溫柔的話：「你無法選擇被不被愛，但可以選擇怎麼愛，包括以慈悲喜捨去愛惜受傷的自己。」

✓ 已記入 \`window.THREAD_POSTS\` — 喺新 🧵 Thread page 見到（記得補 Threads URL）

## 揾到嘅 architecture insight

App 唔再係「draft + publish 嘅 tool」，而係 **published content 嘅 reader + 進度 tracker**。
Drafting 同 brainstorm 喺 Cowork chat 發生 → 結晶化嘅內容 commit 落 file。

呢個分工令兩邊都做得好啲：
- App = clean, structured, version-controlled reader
- Cowork chat = messy, iterative, infinitely flexible writer

## ✅ Claude Cowork course 完成

Anthropic Skilljar 嘅「Introduction to Claude Cowork」課程今日完成。
有趣嘅 timing：**早上學課程，下晝同夜晚就將學到嘅 pattern 直接落地**——build 出嚟個 file-based archive、journal panel、Thread page、accordion certs 全部都係 Cowork-driven 工作流嘅 instance。Best possible validation。

\`certs.js\` 入面 \`ccw\` 嘅 base 由 30 改到 100，🎓 Anthropic Skilljar Courses section 而家應該顯示 3/3 完成。

## 鞏固：Skills / Connectors / Plugins 嘅 mental anchor

Re-tell session Q2 我答得 muddled，Claude 補返一個 sharp 版本：

- **Skill = verb**（Claude 識做嘅 task）— procedural recipe，\`/name\` trigger，self-contained instructions
- **Connector = reach**（Claude 摸得到嘅 external system）— MCP server，authenticated access，提供 tool calls
- **Plugin = pre-assembled kit**（按 domain 打包嘅 skills + connectors）

三者關係：**Skill 跑嗰陣可能會 call Connector 攞 real data；Plugin 將適合一個 role 嘅 skills + connectors 一次過分發**。

跑 \`/draft-outreach\`（Sales plugin 嘅 skill）= Skill 係 recipe，期間 call HubSpot connector 攞 prospect context，Plugin 係嗰個將 skills + connectors 一次過 install 嘅 wrapper。

**Cooking analogy 鎖實：**
- Skill = 食譜
- Connector = 雪櫃 + 街市 access
- Plugin = 主題食譜書 + 配套 grocery account（譬如「意大利菜 starter pack」）

## Bug post-mortem — JSONB \`[]\` vs \`{}\` silent fail

**Symptom：** 每次 check task 都似 save 咗（fetch 200 OK，UI 即時更新），但 hard refresh 之後 records 全部消失。

**Root cause：**
- Supabase \`tasks_done\` column 嘅 default value 係 \`[]\`（array），但 app code 用 object pattern：\`_cache.tasks_done['2026-06-08'] = [...]\`
- JS 入面 array 都係 object，可以接受 string key assignment——**in-memory 完全 work，UI 即時更新，所以好難察覺**
- 但 \`JSON.stringify\` 喺 array 上面只 serialize numeric indices，所有 string key properties 被默默 drop 掉
- POST body 永遠 send \`tasks_done: []\` → Supabase 覆蓋舊資料 → 從來冇真正 persist

**Why silent：** \`fetch()\` 唔會 throw on HTTP error，更加唔會 throw on 200 OK。原本嘅 try/catch 對任何 4xx / 200-empty response 都係廢嘅。

**Detection breakthrough：** 加 verbose request/response logging 之後，見到 Supabase return body 入面 \`tasks_done: []\`——即係 server 真係 receive 咗空 array，問題喺 client 送出去嗰 step。combine 你問「\`{}\` 同 \`[]\` 有冇影響？」直接 narrow 到 array-vs-object 嘅 JSON serialize 行為。

**Fix：**
1. SQL \`UPDATE\` 將 \`tasks_done\` / \`streak\` / \`course_hl\` 由 \`[]\` 改返 \`{}\`
2. \`_sbFetch\` 加 \`res.ok\` check + throw on HTTP error

**3 個 lessons：**
1. **JSONB default value 一定要同 JS data shape 對齊**——\`[]\` 同 \`{}\` 喺 jsonb 入面類型唔同，serialize 行為完全唔同
2. **永遠手動 check \`res.ok\`**——\`fetch()\` 只 throw on network failure，HTTP error 要自己 catch
3. **Fail loudly > fail silently**——silent failure 係最危險嘅 bug type，比 crash 更難 detect

**Meta lesson：** Engineer 嘅 stack trace 同 PM 嘅 type intuition 有時係互補嘅。我一直 trace error path / RLS / grants，但你直接 spot 到「個 value 個 shape 唔對」就過骨咗。

## 今日 content output

**Thread 第 2 篇上線（Production Mode vs Campfire Mode）**
> 「我哋治好咗黑夜，卻不小心殺死咗營火。」

引用 Polly Wiessner *PNAS* 2014 嘅 Ju/'hoansi Bushmen firelight talk 研究——日間對話 100% 務實，圍火夜談 81% 變 storytelling。用嚟對照當代 24 小時生產模式嘅孤獨。完成今日「Article → 啟發總結」嘅 daily task。

**中醫 5 行 Substack 篇 — full draft 完成（~4,800 字）**
- Hook：WHO ICD-11 + Network Medicine + 暗粒個人 anchor
- Framework：五行五臟係 ecosystem 5 個 functional subsystem，生剋 cycle 解 cascade
- Science：5 臟 vs gut-brain / HPA / autonomic / HRV / lung-skin axis 對應 18 條 verifiable citation
- Counter-intuitive：西醫精準介入 vs 中醫 vague maintenance，後者其實係 compressed knowledge
- 5 個 daily ecosystem habits + 暗粒 callback closer

下一步：放入 \`在寫 (drafting)\` tab，polish 之後 publish 上 Substack → promote 去 已發佈。

## 下一步可以諗

- 中醫 5 行 篇 draft → polish → publish ✓ 等 ship
- 將 long-term goals / TASKS 都 migrate 去 file-based pattern？
- Journal 自動化：Cowork session 完之後我自動 update 今日 entry，唔需要 manual ping
- 用 Claude Cowork 課程內容做 Re-tell session 嘅第一個 entry（test 埋個 ldr.js archive）✓`,
};

// ─── Thread posts（short-form）────────────────────
// 同 Substack 嘅 long-form 唔同：簡短、即興、quote / reflection 為主
// 每個 entry: { id, date, content (markdown), threadsUrl }
// 由我喺 Cowork chat 直接 maintain

window.THREAD_POSTS = [
  {
    id: 'thread-2026-06-08-firelight',
    date: '2026-06-08',
    content: `有冇諗過，人點解係夜晚特別容易講真心話？

人類學家 Polly Wiessner 曾研究未有電力照明嘅原始部落，佢記錄咗日頭同夜晚嘅對話，發現一個 fascinating 嘅現象：

日頭嘅對話，幾乎全部係「正經事」——邊度有食物、資源點分、邊個做錯咗嘢、邊個要被批評。全部都係務實、理性、解決問題。

但到咗夜晚，圍住火堆之後——**81% 嘅對話，變成咗 storytelling**。

唔再講邊個欠咗邊個，而係：

- 講遠方部落嘅故事
- 講死去嘅亡魂
- 講神靈、夢境、傳說
- 講笑話、唱歌、跳舞

純粹為咗「連結」而對話，唔為任何實際利益。

---

日頭，我哋處於「生產模式（Production Mode）」——所有人嘅目光、表情、比較、社會階級，全部都一覽無遺。你要應付現實，要理性、要 defend 自己、要有效率。

但當太陽落山，視覺上嘅曝光感消失咗。黑暗俾咗我哋一種 coverage。營火升起，喺呢個半遮半掩嘅空間，世界瞬間縮小到只剩低火光照亮嘅一小撮人。我哋先夠膽放低防衛，講啲日頭唔會講嘅嘢——軟弱、遺憾、渴望、荒誕嘅夢、心底嘅情感。

呢個，係人類幾百萬年嚟進化出嚟嘅 bonding 本能。

---

然而，LED 同手機正喺度驅逐黑夜。

我哋將「日頭嘅生存理性」無限延伸到凌晨兩點嘅 message、email、social media 裡面。理性唔識收工，24 小時都係生產模式。

然後又回過頭嚟，百思不得其解：點解自己活得咁孤獨、咁疏離？

突然諗起細個用被竇搭出嚟嘅小帳篷，同朋友匿埋入面講心事、講鬼故、講秘密。

而家先明——嗰陣可能唔係細路仔玩泥沙，而係 DNA 喺度教緊我，點樣連結彼此。

> 我哋治好咗黑夜，卻不小心殺死咗營火。`,
    threadsUrl: '',  // ← 補返 Threads URL 過嚟我加入
  },
  {
    id: 'thread-2026-06-08-li',
    date: '2026-06-08',
    content: `李堅翔博士曾寫過一段很溫柔的話：

> 你無法選擇被不被愛，但可以選擇怎麼愛，包括以慈悲喜捨去愛惜受傷的自己。`,
    threadsUrl: 'https://www.threads.com/@_aura.laia_/post/DZT0C70CAAQ?xmt=AQG0qd06mT1Cdw7RXTlcAki0D6p-FoES8piCjXSjhXckBg',
  },
];

// ─── Storytelling Session archive ─────────────────
// 4-phase (熱身 / 結構 / 細節 / 整合) 練習嘅 session log
// 每個 entry: { id, date, topic, body (markdown) }
// 由我喺 Cowork chat 直接 maintain，每次練完寫返入

window.STORYTELLING_SESSIONS = [
  // 範例（之後我哋實際練完會 replace）：
  // {
  //   id: 'storytelling-2026-06-08',
  //   date: '2026-06-08',
  //   topic: '最近印象深刻的事',
  //   body: `## 熱身\n...\n\n## 結構\n...\n\n## 細節\n...\n\n## 整合\n...`,
  // },
];

// ─── Learn → Re-tell archive ──────────────────────
// Feynman Technique 4-step (INPUT / DIGEST / RE-TELL / FEEDBACK)
// 每個 entry: { id, date, source, body (markdown) }

window.RETELL_SESSIONS = [
  {
    id: 'retell-2026-06-08-cowork-101',
    date: '2026-06-08',
    source: 'Anthropic Skilljar · Introduction to Claude Cowork',
    body: `## Input

- **Source:** Anthropic Skilljar · Introduction to Claude Cowork
- **Completed:** 2026-06-08
- **Format:** Self-paced video + reading

## Digest

### Cowork 同普通 AI chat 嘅最大 difference

- **Chat 平台**（ChatGPT / Claude.ai web）= 偏 isolated，主要係 individual learning / content generation，分享靠 manual copy-paste
- **Cowork** = 真正可以**交付 project** 嘅 platform — 同 team + AI agent 一齊建 workflow，day-to-day operational

> 一句精煉版："Cowork 唔係齋傾偈嘅 Claude，係可以真正同你一齊做完一個 project 嘅 Claude。"

### 三個 building block 嘅 mental map

- **Skills** → Framework 一啲，你 expect agent 有咩 skillset / persona / 行為
- **Connectors** → Claude 點同其他 tool 溝通；access grant 嘅機制
- **Plugins** → 喺其他 tool 嘅 interface 入面，Claude 點幫你

### 課程比自己摸索贏喺邊

> "It's something that I can explore by myself, but the course gave me a more comprehensive overview."

Framework 加埋 **revision / evals 嘅 iteration cycle** — 靠自己 trial-and-error 慢慢揾到，但課程一次過 frame 晒，省好多時間。

## Re-tell

> 「Cowork 即係將 ChatGPT 嘅 isolated chat experience 升級成 collaborative project delivery platform — Claude 可以開檔案、可以 connect 其他 tool、可以 follow 一套既定 workflow，跨 session 都記住你嘅 context。」

## Feedback（gap spot — 可以返去 review 嘅地方）

**① "Skill" ≈ procedural workflow，唔係 persona**

你形容 Skill 係 "characters and persona"，但其實 Skill 接近 **how-to template / procedural recipe** — 譬如「寫 PRD」「做 sprint planning」係 skill，係步驟 + context，唔係角色。Persona / character 一般喺 system prompt 層面；每個 skill 入面可能有唔同 persona，但 skill 本身嘅核心係 "do this process"。

**② Plugin 嘅定義可以再 sharpen**

你話 Plugin 係「喺其他 tool interface 入面 Claude 點幫你」 — 但 Plugin 其實係 **bundle of Skills + Connectors，packaged for a specific domain**。譬如「Sales」plugin = sales 相關 skills（draft outreach, call prep, etc.）+ relevant connectors（HubSpot, Salesforce）。Plugin 係 **distribution unit**，唔係「Claude embedded in another app」。

**③ 你 missed 咗一個 concept，但其實今日 build 咗：persistent project context**

Q4 答 file-based architecture 嗰陣，你講「reviewing previous work + 跟住 guidelines we set previously」 — 呢個正係 Cowork 教嘅 **memory / project context** pattern。\`CLAUDE.md\`、\`posts/manifest.js\` 呢類 files 喺 Cowork 入面係 **durable layer**，跨 session 存在。你今日 build 嘅嘢 = 將呢個 pattern 推到極致（不止 rules，連 content 都係 files）。

## 下次 review 時想再消化嘅 3 樣

1. **Skill description 嘅 trigger phrasing** — 點寫 description 令 Claude 喺啱嘅時候 invoke
2. **Plugin marketplace** — 邊啲 plugin 真正 fit 你 PM workflow
3. **Memory tiers** — short-term context window vs long-term files vs Supabase 雲端 storage 嘅 trade-off`,
  },
];



