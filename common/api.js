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
		// PCM-16bit, 16000Hz is standard for Baidu
		// If using m4a/mp3 from UniApp recorder, might need dev_pid 1537 (Mandarin) or 1737 (English)
		// Standard Android recorder often gives m4a or mp3.
		// For simplicity, we assume the recorder is configured to produce suitable output or we use the format param.
		
		uni.request({
			url: config.baidu.recognitionUrl,
			method: 'POST',
			data: {
				format: 'm4a', // Matched with recorder
				rate: 16000,
				channel: 1,
				cuid: 'uni-app-user-' + Math.random().toString(36).substr(2),
				token: token,
				speech: base64Audio,
				len: base64Audio.length,
				dev_pid: 1537 // 普通话
			},
			header: {
				'Content-Type': 'application/json'
			},
			success: (res) => {
				if (res.data.err_no === 0) {
					resolve(res.data.result[0]);
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
