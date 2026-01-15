/**
 * 平台管理器
 */
import Platform from "./Platform";
import Pool from "../base/Pool";
import Config from "../base/Config";
import { random, randomInt } from "../../utils/math";

export default class PlatformManager {
	constructor() {
		// 平台对象池
		this.pool = new Pool(() => new Platform(), 10);

		// 活跃的平台列表
		this.platforms = [];

		// 生成配置
		this.baseDistance = Config.platform.baseDistance;
		this.maxDistance = Config.platform.maxDistance;
		this.minDistance = Config.platform.minDistance;

		// 当前难度
		this.difficulty = 0;

		// 当前方向 (1: 右, -1: 左)
		this.currentDirection = 1;
	}

	/**
	 * 初始化平台
	 * @param {number} startX 起始X
	 * @param {number} startY 起始Y
	 */
	init(startX, startY) {
		this.clear();

		// 创建初始平台
		const firstPlatform = this.pool.get();
		firstPlatform.setPosition(startX, startY);
		this.platforms.push(firstPlatform);

		// 生成后续几个平台
		for (let i = 0; i < 3; i++) {
			this.generateNext();
		}
	}

	/**
	 * 生成下一个平台
	 * @returns {Platform}
	 */
	generateNext() {
		const lastPlatform = this.platforms[this.platforms.length - 1];
		if (!lastPlatform) return null;

		// 计算距离（根据难度）
		const distanceRange = this.maxDistance - this.minDistance;
		const baseDistance =
			this.minDistance + distanceRange * this.difficulty * 0.5;
		const distance = baseDistance + random(-30, 50);

		// 随机切换方向（20%概率）
		if (Math.random() < 0.2) {
			this.currentDirection *= -1;
		}

		// 计算新位置
		// X轴：根据方向移动
		const newX = lastPlatform.x + distance * this.currentDirection;
		// Y轴：随机上下偏移，整体略微上移
		const newY = lastPlatform.y + random(-50, 30);

		// 创建新平台
		const platform = this.pool.get();
		platform.setPosition(newX, newY);

		// 随机设置平台类型
		if (Math.random() < 0.1 && this.platforms.length > 3) {
			platform.type = "special";
			// 特殊平台可以有不同的大小或颜色
			platform.width = Config.platform.width * 1.2;
		}

		this.platforms.push(platform);
		return platform;
	}

	/**
	 * 更新难度
	 * @param {number} score 当前分数
	 */
	updateDifficulty(score) {
		// 难度从0到1，50分达到最高难度
		this.difficulty = Math.min(score / 50, 1);
	}

	/**
	 * 回收视口外的平台
	 * @param {Camera} camera
	 */
	recyclePlatforms(camera) {
		const viewLeft = camera.x - camera.viewWidth;

		// 保留当前和之后的平台
		while (this.platforms.length > 0) {
			const platform = this.platforms[0];
			// 如果平台在视口左侧很远，回收它
			if (platform.x + platform.width < viewLeft - 200) {
				this.pool.recycle(this.platforms.shift());
			} else {
				break;
			}
		}
	}

	/**
	 * 确保有足够的平台
	 * @param {number} currentIndex 当前平台索引
	 */
	ensurePlatforms(currentIndex) {
		// 保持当前平台之后有至少3个平台
		const neededCount = currentIndex + 4;
		while (this.platforms.length < neededCount) {
			this.generateNext();
		}
	}

	/**
	 * 更新所有平台
	 * @param {number} deltaTime
	 */
	update(deltaTime) {
		for (const platform of this.platforms) {
			if (platform.active) {
				platform.update(deltaTime);
			}
		}
	}

	/**
	 * 渲染所有平台
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Camera} camera
	 */
	render(ctx, camera) {
		// 按Y坐标排序，从上到下渲染（实现遮挡效果）
		const sortedPlatforms = [...this.platforms].sort((a, b) => a.y - b.y);

		for (const platform of sortedPlatforms) {
			if (
				platform.active &&
				camera.isInView(platform.x, platform.y, platform.width, platform.depth)
			) {
				platform.render(ctx, camera);
			}
		}
	}

	/**
	 * 获取平台
	 * @param {number} index
	 * @returns {Platform}
	 */
	getPlatform(index) {
		return this.platforms[index];
	}

	/**
	 * 获取平台数量
	 * @returns {number}
	 */
	getCount() {
		return this.platforms.length;
	}

	/**
	 * 清空所有平台
	 */
	clear() {
		while (this.platforms.length > 0) {
			this.pool.recycle(this.platforms.pop());
		}
		this.difficulty = 0;
		this.currentDirection = 1;
	}

	/**
	 * 获取下一个跳跃方向
	 * @param {number} currentIndex
	 * @returns {number} 1: 右, -1: 左
	 */
	getJumpDirection(currentIndex) {
		const current = this.platforms[currentIndex];
		const next = this.platforms[currentIndex + 1];

		if (!current || !next) return 1;

		return next.x > current.x ? 1 : -1;
	}
}
