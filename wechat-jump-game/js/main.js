/**
 * 跳一跳游戏主程序
 */
import Config from "./base/Config";
import DataBus from "./base/DataBus";
import GameLoop from "./runtime/GameLoop";
import GameState from "./runtime/GameState";
import Renderer from "./render/Renderer";
import Camera from "./render/Camera";
import Player from "./player/Player";
import PlatformManager from "./platform/PlatformManager";
import Physics from "./physics/Physics";
import Collision, { CollisionType } from "./physics/Collision";
import ScoreManager from "./score/ScoreManager";
import ComboSystem from "./score/ComboSystem";
import AudioManager from "./audio/AudioManager";
import ScoreBoard from "./ui/ScoreBoard";
import StartScreen from "./ui/StartScreen";
import GameOverScreen from "./ui/GameOverScreen";

export default class Main {
	constructor() {
		// 获取 canvas
		this.canvas = wx.createCanvas();
		this.ctx = this.canvas.getContext("2d");

		// 初始化各个模块
		this.initModules();

		// 绑定事件
		this.bindEvents();

		// 开始游戏循环
		this.gameLoop.start();
	}

	/**
	 * 初始化模块
	 */
	initModules() {
		// 渲染器
		this.renderer = new Renderer(this.canvas, this.ctx);

		// 游戏状态
		this.gameState = new GameState();

		// 摄像机
		this.camera = new Camera();

		// 玩家
		this.player = new Player();

		// 平台管理器
		this.platformManager = new PlatformManager();

		// 物理引擎
		this.physics = new Physics();

		// 碰撞检测
		this.collision = new Collision();

		// 分数管理
		this.scoreManager = new ScoreManager();

		// 连击系统
		this.comboSystem = new ComboSystem();

		// 音效管理
		this.audioManager = new AudioManager();
		// this.audioManager.preloadAll(); // 需要音频文件时取消注释

		// UI
		this.scoreBoard = new ScoreBoard();
		this.startScreen = new StartScreen();
		this.gameOverScreen = new GameOverScreen();

		// 游戏循环
		this.gameLoop = new GameLoop(
			this.update.bind(this),
			this.render.bind(this)
		);

		// 数据总线
		this.dataBus = DataBus;

		// 当前平台索引
		this.currentPlatformIndex = 0;

		// 蓄力相关
		this.isCharging = false;
		this.chargeStartTime = 0;

		// 开放数据域相关
		this.openDataContext = null;
		this.sharedCanvas = null;
		this.showRankList = false;
	}

	/**
	 * 绑定触摸事件
	 */
	bindEvents() {
		// 触摸开始
		wx.onTouchStart((e) => {
			const touch = e.touches[0];
			this.onTouchStart(touch.clientX, touch.clientY);
		});

		// 触摸结束
		wx.onTouchEnd((e) => {
			this.onTouchEnd();
		});

		// 显示时恢复
		wx.onShow(() => {
			if (this.gameState.isPlaying()) {
				this.gameLoop.resume();
			}
		});

		// 隐藏时暂停
		wx.onHide(() => {
			this.gameLoop.pause();
		});
	}

	/**
	 * 触摸开始
	 * @param {number} x
	 * @param {number} y
	 */
	onTouchStart(x, y) {
		// 开始界面
		if (this.gameState.isReady()) {
			if (this.startScreen.checkClick(x, y)) {
				this.startGame();
			}
			return;
		}

		// 游戏结束界面
		if (this.gameState.isGameOver()) {
			const action = this.gameOverScreen.checkClick(x, y);
			if (action === "restart") {
				this.restartGame();
			} else if (action === "rank") {
				this.showRank();
			}
			return;
		}

		// 排行榜界面
		if (this.showRankList) {
			this.hideRank();
			return;
		}

		// 游戏中 - 开始蓄力
		if (this.gameState.isPlaying() && this.player.isIdle()) {
			this.startCharge();
		}
	}

	/**
	 * 触摸结束
	 */
	onTouchEnd() {
		// 游戏中 - 跳跃
		if (this.gameState.isPlaying() && this.player.isCharging()) {
			this.jump();
		}
	}

	/**
	 * 开始游戏
	 */
	startGame() {
		this.gameState.setState(Config.state.PLAYING);
		this.startScreen.hide();

		// 初始化游戏
		this.initGame();

		// 播放背景音乐
		// this.audioManager.playBGM();
	}

