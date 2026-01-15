/**
 * 跳一跳游戏 - 浏览器打包版
 */

// ============ 工具函数 ============
const MathUtils = {
	lerp(a, b, t) {
		return a + (b - a) * t;
	},
	clamp(value, min, max) {
		return Math.max(min, Math.min(max, value));
	},
	random(min, max) {
		return min + Math.random() * (max - min);
	},
	degToRad(degrees) {
		return (degrees * Math.PI) / 180;
	},
};

// ============ 游戏状态 ============
const GameState = { READY: 0, PLAYING: 1, GAMEOVER: 2 };
const PlayerState = { IDLE: 0, CHARGING: 1, JUMPING: 2, FALLING: 3 };

// ============ 主游戏类 ============
class JumpGame {
	constructor() {
		this.canvas = wx.createCanvas();
		this.ctx = this.canvas.getContext("2d");

		// 获取实际尺寸
		const info = wx.getSystemInfoSync();
		this.width = info.windowWidth;
		this.height = info.windowHeight;
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		// 游戏配置
		this.config = {
			gravity: 1500,
			chargeRate: 10,
			maxPower: 650,
			minPower: 100,
			jumpAngle: 45,
			platformWidth: 80,
			platformHeight: 15,
			platformDepth: 80,
			playerSize: 40,
			perfectRadius: 12,
			safeRadius: 30,
		};

		// 游戏状态
		this.state = GameState.READY;
		this.score = 0;
		this.highScore = this.loadHighScore();
		this.combo = 0;

		// 摄像机
		this.cameraX = 0;
		this.cameraY = 0;
		this.targetCameraX = 0;
		this.targetCameraY = 0;

		// 玩家
		this.player = {
			x: 0,
			y: 0,
			vx: 0,
			vy: 0,
			width: this.config.playerSize,
			height: this.config.playerSize,
			state: PlayerState.IDLE,
			scaleY: 1,
			rotation: 0,
		};

		// 平台
		this.platforms = [];
		this.currentPlatformIndex = 0;

		// 蓄力
		this.isCharging = false;
		this.chargeStartTime = 0;

		// UI状态
		this.showCombo = false;
		this.comboDisplayTime = 0;
		this.comboX = 0;
		this.comboY = 0;

		// 初始化
		this.init();
		this.bindEvents();
		this.startLoop();
	}

	init() {
		this.platforms = [];
		this.score = 0;
		this.combo = 0;
		this.currentPlatformIndex = 0;

		// 第一个平台在屏幕中央偏下
		const firstX = this.width / 2 - this.config.platformWidth / 2;
		const firstY = this.height * 0.6;
		this.platforms.push(this.createPlatform(firstX, firstY));

		// 生成后续平台
		for (let i = 0; i < 5; i++) {
			this.generateNextPlatform();
		}

		// 玩家站在第一个平台上
		this.setPlayerOnPlatform(this.platforms[0]);

		// 摄像机位置
		this.cameraX = this.player.x + this.player.width / 2 - this.width / 2;
		this.cameraY = this.player.y - this.height / 2 + 100;
		this.targetCameraX = this.cameraX;
		this.targetCameraY = this.cameraY;
	}

	createPlatform(x, y) {
		const colors = [
			"#67c23a",
			"#409eff",
			"#e6a23c",
			"#f56c6c",
			"#909399",
			"#9b59b6",
		];
		return {
			x,
			y,
			width: this.config.platformWidth,
			height: this.config.platformHeight,
			depth: this.config.platformDepth,
			color: colors[Math.floor(Math.random() * colors.length)],
			scaleY: 1,
		};
	}

	generateNextPlatform() {
		const last = this.platforms[this.platforms.length - 1];
		const difficulty = Math.min(this.score / 30, 1);
		const minDist = 120 + difficulty * 50;
		const maxDist = 200 + difficulty * 100;
		const distance = MathUtils.random(minDist, maxDist);

		// 随机方向
		const direction = Math.random() < 0.5 ? 1 : -1;
		const newX = last.x + distance * direction;
		// 每个平台向上偏移，形成阶梯效果
		const newY = last.y - MathUtils.random(40, 80);

		this.platforms.push(this.createPlatform(newX, newY));
	}

	setPlayerOnPlatform(platform) {
		this.player.x = platform.x + platform.width / 2 - this.player.width / 2;
		this.player.y = platform.y - this.player.height;
		this.player.vx = 0;
		this.player.vy = 0;
		this.player.state = PlayerState.IDLE;
		this.player.scaleY = 1;
		this.player.rotation = 0;
	}

