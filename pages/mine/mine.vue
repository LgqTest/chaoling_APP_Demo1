<template>
	<view class="container">
		<view class="user-header card">
			<view class="avatar">
				<text style="font-size:30px">👤</text>
			</view>
			<view class="user-info">
				<text class="username">李桂棋</text>
				<text class="user-role">家庭管理员</text>
			</view>
		</view>
		
		<view class="menu-list card">
			<view class="menu-item">
				<text class="menu-icon">⚙️</text>
				<text class="menu-text">系统设置</text>
				<text class="arrow">></text>
			</view>
			<view class="menu-item">
				<text class="menu-icon">📱</text>
				<text class="menu-text">设备管理</text>
				<text class="arrow">></text>
			</view>
			<view class="menu-item">
				<text class="menu-icon">🔔</text>
				<text class="menu-text">消息通知</text>
				<text class="arrow">></text>
			</view>
			<view class="menu-item">
				<text class="menu-icon">❓</text>
				<text class="menu-text">帮助反馈</text>
				<text class="arrow">></text>
			</view>
			<view class="menu-item">
				<text class="menu-icon">ℹ️</text>
				<text class="menu-text">关于我们</text>
				<text class="arrow">></text>
			</view>
		</view>
		
		<view class="btn logout-btn">退出登录</view>
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
	.user-header {
		display: flex;
		align-items: center;
		padding: 30px 20px;
		background: linear-gradient(135deg, #007aff, #00c6ff);
	}
	.avatar {
		width: 60px;
		height: 60px;
		background: white;
		border-radius: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 15px;
	}
	.user-info {
		display: flex;
		flex-direction: column;
	}
	.username {
		color: white;
		font-size: 20px;
		font-weight: bold;
	}
	.user-role {
		color: rgba(255,255,255,0.8);
		font-size: 14px;
		margin-top: 5px;
	}
	.menu-list {
		padding: 0;
	}
	.menu-item {
		display: flex;
		align-items: center;
		padding: 15px 20px;
		border-bottom: 1px solid #f5f5f5;
	}
	.menu-item:last-child {
		border-bottom: none;
	}
	.menu-icon {
		margin-right: 15px;
		font-size: 18px;
	}
	.menu-text {
		flex: 1;
		font-size: 16px;
		color: #333;
	}
	.arrow {
		color: #ccc;
	}
	.logout-btn {
		background: #ff3b30;
		margin-top: 20px;
	}
</style>
