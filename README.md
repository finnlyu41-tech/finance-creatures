# 财会生物鉴定中心

> 查查你在账上算什么东西。

**试营业 v0.3.0** · 12 道原创情境题 · 12 位原创角色 · 66 种双生物组合

在线体验：https://finnlyu41-tech.github.io/finance-creatures/

自由混搭：https://finnlyu41-tech.github.io/finance-creatures/#mix

## 这一版

“已提足折旧”：功能正常，语气报废。

“其他应收款 × 预计负债”：活还没分给你，你已经替全公司愁完了。

重写 12 张角色卡、48 个选项与即时旁白。每位角色有 5 条可轮换的补刀。保留 v0.2 的 12 张原创人物图，新增主副生物、自由混搭、双人物 PNG 和 66 组独立组合文案。

## 计分与结果边界

每题四个选项，一个选项对应一个类型；每个类型在题库有四次曝光。没有宣称心理测量效度、准确率、人格占比或真实人群稀有度。

1. 主生物取本次最高分；并列时展示全部并列候选，由参与者认领。
2. 排除已选主生物，剩余最高正分类型成为副生物候选。唯一候选自动显示；多个候选允许自选，也允许先只分享主生物。
3. 其余最高分并列类型仍可成为副生物。并列不是算法暗中优先或随机分配。
4. 66 种不同的无序两两组合各有独立梗；交换主副顺序保留角色顺序，但使用同一个组合梗。
5. 自由混搭无需答题，明确标为“不是答题结果”。分享链接的接收者会看到“朋友分享”，不会被伪装成已经完成测评。

## 功能与隐私

手机优先；逐题作答、返回修改、并列认领、图鉴、主副结果、自由混搭。结果卡在浏览器内绘制：单人物和双人物 PNG、复制结果链接、支持时使用系统图片分享；分享失败可长按保存或下载。

无账号、后端、远程字体、广告或追踪统计。答案仅在当前页面内存里，刷新清空。分享片段只包含角色标识，不包含原始答案或个人信息。GitHub Pages 可能保留普通访问日志，因此不宣称完全无日志。

无官方 MBTI、16Personalities 或 SBTI 关联。术语拟人化不是准则定义、招聘工具、心理诊断或能力评价。角色图为本项目 AI 辅助原创资产，见 `assets/characters/README.md`。

## 文件结构

- `content.js`：12 类、12 题、48 条选项旁白、60 条补刀、66 组双生物梗。
- `engine.js`：纯函数计分、主副候选、组合查找、安全分享路由。
- `app.js`：答题、图鉴、自由混搭、结果、Canvas 图片、剪贴板与系统图片分享。
- `index.html` / `style.css`：保留人物卡风格的响应式单页。
- `tests/engine.test.cjs`：无第三方依赖的单元测试。
- `tests/browser.test.cjs`：可选 Puppeteer 浏览器冒烟检查；需自行提供 Puppeteer 和 Chrome。
- `.nojekyll`：静态资源直接发布。

## 运行

```sh
python3 -m http.server 8080
node --test tests/engine.test.cjs
# 可选：在已安装 puppeteer 的开发环境中运行
CHROME_PATH=/path/to/chrome node tests/browser.test.cjs /tmp/finance-qa
```

浏览器测试使用独立无头浏览器和回环 HTTP 服务，不使用日常个人浏览器配置。测试中的系统分享 API 被模拟；通过测试不代表已完成 iPhone / Safari 的实机分享验证。

GitHub Pages 保持 `main` 分支根目录发布，不需要个人电脑常驻。现在仍有 `noindex,follow`，但页面和代码均是公开的。

## 技术参考

- GitHub Pages 发布源：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Web Share API（由用户点击触发）：https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API
