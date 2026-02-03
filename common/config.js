export default {
	// 百度语音识别配置
	baidu: {
		apiKey: '5FINrpIQtNI802jbqoqEIA8v',
		secretKey: 'dncWtBW3QOgMTewpnjykigjA5Wf4lWvI',
		tokenUrl: 'https://aip.baidubce.com/oauth/2.0/token',
		recognitionUrl: 'https://vop.baidu.com/server_api'
	},
	// Moonshot AI (Kimi) 配置
	moonshot: {
		apiKey: 'sk-vKb7RjHjgkfzyMt5ZuTyBcj6YYieyQFbJFnjtBbNSSFQsW27', // sk-xxxxxxxx
		apiUrl: 'https://api.moonshot.cn/v1/chat/completions',
		model: 'moonshot-v1-8k'
	}
}