	bindEvents() {
		wx.onTouchStart((e) => {
			const touch = e.touches[0];
			this.onTouchStart(touch.clientX, touch.clientY);
		});

		wx.onTouchEnd(() => {
			this.onTouchEnd();
		});
	}

	onTouchStart(x, y) {
		if (this.state === GameState.READY) {
			this.state = GameState.PLAYING;
			return;
		}

		if (this.state === GameState.GAMEOVER) {
			this.state = GameState.PLAYING;
			this.init();
			return;
		}

		if (
			this.state === GameState.PLAYING &&
			this.player.state === PlayerState.IDLE
		) {
			this.startCharge();
		}
	}

	onTouchEnd() {
		if (
			this.state === GameState.PLAYING &&
			this.player.state === PlayerState.CHARGING
		) {
			this.jump();
		}
	}

	startCharge() {
		this.isCharging = true;
		this.chargeStartTime = Date.now();
		this.player.state = PlayerState.CHARGING;
	}

	jump() {
		const chargeTime = (Date.now() - this.chargeStartTime) / 1000;
		let power = chargeTime * this.config.chargeRate * 100;
		power = MathUtils.clamp(power, this.config.minPower, this.config.maxPower);

		// 获取跳跃方向
		const current = this.platforms[this.currentPlatformIndex];
		const next = this.platforms[this.currentPlatformIndex + 1];
		const direction = next && next.x > current.x ? 1 : -1;

		const angle = MathUtils.degToRad(this.config.jumpAngle);
		this.player.vx = power * Math.cos(angle) * direction;
		this.player.vy = -power * Math.sin(angle);

		this.player.state = PlayerState.JUMPING;
		this.player.scaleY = 1;
		this.isCharging = false;

		// 恢复平台
		if (current) current.scaleY = 1;
	}

	update(dt) {
		if (this.state !== GameState.PLAYING) return;

		// 蓄力更新
		if (this.player.state === PlayerState.CHARGING) {
			const chargeTime = (Date.now() - this.chargeStartTime) / 1000;
			const ratio = Math.min(chargeTime / 1.2, 1);
			this.player.scaleY = 1 - ratio * 0.35;

			const platform = this.platforms[this.currentPlatformIndex];
			if (platform) platform.scaleY = 1 - ratio * 0.2;
		}

		// 跳跃物理
		if (
			this.player.state === PlayerState.JUMPING ||
			this.player.state === PlayerState.FALLING
		) {
			this.player.vy += this.config.gravity * dt;
			this.player.x += this.player.vx * dt;
			this.player.y += this.player.vy * dt;
			this.player.rotation += dt * 6;

			// 碰撞检测
			if (this.player.vy > 0) {
				this.checkCollision();
			}

			// 掉落检测
			if (this.player.y > this.cameraY + this.height + 100) {
				this.gameOver();
			}
		}

		// 摄像机跟随
		if (this.player.state !== PlayerState.FALLING) {
			this.targetCameraX =
				this.player.x + this.player.width / 2 - this.width / 2;
			this.targetCameraY = this.player.y - this.height / 2 + 100;
		}
		this.cameraX = MathUtils.lerp(this.cameraX, this.targetCameraX, 0.08);
		this.cameraY = MathUtils.lerp(this.cameraY, this.targetCameraY, 0.08);

		// 生成新平台
		while (this.platforms.length < this.currentPlatformIndex + 6) {
			this.generateNextPlatform();
		}

		// Combo显示更新
		if (this.showCombo) {
			this.comboDisplayTime += dt;
			this.comboY -= dt * 40;
			if (this.comboDisplayTime > 1.5) {
				this.showCombo = false;
			}
		}
	}

	checkCollision() {
		const playerCenterX = this.player.x + this.player.width / 2;
		const playerBottom = this.player.y + this.player.height;

		for (
			let i = this.currentPlatformIndex;
			i < Math.min(this.currentPlatformIndex + 3, this.platforms.length);
			i++
		) {
			const platform = this.platforms[i];
			const platformCenterX = platform.x + platform.width / 2;
			const platformTop = platform.y;

			// 检查是否落到平台高度
			if (playerBottom >= platformTop && playerBottom <= platformTop + 30) {
				const dx = Math.abs(playerCenterX - platformCenterX);

				if (dx <= platform.width / 2 + 5) {
					// 成功落地
					this.land(platform, i, dx);
					return;
				}
			}
		}

		// 检查是否错过平台
		const nextPlatform = this.platforms[this.currentPlatformIndex + 1];
		if (nextPlatform && playerBottom > nextPlatform.y + 50) {
			this.player.state = PlayerState.FALLING;
		}
	}

