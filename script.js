const canvas = document.querySelector("#signalCanvas");
const ctx = canvas.getContext("2d");

const labels = ["Trust", "Safety", "Presence", "Behavior", "Evidence", "Decision"];
const colors = ["#0071e3", "#7d5cff", "#111217", "#8e8e93"];

let pointer = { x: 0.5, y: 0.5 };

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const scale = window.devicePixelRatio || 1;

  canvas.width = Math.floor(rect.width * scale);
  canvas.height = Math.floor(rect.height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

function drawSignalMap(time = 0) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const centerX = width * 0.5;
  const centerY = height * 0.5;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fbfbfd";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(11, 11, 15, 0.08)";
  ctx.lineWidth = 1;

  for (let i = 0; i < 9; i += 1) {
    const x = (width / 8) * i;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let i = 0; i < 7; i += 1) {
    const y = (height / 6) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const nodes = labels.map((label, index) => {
    const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
    const pullX = (pointer.x - 0.5) * 26;
    const pullY = (pointer.y - 0.5) * 26;
    const pulse = Math.sin(time / 750 + index) * 7;

    return {
      label,
      x: centerX + Math.cos(angle) * (width * 0.31 + pulse) + pullX,
      y: centerY + Math.sin(angle) * (height * 0.29 + pulse) + pullY,
      color: colors[index % colors.length],
    };
  });

  ctx.lineWidth = 2;
  nodes.forEach((node, index) => {
    const next = nodes[(index + 1) % nodes.length];
    ctx.strokeStyle = "rgba(11, 11, 15, 0.16)";
    ctx.beginPath();
    ctx.moveTo(node.x, node.y);
    ctx.quadraticCurveTo(centerX, centerY, next.x, next.y);
    ctx.stroke();
  });

  ctx.fillStyle = "#0b0b0f";
  ctx.beginPath();
  ctx.arc(centerX, centerY, Math.max(34, width * 0.06), 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 14px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Trust", centerX, centerY);

  nodes.forEach((node) => {
    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#0b0b0f";
    ctx.font = "700 13px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(node.label, node.x, node.y + 23);
  });

  requestAnimationFrame(drawSignalMap);
}

canvas.addEventListener("pointermove", (event) => {
  const rect = canvas.getBoundingClientRect();
  pointer = {
    x: (event.clientX - rect.left) / rect.width,
    y: (event.clientY - rect.top) / rect.height,
  };
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
requestAnimationFrame(drawSignalMap);

const orbit = document.querySelector("[data-project-orbit]");

if (orbit) {
  const cards = Array.from(orbit.querySelectorAll("[data-orbit-card]"));
  const dots = Array.from(orbit.querySelectorAll("[data-orbit-dot]"));
  const cube = orbit.querySelector("[data-project-cube]");
  const stage = orbit.querySelector(".orbit-stage");
  const previousButton = orbit.querySelector("[data-orbit-prev]");
  const nextButton = orbit.querySelector("[data-orbit-next]");
  let activeIndex = 0;
  let dragStartX = null;
  let settleTimer = null;
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function setDeckTilt(x, y) {
    cube.style.setProperty("--drag-tilt-x", `${y.toFixed(2)}deg`);
    cube.style.setProperty("--drag-tilt-y", `${x.toFixed(2)}deg`);
  }

  function updateOrbit(nextIndex) {
    const previousIndex = activeIndex;
    activeIndex = (nextIndex + cards.length) % cards.length;

    if (!motionQuery.matches) {
      const direction = activeIndex >= previousIndex ? 1 : -1;
      setDeckTilt(direction * 4, -2);
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        setDeckTilt(0, 0);
      }, 220);
    }

    cards.forEach((card, index) => {
      const offset = (index - activeIndex + cards.length) % cards.length;
      card.classList.remove("is-active", "is-next", "is-prev", "is-hidden");
      card.setAttribute("aria-hidden", offset === 0 ? "false" : "true");
      card.tabIndex = offset === 0 ? 0 : -1;

      if (offset === 0) {
        card.classList.add("is-active");
      } else if (offset === 1) {
        card.classList.add("is-next");
      } else if (offset === cards.length - 1) {
        card.classList.add("is-prev");
      } else {
        card.classList.add("is-hidden");
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
      dot.setAttribute("aria-pressed", index === activeIndex ? "true" : "false");
    });
  }

  previousButton.addEventListener("click", () => updateOrbit(activeIndex - 1));
  nextButton.addEventListener("click", () => updateOrbit(activeIndex + 1));

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => updateOrbit(index));
  });

  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      if (index !== activeIndex) {
        updateOrbit(index);
      }
    });
  });

  stage.addEventListener("pointerdown", (event) => {
    if (event.target.closest("a")) {
      return;
    }

    dragStartX = event.clientX;
    stage.classList.add("is-dragging");
    stage.setPointerCapture(event.pointerId);
  });

  stage.addEventListener("pointerup", (event) => {
    if (dragStartX === null) {
      return;
    }

    const dragDistance = event.clientX - dragStartX;
    dragStartX = null;
    stage.classList.remove("is-dragging");

    if (Math.abs(dragDistance) < 42) {
      return;
    }

    updateOrbit(activeIndex + (dragDistance < 0 ? 1 : -1));
  });

  stage.addEventListener("pointermove", (event) => {
    if (motionQuery.matches) {
      return;
    }

    const rect = stage.getBoundingClientRect();
    const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;
    setDeckTilt(normalizedX * 7, normalizedY * -5);
  });

  stage.addEventListener("pointerleave", () => {
    dragStartX = null;
    stage.classList.remove("is-dragging");
    setDeckTilt(0, 0);
  });

  stage.addEventListener("pointercancel", () => {
    dragStartX = null;
    stage.classList.remove("is-dragging");
    setDeckTilt(0, 0);
  });

  orbit.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      updateOrbit(activeIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      updateOrbit(activeIndex + 1);
    }
  });

  updateOrbit(activeIndex);
}
