非常好！我已经获取到最新的技术文档。现在让我为你整理一份**完整的PRD开发文档**，包含详细的代码实现说明。这次我会非常详细地讲解每一个模块的实现方式。

---

# **UniApp AI语音助手完整开发文档 (PRD)**

**项目名称：** 厨电智能家居语音助手  
**开发者：** 李桂棋 (AI集成专家·软件工程师)  
**文档版本：** 1.0  
**最后更新：** 2026-02-03  
**技术栈：** UniApp + Vue 2 + HBuilderX + Android APK

---

## **第一部分：产品概述**

### **1.1 产品定位**

这是一款基于UniApp框架开发的**极简化Android语音AI助手**，专注于厨电场景的智能家电控制。产品通过集成百度语音识别、Moonshot AI对话模型，打造一个轻量级、快速验证的Demo应用。

**核心价值主张：**
- 快速原型验证（开发周期短）
- 界面简洁时尚（5个页面设计）
- 语音交互自然（用户友好体验）
- 跨平台部署便捷（一套代码多平台）

### **1.2 核心功能模块**

你的应用将包含以下五个页面和核心功能：

**页面结构：**
- 首页（Home）：应用入口、快速操作卡片
- 聊天页面（Chat）：中间核心页面，语音交互、消息展示
- 控制页面（Control）：家电控制面板
- 场景页面（Scene）：智能场景设置
- 我的页面（Mine）：用户信息、设置

**功能清单：**
- ✅ 实时语音录入（麦克风权限管理）
- ✅ 语音识别转文字（百度API）
- ✅ LLM智能对话（Moonshot API）
- ✅ 消息列表展示与滚动
- ✅ 界面UI完整呈现
- ✅ Android APK打包部署

---

## **第二部分：技术架构设计**

### **2.1 整体技术栈**

| 组件 | 技术选型 | 版本 | 用途 |
|-----|--------|------|-----|
| 前端框架 | Vue 2 | 2.7+ | 渐进式UI开发 |
| 跨平台框架 | UniApp | 3.x | Android/iOS编译 |
| 开发工具 | HBuilderX | 最新版 | IDE + 云打包 |
| 状态管理 | Vuex | 3.x | 全局状态共享 |
| 语音识别 | 百度Speech API | v2.0 | 音频转文字 |
| LLM对话 | Moonshot (Kimi) | K2.5 | 智能回复生成 |
| UI组件库 | uni-ui | 最新版 | 预制组件 |
| 打包工具 | HBuilderX云打包 | - | APK生成 |

### **2.2 数据流程架构**

```
┌─────────────────────────────────────────────────────────┐
│                   用户交互流程图                          │
└─────────────────────────────────────────────────────────┘

用户UI交互
    ↓
┌─────────────────────────────────────────────────────────┐
│ 1. 语音录入模块 (RecorderManager)                        │
│    - 按住录音按钮 → 开始录音                              │
│    - 松开按钮 → 停止录音 → 获取本地音频文件路径           │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ 2. 音频处理模块 (AudioProcessor)                         │
│    - 读取音频文件 (WAV/M4A格式)                          │
│    - Base64编码处理                                      │
│    - 文件大小验证 (需<4M)                                │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ 3. 百度语音API服务 (BaiduSpeech)                        │
│    POST: https://aip.baidubce.com/rest/2.0/speech/      │
│          u/v1/recognize                                 │
│    请求体: {speech: base64Data, len: fileSize, rate: 16000}
│    返回: {result: ["识别文本"], err_no: 0}              │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ 4. 对话上下文管理 (ContextManager)                       │
│    - 保存识别的用户文本                                  │
│    - 构建消息历史数组                                    │
│    - 维护对话上下文 (最近20条)                           │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ 5. Moonshot API服务 (MoonshotAPI)                       │
│    POST: https://api.moonshot.cn/v1/chat/completions   │
│    请求体: {model: "moonshot-v1-8k", messages: [...]}  │
│    返回: {choices: [{message: {content: "回复文本"}}]}  │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ 6. UI更新模块 (MessageDisplay)                          │
│    - 添加AI回复消息到列表                                │
│    - 触发自动滚动到底部                                  │
│    - 更新页面视图                                        │
└─────────────────────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────────────────────┐
│ 7. 消息存储 (LocalStorage)                              │
│    - 保存对话记录到本地缓存                              │
│    - 支持聊天历史恢复                                    │
└─────────────────────────────────────────────────────────┘
```

### **2.3 模块职责划分**

- **录音模块：** 负责手机麦克风权限申请、录音启动/停止、音频文件生成
- **音频处理模块：** 负责Base64编码、文件校验、格式转换
- **API适配模块：** 负责百度API与Moonshot API的请求/响应处理
- **状态管理模块：** 负责全局消息列表、加载状态、错误处理
- **UI展示模块：** 负责消息气泡、输入框、滚动、动画效果
- **存储模块：** 负责对话历史、用户设置、缓存管理

---

## **第三部分：项目目录结构**