	/**
	 * 初始化游戏
	 */
	initGame() {
		// 重置数据
		this.dataBus.reset();
		this.currentPlatformIndex = 0;

		// 初始化平台
		const startX = Config.canvas.width / 2 - Config.platform.width / 2;
		const startY = Config.canvas.height / 2;
		this.platformManager.init(startX, startY);

		// 初始化玩家
		this.player.reset();
		const firstPlatform = this.platformManager.getPlatform(0);
		this.player.setOnPlatform(firstPlatform);

		// 初始化摄像机
		const playerCenter = this.player.getCenter();
		this.camera.moveTo(playerCenter.x, playerCenter.y);

		// 重置UI
		this.scoreBoard.reset();
		this.comboSystem.reset();
	}

	/**
	 * 重新开始游戏
	 */
	restartGame() {
		this.gameOverScreen.hide();
		this.gameState.setState(Config.state.PLAYING);
		this.initGame();
	}

	/**
	 * 开始蓄力
	 */
	startCharge() {
		this.isCharging = true;
		this.chargeStartTime = Date.now();
		this.player.startCharge();

		// 播放蓄力音效
		// this.audioManager.playCharge();

		// 当前平台压缩动画
		const currentPlatform = this.platformManager.getPlatform(
			this.currentPlatformIndex
		);
		if (currentPlatform) {
			currentPlatform.compress(0);
		}
	}

	/**
	 * 执行跳跃
	 */
	jump() {
		if (!this.isCharging) return;

		this.isCharging = false;

		// 停止蓄力音效
		// this.audioManager.stopCharge();

		// 计算蓄力时间
		const chargeTime = (Date.now() - this.chargeStartTime) / 1000;

		// 计算蓄力值
		const power = this.physics.calculateChargePower(chargeTime);

		// 获取跳跃方向
		const direction = this.platformManager.getJumpDirection(
			this.currentPlatformIndex
		);

		// 计算速度
		const { vx, vy } = this.physics.calculateJumpVelocity(power, direction);

		// 执行跳跃
		this.player.jump(vx, vy);

		// 播放跳跃音效
		// this.audioManager.playJump();

		// 恢复平台形态
		const currentPlatform = this.platformManager.getPlatform(
			this.currentPlatformIndex
		);
		if (currentPlatform) {
			currentPlatform.restore();
		}
	}

	/**
	 * 游戏结束
	 */
	gameOver() {
		this.gameState.setState(Config.state.GAMEOVER);

		// 播放失败音效
		// this.audioManager.playFail();

		// 停止背景音乐
		// this.audioManager.stopBGM();

		// 上传分数
		this.scoreManager.uploadScore();

		// 显示结束界面
		this.gameOverScreen.show(this.dataBus.score, this.dataBus.highScore);
	}

	/**
	 * 显示排行榜
	 */
	showRank() {
		this.showRankList = true;

		try {
			this.openDataContext = wx.getOpenDataContext();
			this.sharedCanvas = this.openDataContext.canvas;

			// 设置 sharedCanvas 尺寸
			this.sharedCanvas.width = this.canvas.width * 0.8;
			this.sharedCanvas.height = this.canvas.height * 0.7;

			// 通知开放数据域显示排行榜
			this.openDataContext.postMessage({
				action: "showRankList",
				type: "friend",
			});
		} catch (e) {
			console.error("显示排行榜失败:", e);
			this.showRankList = false;
		}
	}

	/**
	 * 隐藏排行榜
	 */
	hideRank() {
		this.showRankList = false;

		if (this.openDataContext) {
			this.openDataContext.postMessage({
				action: "hideRankList",
			});
		}
	}

	/**
	 * 更新游戏逻辑
	 * @param {number} deltaTime
	 */
	update(deltaTime) {
		// 更新开始界面
		if (this.gameState.isReady()) {
			this.startScreen.update(deltaTime);
			return;
		}

		// 更新结束界面
		if (this.gameState.isGameOver()) {
			this.gameOverScreen.update(deltaTime);
			return;
		}

		// 游戏中
		if (this.gameState.isPlaying()) {
			this.updateGame(deltaTime);
		}
	}