	land(platform, index, distance) {
		this.setPlayerOnPlatform(platform);
		this.currentPlatformIndex = index;

		// 计分
		let points = 1;
		let isPerfect = false;

		if (distance <= this.config.perfectRadius) {
			isPerfect = true;
			this.combo++;
			points = 2 + Math.min(this.combo, 5);

			if (this.combo >= 2) {
				this.showCombo = true;
				this.comboDisplayTime = 0;
				this.comboX = this.player.x + this.player.width / 2;
				this.comboY = this.player.y - 30;
			}
		} else {
			this.combo = 0;
		}

		this.score += points;
		this.updateHighScore();
	}

	gameOver() {
		this.state = GameState.GAMEOVER;
		this.updateHighScore();
	}

	loadHighScore() {
		try {
			return wx.getStorageSync("highScore") || 0;
		} catch (e) {
			return 0;
		}
	}

	updateHighScore() {
		if (this.score > this.highScore) {
			this.highScore = this.score;
			try {
				wx.setStorageSync("highScore", this.highScore);
			} catch (e) {}
		}
	}

	render() {
		const ctx = this.ctx;

		// 清空并绘制背景
		const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
		gradient.addColorStop(0, "#e8f4f8");
		gradient.addColorStop(1, "#c5dde8");
		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, this.width, this.height);

		// 渲染平台
		for (const platform of this.platforms) {
			this.renderPlatform(platform);
		}

		// 渲染玩家
		this.renderPlayer();

		// 渲染UI
		this.renderUI();

		// 渲染Combo
		if (this.showCombo && this.combo >= 2) {
			this.renderCombo();
		}

