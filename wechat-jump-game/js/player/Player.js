/**
 * 玩家角色
 */
import Sprite from "../base/Sprite";
import Config from "../base/Config";

const PlayerState = Config.playerState;

export default class Player extends Sprite {
	constructor() {
		super(0, 0, Config.player.width, Config.player.height);

		// 速度
		this.vx = 0;
		this.vy = 0;

		// 状态
		this.state = PlayerState.IDLE;

		// 蓄力
		this.chargeStartTime = 0;
		this.chargePower = 0;

		// 当前所站平台
		this.currentPlatform = null;

		// 跳跃方向 (1: 右前, -1: 左前)
		this.direction = 1;

		// 动画相关
		this.scaleY = 1;
		this.rotation = 0;

		// 颜色
		this.color = Config.player.color;
	}

	/**
	 * 重置玩家
	 */
	reset() {
		this.vx = 0;
		this.vy = 0;
		this.state = PlayerState.IDLE;
		this.chargeStartTime = 0;
		this.chargePower = 0;
		this.currentPlatform = null;
		this.scaleY = 1;
		this.rotation = 0;
	}

	/**
	 * 设置位置到平台上
	 * @param {Object} platform
	 */
	setOnPlatform(platform) {
		this.currentPlatform = platform;
		// 站在平台中心上方
		this.x = platform.x + platform.width / 2 - this.width / 2;
		this.y = platform.y - this.height;
		this.vx = 0;
		this.vy = 0;
	}

	/**
	 * 开始蓄力
	 */
	startCharge() {
		if (this.state !== PlayerState.IDLE) return;

		this.state = PlayerState.CHARGING;
		this.chargeStartTime = Date.now();
		this.chargePower = 0;
	}

	/**
	 * 更新蓄力
	 * @returns {number} 当前蓄力时间(秒)
	 */
	updateCharge() {
		if (this.state !== PlayerState.CHARGING) return 0;

		const chargeTime = (Date.now() - this.chargeStartTime) / 1000;

		// 蓄力动画：角色被压扁
		const maxCompress = 1 - Config.player.chargeScaleY;
		const compressRatio = Math.min(chargeTime / 1.5, 1); // 1.5秒达到最大压缩
		this.scaleY = 1 - maxCompress * compressRatio;

		// 同时平台也有压缩效果（在平台类中处理）

		return chargeTime;
	}

	/**
	 * 执行跳跃
	 * @param {number} vx 水平速度
	 * @param {number} vy 垂直速度
	 */
	jump(vx, vy) {
		if (this.state !== PlayerState.CHARGING) return;

		this.state = PlayerState.JUMPING;
		this.vx = vx;
		this.vy = vy;
		this.scaleY = 1;
		this.rotation = 0;

		// 清除当前平台
		this.currentPlatform = null;
	}

	/**
	 * 落地
	 * @param {Object} platform
	 */
	land(platform) {
		this.state = PlayerState.LANDING;
		this.setOnPlatform(platform);

		// 短暂的落地状态后切换到IDLE
		setTimeout(() => {
			if (this.state === PlayerState.LANDING) {
				this.state = PlayerState.IDLE;
			}
		}, 100);
	}

	/**
	 * 开始下落（失败）
	 */
	fall() {
		this.state = PlayerState.FALLING;
		// 保持当前速度继续下落
	}

	/**
	 * 更新
	 * @param {number} deltaTime
	 */
	update(deltaTime) {
		if (this.state === PlayerState.CHARGING) {
			this.updateCharge();
		} else if (
			this.state === PlayerState.JUMPING ||
			this.state === PlayerState.FALLING
		) {
			// 跳跃时的旋转动画
			this.rotation += deltaTime * 5;
		}
	}

	/**
	 * 渲染
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Camera} camera
	 */
	render(ctx, camera) {
		if (!this.visible) return;

		// 转换到屏幕坐标
		const screenPos = camera.worldToScreen(this.x, this.y);

		ctx.save();

		// 移动到角色中心
		const centerX = screenPos.x + this.width / 2;
		const centerY = screenPos.y + this.height / 2;

		ctx.translate(centerX, centerY);

		// 旋转（跳跃时）
		if (this.state === PlayerState.JUMPING) {
			ctx.rotate(this.rotation);
		}

		// 缩放（蓄力时）
		ctx.scale(1, this.scaleY);

		// 绘制角色（简单的圆角矩形）
		ctx.fillStyle = this.color;
		ctx.beginPath();

		const w = this.width;
		const h = this.height;
		const r = 10; // 圆角半径

		ctx.moveTo(-w / 2 + r, -h / 2);
		ctx.lineTo(w / 2 - r, -h / 2);
		ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
		ctx.lineTo(w / 2, h / 2 - r);
		ctx.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
		ctx.lineTo(-w / 2 + r, h / 2);
		ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
		ctx.lineTo(-w / 2, -h / 2 + r);
		ctx.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);

		ctx.fill();

		// 绘制眼睛
		ctx.fillStyle = "#ffffff";
		ctx.beginPath();
		ctx.arc(-8, -5, 6, 0, Math.PI * 2);
		ctx.arc(8, -5, 6, 0, Math.PI * 2);
		ctx.fill();

		ctx.fillStyle = "#333333";
		ctx.beginPath();
		ctx.arc(-8, -5, 3, 0, Math.PI * 2);
		ctx.arc(8, -5, 3, 0, Math.PI * 2);
		ctx.fill();

		ctx.restore();
	}

	/**
	 * 获取中心位置
	 * @returns {{x: number, y: number}}
	 */
	getCenter() {
		return {
			x: this.x + this.width / 2,
			y: this.y + this.height / 2,
		};
	}

	/**
	 * 是否正在跳跃
	 * @returns {boolean}
	 */
	isJumping() {
		return this.state === PlayerState.JUMPING;
	}

	/**
	 * 是否正在蓄力
	 * @returns {boolean}
	 */
	isCharging() {
		return this.state === PlayerState.CHARGING;
	}

	/**
	 * 是否空闲
	 * @returns {boolean}
	 */
	isIdle() {
		return this.state === PlayerState.IDLE;
	}

	/**
	 * 是否下落中
	 * @returns {boolean}
	 */
	isFalling() {
		return this.state === PlayerState.FALLING;
	}
}
