(function () {
  const MotionLib = window.Motion;
  if (!MotionLib) return;

  const { animate, hover, scroll } = MotionLib;
  const easeOut = [0.22, 1, 0.36, 1];
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktopHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (reduce) return;

  const progress = document.querySelector(".scroll-progress");
  if (progress) {
    scroll(animate(progress, { scaleX: [0, 1] }, { ease: "linear" }));
  }

  if (!desktopHover) return;

  document.documentElement.classList.add("motion-hover");

  hover(".project-tile", (el) => {
    animate(el, { y: -12, scale: 1.02 }, { duration: 0.55, ease: easeOut });
    return () => animate(el, { y: 0, scale: 1 }, { duration: 0.55, ease: easeOut });
  });

  hover(".contact-pill", (el) => {
    animate(el, { y: -4, scale: 1.015 }, { duration: 0.35, ease: easeOut });
    return () => animate(el, { y: 0, scale: 1 }, { duration: 0.35, ease: easeOut });
  });

  hover(".contact-send, .header-cta, .theme-toggle", (el) => {
    animate(el, { scale: 1.04 }, { duration: 0.28, ease: easeOut });
    return () => animate(el, { scale: 1 }, { duration: 0.28, ease: easeOut });
  });

  const hero = document.querySelector(".hero");
  const heroImg = document.querySelector(".hero-media img");
  if (hero && heroImg) {
    document.documentElement.classList.add("motion-parallax");
    scroll(animate(heroImg, { y: [0, 80] }, { ease: "linear" }), {
      target: hero,
      offset: ["start start", "end start"],
    });
  }
})();
