/* Tilts the hero layer stack toward the pointer. The page works without it. */
(() => {
  const scene = document.querySelector('[data-tilt]');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!scene || !finePointer.matches || reducedMotion.matches) return;

  const base = { rx: 38, rz: -22 };
  let frame = 0;

  function tilt(event) {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const box = scene.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      scene.style.setProperty('--rx', `${base.rx - y * 10}deg`);
      scene.style.setProperty('--rz', `${base.rz + x * 12}deg`);
    });
  }

  function reset() {
    cancelAnimationFrame(frame);
    scene.style.removeProperty('--rx');
    scene.style.removeProperty('--rz');
  }

  scene.addEventListener('pointermove', tilt);
  scene.addEventListener('pointerleave', reset);
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) reset(); });
})();
