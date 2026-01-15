/**
 * 对象池
 * 用于复用对象，减少 GC
 */
export default class Pool {
	constructor(createFn, initialSize = 10) {
		this.createFn = createFn;
		this.pool = [];

		// 预创建对象
		for (let i = 0; i < initialSize; i++) {
			this.pool.push(this.createFn());
		}
	}

	/**
	 * 获取对象
	 * @returns {*}
	 */
	get() {
		if (this.pool.length > 0) {
			return this.pool.pop();
		}
		return this.createFn();
	}

	/**
	 * 回收对象
	 * @param {*} obj
	 */
	recycle(obj) {
		if (obj.reset) {
			obj.reset();
		}
		this.pool.push(obj);
	}

	/**
	 * 清空对象池
	 */
	clear() {
		this.pool = [];
	}

	/**
	 * 获取池大小
	 * @returns {number}
	 */
	size() {
		return this.pool.length;
	}
}
