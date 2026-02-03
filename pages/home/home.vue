<template>
	<view class="container">
		<view class="header">
			<text class="greeting">早上好，主人</text>
			<text class="sub-greeting">今天想要烹饪什么美味？</text>
		</view>
		
		<view class="status-card card">
			<view class="status-item">
				<text class="label">室内温度</text>
				<text class="value">24°C</text>
			</view>
			<view class="status-item">
				<text class="label">空气质量</text>
				<text class="value">优</text>
			</view>
			<view class="status-item">
				<text class="label">净水器</text>
				<text class="value">正常</text>
			</view>
		</view>
		
		<view class="section-title">快速场景</view>
		<view class="grid">
			<view class="grid-item card">
				<text class="icon">🍳</text>
				<text class="grid-label">备菜模式</text>
			</view>
			<view class="grid-item card">
				<text class="icon">🥘</text>
				<text class="grid-label">爆炒模式</text>
			</view>
			<view class="grid-item card">
				<text class="icon">💨</text>
				<text class="grid-label">强力通风</text>
			</view>
			<view class="grid-item card">
				<text class="icon">🌙</text>
				<text class="grid-label">夜间模式</text>
			</view>
		</view>
		
		<view class="section-title">常用设备</view>
		<view class="device-list">
			<view class="device-card card">
				<view class="device-info">
					<text class="device-name">智能烤箱</text>
					<text class="device-status">待机中</text>
				</view>
				<switch checked color="#007aff" style="transform:scale(0.7)"/>
			</view>
			<view class="device-card card">
				<view class="device-info">
					<text class="device-name">洗碗机</text>
					<text class="device-status">工作中 - 剩20分钟</text>
				</view>
				<switch checked color="#007aff" style="transform:scale(0.7)"/>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	.header {
		margin-bottom: 20px;
	}
	.greeting {
		font-size: 24px;
		font-weight: bold;
		display: block;
		color: #333;
	}
	.sub-greeting {
		font-size: 14px;
		color: #888;
		margin-top: 5px;
		display: block;
	}
	.status-card {
		display: flex;
		justify-content: space-around;
		background: linear-gradient(135deg, #007aff, #00c6ff);
	}
	.status-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.status-item .label {
		color: rgba(255,255,255,0.8);
		font-size: 12px;
	}
	.status-item .value {
		color: white;
		font-size: 20px;
		font-weight: bold;
		margin-top: 5px;
	}
	.section-title {
		font-size: 16px;
		font-weight: bold;
		margin: 20px 0 10px;
		color: #333;
	}
	.grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.grid-item {
		width: 42%; /* slightly less than half to account for padding/margin */
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 15px;
	}
	.grid-item .icon {
		font-size: 28px;
		margin-bottom: 10px;
	}
	.grid-label {
		font-size: 14px;
		color: #333;
	}
	.device-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px;
	}
	.device-name {
		font-size: 16px;
		font-weight: bold;
		display: block;
	}
	.device-status {
		font-size: 12px;
		color: #888;
		margin-top: 4px;
		display: block;
	}
</style>
