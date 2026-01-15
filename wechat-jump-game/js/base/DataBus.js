/**
 * 全局数据总线
 * 单例模式，管理游戏全局状态和数据
 */
import Config from "./Config";

let instance = null;

class DataBus {
	constructor() {
		if (instance) {
			return instance;
		}
		instance = this;
		this.reset();
	}

	/**
	 * 重置游戏数据
	 */
	reset() {
		// 游戏状态
		this.gameState = Config.state.READY;

		// 分数
		this.score = 0;
		this.highScore = this.getHighScore();

		// 连击
		this.comboCount = 0;

		// 平台列表
		this.platforms = [];

		// 玩家引用
		this.player = null;

		// 当前平台索引
		this.currentPlatformIndex = 0;

		// 跳跃方向 (1: 右前方, -1: 左前方)
		this.jumpDirection = 1;
	}

	/**
	 * 增加分数
	 * @param {number} points
	 */
	addScore(points) {
		this.score += points;
		this.updateHighScore();
	}

	/**
	 * 增加连击
	 */
	addCombo() {
		this.comboCount++;
	}

	/**
	 * 重置连击
	 */
	resetCombo() {
		this.comboCount = 0;
	}

	/**
	 * 获取连击加成分数
	 * @returns {number}
	 */
	getComboBonus() {
		const bonusArr = Config.score.comboBonus;
		const index = Math.min(this.comboCount, bonusArr.length - 1);
		return bonusArr[index];
	}

	/**
	 * 获取本地存储的最高分
	 * @returns {number}
	 */
	getHighScore() {
		try {
			const score = wx.getStorageSync("highScore");
			return score || 0;
		} catch (e) {
			return 0;
		}
	}

	/**
	 * 更新最高分
	 */
	updateHighScore() {
		if (this.score > this.highScore) {
			this.highScore = this.score;
			try {
				wx.setStorageSync("highScore", this.highScore);
			} catch (e) {
				console.error("保存最高分失败:", e);
			}
		}
	}

	/**
	 * 上传分数到开放数据域
	 */
	uploadScore() {
		try {
			wx.setUserCloudStorage({
				KVDataList: [
					{
						key: "score",
						value: String(this.highScore),
					},
				],
				success: () => {
					console.log("分数上传成功");
				},
				fail: (err) => {
					console.error("分数上传失败:", err);
				},
			});
		} catch (e) {
			console.error("上传分数异常:", e);
		}
	}
}

export default new DataBus();
