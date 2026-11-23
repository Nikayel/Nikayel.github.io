/* The page and its anchor navigation work without JavaScript. */
(() => {
  const sections = [...document.querySelectorAll('.case-section')];
  const chapterLinks = [...document.querySelectorAll('.chapter-nav li a')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pendingFrame = false;

  // Read the section positions together; update the small contents rail once per frame.
  function updateCurrentChapter() {
    pendingFrame = false;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= 160) current = section;
    }
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 24) {
      current = sections.at(-1);
    }
    if (!current) return;
    for (const link of chapterLinks) {
      if (link.hash === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }

  function queueChapterUpdate() {
    if (pendingFrame) return;
    pendingFrame = true;
    window.requestAnimationFrame(updateCurrentChapter);
  }

  window.addEventListener('scroll', queueChapterUpdate, { passive: true });
  window.addEventListener('resize', queueChapterUpdate);
  window.addEventListener('hashchange', queueChapterUpdate);
  window.addEventListener('load', queueChapterUpdate, { once: true });
  updateCurrentChapter();

  // Motion's current, small animation entry point is an optional enhancement.
  // No content starts hidden, so a blocked CDN never makes the page unreadable.
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;
  let observer;
  const animations = new Set();
  const motionChange = () => {
    if (!reducedMotion.matches) return;
    observer?.disconnect();
    for (const animation of animations) animation.complete();
    animations.clear();
  };
  reducedMotion.addEventListener('change', motionChange);

  import('https://cdn.jsdelivr.net/npm/motion@14.11.1/mini/+esm')
    .then(({ animate }) => {
      if (reducedMotion.matches) return;
      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          const animation = animate(entry.target,
            { opacity: [0.6, 1], transform: ['translateY(10px)', 'translateY(0)'] },
            { duration: 0.28, ease: [0.22, 1, 0.36, 1] });
          animations.add(animation);
          animation.then(() => animations.delete(animation));
        }
      }, { threshold: 0.08 });
      // Sections already on screen stay put, so nothing flickers when Motion arrives.
      for (const section of sections) {
        if (section.getBoundingClientRect().top > window.innerHeight) observer.observe(section);
      }
    })
    .catch(() => { /* Native navigation and all content remain available offline. */ });
})();
