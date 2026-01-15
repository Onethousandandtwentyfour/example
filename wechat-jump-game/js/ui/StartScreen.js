/**
 * 开始界面
 */
export default class StartScreen {
	constructor() {
		this.visible = true;

		// 按钮区域
		this.startBtn = { x: 0, y: 0, width: 200, height: 60 };

		// 动画
		this.titleY = 0;
		this.btnScale = 1;
		this.time = 0;
	}

	/**
	 * 显示
	 */
	show() {
		this.visible = true;
		this.time = 0;
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

		this.time += deltaTime;

		// 标题浮动动画
		this.titleY = Math.sin(this.time * 2) * 10;

		// 按钮脉冲动画
		this.btnScale = 1 + Math.sin(this.time * 3) * 0.05;
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

		// 标题
		ctx.font = "bold 56px Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		// 阴影
		ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
		ctx.fillText("跳一跳", centerX + 3, centerY - 150 + this.titleY + 3);

		// 文字
		ctx.fillStyle = "#333333";
		ctx.fillText("跳一跳", centerX, centerY - 150 + this.titleY);

		// 副标题
		ctx.font = "24px Arial";
		ctx.fillStyle = "#666666";
		ctx.fillText("按住屏幕蓄力，松开跳跃", centerX, centerY - 80);

		// 开始按钮
		const btnY = centerY + 50;

		ctx.translate(centerX, btnY);
		ctx.scale(this.btnScale, this.btnScale);

		// 按钮背景
		ctx.fillStyle = "#409eff";
		ctx.beginPath();
		ctx.roundRect(-100, -30, 200, 60, 30);
		ctx.fill();

		// 按钮文字
		ctx.font = "bold 28px Arial";
		ctx.fillStyle = "#ffffff";
		ctx.fillText("开始游戏", 0, 0);

		ctx.restore();

		// 更新按钮区域
		this.startBtn = {
			x: centerX - 100 * this.btnScale,
			y: btnY - 30 * this.btnScale,
			width: 200 * this.btnScale,
			height: 60 * this.btnScale,
		};

		// 提示文字
		ctx.font = "18px Arial";
		ctx.textAlign = "center";
		ctx.fillStyle = "#999999";
		ctx.fillText("点击任意位置开始", centerX, renderer.canvas.height - 100);
	}

	/**
	 * 检查点击
	 * @param {number} x
	 * @param {number} y
	 * @returns {boolean}
	 */
	checkClick(x, y) {
		if (!this.visible) return false;
		// 点击任意位置都可以开始
		return true;
	}
}
