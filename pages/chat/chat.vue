<template>
	<view class="container chat-container">
		<scroll-view class="msg-list" scroll-y="true" :scroll-top="scrollTop" :scroll-into-view="scrollIntoView">
			<view class="msg-item" v-for="(msg, index) in messages" :key="index" :id="'msg-'+index">
				<view class="msg-content" :class="msg.role === 'user' ? 'user-msg' : 'ai-msg'">
					<view class="avatar">
						<text>{{msg.role === 'user' ? '👤' : '🤖'}}</text>
					</view>
					<view class="bubble">
						<text>{{msg.content}}</text>
					</view>
				</view>
			</view>
			<!-- Loading Indicator -->
			<view class="msg-item" v-if="isProcessing">
				<view class="msg-content ai-msg">
					<view class="avatar"><text>🤖</text></view>
					<view class="bubble processing">
						<text>正在思考...</text>
					</view>
				</view>
			</view>
			<view style="height: 100px;"></view> <!-- Spacer for bottom bar -->
		</scroll-view>
		
		<view class="bottom-bar">
			<view class="record-btn" 
				:class="{recording: isRecording}"
				@touchstart="startRecord" 
				@touchend="stopRecord"
				@mousedown="startRecord"
				@mouseup="stopRecord">
				<text class="mic-icon">🎤</text>
				<text>{{statusText}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { getBaiduToken, recognizeSpeech, chatWithAI } from '../../common/api.js';
	import config from '../../common/config.js';

	const recorderManager = uni.getRecorderManager();
	
	export default {
		data() {
			return {
				messages: [
					{ role: 'assistant', content: '你好！我是你的厨电智能助手，请问有什么可以帮你？' }
				],
				isRecording: false,
				isProcessing: false,
				scrollTop: 0,
				scrollIntoView: '',
				statusText: '按住说话',
				baiduToken: ''
			}
		},
		onLoad() {
			this.initBaiduToken();
			this.setupRecorder();
		},
		methods: {
			initBaiduToken() {
				// 获取Baidu Token (实际开发建议在App启动时获取并缓存)
				// 这里为了Demo演示，每次加载页面检查一下
				console.log('检查API Key配置:', {
					baiduKey: config.baidu.apiKey ? '已配置' : '未配置',
					moonshotKey: config.moonshot.apiKey ? '已配置' : '未配置'
				});

				if(config.baidu.apiKey === 'YOUR_BAIDU_API_KEY') {
					this.appendSystemMsg("请在 common/config.js 中配置百度API Key");
					return;
				}

				getBaiduToken().then(token => {
					this.baiduToken = token;
					console.log('百度Token获取成功');
					this.appendSystemMsg("语音服务已就绪");
				}).catch(err => {
					console.error('Token获取失败:', err);
					this.appendSystemMsg("百度语音Token获取失败，请检查网络或Key配置");
				});
			},

			setupRecorder() {
				recorderManager.onStart(() => {
					console.log('录音开始');
					this.isRecording = true;
					this.statusText = '松开结束';
				});

				recorderManager.onStop((res) => {
					console.log('录音停止，文件路径:', res.tempFilePath);
					console.log('录音时长:', res.duration + 'ms');
					console.log('文件大小:', res.fileSize + 'bytes');
					this.isRecording = false;
					this.statusText = '按住说话';
					this.handleRecording(res.tempFilePath);
				});

				recorderManager.onError((err) => {
					console.error('录音错误:', err);
					this.isRecording = false;
					this.statusText = '按住说话';
					this.appendSystemMsg("录音失败: " + (err.errMsg || JSON.stringify(err)));
				});
			},

			startRecord(e) {
				console.log('开始录音按钮被点击');
				e && e.preventDefault && e.preventDefault();

				// 检查录音权限
				uni.getRecorderManager().start({
					duration: 60000,
					format: 'mp3', // 改为mp3格式，兼容性更好
					numberOfChannels: 1,
					sampleRate: 16000,
					encodeBitRate: 48000
				});
				console.log('录音请求已发送');
			},

			stopRecord(e) {
				console.log('停止录音按钮被点击');
				e && e.preventDefault && e.preventDefault();
				uni.getRecorderManager().stop();
				console.log('停止录音请求已发送');
			},
			
			handleRecording(tempFilePath) {
				if (!this.baiduToken) {
					this.appendSystemMsg("语音服务未就绪，请等待Token加载");
					console.error('百度Token未获取');
					return;
				}

				this.isProcessing = true;
				this.appendSystemMsg("正在识别语音...");

				// Read file as Base64
				const fsm = uni.getFileSystemManager();
				console.log('开始读取录音文件:', tempFilePath);

				fsm.readFile({
					filePath: tempFilePath,
					encoding: 'base64',
					success: (res) => {
						console.log('录音文件读取成功，大小:', res.data.length);
						this.processSpeech(res.data);
					},
					fail: (err) => {
						console.error('读取录音文件失败:', err);
						this.isProcessing = false;
						this.appendSystemMsg("读取录音文件失败: " + JSON.stringify(err));
					}
				});
			},
			
			processSpeech(base64Data) {
				console.log('开始语音识别，数据长度:', base64Data.length);

				recognizeSpeech(base64Data, this.baiduToken).then(res => {
					console.log('语音识别结果:', res);
					// result is usually an array of strings
					const text = res; // recognizeSpeech wrapper should return the string
					if(text) {
						// 移除"正在识别语音..."的提示消息
						this.messages = this.messages.filter(m => !m.content.includes('正在识别语音'));
						this.addMessage('user', text);
						this.callLLM();
					} else {
						this.appendSystemMsg("未识别到语音，请重试");
						this.isProcessing = false;
					}
				}).catch(err => {
					console.error('语音识别失败:', err);
					this.isProcessing = false;
					this.appendSystemMsg("语音识别失败: " + JSON.stringify(err));
				});
			},
			
			callLLM() {
				// Filter messages for context window if needed, here we send all
				// Moonshot format: {role, content}
				// Remove system/error messages if any (optional)
				const history = this.messages.filter(m => m.role === 'user' || m.role === 'assistant');
				
				if(config.moonshot.apiKey === 'YOUR_MOONSHOT_API_KEY') {
					this.isProcessing = false;
					this.appendSystemMsg("请配置Moonshot API Key以启用AI对话");
					return;
				}

				chatWithAI(history).then(reply => {
					this.isProcessing = false;
					this.addMessage('assistant', reply);
				}).catch(err => {
					console.error('LLM Error', err);
					this.isProcessing = false;
					this.appendSystemMsg("AI思考出了点问题");
				});
			},
			
			addMessage(role, content) {
				this.messages.push({ role, content });
				this.scrollToBottom();
			},
			
			appendSystemMsg(content) {
				// Special styling or just assistant msg
				this.messages.push({ role: 'system', content: `[系统提示] ${content}` });
				this.scrollToBottom();
			},
			
			scrollToBottom() {
				setTimeout(() => {
					this.scrollTop = 99999;
					this.scrollIntoView = 'msg-' + (this.messages.length - 1);
				}, 100);
			}
		}
	}
</script>

<style>
	.chat-container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #f5f5f5;
		padding: 0;
	}
	
	.msg-list {
		flex: 1;
		padding: 15px;
		box-sizing: border-box;
	}
	
	.msg-item {
		margin-bottom: 20px;
	}
	
	.msg-content {
		display: flex;
		align-items: flex-start;
	}
	
	.user-msg {
		flex-direction: row-reverse;
	}
	
	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 20px;
		background: #ddd;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 20px;
		flex-shrink: 0;
	}
	
	.user-msg .avatar {
		margin-left: 10px;
		background: #007aff;
	}
	
	.ai-msg .avatar {
		margin-right: 10px;
		background: white;
	}
	
	.bubble {
		max-width: 70%;
		padding: 10px 15px;
		border-radius: 12px;
		font-size: 16px;
		line-height: 1.5;
		word-break: break-all;
	}
	
	.user-msg .bubble {
		background: #007aff;
		color: white;
		border-top-right-radius: 2px;
	}
	
	.ai-msg .bubble {
		background: white;
		color: #333;
		border-top-left-radius: 2px;
		box-shadow: 0 1px 3px rgba(0,0,0,0.1);
	}
	
	.processing {
		color: #888;
		font-style: italic;
	}
	
	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 80px; /* height + padding */
		background: white;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
		/* #ifdef H5 */
		bottom: 50px; /* Adjust for TabBar in H5 preview if needed */
		/* #endif */
	}
	
	.record-btn {
		width: 80%;
		height: 50px;
		background: #007aff;
		color: white;
		border-radius: 25px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 18px;
		font-weight: bold;
		transition: all 0.2s;
	}
	
	.record-btn.recording {
		background: #ff3b30;
		transform: scale(0.95);
	}
	
	.mic-icon {
		margin-right: 10px;
	}
</style>
