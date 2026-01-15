/**
 * 开放数据域 - 排行榜
 * 此文件运行在独立的开放数据域中
 */

// 获取 sharedCanvas
const sharedCanvas = wx.getSharedCanvas();
const context = sharedCanvas.getContext("2d");

// 排行榜数据
let rankData = [];
let isShowing = false;

// 配置
const config = {
	itemHeight: 80,
	padding: 20,
	avatarSize: 50,
	startY: 100,
	maxDisplay: 10,
};

/**
 * 监听主域消息
 */
wx.onMessage((data) => {
	switch (data.action) {
		case "showRankList":
			showRankList(data.type || "friend");
			break;
		case "hideRankList":
			hideRankList();
			break;
		case "refresh":
			if (isShowing) {
				loadRankData();
			}
			break;
	}
});

/**
 * 显示排行榜
 * @param {string} type 类型: 'friend' 好友排行
 */
function showRankList(type) {
	isShowing = true;
	loadRankData();
}

/**
 * 隐藏排行榜
 */
function hideRankList() {
	isShowing = false;
	clearCanvas();
}

/**
 * 加载排行榜数据
 */
function loadRankData() {
	wx.getFriendCloudStorage({
		keyList: ["score"],
		success: (res) => {
			// 处理数据
			rankData = res.data
				.map((item) => {
					const scoreData = item.KVDataList.find((kv) => kv.key === "score");
					return {
						avatarUrl: item.avatarUrl,
						nickname: item.nickname,
						score: scoreData ? parseInt(scoreData.value) : 0,
					};
				})
				.filter((item) => item.score > 0)
				.sort((a, b) => b.score - a.score)
				.slice(0, config.maxDisplay);

			renderRankList();
		},
		fail: (err) => {
			console.error("获取好友数据失败:", err);
			rankData = [];
			renderRankList();
		},
	});
}

/**
 * 清空画布
 */
function clearCanvas() {
	context.clearRect(0, 0, sharedCanvas.width, sharedCanvas.height);
}

/**
 * 渲染排行榜
 */
function renderRankList() {
	clearCanvas();

	if (!isShowing) return;

	const width = sharedCanvas.width;
	const height = sharedCanvas.height;

	// 背景
	context.fillStyle = "rgba(255, 255, 255, 0.95)";
	context.fillRect(0, 0, width, height);

	// 标题
	context.font = "bold 32px Arial";
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillStyle = "#333333";
	context.fillText("好友排行榜", width / 2, 50);

	// 无数据提示
	if (rankData.length === 0) {
		context.font = "24px Arial";
		context.fillStyle = "#999999";
		context.fillText("暂无排行数据", width / 2, height / 2);
		context.fillText("快去游戏获得分数吧!", width / 2, height / 2 + 40);
		return;
	}

	// 渲染每一项
	rankData.forEach((item, index) => {
		renderRankItem(item, index);
	});
}

/**
 * 渲染排行项
 * @param {Object} item 数据
 * @param {number} index 索引
 */
function renderRankItem(item, index) {
	const width = sharedCanvas.width;
	const y = config.startY + index * config.itemHeight;
	const padding = config.padding;

	// 背景（奇偶行不同颜色）
	context.fillStyle = index % 2 === 0 ? "#f5f5f5" : "#ffffff";
	context.fillRect(0, y, width, config.itemHeight);

	// 排名
	context.font = "bold 28px Arial";
	context.textAlign = "center";
	context.textBaseline = "middle";

	// 前三名特殊颜色
	if (index === 0) {
		context.fillStyle = "#ffd700"; // 金
	} else if (index === 1) {
		context.fillStyle = "#c0c0c0"; // 银
	} else if (index === 2) {
		context.fillStyle = "#cd7f32"; // 铜
	} else {
		context.fillStyle = "#999999";
	}

	context.fillText(
		(index + 1).toString(),
		padding + 20,
		y + config.itemHeight / 2
	);

	// 头像
	const avatarX = padding + 50;
	const avatarY = y + (config.itemHeight - config.avatarSize) / 2;

	// 绘制头像（圆形裁剪）
	if (item.avatarUrl) {
		const img = wx.createImage();
		img.src = item.avatarUrl;
		img.onload = () => {
			context.save();
			context.beginPath();
			context.arc(
				avatarX + config.avatarSize / 2,
				avatarY + config.avatarSize / 2,
				config.avatarSize / 2,
				0,
				Math.PI * 2
			);
			context.clip();
			context.drawImage(
				img,
				avatarX,
				avatarY,
				config.avatarSize,
				config.avatarSize
			);
			context.restore();
		};
	} else {
		// 默认头像
		context.fillStyle = "#cccccc";
		context.beginPath();
		context.arc(
			avatarX + config.avatarSize / 2,
			avatarY + config.avatarSize / 2,
			config.avatarSize / 2,
			0,
			Math.PI * 2
		);
		context.fill();
	}

	// 昵称
	context.font = "22px Arial";
	context.textAlign = "left";
	context.fillStyle = "#333333";

	let nickname = item.nickname || "微信用户";
	// 截断过长的昵称
	if (nickname.length > 8) {
		nickname = nickname.substring(0, 8) + "...";
	}
	context.fillText(
		nickname,
		avatarX + config.avatarSize + 15,
		y + config.itemHeight / 2
	);

	// 分数
	context.font = "bold 26px Arial";
	context.textAlign = "right";
	context.fillStyle = "#409eff";
	context.fillText(
		item.score.toString(),
		width - padding,
		y + config.itemHeight / 2
	);
}
