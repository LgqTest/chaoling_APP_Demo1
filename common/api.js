import config from './config.js';


const detectAudioFormat = (base64) => {
	if (!base64) return null;
	const sample = base64.slice(0, 64);
	try {
		let bytes = null;
		if (typeof atob === 'function') {
			const binary = atob(sample);
			bytes = new Uint8Array(binary.length);
			for (let i = 0; i < binary.length; i += 1) {
				bytes[i] = binary.charCodeAt(i);
			}
		} else if (typeof uni !== 'undefined' && typeof uni.base64ToArrayBuffer === 'function') {
			bytes = new Uint8Array(uni.base64ToArrayBuffer(sample));
		}
		if (!bytes || bytes.length < 12) return null;
		const ascii = (start, len) => {
			let out = '';
			for (let i = 0; i < len; i += 1) {
				out += String.fromCharCode(bytes[start + i] || 0);
			}
			return out;
		};
		if (ascii(0, 4) === 'RIFF' && ascii(8, 4) === 'WAVE') return 'wav';
		if (ascii(4, 4) === 'ftyp') return 'm4a';
		// AAC ADTS: syncword 0xFFF, layer bits must be 00
		if (bytes[0] === 0xFF && (bytes[1] & 0xF6) === 0xF0) return 'aac';
		if (ascii(0, 3) === 'ID3') return 'mp3';
		if (bytes[0] === 0xFF && (bytes[1] & 0xE0) === 0xE0) return 'mp3';
	} catch (e) {
		return null;
	}
	return null;
};


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
		console.log('🚀 使用百度极速版ASR');
		console.log('原始base64数据长度:', base64Audio.length);

		// 清理base64数据：移除可能的换行符和空格
		const cleanBase64 = base64Audio.replace(/[\r\n\s]/g, '');
		console.log('清理后base64数据长度:', cleanBase64.length);

		const detectedFormat = detectAudioFormat(cleanBase64);
		if (detectedFormat) {
			console.log('检测到音频格式:', detectedFormat);
		}

		// 计算原始音频大小（base64解码后的大小）
		const paddingMatch = cleanBase64.match(/=+$/);
		const paddingSize = paddingMatch ? paddingMatch[0].length : 0;
		const audioSize = Math.max(0, Math.floor(cleanBase64.length * 0.75) - paddingSize);
		console.log('估计的原始音频大小:', audioSize);

		// 百度极速版ASR配置
		// dev_pid 80001: 极速版（支持mp3/m4a，需要开通权限）
		// 既然用户已开通所有服务，直接使用极速版

		const baiduConfig = config && config.baidu ? config.baidu : {};
		const configFormat = baiduConfig.asrFormat || 'm4a';
		const asrDevPid = Number.isFinite(baiduConfig.asrDevPid) ? baiduConfig.asrDevPid : 80001;
		const allowedFormats = asrDevPid === 80001 ? ['m4a', 'pcm', 'wav', 'amr'] : ['pcm', 'wav', 'amr'];
		if (detectedFormat === 'aac') {
			const err = {
				err_no: 3316,
				err_msg: '录音为AAC(ADTS)格式，百度极速版不支持raw AAC，请改为m4a容器或wav/pcm',
				format: detectedFormat
			};
			console.warn('检测到AAC(ADTS)，终止识别:', err);
			reject(err);
			return;
		}
		if (detectedFormat === 'mp3') {
			const err = {
				err_no: 3312,
				err_msg: '录音为MP3格式，百度极速版不支持MP3，请改为m4a或wav/pcm',
				format: detectedFormat
			};
			console.warn('检测到MP3，终止识别:', err);
			reject(err);
			return;
		}
		const formatCandidates = [];
		if (detectedFormat && allowedFormats.includes(detectedFormat)) formatCandidates.push(detectedFormat);
		if (allowedFormats.includes(configFormat) && !formatCandidates.includes(configFormat)) formatCandidates.push(configFormat);
		for (const fmt of allowedFormats) {
			if (!formatCandidates.includes(fmt)) formatCandidates.push(fmt);
		}
		const serverUrl = baiduConfig.recognitionUrl || 'https://vop.baidu.com/server_api';
		const proUrl = baiduConfig.recognitionProUrl || 'https://vop.baidu.com/pro_api';

		const requestData = {
			format: formatCandidates[0],
			rate: 16000,
			channel: 1,
			cuid: 'uniapp-user-' + Date.now(),
			token: token,
			speech: cleanBase64,
			len: audioSize,
			dev_pid: asrDevPid
		};

		console.log('发送的完整参数:', {
			format: requestData.format,
			rate: requestData.rate,
			channel: requestData.channel,
			dev_pid: requestData.dev_pid,
			len: requestData.len,
			speech_length: requestData.speech.length
		});

		const primaryUrl = asrDevPid === 80001 ? proUrl : serverUrl;
		const fallbackUrl = primaryUrl === serverUrl ? proUrl : serverUrl;

		const doRequest = (url, triedFallback, formatIndex) => {
			const nextFormat = formatCandidates[formatIndex] || configFormat || 'm4a';
			requestData.format = nextFormat;
			console.log('发送ASR请求到:', url, 'format:', requestData.format);
			console.log('发送的完整参数:', {
				format: requestData.format,
				rate: requestData.rate,
				channel: requestData.channel,
				dev_pid: requestData.dev_pid,
				len: requestData.len,
				speech_length: requestData.speech.length
			});
			uni.request({
				url,
				method: 'POST',
				data: requestData,
				header: {
					'Content-Type': 'application/json'
				},
				success: (res) => {
					const data = res && res.data ? res.data : {};
					console.log('百度API响应:', data);
					if (data.err_no === 0) {
						console.log('识别成功:', data.result);
						resolve(data.result[0]);
						return;
					}
					if (data.err_no === 3302 && !triedFallback && fallbackUrl && fallbackUrl !== url) {
						console.warn('权限错误，尝试备用URL:', fallbackUrl);
						doRequest(fallbackUrl, true, formatIndex);
						return;
					}
					if (data.err_no === 3312 && formatIndex + 1 < formatCandidates.length) {
						console.warn('格式不支持，尝试备用格式:', formatCandidates[formatIndex + 1]);
						doRequest(url, triedFallback, formatIndex + 1);
						return;
					}
					if (data.err_no === 3302) {
						console.error('极速版权限未开通或Token无效');
						console.error('请检查：');
						console.error('1. 是否在百度云控制台开通了"语音识别-极速版"');
						console.error('2. API Key是否正确');
						reject(data);
						return;
					}
					console.error('百度API错误码:', data.err_no, '错误信息:', data.err_msg);
					console.error('完整响应:', JSON.stringify(data));
					reject(data);
				},
				fail: (err) => {
					console.error('网络请求失败:', err);
					reject(err);
				}
			});
		};

		doRequest(primaryUrl, false, 0);
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
