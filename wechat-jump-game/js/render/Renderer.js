/**
 * 渲染器
 */
import Config from "../base/Config";

export default class Renderer {
	constructor(canvas, ctx) {
		this.canvas = canvas;
		this.ctx = ctx;

		// 设计稿尺寸
		this.designWidth = Config.canvas.width;
		this.designHeight = Config.canvas.height;

		// 计算缩放比例
		this.scale = 1;
		this.offsetX = 0;
		this.offsetY = 0;

		this.resize();
	}

	/**
	 * 适配屏幕
	 */
	resize() {
		const { windowWidth, windowHeight } = wx.getSystemInfoSync();

		// 计算缩放
		const scaleX = windowWidth / this.designWidth;
		const scaleY = windowHeight / this.designHeight;
		this.scale = Math.min(scaleX, scaleY);

		// 设置画布尺寸
		this.canvas.width = windowWidth;
		this.canvas.height = windowHeight;

		// 计算偏移使游戏居中
		this.offsetX = (windowWidth - this.designWidth * this.scale) / 2;
		this.offsetY = (windowHeight - this.designHeight * this.scale) / 2;
	}

	/**
	 * 清空画布
	 */
	clear() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	/**
	 * 填充背景
	 * @param {string} color
	 */
	fillBackground(color = "#f5f5f5") {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	}

	/**
	 * 转换坐标 (设计稿坐标 -> 屏幕坐标)
	 * @param {number} x
	 * @param {number} y
	 * @returns {{x: number, y: number}}
	 */
	toScreen(x, y) {
		return {
			x: x * this.scale + this.offsetX,
			y: y * this.scale + this.offsetY,
		};
	}

	/**
	 * 转换尺寸
	 * @param {number} size
	 * @returns {number}
	 */
	toScreenSize(size) {
		return size * this.scale;
	}

	/**
	 * 屏幕坐标转设计稿坐标
	 * @param {number} screenX
	 * @param {number} screenY
	 * @returns {{x: number, y: number}}
	 */
	toDesign(screenX, screenY) {
		return {
			x: (screenX - this.offsetX) / this.scale,
			y: (screenY - this.offsetY) / this.scale,
		};
	}

	/**
	 * 绘制矩形
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @param {string} color
	 */
	drawRect(x, y, width, height, color) {
		const pos = this.toScreen(x, y);
		const w = this.toScreenSize(width);
		const h = this.toScreenSize(height);

		this.ctx.fillStyle = color;
		this.ctx.fillRect(pos.x, pos.y, w, h);
	}

	/**
	 * 绘制圆形
	 * @param {number} x
	 * @param {number} y
	 * @param {number} radius
	 * @param {string} color
	 */
	drawCircle(x, y, radius, color) {
		const pos = this.toScreen(x, y);
		const r = this.toScreenSize(radius);

		this.ctx.beginPath();
		this.ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
		this.ctx.fillStyle = color;
		this.ctx.fill();
	}

	/**
	 * 绘制文字
	 * @param {string} text
	 * @param {number} x
	 * @param {number} y
	 * @param {string} color
	 * @param {number} fontSize
	 * @param {string} align
	 */
	drawText(text, x, y, color = "#333", fontSize = 24, align = "left") {
		const pos = this.toScreen(x, y);
		const size = this.toScreenSize(fontSize);

		this.ctx.font = `${size}px Arial`;
		this.ctx.fillStyle = color;
		this.ctx.textAlign = align;
		this.ctx.textBaseline = "middle";
		this.ctx.fillText(text, pos.x, pos.y);
	}

	/**
	 * 保存上下文状态
	 */
	save() {
		this.ctx.save();
	}

	/**
	 * 恢复上下文状态
	 */
	restore() {
		this.ctx.restore();
	}
}
