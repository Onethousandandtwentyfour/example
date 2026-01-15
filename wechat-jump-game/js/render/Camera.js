/**
 * 摄像机
 * 实现视角跟随
 */
import Config from "../base/Config";
import { lerp, clamp } from "../../utils/math";

export default class Camera {
	constructor() {
		this.x = 0;
		this.y = 0;

		// 目标位置
		this.targetX = 0;
		this.targetY = 0;

		// 平滑系数
		this.smoothFactor = Config.camera.smoothFactor;

		// 偏移量
		this.offsetY = Config.camera.offsetY;

		// 视口尺寸
		this.viewWidth = Config.canvas.width;
		this.viewHeight = Config.canvas.height;
	}

	/**
	 * 设置跟随目标
	 * @param {number} x
	 * @param {number} y
	 */
	setTarget(x, y) {
		this.targetX = x;
		this.targetY = y + this.offsetY;
	}

	/**
	 * 立即移动到目标位置
	 * @param {number} x
	 * @param {number} y
	 */
	moveTo(x, y) {
		this.x = x;
		this.y = y + this.offsetY;
		this.targetX = this.x;
		this.targetY = this.y;
	}

	/**
	 * 更新摄像机位置
	 * @param {number} deltaTime
	 */
	update(deltaTime) {
		// 平滑插值
		this.x = lerp(this.x, this.targetX, this.smoothFactor);
		this.y = lerp(this.y, this.targetY, this.smoothFactor);
	}

	/**
	 * 世界坐标转屏幕坐标
	 * @param {number} worldX
	 * @param {number} worldY
	 * @returns {{x: number, y: number}}
	 */
	worldToScreen(worldX, worldY) {
		return {
			x: worldX - this.x + this.viewWidth / 2,
			y: worldY - this.y + this.viewHeight / 2,
		};
	}

	/**
	 * 屏幕坐标转世界坐标
	 * @param {number} screenX
	 * @param {number} screenY
	 * @returns {{x: number, y: number}}
	 */
	screenToWorld(screenX, screenY) {
		return {
			x: screenX + this.x - this.viewWidth / 2,
			y: screenY + this.y - this.viewHeight / 2,
		};
	}

	/**
	 * 检查对象是否在视口内
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @returns {boolean}
	 */
	isInView(x, y, width, height) {
		const screenPos = this.worldToScreen(x, y);
		return (
			screenPos.x + width > 0 &&
			screenPos.x < this.viewWidth &&
			screenPos.y + height > 0 &&
			screenPos.y < this.viewHeight
		);
	}

	/**
	 * 重置摄像机
	 */
	reset() {
		this.x = 0;
		this.y = 0;
		this.targetX = 0;
		this.targetY = 0;
	}
}
