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
	.category-tabs {
		display: flex;
		margin-bottom: 20px;
	}
	.tab {
		margin-right: 20px;
		font-size: 16px;
		color: #888;
		padding-bottom: 5px;
	}
	.tab.active {
		color: #333;
		font-weight: bold;
		border-bottom: 2px solid #007aff;
	}
	.device-grid {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.device-item {
		width: 42%;
		padding: 15px;
	}
	.device-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}
	.device-icon {
		font-size: 24px;
	}
	.device-name {
		font-size: 15px;
		font-weight: bold;
		display: block;
		margin-bottom: 5px;
	}
	.device-state {
		font-size: 12px;
		color: #888;
	}
</style>
