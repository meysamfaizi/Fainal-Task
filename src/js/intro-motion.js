// This enhancement is independent of transaction loading and data URLs.
const intro = document.querySelector(".page-intro");

if (intro) {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = null;
  let pointerX = 0;
  let pointerY = 0;
  let tiltFactor = 1;
  let auraFrame = null;
  let auraPointerX = 0;
  let auraPointerY = 0;

  // A fixed-size decorative layer adds no layout space or interactive controls.
  const aura = document.createElement("div");
  aura.className = "intro-aura";
  aura.setAttribute("aria-hidden", "true");
  const field = document.createElement("div");
  field.className = "aura-field";
  for (const className of [
    "aura-orb aura-orb--teal",
    "aura-orb aura-orb--violet",
    "aura-orb aura-orb--rose",
    "aura-ribbon aura-ribbon--teal",
    "aura-ribbon aura-ribbon--violet",
  ]) {
    const decoration = document.createElement("span");
    decoration.className = className;
    field.appendChild(decoration);
  }
  const sparks = document.createElement("div");
  sparks.className = "aura-sparks";
  for (let index = 0; index < 6; index++) {
    const spark = document.createElement("span");
    spark.className = "aura-spark";
    sparks.appendChild(spark);
  }
  field.appendChild(sparks);
  const light = document.createElement("span");
  light.className = "aura-pointer-light";
  aura.appendChild(field);
  aura.appendChild(light);
  document.body.prepend(aura);

  const canAnimate = () => !reducedMotion.matches;
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
    intro.style.setProperty("--intro-rx", `${((0.5 - y) * 9 * tiltFactor).toFixed(2)}deg`);
    intro.style.setProperty("--intro-ry", `${((x - 0.5) * 12 * tiltFactor).toFixed(2)}deg`);
    intro.style.setProperty("--intro-icon-angle", `${((x - 0.5) * -8).toFixed(2)}deg`);
    intro.style.setProperty("--intro-orbit-angle", `${(-25 + x * 50).toFixed(2)}deg`);
    intro.style.setProperty("--intro-hue", (195 + x * 65).toFixed(2));
  }

  function move(event) {
    if (!canAnimate()) return;
    tiltFactor = event.pointerType === "touch" ? 0.45 : 1;
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

  function resetAura() {
    if (auraFrame !== null) cancelAnimationFrame(auraFrame);
    auraFrame = null;
    aura.style.setProperty("--aura-strength", "0");
    aura.style.setProperty("--aura-dx", "0px");
    aura.style.setProperty("--aura-dy", "0px");
  }

  function paintAura() {
    auraFrame = null;
    if (!canAnimate() || document.hidden || document.querySelector("dialog[open]")) {
      resetAura();
      return;
    }

    const bounds = aura.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const x = (auraPointerX - bounds.left) / bounds.width;
    const y = (auraPointerY - bounds.top) / bounds.height;
    const distance = Math.hypot((x - 0.5) * 2, (y - 0.5) * 2);
    const strength = clamp(1.15 - distance * 0.7);

    aura.style.setProperty("--aura-pointer-x", `${(clamp(x) * 100).toFixed(2)}%`);
    aura.style.setProperty("--aura-pointer-y", `${(clamp(y) * 100).toFixed(2)}%`);
    aura.style.setProperty("--aura-strength", strength.toFixed(3));
    aura.style.setProperty("--aura-hue", (190 + clamp(x) * 80).toFixed(2));
    aura.style.setProperty("--aura-dx", `${((clamp(x) - 0.5) * 64 * strength).toFixed(2)}px`);
    aura.style.setProperty("--aura-dy", `${((clamp(y) - 0.5) * 40 * strength).toFixed(2)}px`);
  }

  function moveAura(event) {
    if (!canAnimate() || document.hidden) return;
    auraPointerX = event.clientX;
    auraPointerY = event.clientY;
    if (auraFrame === null) auraFrame = requestAnimationFrame(paintAura);
  }

  function resetAll() {
    reset();
    resetAura();
  }

  function syncAura() {
    resetAll();
    aura.classList.toggle("is-paused", document.hidden || !canAnimate());
  }

  intro.addEventListener("pointerenter", move, { passive: true });
  intro.addEventListener("pointerdown", move, { passive: true });
  intro.addEventListener("pointermove", move, { passive: true });
  intro.addEventListener("pointerleave", reset);
  intro.addEventListener("pointercancel", reset);
  window.addEventListener("pointermove", moveAura, { passive: true });
  window.addEventListener("pointerdown", moveAura, { passive: true });
  // Passive touch tracking keeps native scrolling and button taps intact.
  window.addEventListener("pointerup", (event) => {
    if (event.pointerType === "touch") resetAll();
  }, { passive: true });
  window.addEventListener("pointercancel", resetAll, { passive: true });
  document.addEventListener("pointerleave", resetAll);
  finePointer.addEventListener("change", syncAura);
  reducedMotion.addEventListener("change", syncAura);
  window.addEventListener("blur", resetAll);
  document.addEventListener("visibilitychange", syncAura);
  syncAura();
}

// Keep the native dialog's focus handling while allowing its exit to finish.
const motionDialog = document.getElementById("transactionsDialog");

if (motionDialog) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let closing = false;
  let closeTimer = null;
  let pendingReturnValue = "";

  function cleanUpClose() {
    if (closeTimer !== null) clearTimeout(closeTimer);
    closeTimer = null;
    closing = false;
    motionDialog.classList.remove("is-closing");
    motionDialog.style.removeProperty("--modal-exit-opacity");
    motionDialog.style.removeProperty("--modal-exit-transform");
    motionDialog.style.removeProperty("--backdrop-exit-opacity");
  }

  function finishClose() {
    if (!closing) return;
    const returnValue = pendingReturnValue;
    cleanUpClose();
    if (motionDialog.open) motionDialog.close(returnValue);
  }

  function requestClose(returnValue = "") {
    if (!motionDialog.open || closing) return;
    if (reducedMotion.matches || document.hidden) {
      motionDialog.close(returnValue);
      return;
    }

    // Start from the current frame, even when closing halfway through entry.
    const current = window.getComputedStyle(motionDialog);
    const backdrop = window.getComputedStyle(motionDialog, "::backdrop");
    motionDialog.style.setProperty("--modal-exit-opacity", current.opacity);
    motionDialog.style.setProperty("--modal-exit-transform", current.transform);
    motionDialog.style.setProperty("--backdrop-exit-opacity", backdrop.opacity);
    pendingReturnValue = returnValue;
    closing = true;
    motionDialog.classList.add("is-closing");
    // Also finish if an animation event is interrupted or unavailable.
    closeTimer = setTimeout(finishClose, 600);
  }

  motionDialog.querySelector(".dialog-dismiss")?.addEventListener("submit", (event) => {
    event.preventDefault();
    requestClose(event.submitter?.value ?? "");
  });
  motionDialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    requestClose();
  });
  motionDialog.addEventListener("animationend", (event) => {
    if (event.target === motionDialog && event.animationName === "modal-dismiss") {
      finishClose();
    }
  });
  motionDialog.addEventListener("close", cleanUpClose);
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) finishClose();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) finishClose();
  });
}
