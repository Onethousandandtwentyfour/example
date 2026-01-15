/**
 * 连击系统
 * 管理连击的视觉和音效反馈
 */
import Config from "../base/Config";

export default class ComboSystem {
	constructor() {
		// 当前连击数
		this.count = 0;

		// 连击显示相关
		this.showCombo = false;
		this.comboDisplayTime = 0;
		this.comboDisplayDuration = 1.5; // 显示1.5秒

		// 动画相关
		this.scale = 1;
		this.alpha = 1;

		// 位置
		this.x = 0;
		this.y = 0;
	}

	/**
	 * 触发连击
	 * @param {number} count 连击数
	 * @param {number} x 显示位置X
	 * @param {number} y 显示位置Y
	 */
	trigger(count, x, y) {
		this.count = count;
		this.x = x;
		this.y = y;

		if (count >= 2) {
			this.showCombo = true;
			this.comboDisplayTime = 0;
			this.scale = 1.5;
			this.alpha = 1;
		}
	}

	/**
	 * 重置连击
	 */
	reset() {
		this.count = 0;
		this.showCombo = false;
	}

	/**
	 * 更新
	 * @param {number} deltaTime
	 */
	update(deltaTime) {
		if (this.showCombo) {
			this.comboDisplayTime += deltaTime;

			// 动画效果
			if (this.comboDisplayTime < 0.2) {
				// 放大效果
				this.scale = 1.5 - (this.comboDisplayTime / 0.2) * 0.5;
			} else {
				this.scale = 1;
			}

			// 上浮效果
			this.y -= deltaTime * 50;

			// 淡出
			if (this.comboDisplayTime > this.comboDisplayDuration - 0.5) {
				this.alpha = (this.comboDisplayDuration - this.comboDisplayTime) / 0.5;
			}

			// 隐藏
			if (this.comboDisplayTime >= this.comboDisplayDuration) {
				this.showCombo = false;
			}
		}
	}

	/**
	 * 渲染
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Camera} camera
	 */
	render(ctx, camera) {
		if (!this.showCombo || this.count < 2) return;

		const screenPos = camera.worldToScreen(this.x, this.y);

		ctx.save();

		ctx.globalAlpha = this.alpha;
		ctx.translate(screenPos.x, screenPos.y);
		ctx.scale(this.scale, this.scale);

		// 绘制连击文字
		ctx.font = "bold 36px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		// 描边
		ctx.strokeStyle = "#ffffff";
		ctx.lineWidth = 4;
		ctx.strokeText(`${this.count} COMBO!`, 0, 0);

		// 填充
		ctx.fillStyle = this.getComboColor();
		ctx.fillText(`${this.count} COMBO!`, 0, 0);

		// 加分提示
		const bonus = this.getBonus();
		if (bonus > 0) {
			ctx.font = "bold 24px Arial";
			ctx.fillStyle = "#ffcc00";
			ctx.strokeStyle = "#ffffff";
			ctx.lineWidth = 3;
			ctx.strokeText(`+${bonus}`, 0, 35);
			ctx.fillText(`+${bonus}`, 0, 35);
		}

		ctx.restore();
	}

	/**
	 * 获取连击颜色
	 * @returns {string}
	 */
	getComboColor() {
		if (this.count >= 5) return "#ff4444";
		if (this.count >= 4) return "#ff8800";
		if (this.count >= 3) return "#ffcc00";
		return "#44ff44";
	}

	/**
	 * 获取连击加成
	 * @returns {number}
	 */
	getBonus() {
		const bonusArr = Config.score.comboBonus;
		const index = Math.min(this.count, bonusArr.length - 1);
		return bonusArr[index];
	}
}
