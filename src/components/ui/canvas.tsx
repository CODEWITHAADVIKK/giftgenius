/* eslint-disable @typescript-eslint/no-explicit-any */
/* Canvas trail animation — interactive mouse/touch following lines */

interface OscillatorOptions {
  phase?: number;
  offset?: number;
  frequency?: number;
  amplitude?: number;
}

class Oscillator {
  phase: number;
  offset: number;
  frequency: number;
  amplitude: number;
  value: number;

  constructor(opts: OscillatorOptions = {}) {
    this.phase = opts.phase || 0;
    this.offset = opts.offset || 0;
    this.frequency = opts.frequency || 0.001;
    this.amplitude = opts.amplitude || 1;
    this.value = 0;
  }

  update(): number {
    this.phase += this.frequency;
    this.value = this.offset + Math.sin(this.phase) * this.amplitude;
    return this.value;
  }
}

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

const E = {
  friction: 0.5,
  trails: 80,
  size: 50,
  dampening: 0.025,
  tension: 0.99,
};

class Line {
  spring: number;
  friction: number;
  nodes: NodePoint[];

  constructor(opts: { spring: number }, pos: { x: number; y: number }) {
    this.spring = opts.spring + 0.1 * Math.random() - 0.05;
    this.friction = E.friction + 0.01 * Math.random() - 0.005;
    this.nodes = [];
    for (let i = 0; i < E.size; i++) {
      this.nodes.push({ x: pos.x, y: pos.y, vx: 0, vy: 0 });
    }
  }

  update(pos: { x: number; y: number }) {
    let spring = this.spring;
    let node = this.nodes[0];
    node.vx += (pos.x - node.x) * spring;
    node.vy += (pos.y - node.y) * spring;

    for (let prev, i = 0, n = this.nodes.length; i < n; i++) {
      node = this.nodes[i];
      if (i > 0) {
        prev = this.nodes[i - 1];
        node.vx += (prev.x - node.x) * spring;
        node.vy += (prev.y - node.y) * spring;
        node.vx += prev.vx * E.dampening;
        node.vy += prev.vy * E.dampening;
      }
      node.vx *= this.friction;
      node.vy *= this.friction;
      node.x += node.vx;
      node.y += node.vy;
      spring *= E.tension;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    let x = this.nodes[0].x,
      y = this.nodes[0].y;
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let i = 1, n = this.nodes.length - 2; i < n; i++) {
      const a = this.nodes[i];
      const b = this.nodes[i + 1];
      x = (a.x + b.x) * 0.5;
      y = (a.y + b.y) * 0.5;
      ctx.quadraticCurveTo(a.x, a.y, x, y);
    }
    const a = this.nodes[this.nodes.length - 2];
    const b = this.nodes[this.nodes.length - 1];
    if (a && b) {
      ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
      ctx.stroke();
      ctx.closePath();
    }
  }
}

/**
 * Starts the canvas trail animation. Returns a cleanup function that
 * removes all event listeners and stops the animation loop.
 */
export const renderCanvas = function (): (() => void) {
  let running = true;
  let animationFrameId: number;
  let isInitialized = false;

  const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
  if (!canvas) return () => {};

  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const pos = { x: 0, y: 0 };
  let lines: Line[] = [];

  const f = new Oscillator({
    phase: Math.random() * 2 * Math.PI,
    amplitude: 85,
    frequency: 0.0015,
    offset: 285,
  });

  function initLines() {
    lines = [];
    for (let i = 0; i < E.trails; i++) {
      lines.push(new Line({ spring: 0.45 + (i / E.trails) * 0.025 }, pos));
    }
  }

  function render() {
    if (!running) return;
    if (ctx && canvas) {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      ctx.strokeStyle = "hsla(" + Math.round(f.update()) + ",100%,50%,0.025)";
      ctx.lineWidth = 10;
      for (let i = 0; i < E.trails; i++) {
        if (lines[i]) {
          lines[i].update(pos);
          lines[i].draw(ctx);
        }
      }
    }
    animationFrameId = window.requestAnimationFrame(render);
  }

  function resizeCanvas() {
    if (canvas && canvas.parentElement) {
      // Use parentElement dimensions to avoid scrollbar infinite resize loop triggers
      canvas.width = canvas.parentElement.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement.clientHeight || window.innerHeight;
    }
  }

  function handleMove(e: MouseEvent | TouchEvent) {
    if ("touches" in e && e.touches) {
      pos.x = e.touches[0].pageX;
      pos.y = e.touches[0].pageY;
    } else if ("clientX" in e) {
      pos.x = e.clientX;
      pos.y = e.clientY;
    }
  }

  function onFirstInteraction(e?: MouseEvent | TouchEvent) {
    if (isInitialized) return;
    isInitialized = true;
    document.removeEventListener("mousemove", onFirstInteraction as any);
    document.removeEventListener("touchstart", onFirstInteraction as any);
    document.addEventListener("mousemove", handleMove as any);
    document.addEventListener("touchmove", handleMove as any);
    document.addEventListener("touchstart", handleTouchStart);
    if (e) handleMove(e);
  }

  function handleTouchStart(ev: TouchEvent) {
    if (ev.touches.length === 1) {
      pos.x = ev.touches[0].pageX;
      pos.y = ev.touches[0].pageY;
    }
  }

  function handleOrientationChange() {
    resizeCanvas();
  }

  function handleFocus() {
    if (!running) {
      running = true;
      if (isInitialized) {
        render();
      }
    }
  }

  function handleBlur() {
    running = false;
    if (animationFrameId) {
      window.cancelAnimationFrame(animationFrameId);
    }
  }

  document.addEventListener("mousemove", onFirstInteraction as any);
  document.addEventListener("touchstart", onFirstInteraction as any);
  document.body.addEventListener("orientationchange", handleOrientationChange);
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("focus", handleFocus);
  window.addEventListener("blur", handleBlur);
  resizeCanvas();

  // Auto-start animation
  pos.x = window.innerWidth / 2;
  pos.y = window.innerHeight / 2;
  initLines();
  render();

  return () => {
    running = false;
    if (animationFrameId) {
      window.cancelAnimationFrame(animationFrameId);
    }
    document.removeEventListener("mousemove", onFirstInteraction as any);
    document.removeEventListener("touchstart", onFirstInteraction as any);
    document.removeEventListener("mousemove", handleMove as any);
    document.removeEventListener("touchmove", handleMove as any);
    document.removeEventListener("touchstart", handleTouchStart);
    document.body.removeEventListener("orientationchange", handleOrientationChange);
    window.removeEventListener("resize", resizeCanvas);
    window.removeEventListener("focus", handleFocus);
    window.removeEventListener("blur", handleBlur);
  };
};
