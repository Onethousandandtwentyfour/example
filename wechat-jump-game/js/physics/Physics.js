/**
 * 物理引擎
 */
import Config from "../base/Config";
import { degToRad, clamp } from "../../utils/math";

export default class Physics {
	constructor() {
		this.gravity = Config.physics.gravity;
		this.chargeRate = Config.physics.chargeRate;
		this.maxChargePower = Config.physics.maxChargePower;
		this.minChargePower = Config.physics.minChargePower;
		this.jumpAngle = degToRad(Config.physics.jumpAngle);
	}

	/**
	 * 计算蓄力值
	 * @param {number} chargeTime 蓄力时间(秒)
	 * @returns {number} 蓄力值
	 */
	calculateChargePower(chargeTime) {
		const power = chargeTime * this.chargeRate * 100;
		return clamp(power, this.minChargePower, this.maxChargePower);
	}

	/**
	 * 计算跳跃初速度
	 * @param {number} power 蓄力值
	 * @param {number} direction 方向 (1: 右, -1: 左)
	 * @returns {{vx: number, vy: number}}
	 */
	calculateJumpVelocity(power, direction = 1) {
		// 水平速度
		const vx = power * Math.cos(this.jumpAngle) * direction;
		// 垂直速度 (向上为负)
		const vy = -power * Math.sin(this.jumpAngle);

		return { vx, vy };
	}

	/**
	 * 应用重力
	 * @param {Object} object 有 vy 属性的对象
	 * @param {number} deltaTime
	 */
	applyGravity(object, deltaTime) {
		object.vy += this.gravity * deltaTime;
	}

	/**
	 * 更新位置
	 * @param {Object} object 有 x, y, vx, vy 属性的对象
	 * @param {number} deltaTime
	 */
	updatePosition(object, deltaTime) {
		object.x += object.vx * deltaTime;
		object.y += object.vy * deltaTime;
	}

	/**
	 * 预测跳跃落点
	 * @param {number} startX 起始X
	 * @param {number} startY 起始Y
	 * @param {number} power 蓄力值
	 * @param {number} direction 方向
	 * @param {number} targetY 目标Y坐标
	 * @returns {{x: number, y: number, time: number}}
	 */
	predictLanding(startX, startY, power, direction, targetY) {
		const { vx, vy } = this.calculateJumpVelocity(power, direction);

		// 使用抛物线公式计算落点
		// y = y0 + vy*t + 0.5*g*t^2
		// 求解 t: 0.5*g*t^2 + vy*t + (y0 - targetY) = 0

		const a = 0.5 * this.gravity;
		const b = vy;
		const c = startY - targetY;

		// 二次方程求解
		const discriminant = b * b - 4 * a * c;

		if (discriminant < 0) {
			// 无解，返回估计值
			return { x: startX + vx * 2, y: targetY, time: 2 };
		}

		const t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
		const t2 = (-b - Math.sqrt(discriminant)) / (2 * a);

		// 选择正的较小值
		const time = t1 > 0 && t2 > 0 ? Math.min(t1, t2) : Math.max(t1, t2);

		return {
			x: startX + vx * time,
			y: targetY,
			time: time,
		};
	}

	/**
	 * 获取蓄力百分比
	 * @param {number} power
	 * @returns {number} 0-1
	 */
	getChargePowerPercent(power) {
		return (
			(power - this.minChargePower) /
			(this.maxChargePower - this.minChargePower)
		);
	}
}
