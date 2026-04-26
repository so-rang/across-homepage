"use client";

import { useEffect, useRef } from "react";
import { Mesh, Program, Renderer, Triangle } from "ogl";
import type { LayerProps } from "./types";

const VERTEX = /* glsl */ `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

/**
 * Deep-space nebula shader — no mouse interaction (user feedback: dizzying).
 * Drifts autonomously on a slow time axis. Tuned very dark so actual stars
 * stay the visual focus.
 */
const FRAGMENT = /* glsl */ `
  precision highp float;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uIntensity;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float f = 0.0;
    float w = 0.5;
    for (int i = 0; i < 5; i++) {
      f += w * noise(p);
      p *= 2.04;
      w *= 0.52;
    }
    return f;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    vec2 p = uv - 0.5;
    p.x *= uResolution.x / uResolution.y;

    // Autonomous drift — perceptible flow across the nebula.
    float t = uTime * 0.04;
    float flow = fbm(p * 1.4 + vec2(t, t * 0.7));
    vec2 warped = p + vec2(flow - 0.5, flow - 0.45) * 0.45;
    float nebula = fbm(warped * 2.4 - t * 0.5);
    float distant = fbm(warped * 6.0 + t * 1.4);

    vec3 base     = vec3(0.015, 0.015, 0.030);         // near-black deep space
    vec3 violet   = vec3(0.095, 0.060, 0.180);         // cold dust
    vec3 rose     = vec3(0.160, 0.090, 0.130);         // warm dust
    vec3 milk     = vec3(0.520, 0.490, 0.440);         // milky-way haze

    float dust   = smoothstep(0.42, 0.78, nebula);
    float galaxy = smoothstep(0.55, 0.90, distant);

    vec3 color = base;
    color = mix(color, violet, dust * 0.35 * uIntensity);
    color = mix(color, rose,   dust * 0.12 * uIntensity);
    color += milk * galaxy * 0.045 * uIntensity;

    float vig = 1.0 - smoothstep(0.25, 1.10, length(p));
    color *= mix(0.55, 1.0, vig);

    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * Layer 1 — Liquid Ether.
 * Autonomous drift only; mouse does not influence this layer.
 */
export function LiquidEther({ quality }: LayerProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (quality === "static") return;
    const host = hostRef.current;
    if (!host) return;

    const dpr = Math.min(
      window.devicePixelRatio || 1,
      quality === "low" ? 1 : 1.5
    );

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: false,
      dpr,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    host.appendChild(gl.canvas);
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.style.display = "block";

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      uniforms: {
        uResolution: { value: [window.innerWidth, window.innerHeight] },
        uTime: { value: 0 },
        uIntensity: { value: quality === "low" ? 0.7 : 1.0 },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      program.uniforms.uResolution.value = [
        window.innerWidth,
        window.innerHeight,
      ];
    };
    resize();
    window.addEventListener("resize", resize);

    let rafId = 0;
    let frameCounter = 0;
    const start = performance.now();
    const skip = quality === "low" ? 2 : 1;

    const tick = () => {
      frameCounter++;
      if (frameCounter % skip === 0) {
        program.uniforms.uTime.value = (performance.now() - start) * 0.001;
        renderer.render({ scene: mesh });
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      if (gl.canvas.parentNode === host) {
        host.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [quality]);

  if (quality === "static") {
    return (
      <div
        aria-hidden
        className="stage-layer z-0"
        style={{
          background: `
            radial-gradient(1400px 1000px at 30% 25%, rgba(95, 70, 150, 0.14), transparent 60%),
            radial-gradient(1000px 800px at 78% 72%, rgba(150, 100, 110, 0.08), transparent 55%),
            #04040a
          `,
        }}
      />
    );
  }

  return <div ref={hostRef} aria-hidden className="stage-layer z-0" />;
}
