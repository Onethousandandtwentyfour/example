/**
 * 平台类
 */
import Sprite from "../base/Sprite";
import Config from "../base/Config";

export default class Platform extends Sprite {
	constructor(x = 0, y = 0) {
		super(x, y, Config.platform.width, Config.platform.height);

		// 平台深度（用于3D效果）
		this.depth = Config.platform.depth;

		// 平台类型
		this.type = "normal";

		// 颜色
		this.color = this.getRandomColor();

		// 是否激活
		this.active = true;

		// 是否已触发特殊效果
		this.triggered = false;

		// 动画相关
		this.scaleY = 1;
	}

	/**
	 * 获取随机颜色
	 * @returns {string}
	 */
	getRandomColor() {
		const colors = Config.platform.colors;
		return colors[Math.floor(Math.random() * colors.length)];
	}

	/**
	 * 重置平台
	 */
	reset() {
		this.active = true;
		this.triggered = false;
		this.scaleY = 1;
		this.color = this.getRandomColor();
		this.type = "normal";
	}

	/**
	 * 设置位置
	 * @param {number} x
	 * @param {number} y
	 */
	setPosition(x, y) {
		this.x = x;
		this.y = y;
	}

	/**
	 * 获取平台中心
	 * @returns {{x: number, y: number}}
	 */
	getCenter() {
		return {
			x: this.x + this.width / 2,
			y: this.y + this.height / 2,
		};
	}

	/**
	 * 获取平台顶部中心
	 * @returns {{x: number, y: number}}
	 */
	getTopCenter() {
		return {
			x: this.x + this.width / 2,
			y: this.y,
		};
	}

	/**
	 * 压缩动画（当玩家蓄力时）
	 * @param {number} ratio 压缩比例 0-1
	 */
	compress(ratio) {
		this.scaleY = 1 - ratio * 0.3;
	}

	/**
	 * 恢复形态
	 */
	restore() {
		this.scaleY = 1;
	}

	/**
	 * 更新
	 * @param {number} deltaTime
	 */
	update(deltaTime) {
		// 恢复动画
		if (this.scaleY < 1) {
			this.scaleY = Math.min(1, this.scaleY + deltaTime * 5);
		}
	}

	/**
	 * 渲染
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Camera} camera
	 */
	render(ctx, camera) {
		if (!this.visible || !this.active) return;

		// 转换到屏幕坐标
		const screenPos = camera.worldToScreen(this.x, this.y);

		ctx.save();

		// 绘制平台（3D效果的长方体）
		const w = this.width;
		const h = this.height * this.scaleY;
		const d = this.depth * 0.3; // 视觉深度

		// 顶面
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(screenPos.x, screenPos.y);
		ctx.lineTo(screenPos.x + w, screenPos.y);
		ctx.lineTo(screenPos.x + w - d, screenPos.y - d);
		ctx.lineTo(screenPos.x - d, screenPos.y - d);
		ctx.closePath();
		ctx.fill();

		// 正面
		ctx.fillStyle = this.darkenColor(this.color, 0.2);
		ctx.fillRect(screenPos.x, screenPos.y, w, h);

		// 右侧面
		ctx.fillStyle = this.darkenColor(this.color, 0.4);
		ctx.beginPath();
		ctx.moveTo(screenPos.x + w, screenPos.y);
		ctx.lineTo(screenPos.x + w, screenPos.y + h);
		ctx.lineTo(screenPos.x + w - d, screenPos.y + h - d);
		ctx.lineTo(screenPos.x + w - d, screenPos.y - d);
		ctx.closePath();
		ctx.fill();

		// 绘制完美区域指示（可选）
		// const center = this.getTopCenter();
		// const screenCenter = camera.worldToScreen(center.x, center.y);
		// ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
		// ctx.beginPath();
		// ctx.arc(screenCenter.x - d/2, screenCenter.y - d/2, Config.platform.perfectZoneRadius, 0, Math.PI * 2);
		// ctx.fill();

		ctx.restore();
	}

	/**
	 * 使颜色变暗
	 * @param {string} color 十六进制颜色
	 * @param {number} factor 变暗程度 0-1
	 * @returns {string}
	 */
	darkenColor(color, factor) {
		// 解析十六进制颜色
		const hex = color.replace("#", "");
		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);

		// 变暗
		const newR = Math.floor(r * (1 - factor));
		const newG = Math.floor(g * (1 - factor));
		const newB = Math.floor(b * (1 - factor));

		return `rgb(${newR}, ${newG}, ${newB})`;
	}
}
