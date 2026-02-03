import config from './config.js';

// 获取百度AccessToken
export const getBaiduToken = () => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: config.baidu.tokenUrl,
			method: 'POST',
			data: {
				grant_type: 'client_credentials',
				client_id: config.baidu.apiKey,
				client_secret: config.baidu.secretKey
			},
			header: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.access_token) {
					resolve(res.data.access_token);
				} else {
					reject(res.data);
				}
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
};

// 百度语音识别
export const recognizeSpeech = (base64Audio, token) => {
	return new Promise((resolve, reject) => {
		console.log('发送语音识别请求到百度API');

		uni.request({
			url: config.baidu.recognitionUrl,
			method: 'POST',
			data: {
				format: 'mp3', // 改为mp3格式，与录音器配置一致
				rate: 16000,
				channel: 1,
				cuid: 'uni-app-user-' + Math.random().toString(36).substr(2),
				token: token,
				speech: base64Audio,
				len: base64Audio.length,
				dev_pid: 1537 // 普通话(支持mp3格式)
			},
			header: {
				'Content-Type': 'application/json'
			},
			success: (res) => {
				console.log('百度API响应:', res.data);
				if (res.data.err_no === 0) {
					console.log('识别成功:', res.data.result);
					resolve(res.data.result[0]);
				} else {
					console.error('百度API错误码:', res.data.err_no, '错误信息:', res.data.err_msg);
					reject(res.data);
				}
			},
			fail: (err) => {
				console.error('网络请求失败:', err);
				reject(err);
			}
		});
	});
};

// Moonshot AI 对话
export const chatWithAI = (messages) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: config.moonshot.apiUrl,
			method: 'POST',
			data: {
				model: config.moonshot.model,
				messages: messages,
				temperature: 0.3
			},
			header: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${config.moonshot.apiKey}`
			},
			success: (res) => {
				if (res.data.choices && res.data.choices.length > 0) {
					resolve(res.data.choices[0].message.content);
				} else {
					reject(res.data);
				}
			},
			fail: (err) => {
				reject(err);
			}
		});
	});
};
