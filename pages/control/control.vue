<template>
	<view class="container">
		<view class="title">设备管理</view>

		<view class="category-tabs">
			<text class="tab active">厨房</text>
			<text class="tab">客厅</text>
			<text class="tab">餐厅</text>
		</view>

		<view class="device-grid">
			<view class="device-item card" v-for="(item, index) in devices" :key="index">
				<view class="device-header">
					<text class="device-icon">{{item.icon}}</text>
					<switch :checked="item.isOn" color="#007aff" style="transform:scale(0.6)" @change="toggleDevice(index)"/>
				</view>
				<text class="device-name">{{item.name}}</text>
				<text class="device-state">{{item.isOn ? '运行中' : '已关闭'}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				devices: [
					{ name: '智能油烟机', icon: '💨', isOn: true },
					{ name: '蒸烤一体机', icon: '🥘', isOn: false },
					{ name: '洗碗机', icon: '🍽️', isOn: true },
					{ name: '净水器', icon: '💧', isOn: true },
					{ name: '消毒柜', icon: '✨', isOn: false },
					{ name: '冰箱', icon: '🧊', isOn: true },
					{ name: '燃气灶', icon: '🔥', isOn: false },
					{ name: '咖啡机', icon: '☕', isOn: false },
				]
			}
		},
		methods: {
			toggleDevice(index) {
				this.devices[index].isOn = !this.devices[index].isOn;
			}
		}
	}
</script>

<style>
	.title {
		font-size: 20px;
		font-weight: bold;
		color: #333;
		margin-bottom: 15px;
	}
	.category-tabs {
		display: flex;
		margin-bottom: 20px;
		gap: 20px;
	}
	.tab {
		font-size: 15px;
		color: #888;
		padding-bottom: 8px;
		position: relative;
	}
	.tab.active {
		color: #007aff;
		font-weight: bold;
	}
	.tab.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: #007aff;
		border-radius: 2px;
	}
	.device-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 12px;
	}
	.device-item {
		padding: 15px;
		min-height: 110px;
	}
	.device-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
	}
	.device-icon {
		font-size: 28px;
	}
	.device-name {
		font-size: 15px;
		font-weight: bold;
		display: block;
		margin-bottom: 6px;
		color: #333;
	}
	.device-state {
		font-size: 13px;
		color: #888;
	}
</style>
