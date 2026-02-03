<template>
	<view class="container">
		<view class="title">智能场景</view>
		<view class="scene-list">
			<view class="scene-card card" v-for="(scene, index) in scenes" :key="index">
				<view class="scene-info">
					<view class="scene-icon-wrapper" :style="{background: scene.color}">
						<text class="scene-icon">{{scene.icon}}</text>
					</view>
					<view class="scene-text">
						<text class="scene-name">{{scene.name}}</text>
						<text class="scene-desc">{{scene.desc}}</text>
					</view>
				</view>
				<view class="btn-run" @click="runScene(scene.name)">执行</view>
			</view>
		</view>
		
		<view class="create-btn">
			<text class="plus">+</text>
			<text>创建新场景</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scenes: [
					{ name: '回家模式', desc: '打开客厅灯，开启空气净化器', icon: '🏠', color: '#e3f2fd' },
					{ name: '烹饪模式', desc: '开启油烟机，厨房灯光调亮', icon: '🍳', color: '#fff3e0' },
					{ name: '离家模式', desc: '关闭所有电器，开启安防', icon: '🔒', color: '#ffebee' },
					{ name: '用餐模式', desc: '播放轻音乐，调整灯光氛围', icon: '🍽️', color: '#f3e5f5' }
				]
			}
		},
		methods: {
			runScene(name) {
				uni.showToast({
					title: `已执行${name}`,
					icon: 'success'
				});
			}
		}
	}
</script>

<style>
	.scene-card {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15px;
	}
	.scene-info {
		display: flex;
		align-items: center;
	}
	.scene-icon-wrapper {
		width: 50px;
		height: 50px;
		border-radius: 25px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 15px;
	}
	.scene-icon {
		font-size: 24px;
	}
	.scene-name {
		font-size: 16px;
		font-weight: bold;
		display: block;
	}
	.scene-desc {
		font-size: 12px;
		color: #888;
		margin-top: 4px;
		display: block;
	}
	.btn-run {
		background: #f0f0f0;
		color: #333;
		padding: 6px 15px;
		border-radius: 15px;
		font-size: 12px;
		font-weight: bold;
	}
	.create-btn {
		margin-top: 20px;
		border: 2px dashed #ddd;
		border-radius: 12px;
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #888;
	}
	.plus {
		font-size: 20px;
		margin-right: 5px;
	}
</style>