```
ai-voice-assistant/
├── src/
│   ├── components/               # 通用组件
│   │   ├── MessageBubble.vue     # 消息气泡组件
│   │   ├── RecordButton.vue      # 录音按钮组件
│   │   ├── InputBox.vue          # 输入框组件
│   │   └── Loading.vue           # 加载动画组件
│   │
│   ├── pages/                    # 页面目录
│   │   ├── index/
│   │   │   └── index.vue         # 首页
│   │   ├── chat/
│   │   │   └── chat.vue          # 聊天页面（核心）
│   │   ├── control/
│   │   │   └── control.vue       # 家电控制页面
│   │   ├── scene/
│   │   │   └── scene.vue         # 场景设置页面
│   │   └── mine/
│   │       └── mine.vue          # 我的页面
│   │
│   ├── store/                    # Vuex状态管理
│   │   └── index.js              # 全局状态
│   │
│   ├── utils/                    # 工具函数
│   │   ├── request.js            # HTTP请求工具
│   │   ├── audio.js              # 音频处理工具
│   │   ├── baidu-speech.js       # 百度语音API
│   │   ├── moonshot-api.js       # Moonshot API
│   │   ├── storage.js            # 本地存储工具
│   │   └── logger.js             # 日志工具
│   │
│   ├── assets/                   # 静态资源
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   │
│   ├── App.vue                   # 应用根组件
│   ├── main.js                   # 入口文件
│   └── manifest.json             # 应用配置
│
├── package.json                  # 依赖配置
├── uni.scss                      # 全局样式
└── README.md                     # 项目文档
```

---

## **第四部分：核心代码实现**

### **4.1 项目初始化与配置**

#### **4.1.1 package.json 依赖配置**

```json
{
  "name": "ai-voice-assistant",
  "version": "1.0.0",
  "description": "AI语音助手 - UniApp版本",
  "main": "main.js",
  "scripts": {
    "dev": "uni",
    "build": "uni build",
    "build:app": "uni build --platform app"
  },
  "dependencies": {
    "vue": "^2.7.14",
    "uni-ui": "^1.4.24"
  },
  "devDependencies": {
    "@dcloudio/uni-app": "^3.0.0-alpha",
    "@dcloudio/uni-cli": "^3.0.0-alpha",
    "@dcloudio/uni-ui": "^1.4.24"
  }
}
```

#### **4.1.2 manifest.json 应用清单**

```json
{
  "name": "AI语音助手",
  "appid": "__UNI__YOUR_APP_ID__",
  "description": "厨电场景智能家居控制助手",
  "versionName": "1.0.0",
  "versionCode": 1,
  "transformPx": false,
  "app-plus": {
    "usingComponents": true,
    "splashscreen": {
      "alwaysShowBeforeRender": true,
      "waiting": true,
      "autoclose": true,
      "delay": 0
    },
    "modules": {},
    "permissions": [
      "INTERNET",
      "RECORD_AUDIO",
      "WRITE_EXTERNAL_STORAGE",
      "READ_EXTERNAL_STORAGE",
      "MODIFY_AUDIO_SETTINGS"
    ]
  },
  "permissions": {
    "android": [
      "android.permission.INTERNET",
      "android.permission.RECORD_AUDIO",
      "android.permission.WRITE_EXTERNAL_STORAGE",
      "android.permission.READ_EXTERNAL_STORAGE",
      "android.permission.MODIFY_AUDIO_SETTINGS"
    ]
  }
}
```

### **4.2 Vuex 全局状态管理**

#### **store/index.js**

```javascript
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 消息列表
    messages: [],
    
    // 录音状态
    isRecording: false,
    recordingTime: 0,
    
    // 加载状态
    isLoading: false,
    loadingText: '',
    
    // API密钥配置
    apiConfig: {
      baiduApiKey: 'YOUR_BAIDU_API_KEY',
      baiduSecretKey: 'YOUR_BAIDU_SECRET_KEY',
      moonshotApiKey: 'YOUR_MOONSHOT_API_KEY'
    },
    
    // 对话上下文
    conversationContext: [],
    maxContextLength: 20
  },
  
  mutations: {
    // 添加消息
    ADD_MESSAGE(state, message) {
      state.messages.push({
        id: Date.now(),
        content: message.content,
        role: message.role, // 'user' 或 'assistant'
        timestamp: new Date().getTime(),
        status: message.status || 'success' // 'success', 'error', 'sending'
      })
    },
    
    // 更新消息状态
    UPDATE_MESSAGE_STATUS(state, { messageId, status }) {
      const msg = state.messages.find(m => m.id === messageId)
      if (msg) {
        msg.status = status
      }
    },
    
    // 清空消息列表
    CLEAR_MESSAGES(state) {
      state.messages = []
    },
    
    // 设置录音状态
    SET_RECORDING(state, isRecording) {
      state.isRecording = isRecording
    },
    
    // 更新录音时长
    UPDATE_RECORDING_TIME(state, time) {
      state.recordingTime = time
    },
    
    // 设置加载状态
    SET_LOADING(state, { isLoading, loadingText = '' }) {
      state.isLoading = isLoading
      state.loadingText = loadingText
    },
    
    // 更新对话上下文
    UPDATE_CONTEXT(state, { role, content }) {
      state.conversationContext.push({ role, content })
      // 只保留最近20条消息
      if (state.conversationContext.length > state.maxContextLength) {
        state.conversationContext = state.conversationContext.slice(-state.maxContextLength)
      }
    },
    
    // 清空上下文
    CLEAR_CONTEXT(state) {
      state.conversationContext = []
    }
  },
  
  actions: {
    // 发送用户消息
    sendUserMessage({ commit }, content) {
      commit('ADD_MESSAGE', {
        content: content,
        role: 'user'
      })
      commit('UPDATE_CONTEXT', {
        role: 'user',
        content: content
      })
    },
    
    // 发送AI回复
    sendAIMessage({ commit }, content) {
      commit('ADD_MESSAGE', {
        content: content,
        role: 'assistant'
      })
      commit('UPDATE_CONTEXT', {
        role: 'assistant',
        content: content
      })
    },
    
    // 设置加载状态
    setLoading({ commit }, { isLoading, loadingText }) {
      commit('SET_LOADING', { isLoading, loadingText })
    }
  },
  
  getters: {
    // 获取最后一条消息
    lastMessage: state => state.messages[state.messages.length - 1],
    
    // 获取消息总数
    messageCount: state => state.messages.length,
    
    // 获取对话上下文数组
    contextArray: state => state.conversationContext
  }
})
```