		// 渲染开始/结束界面
		if (this.state === GameState.READY) {
			this.renderStartScreen();
		} else if (this.state === GameState.GAMEOVER) {
			this.renderGameOver();
		}
	}

	renderPlatform(platform) {
		const ctx = this.ctx;
		const x = platform.x - this.cameraX;
		const y = platform.y - this.cameraY;
		const w = platform.width;
		const h = platform.height * platform.scaleY;
		const d = platform.depth * 0.25;

		// 顶面
		ctx.fillStyle = platform.color;
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + w, y);
		ctx.lineTo(x + w - d, y - d);
		ctx.lineTo(x - d, y - d);
		ctx.closePath();
		ctx.fill();

		// 正面
		ctx.fillStyle = this.darkenColor(platform.color, 0.15);
		ctx.fillRect(x, y, w, h);

		// 右侧面
		ctx.fillStyle = this.darkenColor(platform.color, 0.3);
		ctx.beginPath();
		ctx.moveTo(x + w, y);
		ctx.lineTo(x + w, y + h);
		ctx.lineTo(x + w - d, y + h - d);
		ctx.lineTo(x + w - d, y - d);
		ctx.closePath();
		ctx.fill();
	}

	renderPlayer() {
		const ctx = this.ctx;
		const p = this.player;
		const x = p.x - this.cameraX;
		const y = p.y - this.cameraY;

		ctx.save();
		ctx.translate(x + p.width / 2, y + p.height / 2);

		if (p.state === PlayerState.JUMPING) {
			ctx.rotate(p.rotation);
		}
		ctx.scale(1, p.scaleY);

		// 身体
		ctx.fillStyle = "#2c3e50";
		ctx.beginPath();
		const r = 8;
		ctx.moveTo(-p.width / 2 + r, -p.height / 2);
		ctx.lineTo(p.width / 2 - r, -p.height / 2);
		ctx.quadraticCurveTo(
			p.width / 2,
			-p.height / 2,
			p.width / 2,
			-p.height / 2 + r
		);
		ctx.lineTo(p.width / 2, p.height / 2 - r);
		ctx.quadraticCurveTo(
			p.width / 2,
			p.height / 2,
			p.width / 2 - r,
			p.height / 2
		);
		ctx.lineTo(-p.width / 2 + r, p.height / 2);
		ctx.quadraticCurveTo(
			-p.width / 2,
			p.height / 2,
			-p.width / 2,
			p.height / 2 - r
		);
		ctx.lineTo(-p.width / 2, -p.height / 2 + r);
		ctx.quadraticCurveTo(
			-p.width / 2,
			-p.height / 2,
			-p.width / 2 + r,
			-p.height / 2
		);
		ctx.fill();

		// 眼睛
		ctx.fillStyle = "#fff";
		ctx.beginPath();
		ctx.arc(-7, -5, 5, 0, Math.PI * 2);
		ctx.arc(7, -5, 5, 0, Math.PI * 2);
		ctx.fill();

		ctx.fillStyle = "#2c3e50";
		ctx.beginPath();
		ctx.arc(-7, -5, 2.5, 0, Math.PI * 2);
		ctx.arc(7, -5, 2.5, 0, Math.PI * 2);
		ctx.fill();

		ctx.restore();
	}

	renderUI() {
		const ctx = this.ctx;

		// 分数背景
		ctx.fillStyle = "rgba(0,0,0,0.25)";
		ctx.beginPath();
		ctx.roundRect(this.width / 2 - 60, 30, 120, 50, 12);
		ctx.fill();

		// 分数
		ctx.font = "bold 36px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = "#fff";
		ctx.fillText(this.score.toString(), this.width / 2, 55);

		// 最高分
		ctx.font = "16px Arial";
		ctx.textAlign = "left";
		ctx.fillStyle = "rgba(255,255,255,0.8)";
		ctx.fillText(`最高: ${this.highScore}`, 15, 30);
	}

	renderCombo() {
		const ctx = this.ctx;
		const x = this.comboX - this.cameraX;
		const y = this.comboY - this.cameraY;
		const alpha = Math.max(0, 1 - this.comboDisplayTime / 1.5);

		ctx.save();
		ctx.globalAlpha = alpha;
		ctx.font = "bold 28px Arial";
		ctx.textAlign = "center";
		ctx.strokeStyle = "#fff";
		ctx.lineWidth = 3;
		ctx.strokeText(`${this.combo} COMBO!`, x, y);
		ctx.fillStyle =
			this.combo >= 5 ? "#e74c3c" : this.combo >= 3 ? "#f39c12" : "#2ecc71";
		ctx.fillText(`${this.combo} COMBO!`, x, y);
		ctx.restore();
	}

	renderStartScreen() {
		const ctx = this.ctx;

		// 标题
		ctx.font = "bold 48px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = "#2c3e50";
		ctx.fillText("跳一跳", this.width / 2, this.height / 2 - 100);

		// 提示
		ctx.font = "20px Arial";
		ctx.fillStyle = "#7f8c8d";
		ctx.fillText("按住蓄力，松开跳跃", this.width / 2, this.height / 2 - 40);

		// 按钮
		ctx.fillStyle = "#3498db";
		ctx.beginPath();
		ctx.roundRect(this.width / 2 - 80, this.height / 2 + 20, 160, 50, 25);
		ctx.fill();

		ctx.font = "bold 22px Arial";
		ctx.fillStyle = "#fff";
		ctx.fillText("点击开始", this.width / 2, this.height / 2 + 45);
	}

	renderGameOver() {
		const ctx = this.ctx;

		// 遮罩
		ctx.fillStyle = "rgba(0,0,0,0.6)";
		ctx.fillRect(0, 0, this.width, this.height);

		// 面板
		ctx.fillStyle = "#fff";
		ctx.beginPath();
		ctx.roundRect(this.width / 2 - 130, this.height / 2 - 150, 260, 300, 15);
		ctx.fill();

		// 标题
		ctx.font = "bold 32px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = "#2c3e50";
		ctx.fillText("游戏结束", this.width / 2, this.height / 2 - 100);

		// 分数
		ctx.font = "bold 56px Arial";
		ctx.fillStyle = "#3498db";
		ctx.fillText(this.score.toString(), this.width / 2, this.height / 2 - 20);

		ctx.font = "18px Arial";
		ctx.fillStyle = "#7f8c8d";
		ctx.fillText("本次得分", this.width / 2, this.height / 2 + 20);
		ctx.fillText(
			`最高分: ${this.highScore}`,
			this.width / 2,
			this.height / 2 + 50
		);

		// 新纪录
		if (this.score === this.highScore && this.score > 0) {
			ctx.font = "bold 20px Arial";
			ctx.fillStyle = "#e74c3c";
			ctx.fillText("新纪录!", this.width / 2, this.height / 2 + 80);
		}

		// 重玩按钮
		ctx.fillStyle = "#2ecc71";
		ctx.beginPath();
		ctx.roundRect(this.width / 2 - 70, this.height / 2 + 100, 140, 45, 22);
		ctx.fill();

		ctx.font = "bold 20px Arial";
		ctx.fillStyle = "#fff";
		ctx.fillText("再来一局", this.width / 2, this.height / 2 + 122);
	}

	darkenColor(hex, factor) {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgb(${Math.floor(r * (1 - factor))},${Math.floor(
			g * (1 - factor)
		)},${Math.floor(b * (1 - factor))})`;
	}

	startLoop() {
		let lastTime = Date.now();

		const loop = () => {
			const now = Date.now();
			const dt = Math.min((now - lastTime) / 1000, 0.05);
			lastTime = now;

			this.update(dt);
			this.render();

			requestAnimationFrame(loop);
		};

		loop();
	}
}

// 启动游戏
new JumpGame();
