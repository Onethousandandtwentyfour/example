/**
 * 游戏配置
 */
const Config = {
	// 画布配置
	canvas: {
		width: 750,
		height: 1334,
	},

	// 物理参数
	physics: {
		gravity: 2800, // 重力加速度
		chargeRate: 15, // 蓄力速率
		maxChargePower: 800, // 最大蓄力值
		minChargePower: 100, // 最小蓄力值
		jumpAngle: 45, // 跳跃角度(度)
	},

	// 玩家配置
	player: {
		width: 50,
		height: 50,
		color: "#333333",
		chargeScaleY: 0.7, // 蓄力时的压缩比例
	},

	// 平台配置
	platform: {
		baseDistance: 150, // 基础间距
		maxDistance: 350, // 最大间距
		minDistance: 100, // 最小间距
		perfectZoneRadius: 15, // 完美区域半径
		safeZoneRadius: 40, // 安全区域半径
		width: 100, // 平台宽度
		height: 20, // 平台高度(视觉)
		depth: 100, // 平台深度
		colors: ["#67c23a", "#409eff", "#e6a23c", "#f56c6c", "#909399"],
	},

	// 计分配置
	score: {
		baseScore: 1, // 基础得分
		perfectBonus: 2, // 完美加成
		comboBonus: [0, 0, 2, 4, 6, 8], // 连击加成 (索引为连击数)
		specialScore: 30, // 特殊平台得分
	},

	// 摄像机配置
	camera: {
		smoothFactor: 0.1, // 平滑系数
		offsetY: -200, // Y轴偏移
	},

	// 游戏状态
	state: {
		LOADING: 0,
		READY: 1,
		PLAYING: 2,
		GAMEOVER: 3,
	},

	// 玩家状态
	playerState: {
		IDLE: 0,
		CHARGING: 1,
		JUMPING: 2,
		LANDING: 3,
		FALLING: 4,
	},
};

export default Config;
