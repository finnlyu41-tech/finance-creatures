# 财会生物鉴定中心

> 查查你在账上算什么东西。

**v0.5.0** · 16 个会计科目 · 4 条娱乐维度 · 20 道题 · 1 个确定结果

在线体验：https://finnlyu41-tech.github.io/finance-creatures/

## 本版更新

- 四个缺图科目已经配置 Humaaans 授权现成人物插画；不是生成失败后的假占位，也不是本项目新原创。原有 12 张 AI 辅助人物图保留。作者、许可、原文件和哈希见 [ART-CREDITS.md](ART-CREDITS.md)。四张的画风与旧图不完全一致。
- 答题进度仅保存在当前标签页的 sessionStorage，刷新可恢复；最长 24 小时。可以主动清除。存储被禁用时仍能答题，明确提示不保留。无后端、统计或答案上传。
- 结果页先展示人物、笑点、四维摘要与分享按钮，详细计票默认折叠。
- 科目图鉴支持关键词、科目编号、四字母及真实科目类别筛选。
- 修复返回、暂停、重新鉴定、预览与真实结果之间的导航。支持键盘 1—4 选择、Enter 继续。
- 浏览器内合成 900px PNG，加入可扫描的科目链接二维码；图片加载失败可退化成明确标注的文字卡，不影响结果。
- 原生图片分享由第二次用户点击触发；复制失败保留手动选择文本；取消图片预览及时回收 Blob URL。
- 静态资源统一带版本号；合并样式表；无外部字体、第三方脚本或运行时图片来源。

## 判定规则

四个二元维度：D/C（情绪处理）、A/L（任务视角）、R/E（取舍习惯）、F/N（推进节奏）。每轴 5 题，每题给一个方向记 1 票；奇数票无并列。四条方向共 16 种组合，一一映射到 16 个会计科目。

这四条轴借用会计词语作为娱乐比喻，**不是科目的正式分类、借贷增减或余额方向**。资产、负债、损益、成本等真实科目分类另行显示。不是心理测量、职业能力评价或记账指引。不会计算人格准确率、稀有度或虚构用户比例。

本版仅优化体验，**没有更改 v0.4 的计分权重、题目选项映射或 16 型对应关系**。`#v4/type/<id>` 分享链接继续有效；v0.3 双生物链接明确归档，不自动转换成新结果。

## 隐私与分享

原始答案不出浏览器，不写入分享链接。sessionStorage 按标签页隔离，但浏览器恢复标签页可能恢复其临时数据，因此另有 24 小时有效期和主动清空入口。页面计算出的结果只对应当前有效答案。朋友打开分享链接看到的是该角色卡，不会看到伪造的答题票数。

所有人物与 QR 资源从本站加载。GitHub Pages 作为托管方可能保留常规访问日志，不应称为完全无日志服务。页面保留 `noindex,follow`，仍是公开可访问的体验版，不是私密环境。

## 本地运行

```sh
python3 -m http.server 8080
node --test tests/*.test.cjs
```

无需安装前端依赖或打包。`main` 根目录是 GitHub Pages 发布源，不依赖 Mac mini 常驻。

## 资源可复现与浏览器检查

```sh
python3 -m pip install -r requirements-qa.txt
python3 scripts/prepare-assets.py
python3 -m playwright install --with-deps chromium webkit
QA_BROWSER=chromium QA_OUTPUT=/tmp/finance-qa/chromium python3 tests/browser.test.py
QA_BROWSER=webkit QA_OUTPUT=/tmp/finance-qa/webkit python3 tests/browser.test.py
```

`prepare-assets.py` 只在缺少四张授权 SVG 时从固定 Git blob 获取并验证 SHA，原文件保持不变；其余时候校验本地文件并生成只含公开类型链接的 QR。不会调用任何图像生成接口。

测试覆盖全部 16 型的完整答题、插画显示、PNG 导出、二维码解码、刷新恢复、浏览器后退、筛选、旧链接、七种屏幕宽度、禁用存储、损坏缓存、剪贴板拒绝。网页部署后还运行线上 HTTPS 冒烟检查。

**测试中的系统分享接口被模拟。桌面 WebKit 测试不等于 iPhone／Safari 实机分享验证。** 不收集真实用户数据作为测试样本。

## 关键文件

- `content.js`：科目、文案、四维及题库。
- `engine.js`：可测试的确定性计分和安全路由。
- `session.js`：临时进度的验证、版本与期限。
- `app.js`：交互、恢复、分享与 Canvas。
- `scripts/art-sources.json` / `ART-CREDITS.md`：授权图片来源与归属。
- `scripts/prepare-assets.py`：锁定资源、验证与 QR。
- `tests/`：单元与浏览器回归测试。

## 相关说明

无 MBTI、16Personalities 或 SBTI 官方关联。新增四张 Humaaans 为 Pablo Stanley 创作的授权素材，作者未为本项目背书。正式会计科目参考及娱乐与专业边界保留在页面“关于／隐私／版本”中。
