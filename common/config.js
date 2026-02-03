export default {
	// 百度语音识别配置
	baidu: {
		apiKey: 'SMUfwKoXuuyYO1jaitLtjVuJ',
		secretKey: '0NwMYgc4M3vIX4IpYhQbhO8XPYlq0NhS',
		tokenUrl: 'https://aip.baidubce.com/oauth/2.0/token',
		// Short speech recognition endpoints
		recognitionUrl: 'https://vop.baidu.com/server_api',
		recognitionProUrl: 'https://vop.baidu.com/pro_api',
		// ASR request defaults (override if needed)
		asrFormat: 'wav',
		asrDevPid: 80001  // 使用极速版，支持wav格式
	},
	// Moonshot AI (Kimi) 配置
	moonshot: {
		apiKey: 'sk-vKb7RjHjgkfzyMt5ZuTyBcj6YYieyQFbJFnjtBbNSSFQsW27', // sk-xxxxxxxx
		apiUrl: 'https://api.moonshot.cn/v1/chat/completions',
		model: 'moonshot-v1-8k'
	}
}
