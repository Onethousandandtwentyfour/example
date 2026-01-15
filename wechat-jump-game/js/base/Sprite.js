/**
 * 精灵基类
 * 所有游戏对象的基类
 */
export default class Sprite {
	constructor(x = 0, y = 0, width = 0, height = 0) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.visible = true;
		this.active = true;
	}

	/**
	 * 更新
	 * @param {number} deltaTime
	 */
	update(deltaTime) {
		// 子类实现
	}

	/**
	 * 渲染
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Camera} camera
	 */
	render(ctx, camera) {
		// 子类实现
	}

	/**
	 * 获取中心点
	 * @returns {{x: number, y: number}}
	 */
	getCenter() {
		return {
			x: this.x + this.width / 2,
			y: this.y + this.height / 2,
		};
	}

	/**
	 * 获取边界
	 * @returns {{left: number, right: number, top: number, bottom: number}}
	 */
	getBounds() {
		return {
			left: this.x,
			right: this.x + this.width,
			top: this.y,
			bottom: this.y + this.height,
		};
	}

	/**
	 * 销毁
	 */
	destroy() {
		this.active = false;
		this.visible = false;
	}
}
