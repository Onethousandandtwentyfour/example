/* eslint-disable */
import Vue from "vue";
import DialogContainer from '../components/dialogue/index.js';

/**
 * 函数式调用 Dialog
 *
 * @param {object} ComponentTemplate - 要渲染的 Vue 组件（必须是 import 进来的构造器）
 * @param {object} props - 传递给组件的 props
 * @param {object} options - 弹窗配置（title, width 等）
 * @returns {Promise<void>} 关闭时 resolve
 */
export default function showDialog(
	ComponentTemplate,
	props = {},
	options = {}
) {
	// 销毁旧实例
	if (showDialog.instance) {
		showDialog.instance.$destroy();
		showDialog.instance.$el.remove();
		showDialog.instance = null;
	}
	delete options.visible;

	const Constructor = Vue.extend(DialogContainer);
	const instance = new Constructor({
		propsData: {
			component: ComponentTemplate,
			componentProps: props,
		},
		_attrs: options,
	});

	instance.$mount();
	document.body.appendChild(instance.$el);
	showDialog.instance = instance; // 保留引用用于后续销毁（单例模式）
	return new Promise((resolve) => {
		instance.$on("close", () => {
			resolve();
			showDialog.instance.$destroy();
			showDialog.instance.$el.remove();
			showDialog.instance = null;
		});
		instance.$on("submit", resolve);
	});
}
