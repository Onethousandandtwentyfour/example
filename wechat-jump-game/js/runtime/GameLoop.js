/**
 * 游戏主循环
 */
export default class GameLoop {
	constructor(updateCallback, renderCallback) {
		this.updateCallback = updateCallback;
		this.renderCallback = renderCallback;

		this.lastTime = 0;
		this.running = false;
		this.animationId = null;

		// 绑定 loop 方法
		this.loop = this.loop.bind(this);
	}

	/**
	 * 开始游戏循环
	 */
	start() {
		if (this.running) return;

		this.running = true;
		this.lastTime = Date.now();
		this.animationId = requestAnimationFrame(this.loop);
	}

	/**
	 * 停止游戏循环
	 */
	stop() {
		this.running = false;
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
		}
	}

	/**
	 * 暂停
	 */
	pause() {
		this.running = false;
	}

	/**
	 * 恢复
	 */
	resume() {
		if (!this.running) {
			this.running = true;
			this.lastTime = Date.now();
			this.animationId = requestAnimationFrame(this.loop);
		}
	}

	/**
	 * 主循环
	 */
	loop() {
		if (!this.running) return;

		const currentTime = Date.now();
		// deltaTime 转换为秒，限制最大值防止跳帧
		const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.05);
		this.lastTime = currentTime;

		// 更新逻辑
		if (this.updateCallback) {
			this.updateCallback(deltaTime);
		}

		// 渲染
		if (this.renderCallback) {
			this.renderCallback();
		}

		// 继续下一帧
		this.animationId = requestAnimationFrame(this.loop);
	}
}
