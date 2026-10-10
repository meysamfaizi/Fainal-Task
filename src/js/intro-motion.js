// This enhancement is independent of transaction loading and data URLs.
const intro = document.querySelector(".page-intro");

if (intro) {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = null;
  let pointerX = 0;
  let pointerY = 0;

  const canAnimate = () => finePointer.matches && !reducedMotion.matches;
  const clamp = (value) => Math.min(1, Math.max(0, value));

  function paint() {
    frame = null;
    if (!intro.classList.contains("is-active") || !canAnimate()) return;

    // Read the stationary hit area, not the transformed scene, to avoid jitter.
    const bounds = intro.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const x = clamp((pointerX - bounds.left) / bounds.width);
    const y = clamp((pointerY - bounds.top) / bounds.height);

    intro.style.setProperty("--intro-x", `${(x * 100).toFixed(2)}%`);
    intro.style.setProperty("--intro-y", `${(y * 100).toFixed(2)}%`);
    intro.style.setProperty("--intro-rx", `${((0.5 - y) * 9).toFixed(2)}deg`);
    intro.style.setProperty("--intro-ry", `${((x - 0.5) * 12).toFixed(2)}deg`);
    intro.style.setProperty("--intro-icon-angle", `${((x - 0.5) * -8).toFixed(2)}deg`);
    intro.style.setProperty("--intro-orbit-angle", `${(-25 + x * 50).toFixed(2)}deg`);
    intro.style.setProperty("--intro-hue", (195 + x * 65).toFixed(2));
  }

  function move(event) {
    if (event.pointerType === "touch" || !canAnimate()) return;
    intro.classList.add("is-active");
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (frame === null) frame = requestAnimationFrame(paint);
  }

  function reset() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    intro.classList.remove("is-active");
    intro.style.setProperty("--intro-rx", "0deg");
    intro.style.setProperty("--intro-ry", "0deg");
    intro.style.setProperty("--intro-icon-angle", "0deg");
    intro.style.setProperty("--intro-orbit-angle", "-25deg");
  }

  intro.addEventListener("pointerenter", move, { passive: true });
  intro.addEventListener("pointermove", move, { passive: true });
  intro.addEventListener("pointerleave", reset);
  intro.addEventListener("pointercancel", reset);
  finePointer.addEventListener("change", reset);
  reducedMotion.addEventListener("change", reset);
  window.addEventListener("blur", reset);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) reset();
  });
}
