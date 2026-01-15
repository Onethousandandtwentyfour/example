/**
 * 分数管理器
 */
import DataBus from "../base/DataBus";
import Config from "../base/Config";
import { CollisionType } from "../physics/Collision";

export default class ScoreManager {
	constructor() {
		this.dataBus = DataBus;
	}

	/**
	 * 处理落地得分
	 * @param {string} landType 落地类型 (CollisionType)
	 * @returns {{score: number, isPerfect: boolean, combo: number}}
	 */
	processLanding(landType) {
		let score = 0;
		let isPerfect = false;
		let combo = 0;

		if (landType === CollisionType.PERFECT) {
			isPerfect = true;
			this.dataBus.addCombo();
			combo = this.dataBus.comboCount;

			// 基础分 + 完美加成 + 连击加成
			score =
				Config.score.baseScore +
				Config.score.perfectBonus +
				this.dataBus.getComboBonus();
		} else if (
			landType === CollisionType.SAFE ||
			landType === CollisionType.EDGE
		) {
			// 普通落地，重置连击
			this.dataBus.resetCombo();
			score = Config.score.baseScore;
		}

		// 增加分数
		if (score > 0) {
			this.dataBus.addScore(score);
		}

		return { score, isPerfect, combo };
	}

	/**
	 * 处理特殊平台得分
	 * @returns {number}
	 */
	processSpecialPlatform() {
		const score = Config.score.specialScore;
		this.dataBus.addScore(score);
		return score;
	}

	/**
	 * 获取当前分数
	 * @returns {number}
	 */
	getScore() {
		return this.dataBus.score;
	}

	/**
	 * 获取最高分
	 * @returns {number}
	 */
	getHighScore() {
		return this.dataBus.highScore;
	}

	/**
	 * 获取当前连击数
	 * @returns {number}
	 */
	getCombo() {
		return this.dataBus.comboCount;
	}

	/**
	 * 重置分数
	 */
	reset() {
		this.dataBus.reset();
	}

	/**
	 * 上传分数
	 */
	uploadScore() {
		this.dataBus.uploadScore();
	}
}
