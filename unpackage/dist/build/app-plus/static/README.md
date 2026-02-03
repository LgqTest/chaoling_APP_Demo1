# TabBar图标使用指南

## 问题说明
当前底部TabBar图标不显示是因为 `static/` 目录下缺少图标文件。

## 解决方案

### 方案一：使用图标生成器（推荐）

1. 在浏览器中打开 `static/icon-generator.html` 文件
2. 页面会自动生成5个TabBar图标的预览
3. 对每个图标，右键点击图片 → "图片另存为"
4. 保存以下10个文件到 `static/` 目录：
   - `home.png` (首页-未选中)
   - `home_active.png` (首页-选中)
   - `control.png` (控制-未选中)
   - `control_active.png` (控制-选中)
   - `chat.png` (语音-未选中)
   - `chat_active.png` (语音-选中)
   - `scene.png` (场景-未选中)
   - `scene_active.png` (场景-选中)
   - `mine.png` (我的-未选中)
   - `mine_active.png` (我的-选中)

5. 保存完成后，返回HBuilderX，重新运行项目到手机

### 方案二：使用在线图标资源

从以下网站下载48x48px的PNG图标：
- [iconfont.cn](https://www.iconfont.cn/) - 阿里巴巴图标库
- [Flaticon](https://www.flaticon.com/) - 免费图标资源

下载后重命名为对应的文件名，放入 `static/` 目录。

### 方案三：自定义图标

如果你有设计能力，可以使用以下工具创建自定义图标：
- **Figma**: https://www.figma.com/
- **Canva**: https://www.canva.com/
- **Sketch**: https://www.sketch.com/

**图标规格要求：**
- 尺寸：48x48像素（推荐）或 24x24像素
- 格式：PNG
- 背景：透明

## 临时方案

如果暂时不想添加图标，可以修改 `pages.json` 文件，注释掉 `iconPath` 和 `selectedIconPath`，这样TabBar会只显示文字：

```json
{
  "pagePath": "pages/home/home",
  // "iconPath": "static/home.png",
  // "selectedIconPath": "static/home_active.png",
  "text": "首页"
}
```

但建议还是添加图标，这样界面更美观。

## 验证图标是否生效

图标添加后：
1. 在HBuilderX中按 `Ctrl+S` 保存所有文件
2. 重新运行项目到手机
3. 检查底部TabBar是否显示图标
4. 点击不同Tab，图标颜色应该会变化（未选中为灰色，选中为蓝色）

---

**提示**: 图标文件应该直接放在 `static/` 目录下，不要放在子文件夹中。
