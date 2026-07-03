(function () {
  const btn = document.getElementById("runawayBtn");
  if (!btn) return;

  const FLEE_RADIUS = 120;
  const MAX_SPEED = 24;
  const CAUGHT_LABEL = "捕まえた！";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let posX = window.innerWidth / 2;
  let posY = window.innerHeight / 2;
  let caught = false;

  function clampToViewport() {
    const halfW = btn.offsetWidth / 2;
    const halfH = btn.offsetHeight / 2;
    const margin = 8;

    posX = Math.min(
      Math.max(posX, margin + halfW),
      window.innerWidth - margin - halfW
    );
    posY = Math.min(
      Math.max(posY, margin + halfH),
      window.innerHeight - margin - halfH
    );
  }

  function applyPosition() {
    btn.style.left = posX + "px";
    btn.style.top = posY + "px";
    btn.style.transform = "translate(-50%, -50%)";
  }

  function centerButton() {
    posX = window.innerWidth / 2;
    posY = window.innerHeight / 2;
    clampToViewport();
    applyPosition();
  }

  function getButtonCenter() {
    const rect = btn.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }

  function fleeFrom(clientX, clientY) {
    if (caught || prefersReducedMotion) return;

    const center = getButtonCenter();
    const dx = clientX - center.x;
    const dy = clientY - center.y;
    const dist = Math.hypot(dx, dy);

    if (dist < FLEE_RADIUS && dist > 0) {
      const force = (FLEE_RADIUS - dist) / FLEE_RADIUS;
      posX -= (dx / dist) * MAX_SPEED * force;
      posY -= (dy / dist) * MAX_SPEED * force;
      clampToViewport();
      applyPosition();
    }
  }

  function onPointerMove(e) {
    fleeFrom(e.clientX, e.clientY);
  }

  function onTouchMove(e) {
    if (e.touches.length > 0) {
      fleeFrom(e.touches[0].clientX, e.touches[0].clientY);
    }
  }

  btn.addEventListener("click", function () {
    if (caught) return;
    caught = true;
    btn.textContent = CAUGHT_LABEL;
    btn.classList.add("caught");
    document.removeEventListener("mousemove", onPointerMove);
    document.removeEventListener("touchmove", onTouchMove);
  });

  centerButton();

  if (!prefersReducedMotion) {
    document.addEventListener("mousemove", onPointerMove);
    document.addEventListener("touchmove", onTouchMove, { passive: true });
  }

  window.addEventListener("resize", function () {
    if (!caught) {
      clampToViewport();
      applyPosition();
    }
  });
})();
