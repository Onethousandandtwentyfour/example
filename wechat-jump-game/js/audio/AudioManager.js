/**
 * 音频管理器
 */
export default class AudioManager {
	constructor() {
		// 音效实例
		this.sounds = {};

		// 背景音乐
		this.bgm = null;

		// 是否启用音效
		this.soundEnabled = true;

		// 是否启用背景音乐
		this.musicEnabled = true;

		// 音量
		this.soundVolume = 1;
		this.musicVolume = 0.5;

		// 加载设置
		this.loadSettings();
	}

	/**
	 * 加载设置
	 */
	loadSettings() {
		try {
			const soundEnabled = wx.getStorageSync("soundEnabled");
			const musicEnabled = wx.getStorageSync("musicEnabled");

			if (soundEnabled !== "") {
				this.soundEnabled = soundEnabled;
			}
			if (musicEnabled !== "") {
				this.musicEnabled = musicEnabled;
			}
		} catch (e) {
			console.error("加载音频设置失败:", e);
		}
	}

	/**
	 * 保存设置
	 */
	saveSettings() {
		try {
			wx.setStorageSync("soundEnabled", this.soundEnabled);
			wx.setStorageSync("musicEnabled", this.musicEnabled);
		} catch (e) {
			console.error("保存音频设置失败:", e);
		}
	}

	/**
	 * 预加载音效
	 * @param {string} name 音效名称
	 * @param {string} src 音效路径
	 */
	loadSound(name, src) {
		const audio = wx.createInnerAudioContext();
		audio.src = src;

		this.sounds[name] = {
			audio,
			src,
		};
	}

	/**
	 * 预加载所有音效
	 */
	preloadAll() {
		// 音效文件路径
		const soundList = {
			charge: "assets/audios/charge.mp3",
			jump: "assets/audios/jump.mp3",
			land: "assets/audios/land.mp3",
			perfect: "assets/audios/perfect.mp3",
			combo: "assets/audios/combo.mp3",
			fail: "assets/audios/fail.mp3",
			button: "assets/audios/button.mp3",
		};

		for (const [name, src] of Object.entries(soundList)) {
			this.loadSound(name, src);
		}

		// 加载背景音乐
		this.bgm = wx.createInnerAudioContext();
		this.bgm.src = "assets/audios/bgm.mp3";
		this.bgm.loop = true;
		this.bgm.volume = this.musicVolume;
	}

	/**
	 * 播放音效
	 * @param {string} name 音效名称
	 */
	playSound(name) {
		if (!this.soundEnabled) return;

		const sound = this.sounds[name];
		if (sound) {
			// 创建新的音频实例来支持同时播放
			const audio = wx.createInnerAudioContext();
			audio.src = sound.src;
			audio.volume = this.soundVolume;

			audio.onEnded(() => {
				audio.destroy();
			});

			audio.onError((err) => {
				console.error(`播放音效 ${name} 失败:`, err);
				audio.destroy();
			});

			audio.play();
		}
	}

	/**
	 * 播放蓄力音效（循环）
	 */
	playCharge() {
		if (!this.soundEnabled) return;

		const sound = this.sounds["charge"];
		if (sound && sound.audio) {
			sound.audio.loop = true;
			sound.audio.volume = this.soundVolume;
			sound.audio.play();
		}
	}

	/**
	 * 停止蓄力音效
	 */
	stopCharge() {
		const sound = this.sounds["charge"];
		if (sound && sound.audio) {
			sound.audio.stop();
			sound.audio.loop = false;
		}
	}

	/**
	 * 播放跳跃音效
	 */
	playJump() {
		this.playSound("jump");
	}

	/**
	 * 播放落地音效
	 * @param {boolean} isPerfect 是否完美落地
	 */
	playLand(isPerfect = false) {
		if (isPerfect) {
			this.playSound("perfect");
		} else {
			this.playSound("land");
		}
	}

	/**
	 * 播放连击音效
	 */
	playCombo() {
		this.playSound("combo");
	}

	/**
	 * 播放失败音效
	 */
	playFail() {
		this.playSound("fail");
	}

	/**
	 * 播放按钮音效
	 */
	playButton() {
		this.playSound("button");
	}

	/**
	 * 播放背景音乐
	 */
	playBGM() {
		if (!this.musicEnabled || !this.bgm) return;
		this.bgm.play();
	}

	/**
	 * 暂停背景音乐
	 */
	pauseBGM() {
		if (this.bgm) {
			this.bgm.pause();
		}
	}

	/**
	 * 停止背景音乐
	 */
	stopBGM() {
		if (this.bgm) {
			this.bgm.stop();
		}
	}

	/**
	 * 切换音效开关
	 * @returns {boolean} 新状态
	 */
	toggleSound() {
		this.soundEnabled = !this.soundEnabled;
		this.saveSettings();
		return this.soundEnabled;
	}

	/**
	 * 切换背景音乐开关
	 * @returns {boolean} 新状态
	 */
	toggleMusic() {
		this.musicEnabled = !this.musicEnabled;

		if (this.musicEnabled) {
			this.playBGM();
		} else {
			this.pauseBGM();
		}

		this.saveSettings();
		return this.musicEnabled;
	}

	/**
	 * 设置音效音量
	 * @param {number} volume 0-1
	 */
	setSoundVolume(volume) {
		this.soundVolume = Math.max(0, Math.min(1, volume));
	}

	/**
	 * 设置音乐音量
	 * @param {number} volume 0-1
	 */
	setMusicVolume(volume) {
		this.musicVolume = Math.max(0, Math.min(1, volume));
		if (this.bgm) {
			this.bgm.volume = this.musicVolume;
		}
	}

	/**
	 * 销毁所有音频
	 */
	destroy() {
		for (const sound of Object.values(this.sounds)) {
			if (sound.audio) {
				sound.audio.destroy();
			}
		}
		this.sounds = {};

		if (this.bgm) {
			this.bgm.destroy();
			this.bgm = null;
		}
	}
}
