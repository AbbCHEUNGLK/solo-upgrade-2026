// posts/manifest.js — Published posts archive
// 呢個 file 由 Claude 喺 Cowork chat 直接 maintain
// 每次有新 published post，加多一個 entry，commit + push 就 deploy

window.PUBLISHED_POSTS = [
  {
    id: 'payment-marketplace-2026-07-19',
    status: 'published',
    title: '拆解平台級支付：當 Payment 從用戶介面，走向底層基礎建設',
    date: '2026-07-19',
    substackUrl: 'https://abbycheung1.substack.com/p/payment',
    body: `*在 On-demand 平台（如跨境物流、外賣或出行配對）的生態裡，Payment（支付）團隊面對的從不是簡單的「購物車結賬」流程。*

如果你問大部分人 Payment Team 是做什麼的？大概都會得到差不多的答案：

**讓客人成功付款。**

這個答案沒有錯。但只適用於一半的世界。

如果你做的是一般電商（E-commerce），例如 Amazon，Payment 確實主要圍繞著 Checkout：支援更多付款方式、提升付款成功率、降低棄單率。但配對平台（Marketplace）是另一種遊戲。Uber、Grab、Lalamove、Upwork，甚至 Airbnb——它們不是單純賣東西，而是在兩個陌生人之間建立交易。這類平台是商戶（Merchant）與支付服務商（PSP）的混合體，特殊性在於資金是雙邊流動的：

- **入金端 (Pay-in)：** 一邊向付款方（Payer）收錢，走的是收單網絡（Acquiring Rails）。
- **出金端 (Pay-out)：** 另一邊要把服務提供者的收入打給收款方（Receiver），走的是出金網絡（Disbursement Rails）。

對外，平台是 Merchant；對內，平台實際上運行著半個 Payment Company。這個角色在支付行業裡有正式的名字——**Payment Facilitator（PayFac）**：平台以自己的收單關係替旗下 sub-merchants 處理資金，並承擔相應的合規與風險責任¹。這兩條線路的成本結構、失敗模式與監管要求完全不同。

所以 Payment Team 設計的，不再是一個 Checkout，而是一整套資金流（Money Flow）。這篇文章將以支付產品經理的視角，拆解這個「一進一出」的完整資金流，以及錢每經過一層時，我們真正需要關心的事。

## 一筆交易，其實是一條河流

    Payer
      │ Pay-in（Acquiring Rails）
      ▼
   Platform
      │ Pay-out（Disbursement Rails）
      ▼
   Receiver

平台並不是一條透明的水管。每當資金流經平台，它都需要同時完成很多事情：驗證付款是否成功、扣除平台佣金、計算稅項、更新帳本、安排結算、決定何時向司機付款、確保整個流程符合監管要求。

於是，一筆看似簡單的付款，開始變成一套大型的資金管理系統。Payment PM 每天思考的，很多時候是這類問題：

- 應該讓司機即時提現，還是每天結算一次？
- 平台需要先墊付資金嗎？
- 不同國家的支付方式應該如何接入？
- Wallet 值不值得建立？在合規上的代價是什麼？
- 每單交易能不能再便宜 10 bps？

Marketplace 的支付世界，開始從 UI，走向 Infrastructure。

## Marketplace Payment 組成部分

如果把這套複雜的基礎建設拆開，它大致可以由以下五個模組組成：

### 1. Pay-in（入金端）── 如何收錢

支援的渠道越多，意味著越能觸達不同的付款人。平台需要思考：支援哪些付款方式？信用卡？銀行轉帳？本地電子錢包？即時支付系統？

在巴西，即時支付系統 Pix 已覆蓋 93% 的成年人口，每月交易量逼近 80 億筆²³；在菲律賓，GCash 擁有 9,400 萬用戶、佔電子錢包市場近九成——但同時，現金仍佔當地實體消費金額的四成以上⁴。換句話說，在東南亞或拉美，payer 慣用的可能不是卡，而是本地錢包甚至現金。

### 2. Pay-out（出金端）── 如何派錢

很多人第一次接觸 Marketplace 都會發現：收錢容易，派錢反而更困難。因為付款人付完錢就可以離開，但司機、物流商、創作者——他們每天都在等待收入。2025 年一項 gig driver 調查顯示，七成司機希望在賺到錢後 24 小時內收到款項⁵；Mastercard 的調查更發現，85% 的 gig workers 表示如果出糧更快，他們願意接更多工作⁶。

Payout speed 不是 cost centre，而是 supply-side retention lever——派錢的速度，直接影響服務提供者留不留在你的平台上。

平台需要思考：什麼時候付款？用哪條 Payment Rail？即時到帳還是 T+1？成本如何控制？

### 3. Money Management（資金與流動性管理）── 錢的時間差

平台收到錢，並不代表平台銀行戶口立即收到錢。很多時候 Card Settlement 是 T+1、甚至 T+2。但司機希望現在就收到。於是平台 Payment 開始變成一個 Liquidity Management 問題：要不要建立 Wallet？要不要墊付資金？Working Capital 是否足夠？

### 4. Economics（交易經濟學）── 誰拿走了利潤

「Payment」並不是免費。每一次收錢，每一次派錢，每一次跨境換匯，都有人收費。

而 Marketplace 最大的特點，是佣金率（Take Rate，a16z 的 marketplace metrics 框架中的核心指標之一⁷）通常十分有限——定價受制於市場競爭，升不上去。

支付成本對利潤的影響，遠比表面看起來大：一個 25% take rate 的平台，扣除 3% 支付成本後還剩 22 個點；但一個 6% take rate 的平台，同樣扣 3%，只剩 3 個點⁸——同一個支付成本，對低 take rate 平台可以是生死線。

因此 Payment Team 每天都會思考怎樣把每筆交易成本再降低一點，即使每筆交易只節省幾十個 basis points（bps，即 0.01%），當交易量足夠大時，都可能直接轉化成數百萬美元的利潤。

### 5. Compliance（合規與監管）

最後，也是最容易被忽略的一部分。不同國家的 KYC（Know Your Customer）、AML（Anti-Money Laundering）、發票（Invoicing）、稅務（Taxation）、SVL（Stored Value Facility License）、Money Transmission License 等，全部都不同。

很多 Payment PM 不只是寫 Payment System 或設計付款流程，而是在不同監管框架之間，找到一個所有市場都能運作的共同架構，讓資金安全、高效、合規地流經整個生態系統。

## 結語

當交易量只有每天一百筆時，很多問題都可以靠人手解決。但當平台每天要處理數百萬筆交易，Payment 就不再只是 Checkout。

它開始變成一門關於流動性（Liquidity）、成本（Cost）、速度（Speed）、風險（Risk）與監管（Compliance）之間的系統設計。

### The Constraint Triangle

                Cost
                 ▲
                / \\
               /   \\
              /     \\
             /       \\
        TRUST ------- Speed

這三個角互相牽制：想要極致的速度與體驗，可能就要付出更高的墊資成本或牌照代價；想要極低的成本，可能就得犧牲即時到帳的時效。在限制中找到最優解，就是產品團隊每天的任務。

這個系列接下來會逐個模組拆下去：入金的成本結構、出金與 Wallet 的帳本設計、現金訂單如何令資金流方向倒轉。如果你也對「錢在平台裡怎樣流動」感興趣，歡迎追蹤。

## References

1. [Stripe — Payfacs guide](https://stripe.com/guides/payfacs)
2. [PYMNTS — Pix Turns 5](https://www.pymnts.com/real-time-payments/2025/pix-turns-5-brazil-real-time-payments-shift-accelerates/)
3. [EBANX — Pix 8B monthly transactions](https://business.ebanx.com/en/press-room/press-releases/pix-to-approach-8-billion-monthly-transactions-as-it-marks-five-year-milestone-ebanx-study-finds)
4. [Fintech Singapore — SEA Payment Methods 2026](https://fintechnews.sg/128337/e-commerce/southeast-asia-payment-methods-2026-global-payments-report/)
5. [Totally Rewards — Payout Speed](https://www.totallyrewards.com/blog/payout-speed-the-competitive-advantage-in-the-gig-economy)
6. [USIO — Access to Pay](https://usio.com/access-to-pay-is-access-to-work/)
7. [a16z — 13 Metrics for Marketplace Companies](https://a16z.com/13-metrics-for-marketplace-companies/)
8. [Spark — Marketplace Payments Platform Economics](https://www.spark.money/research/marketplace-payments-platform-economics)
9. [Venable — Money Transmission in the PayFac Model](https://www.venable.com/insights/publications/2018/06/money-transmission-in-the-payment-facilitator-mode)
10. [PayRam — How to Become a PayFac](https://www.payram.com/blog/how-to-become-a-payment-facilitator)`
  },
  {
    id: 'firelight-2026-06-13',
    status: 'published',
    title: '我們治好了黑夜，卻不小心殺死了營火：為什麼我們丟失了深夜的真心話？',
    date: '2026-06-13',
    substackUrl: 'https://abbycheung1.substack.com/p/9c7',
    body: `*一個追蹤了 40 年的人類學研究發現：同一群人，白天說的話和夜晚說的話，完全是兩個世界。這個差異，可能藏著現代人為何愈來愈孤獨的答案。*

## 引言：一個關於黑暗的提問

有沒有想過，人為什麼在夜晚特別容易說真心話？

深夜兩點打出那段白天不敢說的訊息、關了燈才說得出口的心事、凌晨和朋友講電話講到不捨得掛線——這些行為太普遍，普遍到我們從來沒問過為什麼。

我們通常將它歸咎於「夜深人靜」、「累到失去防備」。但人類學有一個追蹤了 40 年的研究，給了一個更深、更具啟發性的答案。

而這個答案，可能同時解釋著一個現代通病：**為什麼我們的連結工具愈來愈多，卻活得愈來愈孤獨？**

這篇文章想拆解三件事：一個關於日夜對話的驚人研究發現、背後的進化機制、以及一個我們正在親手摧毀的、寫進了 DNA 的連結本能。

## 一、同一群人，日夜說兩種完全不同的話

人類學家波莉·威斯納（Polly Wiessner）曾對南部非洲的朱霍安西（Ju/'hoansi）布希曼人進行了一項長達數年的追蹤研究。在那個電力照明尚未發明的原始部落裡，她詳細記錄了原住民在「日頭」與「夜晚」的對話內容，並發現了一個極具啟發性的數據差異。

**白天的對話：Production Mode**

在白日光線充足的時候，部落的對話幾乎全是關於「正經事」——哪裡有食物、資源如何分配、誰做錯了事情、誰需要接受批評。白天的語言是一種社會管理工具，它是務實的、理性的、解決問題並維持秩序的。

**夜晚的對話：Connection Mode**

但當太陽落山，當人們圍繞著火堆坐下，語言的本質徹底改變。

夜晚大約 81% 的對話，自動切換成了 **故事講述（Storytelling）**。人們不再計較白日的債務與對錯，他們開始講述遠方部落的奇聞、死去亡魂的足跡、古老的神靈、荒誕的夢境與傳說。他們唱歌、跳舞、開著不著邊際的玩笑。

這些對話不為了任何實際的物質利益，純粹為了兩件事：**表達情感，與建立連結（Bonding）。**

同一群人，在日落前後判若兩人。問題是——為什麼？

## 二、黑夜帶來的「庇護感（Darkness as Coverage）」

為什麼光線的改變，能瞬間重寫大腦的底層代碼？這背後有三個層次的進化心理學支撐：

### 第一層：火光創造了「額外的四個小時」

演化心理學家羅賓·鄧巴（Robin Dunbar）指出一個關鍵：火光提供了 **額外大約四個小時**，這段時間「社交互動，而且幾乎只有社交互動，才能發生」。

這點很重要。白天的時間被維生勞動佔據——覓食、打獵、採集。只有當黑暗令生產活動無法進行，人類才第一次擁有 **「純社交時間」**。從系統發育（phylogenetic）的角度，故事可能主要就是在我們祖先規律使用了大約 40 萬年的營火旁邊誕生的。

### 第二層：夜晚對話激活更高層次的認知

Wiessner 的研究有一個微妙但深刻的發現。日間對話聚焦實用性與批判性的八卦；而火光旁的活動，**聚焦在激發想像力、幫人記住與理解外部 network 裡的人、修補日間的裂痕（healed rifts of the day）、傳遞關於文化制度的資訊**。

特別是「想像力」這一點——夜間對話在激發更高層次的 theory of mind（透過想像力）上扮演重要角色。Theory of mind 即是理解「他人腦中所想」的能力。當你聽一個關於遠方部落、或者已故之人的故事，你的大腦要模擬一個不在現場的世界——這正是人類獨有的認知飛躍。

### 第三層：黑暗本身的抑制效應（Disinhibition Effect）

Wiessner 說過一句很美的話：

> 黑暗中的火有種特別的力量——它讓人連結（Bond）、讓人放鬆、又讓人興奮。它是如此親密（Intimate）。

在日光之下，我們每個人都處於一種「全面曝光」的狀態：別人的目光、微妙的表情、無處不在的社會階級與比較，在太陽底下一覽無遺。為了在殘酷的生存競爭中活下來，我們必須逼自己維持高度警覺（High-Alert），用理性武裝自己，隨時準備捍衛自己的利益。

但當太陽落山，視覺上的曝光感消失了。

當營火升起，在這個半遮半掩的微光空間裡，宏大的世界瞬間縮小了，縮小到只剩下火光能照亮的、身邊這一小撮人。地平線不見了，遠處的審視不見了，視覺上的危險防禦機制終於可以暫時安全關機。

**在這種黑暗的保護罩下，展現脆弱的社交風險降到了最低**。人類的大腦終於敢放低防衛，去訴說那些白日裡絕對不會提起的字眼：我們的軟弱、遺憾、渴望，以及心底最深沉的愛恨。

這種「夜間感性」，是人類幾百萬年來刻在 DNA 裡的進化本能。白日的理性讓我們活下來，但夜晚的營火，才讓我們願意活下去。

## 三、反直覺視角：我們發明了光，卻失去了連結

如果故事停在這裡，它只是一個關於遠古部落的迷人研究。但真正深思的，是當我們把這個 framework 套回現代生活。

夜間講故事的模式在現代文化中同樣存在——人們在工作日結束之後，跟孩子講童話、讀小說、看電影、聽廣播劇、看電視劇、打電子遊戲。換言之，人類從未停止「夜晚講故事」——我們只是換了形式。

但問題來了。

過去 40 萬年，黑暗一直是一個天然的「斷路器（Circuit Breaker）」——它強制終止生產活動，逼我們進入連結模式。**但 LED 與手機，第一次在人類歷史上，廢除了這個 circuit breaker。**

現代人的世界裡不再有真正的日夜交替。我們將「白日的生存理性」無限延伸到了凌晨兩點——message、email、social media。我們的理性被迫 24 小時不准收工，凌晨還在回工作訊息、還在跟人比較、還在被無形的目光審視。大腦的預測模型被強行超頻（Overclocking），永遠停留在高產出、高防備的「生產模式」。

我們在深夜裡用冷光螢幕試圖填補空虛，卻悲哀地發現，數位訊號只帶來了更多的比較與焦慮。**它正在做的，恰恰是將白天那種「被審視、要表現、要 defend」的生產邏輯，延伸到本應屬於連結的夜晚。**

我們擁有人類史上最多的「連結科技」，卻失去了那個唯一的、被黑暗保護著的、可以放下防衛的空間。

然後我們回過頭來，百思不得其解：為什麼自己活得這麼孤獨、這麼疏離？

研究並沒有直接證明「手機 = 孤獨」的 causation。但 framework 本身已經足夠 illuminating：當你 24 小時都處於曝光與生產狀態，你其實從未真正進入過營火那種 intimate、低防衛的連結模式。

我們治好了黑夜，卻不小心殺死了營火。

## 四、結尾：重新搭一個帳篷

寫到這裡，我突然想起小時候。

那時喜歡用棉被和枕頭，在床角搭出一個與世隔絕的「小帳篷」。然後跟朋友、跟兄弟姊妹躲進裡面，拿著手電筒，在那個悶熱的小空間裡，講心事、講鬼故事、講大人面前不會說的秘密。

那個帳篷裡面，有一種現在很難找回的感覺——很小、很暗、很安全。世界縮小到只剩眼前那一兩個人。

當時以為只是小孩的胡鬧。

現在才明白，那時可能不是在玩——那是我們尚未被現代科技馴化的 DNA，在用最本能的方式教導我：**人類需要邊界，需要陰影，需要一個「營火般的空間」，才能真正連結彼此。**

這個本能從來沒有消失。它只是被我們的 LED 和一聲聲 notification 蓋過了。

我想今晚，我會早一點關燈，去允許黑夜重新接管我的房間。

## References

1. Wiessner, P. W. (2014). Embers of society: Firelight talk among the Ju/'hoansi Bushmen. *Proceedings of the National Academy of Sciences*, 111(39), 14027–14035.
2. Dunbar, R. I. M. (2014). How conversations around campfires came to be. *PNAS*, 111(39), 14013–14014.
3. Wiessner, P. (2005). Norm enforcement among the Ju/'hoansi Bushmen. *Human Nature*, 16(2).

## 關於「獨自升級 2026」計劃

這是我的個人品牌與知識沙盒。每週我會挑選一個日常生活中看似平凡的物件或冷知識，用 Framework（商業框架）+ Science（硬核科學）+ Behavioral Insight（行為洞察）的三層漏斗結構進行重新整合，在輸入與輸出之間鍛鍊自己的結構化思維。

如果你對這種「將日常物件解構成研究級分析」的寫作方式有興趣，歡迎 subscribe 留言跟我一起思考。`,
  },
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
  '2026-06-14': `## 🎁 Mabelle event 嘅 unexpected delight

本身諗住去拎個水樽 only ——結果個姐姐超勁咁幫我開返本身已經幾乎埋左口嘅耳窿。Shocked。我仲打算放棄耳機哩樣嘢，返到屋企又帶返 haha。

仲比我試到一對心心耳環⋯⋯想要。下次再有 event 再去 lam 禮物個時先——可能又係一份生日禮物。

Btw 個水壺比想像中靚，仲要係紫色～開心開心。

## 💡 Threading back: Manifestation × Carl Sagan

> 為什麼我信 Manifestation？因為當我想到，這個宇宙連「生命」都可以從無到有創造出來，在這個種機率制度下，有什麼是不可能的呢？

琴日 6/13 寫低嘅 thread。今日重新 surface 係因為呢個 framing 啱啱配合 Mabelle 嘅 unexpected delight——本身去拎水壺，唔知道嘅 universe 已經喺度幫你開耳窿、預備心心耳環。

呢個 thread 同 Free Won't（6/12）形成完美 pairing：
- **Free Won't** = 拒絕慣性嘅 veto power
- **Manifestation** = commit 看似不可能嘅 thing 嘅 framing

一個收一個放，組合埋係完整嘅 agency。

## 🌭 食物驚為天人：美版 yellow mustard

嘩嘩嘩，今日個多士加咗 yellow mustard——驚為天人。好夾。我啱我口味。

琴日仲係咁睇食譜睇下點樣消耗咁大支醬，但估！唔！到！美版 yellow mustard 咁好食。之前食 Dijon mustard 真係太辛辣，點整都唔夾。但今次係用嚟搽包、點餃子、配肉——全部 perfect match。同個蕃茄辣湯都好夾。

正呀正。

## 今日 daily tasks ✓

- ✓ 朝早：最佳自我想像 + Stoic 準備
- ✓ Anthropic Academy 微學習
- ✓ AI Storytelling 練習
- ✓ Article → 啟發總結（呢條 Manifestation thread 算埋）
- ⬜ Shadowing + Re-tell（仲未做）

4/5 = 80%。Strong day.

## ✅ Building with the Claude API 完成 = 5/5 Anthropic Academy

今日完成最後一個 Anthropic Academy course。完整 progression：

> Claude 101 → Code 101 → Cowork → AI Fluency → Building with Claude API

呢套 cover 晒 4 個 level：**user → power user → autonomous-agent user → meta-fluent → builder**。對 PM 嘅 implication：可以直接同 eng 傾 API spec / eval threshold / tool design，唔需要 translator。

**今日學嘅核心 concepts 同我哋實時應用：**

- **Prompt evaluation workflow**——之後我哋傾咗 dev / PM ownership split + 3-tier framework（production / repeated workflow / one-off chat），confirm 我哋 chat 屬 Tier 3 唔需要 dataset+grader，但 eval-first thinking 仍 transferable
- **XML tags**——學到 tag-as-labeled-envelope 嘅 concept，並且 spot 到自己之前 prompt 入面邊度 wrap 咗會 cleaner（例如 paste long content + ask 嘅 turn）
- **Tool use**——意識到我哋整段 conversation 我已經 heavily 用緊 tools（Read / Edit / Bash / WebFetch / TaskCreate 等）；future build 階段 spec tool description / boundaries / failure handling 係 PM 嘅 turf

呢個 course 嘅 mode 同前 4 個唔同——前 4 個係 absorb concept，呢個係**邊學邊同我 apply 落 real conversation**（譬如即時 self-grade vanilla vs firelight、用 author preference vs audience reaction axis 拆解 reactions divergence）。Learning loop 嘅 density 大幅高過 passive consumption。

## 🪙 同步進行：Fintech Innovations Specialization (Coursera · U Michigan)

Cross-domain expansion。4-course Specialization：

1. The Future of Payment Technologies（in progress, 26%）
2. Blockchain and Cryptocurrency Explained（next）
3. Raising Capital: Credit Tech, Coin Offerings, Crowdfunding
4. Innovations in Investment Technology: AI

對應 Binance current 嘅 cross-border + Web3 payment work，aligned with confirmed next-role direction（cross-border payment & merchant side payment systems）。Coursera 全 spec 進度約 7%（course 1 of 4 at 26%）。

## 📋 Strategic clarification（CV share 之後嘅 calibration）

CV reveal 之後我重新 anchor 對你嘅 understanding：

- **Career arc spine：物理 flow → 數碼 flow → 代幣化 flow → payment flow**，spine 唔係「PM in tech」係「PM specializing in flow systems crossing boundaries」
- **Next role 方向 confirmed**：繼續 cross-border payment + merchant side payment systems，所以係 deepening 嘅 trajectory，唔係 pivot
- **Substack content strategy 係 intentional craft choice**：cognitive sanctuary + consulting-grade framework on life phenomena，唔係 work-related thought leadership。呢個係 **senior PM-level positioning move**——partner-style「strategic versatility across domain」嘅 signal，比 domain-specialist blogging 更 valuable for senior trajectory。我之前 framing 為「gap」嘅 advice 錯咗，retract。
- **Self-Upgrade 2026 project**：personal upgrade tracker + PM-AI collaboration workflow portfolio artifact——alongside Binance day job 嘅 self-developed PM tooling demo

## Daily task #1 擴闊 scope

「Anthropic Academy 微學習」→ **「專業課程 微學習」**，cover Anthropic Academy + Coursera Fintech Specialization 兩條 track。同一個 daily commitment 但兩個 source 都 valid。

## 🎯 Next role confirmed: Lalamove, Senior Payment Product Manager, Regional scope

**Career arc synthesis：** BBA International Shipping and Transport Logistics（2014-2018）→ DeFi（Cronos 2022）→ Mobile payment（AlipayHK 2024）→ Cross-border Web3 payment（Binance 2025）→ **Lalamove 2026：Logistics ∩ Payment ∩ Regional**。8 年 trajectory 嘅 convergent destination——原始 logistics 教育 + Web3 / Fintech payment specialty 第一次 collide 喺同一個 role 入面。

**Seniority jump confirmed**：PM → Senior PM。Regional scope 對齊 cross-border experience。

## 4 個月 prep horizon（Mar 2026 → 開始 Lalamove）

四條 high-leverage prep axes：

1. **Regional payment landscape literacy** — Lalamove 嘅核心 markets（HK / 中國 / SEA / LatAm）嘅 payment rails、wallets、regulators。Coursera Course 1（Payment Technologies）直接 cover 一部分
2. **Marketplace / gig economy 嘅 payment patterns** — driver payouts（real-time、cross-border、FX）、customer 多 payment method、merchant settlement、reconciliation。呢個 sub-domain Coursera 唔深，可能要靠 case study / talking to people
3. **Senior PM leadership signals** — Senior level 開始有 team leadership / stakeholder 高層 / strategic planning over longer horizons 嘅 expectations
4. **Lalamove product immersion** — 用佢個 app（HK 用戶）、讀公開 job description / earnings call / press release、可能 LinkedIn message 現職員工

## 下一步可以諗

- 中醫 5 行 篇 draft → polish → publish（pending）
- 將 home.js 長期目標由 abstract 改為 Lalamove-aligned concrete milestone（要我做？）
- Coursera Course 1 prioritize 喺 May 1 之前完成（before Lalamove start 的 baseline）
- 中性 Substack 寫 1 篇 cross-flow 主題嘅 essay（McKinsey/BCG framework on flow systems）——既係 intellectual sandbox，又係 implicit positioning signal`,

  '2026-06-13': `## ✅ Substack 第 2 篇 published

**標題：** 我們治好了黑夜，卻不小心殺死了營火：為什麼我們丟失了深夜的真心話？
**URL：** https://abbycheung1.substack.com/p/9c7
**字數：** ~2,600 字

呢篇 expand 自 6/8 嘅 Threads firelight post — 將原本 short-form 嘅 quote-and-react，擴展成完整嘅 4-段式 Framework / Science / Counter-intuitive / Closing structure，配 3 條 academic references（Wiessner *PNAS* 2014 + Dunbar *PNAS* 2014 + Wiessner *Human Nature* 2005）。

**Workflow 嘅 validation：** Thread = idea seed → Substack = polished long-form expansion。呢個 pipeline 完美 demonstrate 咗你嘅 architecture——short-form 試 angle，long-form 加 depth + citations。同 vanilla 雪糕嘅 formula 一致。

## ✅ Building with Claude API 完成

Anthropic Academy 嘅第 5 個 course done。COURSES tracker 由 4/4 → 5/5。Trajectory：

> Claude 101 → Claude Code 101 → Claude Cowork → AI Fluency → Building with Claude API

由 user-facing → IDE 開發 → file-system autonomy → 認知 framework → 直接 API call，呢條 path 等於由「點用」進化到「點 build」嘅 progression。

## Thread #4 上線（Manifestation × Carl Sagan）

> 「Manifestation 只是一個 framing——讓我們願意去 commit 一個看似不可能的想法。而那份 commitment，就是行動的起點。」

引用 Carl Sagan 嘅 *"We are a way for the cosmos to know itself"*——將 cosmological probability 同 manifestation 嘅 commitment psychology 連埋。呢個 angle interesting 喺：唔係 New Age 嘅「信就會成真」，而係 secular reframe——manifestation 嘅本質係「夠膽 commit」嘅 mental scaffolding。

呢條 thread 嘅 input → output 同樣完成今日「**Article → 啟發總結**」task。

## 中醫 5 行 篇 status

之前我哋一齊 draft 嘅 ~4,800 字 中醫五行 / body as ecosystem 篇仲未 ship。如果你想 next session 拎返出嚟 polish + publish，個 draft 仲 hold 喺 manifest.js comments / 我哋之前對話入面，隨時可以 lift 出嚟。

## 下一步可以諗

- 中醫 5 行 篇 polish 完上 Substack 變第 3 篇
- 將 long-term goals / TASKS 都 migrate 去 file-based pattern
- 開始用 Threads → Substack pipeline 做 weekly cadence`,

  '2026-06-12': `## ✅ AI Fluency: Framework & Foundations 完成

Anthropic Academy 嘅第 4 個 course done。COURSES tracker 由 3/3 → 4/4。順便將舊三個 \`sub\` 由 "Anthropic Skilljar" 統一改成 "Anthropic Academy"（newer brand）。

## Daily task 微調：Self Small Talk → Anthropic Academy 微學習

審視今日嘅 5 個 daily task，發現 **Self Small Talk 錄音** 嘅 marginal value 已經低咗——其他 3 個 communication task（AI Storytelling、Article → 啟發總結、Shadowing + Re-tell）已 cover 晒 read / speak / listen / reflect 嘅 cycle。

替換成 **Anthropic Academy 微學習 15 min**：每日 consume 15 min Anthropic Academy 或其他 cert course 內容（影片 / docs / interactive demo），積少成多 keeps you ahead of frontier，避免一次過 binge consume 帶嚟嘅 burnout。

> 注意：歷史 \`tasks_done\` records 入面 task index 1 嘅意義從今日起由「Self Small Talk」變成「Anthropic Academy 微學習」——舊 records 仍然 valid 反映你嗰日做咗 task #1，只係 label 改咗。

## 今日 content output

**Thread 第 3 篇上線（Free Won't / 意念 vs 人設）**
> 「人類可能沒有自由的『發起權』（Free Will），但擁有自由的『否決權』（Free Won't）。」

引用 Libet 1980s readiness potential 實驗 + Wegner *Illusion of Conscious Will* (2002)，combine LLM「人設 = trained weights」嘅 analogy + 佛教「業力 = training data」嘅 reframe。三條 stream（neuroscience + Buddhism + AI）收喺一條 thread——cross-domain synthesis 嘅 craftsmanship 高度。

配對 daily task：今日呢條 thread 嘅 work flow（讀 / 連結 / 重新整理輸出）剛好對應「**Article → 啟發總結**」task #2 — 喺 app 入面 click 一下就 mark 咗今日進度。

## 下一步可以諗

- 中醫 5 行 篇 draft → polish → publish
- 將 long-term goals / TASKS 都 migrate 去 file-based pattern（避免下次再有 task index drift 嘅 ambiguity）
- 配合「微學習」task，每日 15 min 食啲新 Anthropic content`,

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
    id: 'thread-2026-06-13-manifestation',
    date: '2026-06-13',
    content: `為什麼我信 Manifestation？

因為當我想到，這個宇宙連「生命」都可以從無到有創造出來，在這個種機率制度下，有什麼是不可能的呢？

宇宙本身就係一個巨大嘅「創造系統」。

> We are a way for the cosmos to know itself.
> —— Carl Sagan

Manifestation 只是一個 framing——讓我們願意去 commit 一個看似不可能的想法。

而那份 commitment，就是行動的起點。`,
    threadsUrl: 'https://www.threads.com/@_aura.laia_/post/DZkI71ajjNZ?xmt=AQG0bVzsCwyM5F9KoWJO7vJ_bwzIMRsjyclpcyDtRBBxMw',
  },
  {
    id: 'thread-2026-06-12-freewont',
    date: '2026-06-12',
    content: `你現在做出的種種選擇，到底係根據你當下「真正的意念」，定係根據「你認為自己會做出的選擇」？

1980 年代著名的李貝特實驗（Libet Experiment）發現，喺你意識到「我想撳掣」之前幾百毫秒，大腦嘅準備電位 (Readiness Potential) 已經點咗火。換句話說，大腦先幫你做了決定，你的意識隨後才「接收」到這個決定，仲誤以為係自己發起。

心理學家（如 Daniel Wegner）認為，傳統意義上「純粹由意識控制」嘅自由意志，只係大腦後製出嚟嘅幻覺。

就好似現代人用手機打字，打個「我」字，後面會自動跳出「覺得、好餓、返緊工」。

當你根據「人設」做選擇時，你其實就像大語言模型（LLM）一樣，在根據過去的數據，計算下一個最符合人設的 token（詞彙）。

---

佛教講嘅「業力」，用呢個 lens 睇就好清楚：

業力，就係你嘅 training data。每一次相信「我唔夠好」，每一次卑微討好一個不值得嘅人，都係幫個 model 加多一條訓練樣本。而「人設」，就係咁樣 train 出嚟嘅 weights。

所以兩種選擇嘅分別係：

1. **根據意念選擇**：是此時此刻的你，清晰看見現狀後做出的最優解。你是做決策的主人。
2. **根據「人設」選擇**：遇到事情，大腦自動檢索過去的數據庫，然後為了符合這個人設，順住熟悉嘅軌跡滑行。

---

雖然我地無法阻止大腦無意識地浮現某種衝動或慣性抉擇（例如遇到挑戰想逃避、想躲返入舊模式），但我地嘅意識在最後關頭（~100-200 毫秒的窗口期）擁有「按暫停」和「否決」的能力。

正如李堅翔博士所講：

> 真正的意念選擇，往往需要你違背慣性，甚至在當下會感到一點點違反本能的彆扭與恐懼，但隨之而來的是前所未有的開闊與自由。

佛教講「輪迴」——慣性嘅輪迴，係每一個 moment 都喺度轉。看破「我執」，先可以唔再被舊有模式推住走。

---

人類可能沒有自由的「發起權」（Free Will），但擁有自由的「否決權」（Free Won't）。

你永遠有其他選擇同可能。`,
    threadsUrl: 'https://www.threads.com/@_aura.laia_/post/DZeqZ6Vjg_u?xmt=AQG0WABmIhcn-Yg6XrBZuzYExzh-ENfbVClyznWivNHw-Q',
  },
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



