<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* 每个页面公共css */
	body {
		background-color: #f5f7fa;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
	}
	
	.container {
		padding: 20px;
	}
	
	.card {
		background: #ffffff;
		border-radius: 12px;
		box-shadow: 0 4px 12px rgba(0,0,0,0.05);
		padding: 20px;
		margin-bottom: 20px;
	}
	
	.title {
		font-size: 18px;
		font-weight: bold;
		color: #333;
		margin-bottom: 10px;
	}
	
	.btn {
		background: #007aff;
		color: white;
		border-radius: 25px;
		padding: 10px 20px;
		text-align: center;
		font-size: 16px;
	}
</style>
