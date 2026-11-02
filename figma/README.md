# 中汇新年福卡 · 2027 原型 → Figma 可编辑导入

这不是截图导入。插件会把原型逐元素还原成 Figma 图层：文字是可编辑文本、按钮/卡片/输入框是可改的矩形、PNG 素材是可替换的图片填充，并按「区块 / 元素」命名图层。

## 一、安装（Figma 桌面端）

1. 打开 Figma 桌面端，新建或打开一个 Design 文件。
2. 菜单 **Plugins → Development → Import plugin from manifest…**
3. 选择本目录下的 `editable-plugin/manifest.json`。
4. 菜单 **Plugins → Development → 中汇新年福卡原型（可编辑导入）** 运行。
5. 等待 1–3 分钟（首次运行需联网拉取布局数据与图片），会自动生成 14 个画板：
   - 原型入口 ×1
   - 前台 H5 ×7（390 宽，3 列排列）
   - 后台 ×6（1440 宽，单列排列）

插件运行时从 `https://amberstone-7.github.io/mp-fuka-2027-prototype/figma/spec/` 拉取布局 JSON 与素材；也可部署到自己的域名后修改 `editable-plugin/code.js` 顶部的 `PAGES` / `POSTER` 地址。

## 二、可以改什么

| 内容 | 在 Figma 里的形态 | 修改方式 |
| --- | --- | --- |
| 所有文案（标题/按钮/表格/提示） | Text 图层 | 双击直接改字 |
| 按钮、卡片、标签、输入框、表格 | Rectangle（+ Text） | 改填充、圆角、描边、尺寸 |
| 2027 主视觉、福卡字标、奖品图、emoji 图标 | Image Fill | 右侧 Fill → 替换图片 |
| 背景视频 | 视频首帧的图片占位（画板背景） | 替换为新的 PNG/JPG；Figma 不支持视频播放 |
| 图标 | 矢量（部分为 SVG 转换后的 frame） | 改颜色/缩放 |

图层命名规则：`区块 / 元素类型`，例如 `result / button.h5-btn`、`card / h2.h5-sec 文本`，可在 Layers 面板里按区块查找。

## 三、已知限制

- 采用**绝对定位**还原，不是 Auto Layout；改长文案时可能需要手动把宽度调大。
- 只还原**首屏可见状态**：弹窗、抽屉、下拉展开、悬停、切换后的状态不在导入结果里（原型页内可通过演示按钮查看这些状态）。
- 阴影、模糊、混合模式、部分伪元素装饰未还原；金色的分隔线已尽量还原。
- 字体自动匹配 **Noto Sans SC / Noto Serif SC**；若你的 Figma 没有这些字体，会回退到 Inter，可在 Figma 里一键替换字体。
- Figma 无法播放视频；需要看动效时请用线上原型：<https://amberstone-7.github.io/mp-fuka-2027-prototype/>

## 四、需要 Auto Layout / 组件库？

当前是「可编辑的页面还原」。如果你需要进一步做成设计系统（Button / Card / Input / Table 组件变体 + Auto Layout），可以在此基础上继续整理，告诉我即可。
