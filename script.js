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

const projectShowcase = document.querySelector("[data-project-showcase]");

if (projectShowcase) {
  const panels = Array.from(projectShowcase.querySelectorAll("[data-project-panel]"));
  const tabs = Array.from(projectShowcase.querySelectorAll("[data-project-tab]"));
  let activeProject = 0;

  function setActiveProject(nextIndex, shouldFocus = false) {
    activeProject = (nextIndex + panels.length) % panels.length;

    panels.forEach((panel, index) => {
      const isActive = index === activeProject;
      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });

    tabs.forEach((tab, index) => {
      const isActive = index === activeProject;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", isActive ? "true" : "false");
      tab.tabIndex = isActive ? 0 : -1;
    });

    if (shouldFocus) {
      tabs[activeProject].focus();
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => setActiveProject(index));

    tab.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        setActiveProject(activeProject + 1, true);
      }

      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveProject(activeProject - 1, true);
      }
    });
  });

  setActiveProject(activeProject);
}
