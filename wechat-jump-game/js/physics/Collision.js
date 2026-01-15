/**
 * 碰撞检测
 */
import Config from "../base/Config";
import { distance } from "../../utils/math";

// 碰撞类型
export const CollisionType = {
	NONE: "none",
	PERFECT: "perfect",
	SAFE: "safe",
	EDGE: "edge",
	MISS: "miss",
};

export default class Collision {
	constructor() {
		this.perfectRadius = Config.platform.perfectZoneRadius;
		this.safeRadius = Config.platform.safeZoneRadius;
	}

	/**
	 * AABB 碰撞检测
	 * @param {Object} rect1 {x, y, width, height}
	 * @param {Object} rect2 {x, y, width, height}
	 * @returns {boolean}
	 */
	checkAABB(rect1, rect2) {
		return (
			rect1.x < rect2.x + rect2.width &&
			rect1.x + rect1.width > rect2.x &&
			rect1.y < rect2.y + rect2.height &&
			rect1.y + rect1.height > rect2.y
		);
	}

	/**
	 * 点与矩形碰撞检测
	 * @param {number} px 点X
	 * @param {number} py 点Y
	 * @param {Object} rect {x, y, width, height}
	 * @returns {boolean}
	 */
	checkPointInRect(px, py, rect) {
		return (
			px >= rect.x &&
			px <= rect.x + rect.width &&
			py >= rect.y &&
			py <= rect.y + rect.height
		);
	}

	/**
	 * 圆形与矩形碰撞检测
	 * @param {number} cx 圆心X
	 * @param {number} cy 圆心Y
	 * @param {number} radius 半径
	 * @param {Object} rect {x, y, width, height}
	 * @returns {boolean}
	 */
	checkCircleRect(cx, cy, radius, rect) {
		// 找到矩形上离圆心最近的点
		const closestX = Math.max(rect.x, Math.min(cx, rect.x + rect.width));
		const closestY = Math.max(rect.y, Math.min(cy, rect.y + rect.height));

		// 计算距离
		const dist = distance(cx, cy, closestX, closestY);

		return dist <= radius;
	}

	/**
	 * 检测玩家与平台的碰撞
	 * @param {Object} player 玩家对象
	 * @param {Object} platform 平台对象
	 * @returns {{type: string, distance: number}}
	 */
	checkPlayerPlatform(player, platform) {
		// 玩家底部中心点
		const playerCenterX = player.x + player.width / 2;
		const playerBottomY = player.y + player.height;

		// 平台顶部中心点
		const platformCenterX = platform.x + platform.width / 2;
		const platformTopY = platform.y;

		// 首先检查玩家是否下落到平台高度
		// 只有当玩家底部接近或超过平台顶部时才检测
		if (playerBottomY < platformTopY - 10) {
			return { type: CollisionType.NONE, distance: Infinity };
		}

		// 计算玩家中心到平台中心的水平距离
		const dx = Math.abs(playerCenterX - platformCenterX);

		// 检查是否在平台范围内
		const platformHalfWidth = platform.width / 2;

		if (dx > platformHalfWidth + 10) {
			// 完全在平台外
			return { type: CollisionType.MISS, distance: dx };
		}

		// 判断落点质量
		if (dx <= this.perfectRadius) {
			return { type: CollisionType.PERFECT, distance: dx };
		} else if (dx <= this.safeRadius) {
			return { type: CollisionType.SAFE, distance: dx };
		} else if (dx <= platformHalfWidth) {
			return { type: CollisionType.EDGE, distance: dx };
		}

		return { type: CollisionType.MISS, distance: dx };
	}

	/**
	 * 检测玩家与所有平台的碰撞
	 * @param {Object} player 玩家对象
	 * @param {Array} platforms 平台列表
	 * @param {number} currentIndex 当前平台索引
	 * @returns {{platform: Object, result: Object} | null}
	 */
	checkPlayerPlatforms(player, platforms, currentIndex) {
		// 只检测当前和下一个平台
		const startIndex = Math.max(0, currentIndex);
		const endIndex = Math.min(platforms.length, currentIndex + 3);

		for (let i = startIndex; i < endIndex; i++) {
			const platform = platforms[i];
			const result = this.checkPlayerPlatform(player, platform);

			if (
				result.type !== CollisionType.NONE &&
				result.type !== CollisionType.MISS
			) {
				return { platform, result, index: i };
			}
		}

		// 检查是否掉落
		const nextPlatform = platforms[currentIndex + 1];
		if (nextPlatform) {
			const playerBottomY = player.y + player.height;
			// 如果玩家下落到远低于下一个平台的位置
			if (playerBottomY > nextPlatform.y + 100) {
				return {
					platform: null,
					result: { type: CollisionType.MISS, distance: Infinity },
					index: -1,
				};
			}
		}

		return null;
	}
}
