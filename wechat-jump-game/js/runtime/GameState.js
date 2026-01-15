/**
 * 游戏状态机
 */
import Config from "../base/Config";

export default class GameState {
	constructor() {
		this.currentState = Config.state.READY;
		this.listeners = {};
	}

	/**
	 * 获取当前状态
	 * @returns {number}
	 */
	getState() {
		return this.currentState;
	}

	/**
	 * 设置状态
	 * @param {number} newState
	 */
	setState(newState) {
		const oldState = this.currentState;
		if (oldState !== newState) {
			this.currentState = newState;
			this.emit("stateChange", { oldState, newState });
		}
	}

	/**
	 * 是否处于某状态
	 * @param {number} state
	 * @returns {boolean}
	 */
	is(state) {
		return this.currentState === state;
	}

	/**
	 * 是否正在游戏中
	 * @returns {boolean}
	 */
	isPlaying() {
		return this.currentState === Config.state.PLAYING;
	}

	/**
	 * 是否游戏结束
	 * @returns {boolean}
	 */
	isGameOver() {
		return this.currentState === Config.state.GAMEOVER;
	}

	/**
	 * 是否准备中
	 * @returns {boolean}
	 */
	isReady() {
		return this.currentState === Config.state.READY;
	}

	/**
	 * 监听事件
	 * @param {string} event
	 * @param {Function} callback
	 */
	on(event, callback) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(callback);
	}

	/**
	 * 移除监听
	 * @param {string} event
	 * @param {Function} callback
	 */
	off(event, callback) {
		if (this.listeners[event]) {
			this.listeners[event] = this.listeners[event].filter(
				(cb) => cb !== callback
			);
		}
	}

	/**
	 * 触发事件
	 * @param {string} event
	 * @param {*} data
	 */
	emit(event, data) {
		if (this.listeners[event]) {
			this.listeners[event].forEach((callback) => callback(data));
		}
	}
}
