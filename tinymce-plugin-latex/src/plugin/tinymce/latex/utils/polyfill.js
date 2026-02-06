// 兼容 matches
export function matches(el, selector) {
  const fn = el.matches || el.webkitMatchesSelector || el.msMatchesSelector;
  return fn ? fn.call(el, selector) : false;
}

export function closest(el, selector) {
  if (el.closest) return el.closest(selector);
  // fallback for old browsers
  while (el) {
    if (el.nodeType === 1 && matches(el, selector)) return el;
    el = el.parentElement;
  }
  return null;
}
