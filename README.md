# 厨电智能家居语音助手 (UniApp)

## 项目简介
这是一个基于 UniApp + Vue 2 开发的 Android 语音助手 Demo。集成了百度语音识别 (STT) 和 Moonshot AI (Kimi) 大模型对话功能。

## 目录结构
- `pages/`: 页面文件 (Home, Chat, Control, Scene, Mine)
- `common/`: 公共工具 (API 封装, 配置文件)
- `static/`: 静态资源 (需自行添加图标)
- `App.vue`: 应用入口及全局样式
- `manifest.json`: 应用配置及权限

## 快速开始

### 1. 导入项目
将本项目文件夹直接导入 **HBuilderX**。

### 2. 配置 API Key
打开 `common/config.js` 文件，填入你的 API Key：
```javascript
export default {
    baidu: {
        apiKey: '你的百度API Key',
        secretKey: '你的百度Secret Key',
        // ...
    },
    moonshot: {
        apiKey: 'sk-xxxxxxxx', // 你的Moonshot AI Key
        // ...
    }
}
```

### 3. 添加图标资源
请在 `static/` 目录下添加以下图片文件（或修改 `pages.json` 中的路径）：
- `home.png` / `home_active.png`
- `chat.png` / `chat_active.png`
- `control.png` / `control_active.png`
- `scene.png` / `scene_active.png`
- `mine.png` / `mine_active.png`

### 4. 运行调试
1. 连接安卓手机并开启 USB 调试。
2. 在 HBuilderX 中点击 **运行** -> **运行到手机或模拟器** -> **运行到Android App基座**。
3. 首次运行需要自定义基座或使用标准基座，确保勾选 "使用公共测试证书"。

## 核心功能说明
- **语音交互**：在 "语音" 页面，长按麦克风图标说话，松开后自动识别并发送给 AI。
- **智能对话**：AI 会根据上下文进行回复。
- **模拟控制**：其他页面展示了智能家居的控制 UI，目前为演示状态。

## 注意事项
- 确保手机已联网。
- 确保授予应用 **录音** 和 **存储** 权限。
- 百度语音识别 API 免费额度可能有限，请留意百度控制台。

## 开发者
李桂棋
2026-02-03
