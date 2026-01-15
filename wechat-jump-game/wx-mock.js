/**
 * 微信小游戏 API 模拟层
 * 用于在浏览器中预览游戏
 */

// 创建全局 wx 对象
window.wx = {
	// 创建画布
	createCanvas: function () {
		const canvas = document.getElementById("gameCanvas");
		// 设置画布尺寸
		const width = Math.min(window.innerWidth, 450);
		const height = Math.min(window.innerHeight, 800);
		canvas.width = width;
		canvas.height = height;
		return canvas;
	},

	// 获取系统信息
	getSystemInfoSync: function () {
		return {
			windowWidth: Math.min(window.innerWidth, 450),
			windowHeight: Math.min(window.innerHeight, 800),
			pixelRatio: window.devicePixelRatio || 1,
			platform: "browser",
		};
	},

	// 触摸事件
	onTouchStart: function (callback) {
		const canvas = document.getElementById("gameCanvas");
		canvas.addEventListener("mousedown", (e) => {
			const rect = canvas.getBoundingClientRect();
			callback({
				touches: [
					{
						clientX: e.clientX - rect.left,
						clientY: e.clientY - rect.top,
					},
				],
			});
		});
		canvas.addEventListener("touchstart", (e) => {
			e.preventDefault();
			const rect = canvas.getBoundingClientRect();
			const touch = e.touches[0];
			callback({
				touches: [
					{
						clientX: touch.clientX - rect.left,
						clientY: touch.clientY - rect.top,
					},
				],
			});
		});
	},

	onTouchEnd: function (callback) {
		const canvas = document.getElementById("gameCanvas");
		canvas.addEventListener("mouseup", () => callback({}));
		canvas.addEventListener("touchend", (e) => {
			e.preventDefault();
			callback({});
		});
	},

	onTouchMove: function (callback) {
		// 不需要实现
	},

	// 生命周期
	onShow: function (callback) {
		document.addEventListener("visibilitychange", () => {
			if (!document.hidden) callback({});
		});
	},

	onHide: function (callback) {
		document.addEventListener("visibilitychange", () => {
			if (document.hidden) callback();
		});
	},

	// 本地存储
	getStorageSync: function (key) {
		try {
			const value = localStorage.getItem(key);
			return value ? JSON.parse(value) : "";
		} catch (e) {
			return "";
		}
	},

	setStorageSync: function (key, value) {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (e) {
			console.error("存储失败:", e);
		}
	},

	// 音频（简化版）
	createInnerAudioContext: function () {
		return {
			src: "",
			loop: false,
			volume: 1,
			play: function () {},
			pause: function () {},
			stop: function () {},
			destroy: function () {},
			onEnded: function () {},
			onError: function () {},
		};
	},

	// 开放数据域（模拟）
	getOpenDataContext: function () {
		return {
			canvas: document.createElement("canvas"),
			postMessage: function (data) {
				console.log("发送到开放数据域:", data);
			},
		};
	},

	// 云存储（模拟）
	setUserCloudStorage: function (options) {
		console.log("上传分数:", options.KVDataList);
		if (options.success) options.success();
	},

	getFriendCloudStorage: function (options) {
		// 模拟好友数据
		if (options.success) {
			options.success({ data: [] });
		}
	},

	// 分享
	shareAppMessage: function (options) {
		console.log("分享:", options);
		alert("分享功能需要在微信中使用");
	},

	onShareAppMessage: function (callback) {
		// 浏览器不支持
	},
};

// 模拟 requestAnimationFrame（如果需要）
if (!window.requestAnimationFrame) {
	window.requestAnimationFrame = function (callback) {
		return setTimeout(callback, 1000 / 60);
	};
}

if (!window.cancelAnimationFrame) {
	window.cancelAnimationFrame = function (id) {
		clearTimeout(id);
	};
}

// Canvas 2D roundRect polyfill
if (!CanvasRenderingContext2D.prototype.roundRect) {
	CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
		if (typeof r === "number") {
			r = { tl: r, tr: r, br: r, bl: r };
		} else {
			r = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...r };
		}
		this.beginPath();
		this.moveTo(x + r.tl, y);
		this.lineTo(x + w - r.tr, y);
		this.quadraticCurveTo(x + w, y, x + w, y + r.tr);
		this.lineTo(x + w, y + h - r.br);
		this.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
		this.lineTo(x + r.bl, y + h);
		this.quadraticCurveTo(x, y + h, x, y + h - r.bl);
		this.lineTo(x, y + r.tl);
		this.quadraticCurveTo(x, y, x + r.tl, y);
		this.closePath();
		return this;
	};
}

console.log("微信 API 模拟层已加载");
