# 人物插画来源

## 当前使用：16 张 AI 辅助财会人物图

v0.5.1 保留 12 张已有 WebP，并用 4 张新图替换此前画风不同的 Humaaans SVG。当前人物均为人类职场角色，沿用暖米白底、柔和块面阴影和财会道具；没有使用 MBTI / 16Personalities 官方角色，也没有品牌授权或关联。

已有 12 张为：`construction.webp`、`fixed-asset.webp`、`receivables.webp`、`skepticism.webp`、`provision.webp`、`going-concern.webp`、`goodwill.webp`、`windfall.webp`、`substance.webp`、`other-receivables.webp`、`materiality.webp`、`depreciated.webp`。本次没有改动这 12 个文件。

四张新图于 2026-09-09 使用本地 Codex 的内置图像生成工具制作，以项目已有 `provision.webp` 和 `construction.webp` 为画风参考。生成后只作留白裁切、等比例缩放、纸白校正（适配页面既有正片叠底）和 WebP 压缩，没有使用第三方运行时图像服务。不是 Pablo Stanley / Humaaans 的新作品，不把旧署名套在新图上。

| 角色 ID | 当前文件 | SHA-256 |
|---|---|---|
| cash | `assets/characters/cash.webp` | `03ebc939e86171035aec54d3cdbd2467a543f6a9db88841cd7605b7503fb8b88` |
| bank-deposits | `assets/characters/bank-deposits.webp` | `0901ff65f16a0f0173e9f1f42cbf03d5f8592b126fc23264d3ef2bbf64d91c6e` |
| long-term-prepaid | `assets/characters/long-term-prepaid.webp` | `2e00f4052ce4ae79e9d558bf4587532f68df7ed41eb81f2139397c9168a417f2` |
| payroll | `assets/characters/payroll.webp` | `7e0c692c87c0e82e8d57cf72089ce58bd23a128cbadd69f85abf93c61ec0141e` |

全部 16 张当前图的 SHA-256、字节数、实际尺寸与制作来源记录在 `scripts/portrait-manifest.json`；新图还记录了生成原始 PNG 的 SHA-256。该清单用于验证选定素材，不承诺再次生成能逐像素复现。同风格不等于每个角色笔触完全相同，仍保留姿态与道具的差异。

## 旧版授权素材：保留原文件及归属，不再用于当前人物卡

v0.5.0 曾在库存现金、银行存款、长期待摊费用、应付职工薪酬使用以下四张 Humaaans SVG。文件仍按原路径保留，未修改原内容；`scripts/art-sources.json` 保留不可变源文件与 Git blob SHA。

**作者：Pablo Stanley，Copyright © 2019。** 作品集合：[Humaaans](https://www.humaaans.com/)。下载来源：[Calinou/humaaans](https://github.com/Calinou/humaaans)，按该镜像发布的 [Creative Commons Attribution 4.0 International（CC BY 4.0）](https://creativecommons.org/licenses/by/4.0/) 条款署名使用。[来源许可原文](https://github.com/Calinou/humaaans/blob/master/LICENSE.md)。

| 本站位置 | 来源作品 | 内容校验（Git blob SHA-1） |
|---|---|---|
| 库存现金 | Flat Assets/Humaaans/standing-1.svg | 10106ce9bdd3d54b1f27905004e8ccb67476e46c |
| 银行存款 | Flat Assets/Humaaans/sitting-8.svg | e47d77e642f36a040b103330f344d9a04453ddb4 |
| 长期待摊费用 | Flat Assets/Humaaans/sitting-1.svg | 36ff6933b802a0fee30f46bec3b2bc45b627e8ef |
| 应付职工薪酬 | Flat Assets/Humaaans/standing-12.svg | 9b0517913589be9eff00d76784835a8f4889df37 |


四份旧 SVG 的原文件及本节署名继续保留，避免移除现存素材的出处。当前图鉴、结果页与 PNG 分享卡改用上方的新 WebP，不再把旧授权人物当作当前图。会计角色名称、笑话、维度及对应关系由本项目创作，不代表旧素材作者认可或参与。

所有当前人物与 QR 资源均随站点发布；访客浏览及生成分享卡不连接插画作者服务器或图像生成服务。原始生成文件与人工视觉核查记录作为本次执行证据保存，不把素材生成成功等同于代码、测试或部署成功。
