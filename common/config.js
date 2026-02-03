export default {
	// 百度语音识别配置
	baidu: {
		apiKey: 'YOUR_BAIDU_API_KEY',
		secretKey: 'YOUR_BAIDU_SECRET_KEY',
		tokenUrl: 'https://aip.baidubce.com/oauth/2.0/token',
		recognitionUrl: 'https://vop.baidu.com/server_api'
	},
	// Moonshot AI (Kimi) 配置
	moonshot: {
		apiKey: 'YOUR_MOONSHOT_API_KEY', // sk-xxxxxxxx
		apiUrl: 'https://api.moonshot.cn/v1/chat/completions',
		model: 'moonshot-v1-8k'
	}
}
