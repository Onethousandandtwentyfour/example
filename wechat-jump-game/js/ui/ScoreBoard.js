/**
 * 计分板
 * 显示实时分数
 */
export default class ScoreBoard {
	constructor() {
		this.score = 0;
		this.highScore = 0;
		this.combo = 0;

		// 分数动画
		this.displayScore = 0;
		this.targetScore = 0;

		// 加分提示
		this.showAddScore = false;
		this.addScoreValue = 0;
		this.addScoreTime = 0;
		this.addScoreY = 0;
	}

	/**
	 * 更新分数
	 * @param {number} score
	 * @param {number} highScore
	 * @param {number} combo
	 */
	updateScore(score, highScore, combo) {
		if (score !== this.score) {
			this.addScoreValue = score - this.score;
			this.showAddScore = true;
			this.addScoreTime = 0;
			this.addScoreY = 0;
		}

		this.score = score;
		this.targetScore = score;
		this.highScore = highScore;
		this.combo = combo;
	}

	/**
	 * 更新
	 * @param {number} deltaTime
	 */
	update(deltaTime) {
		// 分数滚动动画
		if (this.displayScore < this.targetScore) {
			this.displayScore = Math.min(
				this.displayScore + deltaTime * 20,
				this.targetScore
			);
		}

		// 加分提示动画
		if (this.showAddScore) {
			this.addScoreTime += deltaTime;
			this.addScoreY -= deltaTime * 60;

			if (this.addScoreTime > 1) {
				this.showAddScore = false;
			}
		}
	}

	/**
	 * 渲染
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Renderer} renderer
	 */
	render(ctx, renderer) {
		// 当前分数
		const scoreText = Math.floor(this.displayScore).toString();

		ctx.save();

		// 分数背景
		const bgX = renderer.canvas.width / 2;
		const bgY = 80;

		ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
		ctx.beginPath();
		ctx.roundRect(bgX - 80, bgY - 30, 160, 60, 15);
		ctx.fill();

		// 分数文字
		ctx.font = "bold 48px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStyle = "#ffffff";
		ctx.fillText(scoreText, bgX, bgY);

		// 加分提示
		if (this.showAddScore && this.addScoreValue > 0) {
			const alpha = Math.max(0, 1 - this.addScoreTime);
			ctx.globalAlpha = alpha;
			ctx.font = "bold 28px Arial";
			ctx.fillStyle = "#ffcc00";
			ctx.fillText(`+${this.addScoreValue}`, bgX + 70, bgY + this.addScoreY);
			ctx.globalAlpha = 1;
		}

		// 最高分（左上角）
		ctx.font = "20px Arial";
		ctx.textAlign = "left";
		ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
		ctx.fillText(`最高: ${this.highScore}`, 20, 40);

		ctx.restore();
	}

	/**
	 * 重置
	 */
	reset() {
		this.score = 0;
		this.displayScore = 0;
		this.targetScore = 0;
		this.combo = 0;
		this.showAddScore = false;
	}
}
