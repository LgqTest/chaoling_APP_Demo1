<template>
	<view class="container chat-container">
		<scroll-view class="msg-list" scroll-y="true" :scroll-top="scrollTop" :scroll-into-view="scrollIntoView">
			<view class="msg-item" v-for="(msg, index) in messages" :key="index" :id="'msg-'+index">
				<view class="msg-content" :class="msg.role === 'user' ? 'user-msg' : 'ai-msg'">
					<view class="avatar">
						<text>{{msg.role === 'user' ? '👤' : '🤖'}}</text>
					</view>
					<view class="bubble">
						<!-- AI消息使用rich-text渲染Markdown -->
						<rich-text v-if="msg.role === 'assistant'" :nodes="msg.htmlContent || msg.content"></rich-text>
						<!-- 用户消息和系统消息显示纯文本 -->
						<text v-else>{{msg.content}}</text>
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
			<view style="height: 70px;"></view> <!-- Spacer for bottom bar -->
		</scroll-view>

		<view class="bottom-bar">
			<view class="record-btn"
				:class="{recording: isRecording}"
				@touchstart="startRecord"
				@touchend="stopRecord"
				@mousedown="startRecord"
				@mouseup="stopRecord">
				<text class="mic-icon">🎤</text>
			</view>
			<view class="input-container">
				<input
					class="text-input"
					type="text"
					v-model="inputText"
					placeholder="输入消息..."
					@confirm="sendTextMessage"
					confirm-type="send"
				/>
				<button class="send-btn" @click="sendTextMessage" :disabled="!inputText.trim()">发送</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { getBaiduToken, recognizeSpeech, chatWithAI } from '../../common/api.js';
	import { markdownToHtml } from '../../common/markdown.js';
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
				baiduToken: '',
				usePlusRecorder: false,
				plusRecorder: null,
				recordStartTime: 0,
				minRecordMs: 800,
				minFileBytes: 8000,
				lastTouchAt: 0,
				inputText: ''  // 文本输入框内容
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
				this.setupPlusRecorder();
				recorderManager.onStart(() => {
					console.log('录音开始');
					this.isRecording = true;
					this.statusText = '松开结束';
					this.recordStartTime = Date.now();
				});

				recorderManager.onStop((res) => {
					console.log('录音停止，文件路径:', res.tempFilePath);
					console.log('录音时长:', (res.duration || '未知') + 'ms');
					console.log('文件大小:', (res.fileSize || '未知') + 'bytes');
					this.isRecording = false;
					this.statusText = '按住说话';

					// 检查返回的数据
					console.log('完整的录音结果:', JSON.stringify(res));

					// 检查录音时长
					const durationMs = res.duration || (Date.now() - this.recordStartTime);
					if (durationMs < 1000) {
						console.warn('录音时长太短:', durationMs + 'ms');
						this.appendSystemMsg(`录音时长太短(${Math.round(durationMs/1000)}秒)，请至少说话2-3秒`);
						return;
					}

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

				const now = Date.now();
				const type = e && e.type ? e.type : '';
				const isTouch = type.indexOf('touch') === 0;
				const isMouse = type.indexOf('mouse') === 0;
				if (isTouch) this.lastTouchAt = now;
				if (isMouse && now - this.lastTouchAt < 500) {
					console.log('忽略鼠标事件（触摸后）');
					return;
				}

				if (this.isRecording) {
					console.log('正在录音中，忽略start事件');
					return;
				}

				if (this.usePlusRecorder && this.plusRecorder) {
					this.startPlusRecord();
					return;
				}

				this.startUniRecord();
			},

			stopRecord(e) {
				console.log('停止录音按钮被点击');
				e && e.preventDefault && e.preventDefault();

				const now = Date.now();
				const type = e && e.type ? e.type : '';
				const isMouse = type.indexOf('mouse') === 0;
				if (isMouse && now - this.lastTouchAt < 500) {
					console.log('忽略鼠标事件（触摸后）');
					return;
				}

				if (!this.isRecording) {
					console.log('未在录音中，忽略stop事件');
					return;
				}

				if (this.usePlusRecorder && this.plusRecorder) {
					this.stopPlusRecord();
					return;
				}

				this.stopUniRecord();
			},

			startUniRecord() {
				console.log('使用uni录音器(WAV)');
				this.isRecording = true;
				this.statusText = '松开结束';
				this.recordStartTime = Date.now();
				uni.getRecorderManager().start({
					duration: 60000,
					format: 'wav',
					numberOfChannels: 1,
					sampleRate: 16000
				});
				console.log('uni录音请求已发送');
			},

			stopUniRecord() {
				uni.getRecorderManager().stop();
				this.isRecording = false;
				console.log('uni录音停止请求已发送');
			},

			setupPlusRecorder() {
				// #ifdef APP-PLUS
				const initPlus = () => {
					if (this.plusRecorder) return;
					if (typeof plus !== 'undefined' && plus.audio && plus.audio.getRecorder) {
						this.plusRecorder = plus.audio.getRecorder();
						this.usePlusRecorder = true;
						console.log('使用plus.audio录音器(WAV)');
					}
				};
				if (typeof plus !== 'undefined') {
					initPlus();
				} else if (typeof document !== 'undefined' && document.addEventListener) {
					document.addEventListener('plusready', initPlus);
				}
				// #endif
			},

			startPlusRecord() {
				console.log('开始plus.audio录音(WAV)');
				this.isRecording = true;
				this.statusText = '松开结束';
				this.recordStartTime = Date.now();
				const filename = `_doc/recorder_${Date.now()}.wav`;

				// 优化的录音参数
				this.plusRecorder.record({
					filename,
					format: 'wav',
					samplerate: 16000,  // 16kHz采样率（百度推荐）
					channels: 1         // 单声道
				}, (path) => {
					const duration = Date.now() - this.recordStartTime;
					console.log('录音完成，路径:', path);
					console.log('录音时长:', duration + 'ms');

					// 检查录音时长是否足够
					if (duration < 1000) {
						console.warn('录音时长太短:', duration + 'ms');
						this.isRecording = false;
						this.statusText = '按住说话';
						this.appendSystemMsg(`录音时长太短(${Math.round(duration/1000)}秒)，请至少说话2-3秒`);
						return;
					}

					this.isRecording = false;
					this.statusText = '按住说话';
					this.handleRecording(path);
				}, (err) => {
					console.error('plus录音错误:', err);
					this.isRecording = false;
					this.statusText = '按住说话';
					this.appendSystemMsg('录音失败: ' + (err && err.message ? err.message : JSON.stringify(err)));
				});
				console.log('plus录音请求已发送');
			},

			stopPlusRecord() {
				try {
					this.plusRecorder.stop();
					console.log('plus录音停止请求已发送');
				} catch (err) {
					console.error('停止plus录音失败:', err);
				}
			},
			
			handleRecording(tempFilePath) {
				if (!this.baiduToken) {
					this.appendSystemMsg("语音服务未就绪，请等待Token加载");
					console.error('百度Token未获取');
					return;
				}

				this.isProcessing = true;
				this.appendSystemMsg("正在识别语音...");

				console.log('开始读取录音文件:', tempFilePath);

				// 方案1: 尝试使用 uni.getFileSystemManager
				const fsm = uni.getFileSystemManager();

				if (fsm && typeof fsm.readFile === 'function') {
					console.log('使用 uni.getFileSystemManager 读取文件');
					fsm.readFile({
						filePath: tempFilePath,
						encoding: 'base64',
						success: (res) => {
							console.log('录音文件读取成功，大小:', res.data.length);
							this.processSpeech(res.data);
						},
						fail: (err) => {
							console.error('读取录音文件失败，尝试备用方案:', err);
							this.readFileWithPlusIO(tempFilePath);
						}
					});
				} else {
					console.log('getFileSystemManager不可用，直接使用 plus.io 读取');
					this.readFileWithPlusIO(tempFilePath);
				}
			},

			// 备用方案: 使用 5+ API 读取文件
			readFileWithPlusIO(filePath) {
				console.log('使用 plus.io 读取文件，路径:', filePath);

				// #ifdef APP-PLUS
				// 使用 resolveLocalFileSystemURL 获取文件对象
				plus.io.resolveLocalFileSystemURL(filePath, (entry) => {
					console.log('文件解析成功，开始读取');

					entry.file((file) => {
						console.log('文件对象获取成功，大小:', file.size);

						// 检查文件大小是否合理
						if (file.size < 1000) {
							console.warn('录音文件太小:', file.size + 'bytes');
							this.isProcessing = false;
							this.appendSystemMsg('录音数据太小，请重新录音');
							return;
						}

						const reader = new plus.io.FileReader();

						reader.onload = (e) => {
							console.log('plus.io 读取成功，结果长度:', e.target.result.length);
							// e.target.result 包含 data URL 前缀，需要去掉
							const base64Data = e.target.result.split(',')[1];
							this.processSpeech(base64Data);
						};

						reader.onerror = (e) => {
							console.error('FileReader 读取失败:', e);
							this.isProcessing = false;
							this.appendSystemMsg("读取文件内容失败");
						};

						// 读取文件为 data URL (base64)
						reader.readAsDataURL(file);
					}, (err) => {
						console.error('获取文件对象失败:', err);
						this.isProcessing = false;
						this.appendSystemMsg("获取文件对象失败: " + JSON.stringify(err));
					});

				}, (err) => {
					console.error('文件解析失败:', err);
					this.isProcessing = false;
					this.appendSystemMsg("文件解析失败，请检查文件路径");
				});
				// #endif

				// #ifndef APP-PLUS
				console.error('当前环境不支持文件读取');
				this.isProcessing = false;
				this.appendSystemMsg("当前环境不支持语音识别，请在真机App环境下运行");
				// #endif
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
				// System prompt for the AI assistant
				const systemPrompt = {
					role: 'system',
					content: '你的名字叫小禾，你是深圳和而泰智能控制-技术研究院-超灵团队开发的Agent机器人，你是一个专业的厨电智能助手。你需要帮助用户控制和管理厨房电器。能够依据用户的身份角色和当前正在使用的厨电设备，对用户做一些主动功能和做菜食谱的推荐，你需要保持对话简洁、友好、有帮助。如果用户问题与厨电无关，请礼貌地引导回厨电话题，并结合当前使用场景和当前设备（默认烤箱）作使用推荐。'
				};

				// Filter messages for context window if needed, here we send all
				// Moonshot format: {role, content}
				// Remove system/error messages if any (optional)
				const history = this.messages.filter(m => m.role === 'user' || m.role === 'assistant');

				// Combine system prompt with conversation history
				const messages = [systemPrompt, ...history];

				if(config.moonshot.apiKey === 'YOUR_MOONSHOT_API_KEY') {
					this.isProcessing = false;
					this.appendSystemMsg("请配置Moonshot API Key以启用AI对话");
					return;
				}

				chatWithAI(messages).then(reply => {
					this.isProcessing = false;
					this.addMessage('assistant', reply);
				}).catch(err => {
					console.error('LLM Error', err);
					this.isProcessing = false;
					this.appendSystemMsg("AI思考出了点问题");
				});
			},
			
			addMessage(role, content) {
				const message = { role, content };

				// 如果是AI助手消息，将Markdown转换为HTML
				if (role === 'assistant') {
					message.htmlContent = markdownToHtml(content);
				}

				this.messages.push(message);
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
			},

		sendTextMessage() {
			const text = this.inputText.trim();
			if (!text) {
				return;
			}

			// 添加用户消息
			this.addMessage('user', text);

			// 清空输入框
			this.inputText = '';

			// 调用AI
			this.callLLM();
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
		overflow: hidden;
	}

	/* rich-text 样式优化 */
	.ai-msg .bubble rich-text {
		width: 100%;
		word-break: break-word;
	}

	.ai-msg .bubble rich-text p {
		margin: 5px 0;
		line-height: 1.6;
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
		padding: 10px 15px;
		background: white;
		display: flex;
		align-items: center;
		gap: 10px;
		box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
		/* #ifdef H5 */
		bottom: 50px; /* Adjust for TabBar in H5 preview if needed */
		/* #endif */
	}

	.input-container {
		display: flex;
		gap: 10px;
		flex: 1;
	}

	.text-input {
		flex: 1;
		height: 40px;
		padding: 0 15px;
		border: 1px solid #ddd;
		border-radius: 20px;
		font-size: 16px;
		background: #f5f5f5;
	}

	.send-btn {
		width: 65px;
		height: 40px;
		background: #007aff;
		color: white;
		border: none;
		border-radius: 20px;
		font-size: 15px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.send-btn[disabled] {
		background: #ccc;
	}

	.record-btn {
		width: 44px;
		height: 44px;
		background: #007aff;
		color: white;
		border-radius: 22px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 20px;
		transition: all 0.2s;
		flex-shrink: 0;
	}
	
	.record-btn.recording {
		background: #ff3b30;
		transform: scale(0.95);
	}
	
	.mic-icon {
		margin-right: 10px;
	}
</style>
