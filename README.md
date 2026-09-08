# 财会生物鉴定中心

> 查查你在账上算什么东西。

**试营业 v0.1.0** · 12 道原创情境题 · 12 种财会身份 · 纯娱乐

在线体验：https://finnlyu41-tech.github.io/finance-creatures/

## 内容与功能

本项目把会计科目、财会概念和审计术语拟人化，做一个轻量解压小测试。不是 MBTI / SBTI 官方产品，不是心理测量、能力评价或专业会计指引。

- 单页，手机优先；逐题作答、返回修改、重测。
- 每个选项映射到一个类型；最高计数即本次候选类型。
- 并列时公开展示候选，让参与者自行认领；不暗设顺序，不随机替参与者决定。
- 查看全部 12 种图鉴、分享类型链接、在浏览器内生成 PNG 卡片。
- 从分享链接进入会标记为分享的卡片，不会假称是接收者的答题结果。
- 没有账号、后端、第三方依赖、广告或统计代码。答案仅在当前页面内存中处理，刷新清空；分享只包含类型，不带原始答案。
- GitHub Pages 作为托管方可能产生常规访问日志，不能将此项目称为完全无日志服务。

## 文件结构

- `index.html`：页面结构及公开隐私说明。
- `style.css`：响应式财务纸单样式，系统字体，无远程字体。
- `content.js`：12 种结果卡与 12 道题。调整笑点主要改这里。
- `engine.js`：纯函数计分逻辑。
- `app.js`：交互、结果路由、复制 / 原生分享、Canvas 图片生成。
- `tests/engine.test.cjs`：结构、并列、计分有效性及可达性测试。
- `.nojekyll`：直接发布静态资源。

## 本地查看与验证

无需安装前端依赖或构建。

```sh
python3 -m http.server 8080
# 然后访问 http://localhost:8080
node --test tests/engine.test.cjs
```

GitHub Pages 发布源为 `main` 分支根目录。提交这几个静态文件即可更新，不依赖个人电脑长期在线，也不消耗 AI 接口。

目前页面设置了 `noindex,follow`，避免把试稿主动纳入搜索索引；这不限制公开访问或分享。正式版确定后可移除 `noindex`。

## 创作与数据边界

角色名称是拟人化玩笑，描述不是术语定义。本项目不发布任何客户资料、真实财务记录、私人笔记或内部研究。当前内容并未经过真人试玩或科学量表验证，不提供准确率、类型稀有度或虚构参与人数。

技术参考：
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/rest/pages/pages