	/**
	 * 更新游戏
	 * @param {number} deltaTime
	 */
	updateGame(deltaTime) {
		// 更新玩家
		this.player.update(deltaTime);

		// 蓄力时更新平台压缩
		if (this.player.isCharging()) {
			const chargeTime = (Date.now() - this.chargeStartTime) / 1000;
			const ratio = Math.min(chargeTime / 1.5, 1);
			const currentPlatform = this.platformManager.getPlatform(
				this.currentPlatformIndex
			);
			if (currentPlatform) {
				currentPlatform.compress(ratio);
			}
		}

		// 跳跃中的物理更新
		if (this.player.isJumping()) {
			// 应用重力
			this.physics.applyGravity(this.player, deltaTime);

			// 更新位置
			this.physics.updatePosition(this.player, deltaTime);

			// 检测碰撞
			this.checkCollision();
		}

		// 下落中
		if (this.player.isFalling()) {
			this.physics.applyGravity(this.player, deltaTime);
			this.physics.updatePosition(this.player, deltaTime);

			// 如果掉出屏幕下方，游戏结束
			if (this.player.y > this.camera.y + Config.canvas.height) {
				this.gameOver();
			}
		}

		// 更新平台
		this.platformManager.update(deltaTime);
		this.platformManager.updateDifficulty(this.dataBus.score);
		this.platformManager.ensurePlatforms(this.currentPlatformIndex);

		// 更新摄像机
		if (!this.player.isFalling()) {
			const playerCenter = this.player.getCenter();
			this.camera.setTarget(playerCenter.x, playerCenter.y);
		}
		this.camera.update(deltaTime);

		// 更新连击系统
		this.comboSystem.update(deltaTime);

		// 更新计分板
		this.scoreBoard.updateScore(
			this.dataBus.score,
			this.dataBus.highScore,
			this.dataBus.comboCount
		);
		this.scoreBoard.update(deltaTime);

		// 回收平台
		this.platformManager.recyclePlatforms(this.camera);
	}

	/**
	 * 检测碰撞
	 */
	checkCollision() {
		// 只有下落时才检测
		if (this.player.vy <= 0) return;

		const platforms = this.platformManager.platforms;
		const result = this.collision.checkPlayerPlatforms(
			this.player,
			platforms,
			this.currentPlatformIndex
		);

		if (!result) return;

		const { platform, result: collisionResult, index } = result;

		if (collisionResult.type === CollisionType.MISS) {
			// 失败
			this.player.fall();
			return;
		}

		if (collisionResult.type !== CollisionType.NONE) {
			// 成功落地
			this.player.land(platform);
			this.currentPlatformIndex = index;

			// 处理得分
			const scoreResult = this.scoreManager.processLanding(
				collisionResult.type
			);

			// 播放音效
			// this.audioManager.playLand(scoreResult.isPerfect);

			// 触发连击效果
			if (scoreResult.isPerfect && scoreResult.combo >= 2) {
				const playerCenter = this.player.getCenter();
				this.comboSystem.trigger(
					scoreResult.combo,
					playerCenter.x,
					playerCenter.y - 50
				);
				// this.audioManager.playCombo();
			}
		}
	}

	/**
	 * 渲染
	 */
	render() {
		// 清空画布
		this.renderer.clear();

		// 渲染背景
		this.renderBackground();

		// 开始界面
		if (this.gameState.isReady()) {
			// 渲染一些静态元素
			this.platformManager.render(this.ctx, this.camera);
			this.player.render(this.ctx, this.camera);
			this.startScreen.render(this.ctx, this.renderer);
			return;
		}

		// 游戏中或结束
		// 渲染平台
		this.platformManager.render(this.ctx, this.camera);

		// 渲染玩家
		this.player.render(this.ctx, this.camera);

		// 渲染连击效果
		this.comboSystem.render(this.ctx, this.camera);

		// 渲染计分板
		if (this.gameState.isPlaying()) {
			this.scoreBoard.render(this.ctx, this.renderer);
		}

		// 渲染结束界面
		if (this.gameState.isGameOver()) {
			this.gameOverScreen.render(this.ctx, this.renderer);
		}

		// 渲染排行榜
		if (this.showRankList) {
			this.renderRankList();
		}
	}

	/**
	 * 渲染背景
	 */
	renderBackground() {
		// 渐变背景
		const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
		gradient.addColorStop(0, "#e8f4f8");
		gradient.addColorStop(1, "#d4e5ed");

		this.ctx.fillStyle = gradient;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	/**
	 * 渲染排行榜
	 */
	renderRankList() {
		if (!this.sharedCanvas) return;

		const centerX = this.canvas.width / 2;
		const centerY = this.canvas.height / 2;

		// 半透明遮罩
		this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

		// 绘制 sharedCanvas
		const x = centerX - this.sharedCanvas.width / 2;
		const y = centerY - this.sharedCanvas.height / 2;

		this.ctx.drawImage(
			this.sharedCanvas,
			x,
			y,
			this.sharedCanvas.width,
			this.sharedCanvas.height
		);

		// 关闭按钮提示
		this.ctx.font = "20px Arial";
		this.ctx.textAlign = "center";
		this.ctx.fillStyle = "#ffffff";
		this.ctx.fillText(
			"点击任意位置关闭",
			centerX,
			y + this.sharedCanvas.height + 40
		);
	}
}
