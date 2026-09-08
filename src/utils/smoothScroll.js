const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function smoothScrollTo(target, duration = 1100) {
  const el = typeof target === 'string' ? document.getElementById(target) : target;
  if (!el) return;

  const startY = window.scrollY;
  const targetY = el.getBoundingClientRect().top + window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  const step = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    window.scrollTo(0, startY + distance * easeInOutCubic(progress));
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}
