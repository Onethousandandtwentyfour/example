/**
 * 游戏结束界面
 */
export default class GameOverScreen {
	constructor() {
		this.visible = false;
		this.score = 0;
		this.highScore = 0;
		this.isNewRecord = false;

		// 按钮区域
		this.restartBtn = { x: 0, y: 0, width: 200, height: 60 };
		this.rankBtn = { x: 0, y: 0, width: 200, height: 60 };

		// 动画
		this.alpha = 0;
		this.scale = 0.8;
	}

	/**
	 * 显示
	 * @param {number} score
	 * @param {number} highScore
	 */
	show(score, highScore) {
		this.visible = true;
		this.score = score;
		this.highScore = highScore;
		this.isNewRecord = score >= highScore && score > 0;
		this.alpha = 0;
		this.scale = 0.8;
	}

	/**
	 * 隐藏
	 */
	hide() {
		this.visible = false;
	}

	/**
	 * 更新
	 * @param {number} deltaTime
	 */
	update(deltaTime) {
		if (!this.visible) return;

		// 淡入动画
		if (this.alpha < 1) {
			this.alpha = Math.min(1, this.alpha + deltaTime * 3);
		}

		// 缩放动画
		if (this.scale < 1) {
			this.scale = Math.min(1, this.scale + deltaTime * 2);
		}
	}

	/**
	 * 渲染
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Renderer} renderer
	 */
	render(ctx, renderer) {
		if (!this.visible) return;

		const centerX = renderer.canvas.width / 2;
		const centerY = renderer.canvas.height / 2;

		ctx.save();
		ctx.globalAlpha = this.alpha;

		// 半透明背景
		ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
		ctx.fillRect(0, 0, renderer.canvas.width, renderer.canvas.height);

		// 面板
		ctx.translate(centerX, centerY);
		ctx.scale(this.scale, this.scale);

		const panelWidth = 320;
		const panelHeight = 400;

		// 面板背景
		ctx.fillStyle = "#ffffff";
		ctx.beginPath();
		ctx.roundRect(
			-panelWidth / 2,
			-panelHeight / 2,
			panelWidth,
			panelHeight,
			20
		);
		ctx.fill();

		// 标题
		ctx.font = "bold 36px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = "#333333";
		ctx.fillText("游戏结束", 0, -panelHeight / 2 + 50);

		// 分数
		ctx.font = "bold 64px Arial";
		ctx.fillStyle = "#409eff";
		ctx.fillText(this.score.toString(), 0, -30);

		ctx.font = "20px Arial";
		ctx.fillStyle = "#666666";
		ctx.fillText("本次得分", 0, 30);

		// 最高分
		ctx.font = "24px Arial";
		ctx.fillStyle = "#999999";
		ctx.fillText(`最高分: ${this.highScore}`, 0, 80);

		// 新纪录
		if (this.isNewRecord) {
			ctx.font = "bold 24px Arial";
			ctx.fillStyle = "#ff6600";
			ctx.fillText("新纪录!", 0, 110);
		}

		// 重新开始按钮
		const btnY = panelHeight / 2 - 90;
		this.restartBtn = {
			x: centerX - 100,
			y: centerY + btnY * this.scale - 25,
			width: 200,
			height: 50,
		};

		ctx.fillStyle = "#67c23a";
		ctx.beginPath();
		ctx.roundRect(-100, btnY - 25, 200, 50, 25);
		ctx.fill();

		ctx.font = "bold 22px Arial";
		ctx.fillStyle = "#ffffff";
		ctx.fillText("再来一局", 0, btnY);

		// 排行榜按钮
		const rankBtnY = btnY + 60;
		this.rankBtn = {
			x: centerX - 100,
			y: centerY + rankBtnY * this.scale - 20,
			width: 200,
			height: 40,
		};

		ctx.font = "20px Arial";
		ctx.fillStyle = "#409eff";
		ctx.fillText("查看排行榜", 0, rankBtnY);

		ctx.restore();
	}

	/**
	 * 检查点击
	 * @param {number} x
	 * @param {number} y
	 * @returns {string|null} 'restart' | 'rank' | null
	 */
	checkClick(x, y) {
		if (!this.visible) return null;

		// 检查重新开始按钮
		if (this.isPointInRect(x, y, this.restartBtn)) {
			return "restart";
		}

		// 检查排行榜按钮
		if (this.isPointInRect(x, y, this.rankBtn)) {
			return "rank";
		}

		return null;
	}

	/**
	 * 点是否在矩形内
	 * @param {number} x
	 * @param {number} y
	 * @param {Object} rect
	 * @returns {boolean}
	 */
	isPointInRect(x, y, rect) {
		return (
			x >= rect.x &&
			x <= rect.x + rect.width &&
			y >= rect.y &&
			y <= rect.y + rect.height
		);
	}
}
