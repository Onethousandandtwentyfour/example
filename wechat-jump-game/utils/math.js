/**
 * 数学工具函数
 */

/**
 * 线性插值
 * @param {number} a 起始值
 * @param {number} b 目标值
 * @param {number} t 插值因子 (0-1)
 * @returns {number}
 */
export function lerp(a, b, t) {
	return a + (b - a) * t;
}

/**
 * 限制值在范围内
 * @param {number} value 值
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number}
 */
export function clamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
}

/**
 * 生成范围内的随机数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number}
 */
export function random(min, max) {
	return min + Math.random() * (max - min);
}

/**
 * 生成范围内的随机整数
 * @param {number} min 最小值
 * @param {number} max 最大值
 * @returns {number}
 */
export function randomInt(min, max) {
	return Math.floor(random(min, max + 1));
}

/**
 * 计算两点之间的距离
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @returns {number}
 */
export function distance(x1, y1, x2, y2) {
	const dx = x2 - x1;
	const dy = y2 - y1;
	return Math.sqrt(dx * dx + dy * dy);
}

/**
 * 角度转弧度
 * @param {number} degrees
 * @returns {number}
 */
export function degToRad(degrees) {
	return (degrees * Math.PI) / 180;
}

/**
 * 弧度转角度
 * @param {number} radians
 * @returns {number}
 */
export function radToDeg(radians) {
	return (radians * 180) / Math.PI;
}

/**
 * 2D 向量类
 */
export class Vector2 {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	set(x, y) {
		this.x = x;
		this.y = y;
		return this;
	}

	copy(v) {
		this.x = v.x;
		this.y = v.y;
		return this;
	}

	clone() {
		return new Vector2(this.x, this.y);
	}

	add(v) {
		this.x += v.x;
		this.y += v.y;
		return this;
	}

	sub(v) {
		this.x -= v.x;
		this.y -= v.y;
		return this;
	}

	scale(s) {
		this.x *= s;
		this.y *= s;
		return this;
	}

	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	normalize() {
		const len = this.length();
		if (len > 0) {
			this.x /= len;
			this.y /= len;
		}
		return this;
	}

	distanceTo(v) {
		return distance(this.x, this.y, v.x, v.y);
	}
}