### **4.3 核心业务模块实现**

#### **4.3.1 百度语音识别工具 (utils/baidu-speech.js)**

```javascript
// 百度语音识别API工具类
class BaiduSpeechService {
  constructor(apiKey, secretKey) {
    this.apiKey = apiKey
    this.secretKey = secretKey
    this.accessToken = null
    this.tokenExpireTime = 0
  }
  
  // 获取Access Token
  async getAccessToken() {
    const now = Date.now()
    
    // Token还有效期超过5分钟则复用
    if (this.accessToken && this.tokenExpireTime - now > 300000) {
      return this.accessToken
    }
    
    try {
      const tokenUrl = `https://aip.baidubce.com/oauth/2.0/token`
      
      const response = await uni.request({
        url: tokenUrl,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          grant_type: 'client_credentials',
          client_id: this.apiKey,
          client_secret: this.secretKey
        }
      })
      
      if (response[1].statusCode === 200) {
        const data = response[1].data
        this.accessToken = data.access_token
        // Token过期时间 = 当前时间 + 有效期(秒) - 提前刷新5分钟
        this.tokenExpireTime = now + (data.expires_in * 1000) - 300000
        return this.accessToken
      } else {
        throw new Error('获取Token失败: ' + response[1].statusCode)
      }
    } catch (error) {
      console.error('获取百度Access Token失败:', error)
      throw error
    }
  }
  
  // 识别语音文件
  async recognizeAudio(audioFilePath) {
    try {
      // 第一步：获取Access Token
      const token = await this.getAccessToken()
      
      // 第二步：读取音频文件并转Base64
      const audioBase64 = await this.readAndEncodeAudio(audioFilePath)
      
      // 第三步：调用百度API
      const recognizeUrl = `https://aip.baidubce.com/rest/2.0/speech/u/v1/recognize?access_token=${token}`
      
      const response = await uni.request({
        url: recognizeUrl,
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          format: 'wav',
          rate: 16000,
          speech: audioBase64,
          len: audioBase64.length,
          channel: 1
        }
      })
      
      if (response[1].statusCode === 200) {
        const data = response[1].data
        
        if (data.err_no === 0 && data.result && data.result.length > 0) {
          return {
            success: true,
            text: data.result[0]
          }
        } else {
          return {
            success: false,
            error: data.err_msg || '识别失败'
          }
        }
      } else {
        throw new Error('API调用失败: ' + response[1].statusCode)
      }
    } catch (error) {
      console.error('语音识别失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  // 读取文件并转Base64
  async readAndEncodeAudio(filePath) {
    return new Promise((resolve, reject) => {
      uni.getFileInfo({
        filePath: filePath,
        success: (res) => {
          // 获取文件大小
          const fileSize = res.size
          
          if (fileSize > 4 * 1024 * 1024) {
            reject(new Error('音频文件过大，不超过4M'))
            return
          }
          
          // 使用plus.io读取文件
          if (typeof plus !== 'undefined') {
            plus.io.resolveLocalFileSystemURL(filePath, (entry) => {
              entry.file((file) => {
                const reader = new plus.io.FileReader()
                reader.onloadend = (event) => {
                  // 转为Base64
                  const base64Data = plus.base64.encode(event.target.result)
                  resolve(base64Data)
                }
                reader.readAsArrayBuffer(file)
              })
            }, (error) => {
              reject(new Error('文件读取失败: ' + error.message))
            })
          } else {
            reject(new Error('不支持的平台'))
          }
        },
        fail: (error) => {
          reject(new Error('文件信息获取失败: ' + error.message))
        }
      })
    })
  }
}

export default BaiduSpeechService
```

#### **4.3.2 Moonshot API对话工具 (utils/moonshot-api.js)**

```javascript
// Moonshot (Kimi) API工具类 - 完全兼容OpenAI格式
class MoonshotAPIService {
  constructor(apiKey) {
    this.apiKey = apiKey
    this.baseUrl = 'https://api.moonshot.cn/v1'
    this.model = 'moonshot-v1-8k' // 支持8k上下文
  }
  
  // 创建聊天完成请求
  async createChatCompletion(messages, options = {}) {
    try {
      const payload = {
        model: options.model || this.model,
        messages: messages,
        temperature: options.temperature || 0.7,
        top_p: options.top_p || 0.95,
        max_tokens: options.max_tokens || 1024
      }
      
      const response = await uni.request({
        url: `${this.baseUrl}/chat/completions`,
        method: 'POST',
        header: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        data: payload
      })
      
      if (response[1].statusCode === 200) {
        const data = response[1].data
        
        if (data.choices && data.choices.length > 0) {
          return {
            success: true,
            content: data.choices[0].message.content,
            usage: data.usage
          }
        } else {
          return {
            success: false,
            error: '未获取到有效回复'
          }
        }
      } else if (response[1].statusCode === 401) {
        return {
          success: false,
          error: 'API密钥无效或已过期'
        }
      } else {
        return {
          success: false,
          error: `API调用失败: ${response[1].statusCode}`
        }
      }
    } catch (error) {
      console.error('Moonshot API调用失败:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
  
  // 便利方法：发送单条消息并获取回复
  async sendMessage(userMessage, conversationContext = []) {
    // 构建消息数组（包含历史上下文）
    const messages = [
      ...conversationContext,
      {
        role: 'user',
        content: userMessage
      }
    ]
    
    return await this.createChatCompletion(messages)
  }
  
  // 系统提示词设置
  setSystemPrompt(systemPrompt) {
    this.systemPrompt = systemPrompt
  }
  
  // 获取带系统提示词的消息数组
  buildMessagesWithSystem(messages) {
    if (!this.systemPrompt) {
      return messages
    }
    
    return [
      {
        role: 'system',
        content: this.systemPrompt
      },
      ...messages
    ]
  }
}

export default MoonshotAPIService
```

#### **4.3.3 音频处理工具 (utils/audio.js)**

```javascript
// 音频处理工具类
class AudioRecorder {
  constructor() {
    this.recorder = null
    this.recordingPath = null
    this.isRecording = false
  }
  
  // 初始化录音
  init() {
    return new Promise((resolve, reject) => {
      // 检查平台支持
      if (typeof plus !== 'undefined' && plus.media) {
        this.recorder = plus.media.getMediaRecorder()
        resolve()
      } else {
        reject(new Error('平台不支持录音'))
      }
    })
  }
  
  // 开始录音
  startRecording() {
    return new Promise((resolve, reject) => {
      try {
        if (!this.recorder) {
          reject(new Error('录音器未初始化'))
          return
        }
        
        // 设置录音文件路径
        const recordDir = plus.io.convertLocalFileSystemURL(
          '_doc/audio/'
        )
        this.recordingPath = recordDir + `recording_${Date.now()}.wav`
        
        // 开始录音
        this.recorder.startRecord({
          filename: this.recordingPath,
          format: 'wav',
          channels: 1,
          samplerate: 16000,
          success: () => {
            this.isRecording = true
            console.log('开始录音:', this.recordingPath)
            resolve(this.recordingPath)
          },
          error: (error) => {
            reject(new Error('开始录音失败: ' + error))
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  }
  
  // 停止录音
  stopRecording() {
    return new Promise((resolve, reject) => {
      try {
        if (!this.recorder || !this.isRecording) {
          reject(new Error('未在录音状态'))
          return
        }
        
        this.recorder.stopRecord({
          success: () => {
            this.isRecording = false
            console.log('停止录音')
            resolve(this.recordingPath)
          },
          error: (error) => {
            reject(new Error('停止录音失败: ' + error))
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  }
  
  // 获取录音文件路径
  getRecordingPath() {
    return this.recordingPath
  }
  
  // 删除录音文件
  deleteRecording(filePath) {
    return new Promise((resolve, reject) => {
      plus.io.resolveLocalFileSystemURL(filePath, (entry) => {
        entry.remove(() => {
          resolve()
        }, (error) => {
          reject(error)
        })
      }, (error) => {
        reject(error)
      })
    })
  }
}

export default AudioRecorder
```

### **4.4 页面实现**

#### **4.4.1 聊天页面 - chat.vue（核心）**

```vue
<template>
  <view class="chat-container">
    <!-- 顶部导航栏 -->
    <view class="header">
      <text class="header-title">AI语音助手</text>
      <text class="header-subtitle">厨电智能控制</text>
    </view>
    
    <!-- 消息展示区 -->
    <scroll-view 
      class="message-list"
      scroll-y
      :scroll-top="scrollTop"
      @scroll="onScroll"
    >
      <!-- 欢迎消息 -->
      <view v-if="messages.length === 0" class="welcome-box">
        <text class="welcome-icon">🤖</text>
        <text class="welcome-text">你好，我是AI语音助手</text>
        <text class="welcome-subtitle">点击下方麦克风开始交互</text>
      </view>
      
      <!-- 消息气泡列表 -->
      <view v-for="msg in messages" :key="msg.id" class="message-item">
        <message-bubble
          :content="msg.content"
          :role="msg.role"
          :status="msg.status"
          :timestamp="msg.timestamp"
        />
      </view>
      
      <!-- 加载指示器 -->
      <view v-if="isLoading" class="loading-box">
        <loading :text="loadingText" />
      </view>
    </scroll-view>
    
    <!-- 输入区域 -->
    <view class="input-area">
      <!-- 文本输入框 -->
      <input-box
        :value="inputText"
        @input="onInputChange"
        @send="sendTextMessage"
        :disabled="isRecording || isLoading"
      />
      
      <!-- 录音按钮 -->
      <record-button
        :isRecording="isRecording"
        :recordingTime="recordingTime"
        @start="startRecording"
        @stop="stopRecording"
        @cancel="cancelRecording"
      />
    </view>
  </view>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import MessageBubble from '@/components/MessageBubble.vue'
import RecordButton from '@/components/RecordButton.vue'
import InputBox from '@/components/InputBox.vue'
import Loading from '@/components/Loading.vue'
import AudioRecorder from '@/utils/audio'
import BaiduSpeechService from '@/utils/baidu-speech'
import MoonshotAPIService from '@/utils/moonshot-api'

export default {
  name: 'ChatPage',
  components: {
    MessageBubble,
    RecordButton,
    InputBox,
    Loading
  },
  data() {
    return {
      inputText: '',
      scrollTop: 0,
      recordingTimer: null,
      recordingInterval: null,
      
      // 业务实例
      audioRecorder: null,
      baiduService: null,
      moonshotService: null
    }
  },
  computed: {
    ...mapState([
      'messages',
      'isRecording',
      'recordingTime',
      'isLoading',
      'loadingText',
      'apiConfig',
      'conversationContext'
    ])
  },
  methods: {
    ...mapActions([
      'sendUserMessage',
      'sendAIMessage',
      'setLoading'
    ]),
    ...mapMutations([
      'SET_RECORDING',
      'UPDATE_RECORDING_TIME',
      'ADD_MESSAGE',
      'SET_LOADING'
    ]),
    
    // 初始化页面
    async initPage() {
      try {
        // 初始化音频录制器
        this.audioRecorder = new AudioRecorder()
        await this.audioRecorder.init()
        
        // 初始化百度语音服务
        this.baiduService = new BaiduSpeechService(
          this.apiConfig.baiduApiKey,
          this.apiConfig.baiduSecretKey
        )
        
        // 初始化Moonshot服务
        this.moonshotService = new MoonshotAPIService(
          this.apiConfig.moonshotApiKey
        )
        
        // 设置系统提示词
        this.moonshotService.setSystemPrompt(
          `你是一个专业的厨电智能助手。
           你需要帮助用户控制和管理厨房电器。
           保持对话简洁、友好、有帮助。
           如果用户问题与厨电无关，请礼貌地引导回厨电话题。`
        )
        
        console.log('聊天页面初始化完成')
      } catch (error) {
        console.error('页面初始化失败:', error)
        uni.showToast({
          title: '初始化失败，请重新进入页面',
          icon: 'none'
        })
      }
    },
    
    // 开始录音
    async startRecording() {
      try {
        this.SET_RECORDING(true)
        await this.audioRecorder.startRecording()
        
        // 启动计时器
        let seconds = 0
        this.recordingInterval = setInterval(() => {
          seconds++
          this.UPDATE_RECORDING_TIME(seconds)
          
          // 限制最长录音时间为60秒
          if (seconds >= 60) {
            this.stopRecording()
          }
        }, 1000)
      } catch (error) {
        console.error('启动录音失败:', error)
        this.SET_RECORDING(false)
        uni.showToast({
          title: error.message,
          icon: 'none'
        })
      }
    },
    
    // 停止录音并处理
    async stopRecording() {
      try {
        if (this.recordingInterval) {
          clearInterval(this.recordingInterval)
          this.recordingInterval = null
        }
        
        const recordingPath = await this.audioRecorder.stopRecording()
        this.SET_RECORDING(false)
        this.UPDATE_RECORDING_TIME(0)
        
        // 处理音频
        await this.processAudio(recordingPath)
      } catch (error) {
        console.error('停止录音失败:', error)
        this.SET_RECORDING(false)
        uni.showToast({
          title: error.message,
          icon: 'none'
        })
      }
    },
    
    // 取消录音
    cancelRecording() {
      if (this.recordingInterval) {
        clearInterval(this.recordingInterval)
        this.recordingInterval = null
      }
      
      this.SET_RECORDING(false)
      this.UPDATE_RECORDING_TIME(0)
      
      // 删除未处理的录音文件
      if (this.audioRecorder && this.audioRecorder.recordingPath) {
        this.audioRecorder.deleteRecording(
          this.audioRecorder.recordingPath
        ).catch(err => console.error(err))
      }
    },
    
    // 处理音频文件
    async processAudio(audioPath) {
      try {
        this.SET_LOADING({
          isLoading: true,
          loadingText: '正在识别语音...'
        })
        
        // 步骤1：调用百度语音识别API
        const speechResult = await this.baiduService.recognizeAudio(audioPath)
        
        if (!speechResult.success) {
          throw new Error('语音识别失败: ' + speechResult.error)
        }
        
        const recognizedText = speechResult.text
        console.log('识别结果:', recognizedText)
        
        // 步骤2：添加用户消息到界面和上下文
        this.sendUserMessage(recognizedText)
        this.scrollToBottom()
        
        // 步骤3：调用Moonshot API获取AI回复
        this.SET_LOADING({
          isLoading: true,
          loadingText: 'AI思考中...'
        })
        
        const aiResult = await this.moonshotService.sendMessage(
          recognizedText,
          this.conversationContext.slice(-18) // 只传前面的消息，这个是最新的用户消息
        )
        
        if (!aiResult.success) {
          throw new Error('获取AI回复失败: ' + aiResult.error)
        }
        
        // 步骤4：添加AI回复到界面
        this.sendAIMessage(aiResult.content)
        this.scrollToBottom()
        
        this.SET_LOADING({
          isLoading: false,
          loadingText: ''
        })
      } catch (error) {
        console.error('音频处理失败:', error)
        
        this.SET_LOADING({
          isLoading: false,
          loadingText: ''
        })
        
        // 显示错误消息
        this.ADD_MESSAGE({
          content: `出错: ${error.message}`,
          role: 'assistant',
          status: 'error'
        })
        
        uni.showToast({
          title: error.message,
          icon: 'none'
        })
      } finally {
        // 删除临时录音文件
        if (this.audioRecorder && audioPath) {
          this.audioRecorder.deleteRecording(audioPath).catch(
            err => console.warn('删除临时文件失败:', err)
          )
        }
      }
    },
    
    // 文本消息发送
    async sendTextMessage() {
      if (!this.inputText.trim()) {
        return
      }
      
      try {
        const userText = this.inputText.trim()
        this.inputText = ''
        
        // 添加用户消息
        this.sendUserMessage(userText)
        this.scrollToBottom()
        
        // 调用AI获取回复
        this.SET_LOADING({
          isLoading: true,
          loadingText: 'AI思考中...'
        })
        
        const aiResult = await this.moonshotService.sendMessage(
          userText,
          this.conversationContext.slice(-18)
        )
        
        if (!aiResult.success) {
          throw new Error(aiResult.error)
        }
        
        this.sendAIMessage(aiResult.content)
        this.scrollToBottom()
        
        this.SET_LOADING({
          isLoading: false,
          loadingText: ''
        })
      } catch (error) {
        console.error('发送消息失败:', error)
        this.SET_LOADING({
          isLoading: false,
          loadingText: ''
        })
        
        this.ADD_MESSAGE({
          content: `出错: ${error.message}`,
          role: 'assistant',
          status: 'error'
        })
      }
    },
    
    // 文本输入变化
    onInputChange(value) {
      this.inputText = value
    },
    
    // 滚动事件
    onScroll(event) {
      // 可以在这里处理滚动相关逻辑
    },
    
    // 滚动到底部
    scrollToBottom() {
      this.$nextTick(() => {
        this.scrollTop = 99999
      })
    }
  },
  
  onLoad() {
    this.initPage()
  },
  
  onUnload() {
    // 清理资源
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval)
    }
  }
}
</script>

<style scoped lang="scss">
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  padding: 20px 15px;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  text-align: center;
}

.header-title {
  font-size: 22px;
  font-weight: bold;
  display: block;
}

.header-subtitle {
  font-size: 12px;
  opacity: 0.8;
  display: block;
  margin-top: 5px;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
}

.welcome-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: white;
  text-align: center;
}

.welcome-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.welcome-text {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.welcome-subtitle {
  font-size: 14px;
  opacity: 0.7;
}

.message-item {
  margin-bottom: 15px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loading-box {
  display: flex;
  justify-content: center;
  padding: 20px;
  margin-top: 20px;
}

.input-area {
  display: flex;
  gap: 10px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
```

#### **4.4.2 消息气泡组件 - MessageBubble.vue**

```vue
<template>
  <view class="message-wrapper" :class="{ 'user-message': role === 'user' }">
    <!-- AI消息气泡 -->
    <view v-if="role === 'assistant'" class="bubble assistant-bubble">
      <text class="bubble-content">{{ content }}</text>
      <text v-if="status === 'error'" class="error-indicator">⚠️</text>
      <view class="timestamp">{{ formatTime(timestamp) }}</view>
    </view>
    
    <!-- 用户消息气泡 -->
    <view v-else class="bubble user-bubble">
      <text class="bubble-content">{{ content }}</text>
      <view class="timestamp">{{ formatTime(timestamp) }}</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'MessageBubble',
  props: {
    content: {
      type: String,
      required: true
    },
    role: {
      type: String,
      default: 'assistant',
      validator: value => ['user', 'assistant'].includes(value)
    },
    status: {
      type: String,
      default: 'success'
    },
    timestamp: {
      type: Number,
      default: () => Date.now()
    }
  },
  methods: {
    formatTime(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped lang="scss">
.message-wrapper {
  display: flex;
  margin-bottom: 10px;
  justify-content: flex-start;
  
  &.user-message {
    justify-content: flex-end;
  }
}

.bubble {
  max-width: 75%;
  padding: 12px 15px;
  border-radius: 18px;
  word-wrap: break-word;
  position: relative;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.assistant-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-left-radius: 4px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.user-bubble {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  border-bottom-right-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.bubble-content {
  display: block;
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 5px;
}

.error-indicator {
  margin-left: 5px;
}

.timestamp {
  font-size: 11px;
  opacity: 0.6;
  text-align: right;
  margin-top: 5px;
}
</style>
```

#### **4.4.3 录音按钮组件 - RecordButton.vue**

```vue
<template>
  <view class="record-button-container">
    <view 
      class="record-button"
      :class="{ 
        'recording': isRecording,
        'pulse': isRecording
      }"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
      @touchmove="handleTouchMove"
    >
      <text v-if="!isRecording" class="icon">🎤</text>
      <text v-else class="icon rotating">⏸</text>
      <text v-if="isRecording" class="recording-time">{{ recordingTime }}s</text>
    </view>
    
    <!-- 录音提示 -->
    <view v-if="isRecording" class="recording-tip">
      <text>松开停止录音</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'RecordButton',
  props: {
    isRecording: {
      type: Boolean,
      default: false
    },
    recordingTime: {
      type: Number,
      default: 0
    }
  },
  emits: ['start', 'stop', 'cancel'],
  data() {
    return {
      touchStartY: 0,
      touchStartX: 0
    }
  },
  methods: {
    handleTouchStart(event) {
      if (!this.isRecording) {
        this.touchStartY = event.touches[0].clientY
        this.touchStartX = event.touches[0].clientX
        this.$emit('start')
      }
    },
    handleTouchEnd(event) {
      if (this.isRecording) {
        const currentY = event.changedTouches[0].clientY
        const currentX = event.changedTouches[0].clientX
        const moveDistance = this.touchStartY - currentY
        const horizontalDistance = Math.abs(this.touchStartX - currentX)
        
        // 向上滑动超过50px或正常松开
        if (moveDistance > 50 || horizontalDistance < 20) {
          this.$emit('stop')
        } else {
          // 横向滑动超过50px则取消
          this.$emit('cancel')
        }
      }
    },
    handleTouchMove(event) {
      // 可以在这里更新UI提示移动状态
    }
  }
}
</script>

<style scoped lang="scss">
.record-button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.record-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  
  &:active {
    transform: scale(0.95);
  }
  
  &.recording {
    background: linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%);
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.5);
  }
  
  &.pulse {
    animation: pulse 1s infinite;
  }
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.5);
  }
  50% {
    box-shadow: 0 4px 25px rgba(255, 107, 107, 0.8);
  }
}

.icon {
  font-size: 28px;
  display: block;
  
  &.rotating {
    animation: rotate 1s linear infinite;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.recording-time {
  position: absolute;
  font-size: 12px;
  color: white;
  bottom: -20px;
  font-weight: bold;
}

.recording-tip {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}
</style>
```

#### **4.4.4 输入框组件 - InputBox.vue**

```vue
<template>
  <view class="input-box">
    <input
      v-model="inputValue"
      class="text-input"
      type="text"
      placeholder="输入文字或按住录音..."
      :disabled="disabled"
      @input="emitInput"
      @confirm="handleSend"
    />
    <button 
      class="send-button"
      :disabled="!inputValue.trim() || disabled"
      @click="handleSend"
    >
      <text>发送</text>
    </button>
  </view>
</template>

<script>
export default {
  name: 'InputBox',
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['input', 'send'],
  data() {
    return {
      inputValue: ''
    }
  },
  watch: {
    value(newVal) {
      this.inputValue = newVal
    }
  },
  methods: {
    emitInput() {
      this.$emit('input', this.inputValue)
    },
    handleSend() {
      if (this.inputValue.trim() && !this.disabled) {
        this.$emit('send')
      }
    }
  },
  mounted() {
    this.inputValue = this.value
  }
}
</script>

<style scoped lang="scss">
.input-box {
  display: flex;
  gap: 8px;
  align-items: center;
}

.text-input {
  flex: 1;
  padding: 10px 15px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  font-size: 14px;
  outline: none;
  
  &:focus {
    border-color: rgba(255, 255, 255, 0.6);
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.send-button {
  padding: 10px 20px;
  border-radius: 20px;
  background: white;
  color: #667eea;
  border: none;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:active:not(:disabled) {
    transform: scale(0.95);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
```

#### **4.4.5 加载组件 - Loading.vue**

```vue
<template>
  <view class="loading-container">
    <view class="spinner">
      <view class="dot dot-1"></view>
      <view class="dot dot-2"></view>
      <view class="dot dot-3"></view>
    </view>
    <text class="loading-text">{{ text }}</text>
  </view>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    text: {
      type: String,
      default: '加载中...'
    }
  }
}
</script>

<style scoped lang="scss">
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.spinner {
  display: flex;
  gap: 8px;
  align-items: center;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: white;
  animation: bounce 1.4s infinite ease-in-out both;
  
  &.dot-1 {
    animation-delay: -0.32s;
  }
  
  &.dot-2 {
    animation-delay: -0.16s;
  }
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-text {
  color: white;
  font-size: 14px;
  opacity: 0.8;
}
</style>
```

### **4.5 其他页面简介**

#### **4.5.1 首页 - pages/index/index.vue**

```vue
<template>
  <view class="home-container">
    <view class="header">
      <text class="title">智能厨电助手</text>
    </view>
    
    <scroll-view scroll-y class="content">
      <!-- 快速操作卡片 -->
      <view class="card-grid">
        <view 
          v-for="item in quickActions"
          :key="item.id"
          class="action-card"
          @click="navigateTo(item.path)"
        >
          <text class="card-icon">{{ item.icon }}</text>
          <text class="card-title">{{ item.title }}</text>
          <text class="card-desc">{{ item.desc }}</text>
        </view>
      </view>
      
      <!-- 功能介绍 -->
      <view class="features-section">
        <text class="section-title">功能特性</text>
        <view v-for="feature in features" :key="feature.id" class="feature-item">
          <text class="feature-icon">{{ feature.icon }}</text>
          <text class="feature-text">{{ feature.text }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      quickActions: [
        {
          id: 1,
          title: '语音聊天',
          desc: '与AI交互',
          icon: '💬',
          path: '/pages/chat/chat'
        },
        {
          id: 2,
          title: '家电控制',
          desc: '智能管理',
          icon: '🏠',
          path: '/pages/control/control'
        },
        {
          id: 3,
          title: '智能场景',
          desc: '一键启动',
          icon: '🎯',
          path: '/pages/scene/scene'
        },
        {
          id: 4,
          title: '我的设置',
          desc: '个人中心',
          icon: '⚙️',
          path: '/pages/mine/mine'
        }
      ],
      features: [
        { id: 1, icon: '🎤', text: '实时语音识别 - 支持中文和方言' },
        { id: 2, icon: '🤖', text: 'AI智能对话 - Moonshot大模型驱动' },
        { id: 3, icon: '⚡', text: '快速响应 - 低延迟语音处理' },
        { id: 4, icon: '🔐', text: '数据安全 - 本地加密存储' }
      ]
    }
  },
  methods: {
    navigateTo(path) {
      uni.navigateTo({
        url: path
      })
    }
  }
}
</script>

<style scoped lang="scss">
.home-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.header {
  padding: 40px 20px 30px;
  text-align: center;
  color: white;
}

.title {
  font-size: 28px;
  font-weight: bold;
}

.content {
  height: calc(100vh - 120px);
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  padding: 20px;
}

.action-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  
  &:active {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
}

.card-icon {
  font-size: 32px;
}

.card-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.card-desc {
  font-size: 12px;
  color: #999;
}

.features-section {
  padding: 20px;
  margin-top: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: white;
  margin-bottom: 15px;
  display: block;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: white;
  backdrop-filter: blur(10px);
}

.feature-icon {
  font-size: 18px;
}

.feature-text {
  font-size: 14px;
}
</style>
```

---

## **第五部分：部署与打包**

### **5.1 HBuilderX云打包流程（推荐）**

**优势：** 无需本地配置Android SDK，直接使用DCloud云端打包服务

**步骤：**

**第1步：获取DCloud AppID**
```
1. 登录DCloud开发者中心：https://dev.dcloud.net.cn
2. 创建应用，获取AppID
3. 在manifest.json中填写AppID
```

**第2步：配置打包参数**
```
1. 打开HBuilderX项目
2. 点击菜单 → 发行 → 原生App-云打包
3. 选择Android平台
4. 填写应用基本信息：
   - 应用名称：AI语音助手
   - 包名：com.yourcompany.aivoiceassistant
   - 版本号：1.0.0
   - 签名证书（可在线生成）
```

**第3步：构建APK**
```
1. 点击"打包"按钮
2. 等待云端编译完成（通常需要2-5分钟）
3. 下载生成的APK文件
```


---

## **第六部分：API密钥配置**

### **6.1 百度语音API密钥获取**

```
1. 访问百度AI开放平台：https://ai.baidu.com
2. 注册账户并登录
3. 创建应用获取API Key和Secret Key
4. 在state/index.js中配置：

apiConfig: {
  baiduApiKey: 'YOUR_BAIDU_API_KEY',
  baiduSecretKey: 'YOUR_BAIDU_SECRET_KEY'
}
```

### **6.2 Moonshot API密钥获取**

```
1. 访问Moonshot开放平台：https://platform.moonshot.cn
2. 注册账户并登录
3. 在控制台创建API密钥
4. 在state/index.js中配置：

apiConfig: {
  moonshotApiKey: 'YOUR_MOONSHOT_API_KEY'
}
```

### **6.3 环境变量配置（生产环境推荐）**

创建 `.env.production` 文件：

```
VUE_APP_BAIDU_API_KEY=your_baidu_api_key
VUE_APP_BAIDU_SECRET_KEY=your_baidu_secret_key
VUE_APP_MOONSHOT_API_KEY=your_moonshot_api_key
```

在main.js中使用：

```javascript
store.state.apiConfig = {
  baiduApiKey: process.env.VUE_APP_BAIDU_API_KEY,
  baiduSecretKey: process.env.VUE_APP_BAIDU_SECRET_KEY,
  moonshotApiKey: process.env.VUE_APP_MOONSHOT_API_KEY
}
```

---

## **第七部分：性能优化与最佳实践**

### **7.1 性能优化**

**组件懒加载：**
```javascript
// 使用动态import
const ChatPage = () => import('@/pages/chat/chat.vue')
const ControlPage = () => import('@/pages/control/control.vue')
```

**消息列表虚拟滚动：** 当消息数超过100条时，使用虚拟滚动优化

**API请求超时控制：**
```javascript
// 设置请求超时
uni.request({
  url: apiUrl,
  timeout: 10000, // 10秒超时
  // ...
})
```

**内存管理：**
```javascript
// 定期清理旧消息
if (this.messages.length > 500) {
  this.messages = this.messages.slice(-500)
}
```

### **7.2 错误处理最佳实践**

```javascript
// 统一错误处理
try {
  const result = await apiCall()
  if (!result.success) {
    throw new Error(result.error)
  }
} catch (error) {
  console.error('业务错误:', error)
  uni.showToast({
    title: '操作失败: ' + error.message,
    icon: 'none'
  })
}
```

### **7.3 安全建议**

- **不在代码中硬编码API密钥** - 使用环境变量
- **使用HTTPS加密通信** - 所有API调用都使用https
- **验证用户权限** - 在录音前检查权限
- **清理敏感数据** - 删除临时音频文件
- **速率限制** - 防止API滥用

---

## **第八部分：故障排查**

### **8.1 常见问题**

| 问题 | 解决方案 |
|-----|--------|
| 录音按钮无反应 | 检查Android权限配置、重启应用 |
| 识别结果为空 | 验证百度API密钥、检查网络连接 |
| AI回复超时 | 检查Moonshot API密钥、增加超时时间 |
| APK安装失败 | 检查签名证书、清空旧版本 |
| 内存占用过高 | 减少保留消息数、释放临时资源 |

### **8.2 调试技巧**

```javascript
// 开启详细日志
// logger.js
class Logger {
  log(tag, message) {
    console.log(`[${tag}] ${message}`)
  }
  
  error(tag, error) {
    console.error(`[${tag}] ${error}`)
  }
}

export default new Logger()
```

---

## **第九部分：总结与展望**

### **10.1 项目完成度**

✅ **已实现功能：**
- 完整的5页面应用架构
- 语音录入与转文字
- AI智能对话
- 消息展示与滚动
- APK打包部署

✅ **技术特点：**
- 轻量级框架选择
- 快速开发迭代
- 跨平台兼容性
- 生产级代码质量

### **10.2 后续优化方向**

- 🚀 添加语音合成（文字转语音）
- 🎯 集成更多家电协议（WiFi、Zigbee）
- 📊 数据分析与用户行为追踪
- 🔔 推送通知功能
- 🌍 多语言支持

### **10.3 技术栈升级建议**

- 考虑使用 **Vue 3 + TypeScript** 提升代码质量
- 集成 **TensorFlow.js** 进行本地语音处理
- 使用 **WebSocket** 实现实时通信
- 引入 **GraphQL** 优化API查询

---

## **附录：完整文件清单**

```
✓ manifest.json - 应用配置
✓ main.js - 入口文件
✓ App.vue - 根组件
✓ package.json - 依赖配置
✓ store/index.js - 状态管理
✓ utils/audio.js - 音频处理
✓ utils/baidu-speech.js - 百度API
✓ utils/moonshot-api.js - Moonshot API
✓ components/MessageBubble.vue - 消息组件
✓ components/RecordButton.vue - 录音组件
✓ components/InputBox.vue - 输入组件
✓ components/Loading.vue - 加载组件
✓ pages/index/index.vue - 首页
✓ pages/chat/chat.vue - 聊天页
✓ pages/control/control.vue - 控制页
✓ pages/scene/scene.vue - 场景页
✓ pages/mine/mine.vue - 我的页
```

---

**文档完成！** 这份PRD包含了从项目规划、技术架构、代码实现到部署发布的全套内容。

