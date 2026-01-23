"use client";

import { useBackground } from "@/context/BackgroundContext";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  initialZ: number;
  initialY: number;
  initialX: number;
  pathX: number[];
  pathY: number[];
  duration: number;
  scaleVariations: number[];
}

export default function AnimatedOrb() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const coreGlowRef = useRef<HTMLDivElement>(null);
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const logoTopGroupRef = useRef<SVGGElement>(null);
  const orbitingDotRef = useRef<HTMLDivElement>(null);
  const orbitingContainerRef = useRef<HTMLDivElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const { cycleTheme, currentTheme } = useBackground();
  const [isPressed, setIsPressed] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const mousePos = useRef({ x: 0, y: 0 });
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const particleAnimationsRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const timer = setTimeout(() => {
      const newParticles = Array.from({ length: 5 }).map((_, i) => {
        const waypoints = 4;
        const pathX: number[] = [];
        const pathY: number[] = [];

        for (let j = 0; j < waypoints; j++) {
          pathX.push(Math.random() * 300 - 150);
          pathY.push(Math.random() * 300 - 150);
        }
        pathX.push(pathX[0]);
        pathY.push(pathY[0]);

        return {
          id: i,
          initialZ: Math.random() * 200,
          initialY: 0,
          initialX: 0,
          pathX,
          pathY,
          duration: Math.random() * 3 + 4,
          scaleVariations: Array.from(
            { length: waypoints + 1 },
            () => Math.random() * 0.5 + 0.5
          ),
        };
      });
      setParticles(newParticles);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!orbRef.current) return;

    const ctx = gsap.context(() => {
      let rafId: number;
      let lastUpdate = 0;
      const throttleMs = 16;

      const handleMouseMove = (e: MouseEvent) => {
        const now = performance.now();
        if (now - lastUpdate < throttleMs) return;
        lastUpdate = now;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          if (!containerRef.current) return;

          const rect = containerRef.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          mousePos.current = {
            x: e.clientX - centerX,
            y: e.clientY - centerY,
          };

          const distance = Math.sqrt(
            mousePos.current.x * mousePos.current.x +
              mousePos.current.y * mousePos.current.y
          );
          const maxDistance = 500;
          const intensity = maxDistance / (maxDistance + distance);

          if (orbRef.current) {
            gsap.to(orbRef.current, {
              rotateX: (mousePos.current.y / 1000) * -50 * intensity,
              rotateY: (mousePos.current.x / 1000) * 50 * intensity,
              duration: 0.5,
              ease: "power2.out",
            });
          }

          if (logoContainerRef.current) {
            gsap.to(logoContainerRef.current, {
              x: (mousePos.current.x / 1000) * -200 * intensity,
              y: (mousePos.current.y / 1000) * -200 * intensity,
              duration: 0.5,
              ease: "power2.out",
            });
          }

          if (coreGlowRef.current) {
            gsap.to(coreGlowRef.current, {
              x: (mousePos.current.x / 1000) * -25 * intensity,
              y: (mousePos.current.y / 1000) * -25 * intensity,
              duration: 0.5,
              ease: "power2.out",
            });
          }

          if (ring1Ref.current) {
            gsap.to(ring1Ref.current, {
              x: (mousePos.current.x / 1000) * -80 * intensity,
              y: (mousePos.current.y / 1000) * -80 * intensity,
              duration: 0.5,
              ease: "power2.out",
            });
          }

          if (ring2Ref.current) {
            gsap.to(ring2Ref.current, {
              x: (mousePos.current.x / 1000) * -60 * intensity,
              y: (mousePos.current.y / 1000) * -60 * intensity,
              duration: 0.5,
              ease: "power2.out",
            });
          }

          if (orbitingContainerRef.current) {
            gsap.to(orbitingContainerRef.current, {
              x: (mousePos.current.x / 1000) * -40 * intensity,
              y: (mousePos.current.y / 1000) * -40 * intensity,
              duration: 0.5,
              ease: "power2.out",
            });
          }

          if (particlesContainerRef.current) {
            gsap.to(particlesContainerRef.current, {
              x: (mousePos.current.x / 1000) * -90 * intensity,
              y: (mousePos.current.y / 1000) * -90 * intensity,
              duration: 0.5,
              ease: "power2.out",
            });
          }
        });
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });

      if (coreGlowRef.current) {
        gsap.to(coreGlowRef.current, {
          scale: 0.8,
          opacity: 0.2,
          yoyo: true,
          repeat: -1,
          duration: 2,
          ease: "sine.inOut",
        });
        gsap.to(coreGlowRef.current, {
          scale: 1.2,
          opacity: 0.5,
          yoyo: true,
          repeat: -1,
          duration: 2,
          ease: "sine.inOut",
        });
      }

      if (ring1Ref.current) {
        gsap.to(ring1Ref.current, {
          rotateZ: -360,
          duration: 30,
          repeat: -1,
          ease: "none",
        });
      }

      if (ring2Ref.current) {
        gsap.to(ring2Ref.current, {
          rotateZ: 360,
          duration: 15,
          repeat: -1,
          ease: "none",
        });
      }

      if (orbitingContainerRef.current) {
        gsap.to(orbitingContainerRef.current, {
          rotate: 360,
          duration: 20,
          repeat: -1,
          ease: "none",
        });
      }

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        if (rafId) cancelAnimationFrame(rafId);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (particles.length === 0) return;

    const ctx = gsap.context(() => {
      particleAnimationsRef.current = [];

      particles.forEach((p, i) => {
        const particle = particleRefs.current[i];
        if (!particle) return;

        const customEase = "power1.inOut";

        const animX = gsap.to(particle, {
          keyframes: p.pathX.map((x) => ({ x })),
          duration: p.duration,
          repeat: -1,
          ease: customEase,
          delay: i * 0.3,
        });

        const animY = gsap.to(particle, {
          keyframes: p.pathY.map((y) => ({ y })),
          duration: p.duration * 0.95,
          repeat: -1,
          ease: customEase,
          delay: i * 0.3,
        });

        const animScale = gsap.to(particle, {
          keyframes: p.scaleVariations.map((scale) => ({ scale })),
          duration: p.duration * 0.8,
          repeat: -1,
          ease: "sine.inOut",
          delay: i * 0.3,
        });

        const animOpacity = gsap.to(particle, {
          keyframes: [
            { opacity: 0.3 },
            { opacity: 1 },
            { opacity: 0.8 },
            { opacity: 1 },
            { opacity: 0.5 },
            { opacity: 1 },
            { opacity: 0.3 },
          ],
          duration: p.duration * 1.2,
          repeat: -1,
          ease: "sine.inOut",
          delay: i * 0.3,
        });

        particleAnimationsRef.current.push(
          animX,
          animY,
          animScale,
          animOpacity
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [particles]);

  useEffect(() => {
    const timeScale = isHovered ? 3 : 1;
    particleAnimationsRef.current.forEach((anim) => {
      if (anim) {
        anim.timeScale(timeScale);
      }
    });
  }, [isHovered]);

  useEffect(() => {
    if (isHovered && ring1Ref.current && ring2Ref.current) {
      gsap.to(ring1Ref.current, { scale: 1.1, duration: 0.3 });
      gsap.to(ring1Ref.current, {
        rotateZ: -360,
        duration: 10,
        repeat: -1,
        ease: "none",
      });
      gsap.to(ring2Ref.current, { scale: 0.9, duration: 0.3 });
    } else if (ring1Ref.current && ring2Ref.current) {
      gsap.to(ring1Ref.current, { scale: 1, duration: 0.3 });
      gsap.to(ring1Ref.current, {
        rotateZ: -360,
        duration: 30,
        repeat: -1,
        ease: "none",
      });
      gsap.to(ring2Ref.current, { scale: 1, duration: 0.3 });
    }
  }, [isHovered]);

  useEffect(() => {
    if (logoTopGroupRef.current) {
      if (isPressed) {
        gsap.to(logoTopGroupRef.current, {
          y: 30,
          duration: 0.2,
          ease: "power2.out",
        });
      } else {
        gsap.to(logoTopGroupRef.current, {
          y: 0,
          duration: 0.2,
          ease: "power2.out",
        });
      }
    }
  }, [isPressed]);

  const handlePressStart = () => {
    setIsPressed(true);
  };

  const handlePressEnd = () => {
    setTimeout(() => {
      setIsPressed(false);
    }, 150);
  };

  return (
    <div ref={containerRef} className="pointer-events-auto">
      <div
        ref={orbRef}
        className="relative w-[400px] h-[400px]"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div
          ref={coreGlowRef}
          className="absolute inset-0 rounded-full blur-[80px]"
          style={{
            backgroundColor: currentTheme.primary + "10",
            transform: "translateZ(-100px)",
            transformStyle: "preserve-3d",
          }}
        />

        <div
          ref={ring1Ref}
          className="absolute inset-10 border-2 border-dashed rounded-full opacity-50"
          style={{
            borderColor: currentTheme.primary + "33",
            transform: "translateZ(80px)",
            transformStyle: "preserve-3d",
          }}
        />

        <div
          ref={ring2Ref}
          className="absolute inset-20 border border-dotted rounded-full"
          style={{
            borderColor: currentTheme.secondary + "4D",
            transform: "translateZ(100px)",
            transformStyle: "preserve-3d",
          }}
        />

        <div
          ref={particlesContainerRef}
          className="absolute inset-0"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {particles.map((p, i) => (
            <div
              key={`p-${p.id}`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                transform: `translateZ(${p.initialZ - 200}px) translate(${
                  p.initialX
                }px, ${p.initialY}px)`,
                transformStyle: "preserve-3d",
              }}
            >
              <div
                ref={(el) => {
                  particleRefs.current[i] = el;
                }}
                className="w-2 h-2 bg-white rounded-full mix-blend-overlay"
              />
            </div>
          ))}
        </div>

        <div
          ref={logoContainerRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: "translateZ(150px)",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="relative w-80 h-80 flex items-center justify-center overflow-hidden group"
            style={{
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
              WebkitFontSmoothing: "antialiased",
            }}
          >
            <svg
              viewBox="0 0 936 754"
              className="w-72 h-72 cursor-pointer pointer-events-auto"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                setIsPressed(false);
              }}
              onMouseDown={handlePressStart}
              onMouseUp={handlePressEnd}
              onClick={cycleTheme}
              style={{
                shapeRendering: "geometricPrecision",
                imageRendering: "pixelated",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
                WebkitFontSmoothing: "antialiased",
                color: currentTheme.primary,
                filter: isHovered
                  ? `drop-shadow(0 0 2px ${currentTheme.primary}80) drop-shadow(0 0 5px ${currentTheme.primary}99)`
                  : `drop-shadow(0 0 20px ${currentTheme.primary}33)`,
                transition: "filter 0.3s ease",
              }}
              preserveAspectRatio="xMidYMid meet"
            >
              <g ref={logoTopGroupRef}>
                <path
                  transform="translate(0 754) scale(0.1 -0.1)"
                  d="M4607 7529 c-17 -10 -190 -88 -607 -274 -631 -281 -835 -378 -843
-400 -4 -9 -7 -144 -7 -300 l0 -284 -105 50 c-58 27 -114 49 -124 49 -23 0
-121 -41 -286 -120 -71 -34 -187 -88 -257 -121 -70 -32 -203 -94 -295 -137
-371 -175 -531 -251 -598 -282 -38 -18 -75 -40 -82 -49 -9 -12 -12 -145 -13
-564 l0 -548 -167 -81 c-387 -186 -673 -322 -753 -358 -47 -21 -132 -62 -190
-90 -58 -29 -137 -67 -177 -85 -39 -18 -76 -42 -82 -53 -8 -14 -11 -176 -11
-505 0 -447 1 -486 17 -505 10 -12 99 -57 198 -100 165 -73 729 -331 1020
-466 66 -31 134 -56 150 -56 17 0 93 31 170 69 l140 68 5 -356 c3 -196 9 -362
13 -369 10 -15 110 -66 241 -124 50 -22 156 -70 236 -108 521 -245 1015 -471
1038 -475 20 -4 77 20 225 93 l197 98 0 -167 c0 -103 4 -178 11 -193 8 -16 36
-36 88 -59 42 -19 195 -90 341 -157 146 -67 299 -137 340 -155 41 -18 120 -54
175 -80 109 -51 324 -149 564 -256 84 -38 166 -69 182 -69 32 0 119 38 449
195 124 59 299 142 390 185 454 213 837 403 853 421 15 19 17 47 17 255 0 129
1 234 3 234 2 0 109 -50 238 -111 129 -62 250 -114 269 -116 31 -4 128 40 685
310 358 173 698 337 756 364 58 28 110 56 115 64 5 8 7 217 5 481 l-3 468 95
44 c57 26 102 54 111 69 15 22 16 78 14 522 l-3 498 -23 15 c-23 15 -353 168
-641 298 -85 38 -281 128 -435 200 l-281 130 -6 545 c-4 299 -10 551 -13 560
-4 10 -82 52 -174 95 -912 424 -1343 621 -1376 630 -17 4 -56 -9 -133 -45
l-108 -50 -3 288 c-2 259 -4 290 -20 304 -15 13 -168 84 -857 397 -93 43 -226
103 -295 135 -352 160 -343 157 -383 134z m113 -136 c36 -17 103 -48 150 -68
47 -21 119 -53 160 -72 41 -20 113 -52 160 -73 47 -20 137 -61 200 -90 114
-52 194 -88 425 -190 66 -29 128 -58 137 -65 15 -10 -30 -35 -308 -171 -179
-87 -327 -161 -329 -164 -2 -3 18 -22 45 -42 l50 -37 232 113 c128 62 270 132
316 155 l82 41 0 -54 0 -55 -62 -33 -63 -33 -5 -330 -5 -331 -32 -44 c-40 -53
-42 -91 -8 -140 21 -30 27 -53 31 -122 5 -83 5 -85 -21 -96 l-25 -12 0 81 c0
79 -1 81 -35 113 -32 30 -35 39 -35 87 0 49 4 60 40 103 l40 48 0 309 c0 170
-2 309 -5 309 -3 0 -43 -19 -90 -42 l-85 -42 0 -353 0 -353 -27 -49 -28 -49
25 -34 c21 -28 25 -46 29 -117 3 -86 -2 -100 -39 -101 -12 0 -14 14 -12 84 2
59 -1 94 -12 121 -21 49 -20 74 4 135 19 47 20 74 20 370 0 176 -3 320 -7 320
-14 0 -163 -73 -163 -80 0 -4 7 -27 15 -50 35 -100 5 -273 -63 -355 -94 -115
-282 -200 -502 -229 l-95 -12 -3 -330 -2 -330 -45 -22 c-25 -12 -48 -22 -50
-22 -3 0 -5 158 -5 350 l0 350 -59 0 -59 0 -7 -49 c-4 -27 -4 -193 0 -369 6
-314 6 -320 -14 -327 -11 -3 -36 -17 -55 -30 l-36 -24 0 364 0 364 -34 26
c-54 41 -193 88 -244 82 -85 -9 -80 -35 17 -82 l60 -28 -207 -95 c-114 -52
-261 -119 -327 -149 -66 -30 -127 -57 -136 -60 -8 -2 -80 23 -160 57 -79 34
-171 72 -204 85 -64 25 -379 177 -509 247 l-79 42 -105 -28 -105 -27 -42 22
c-51 27 -100 21 -139 -18 -44 -44 -30 -104 30 -129 46 -19 104 -4 137 36 29
34 115 60 198 60 54 0 120 -24 197 -72 l33 -20 -188 -85 c-262 -117 -370 -163
-386 -163 -16 0 -126 48 -357 155 -91 42 -207 95 -259 118 l-93 42 48 22 c27
11 121 55 209 96 88 41 288 134 445 207 157 72 361 168 454 211 93 43 174 79
179 79 6 0 59 -23 118 -52 l109 -51 0 -183 0 -183 -72 33 c-177 81 -207 99
-213 127 -10 44 -48 72 -99 72 -81 -2 -126 -42 -112 -99 12 -48 101 -78 160
-55 13 5 63 -15 175 -72 86 -44 163 -85 171 -92 24 -21 68 -29 85 -15 13 11
15 86 15 546 l0 534 92 -46 c51 -26 156 -75 233 -109 77 -35 210 -94 295 -133
85 -38 164 -72 176 -76 26 -8 34 -69 34 -240 0 -125 -8 -143 -71 -169 l-36
-15 -6 -93 c-3 -51 -4 -96 -1 -101 3 -4 61 -8 130 -8 122 0 125 1 149 26 14
15 25 31 25 36 0 5 5 6 10 3 6 -3 10 -19 10 -36 l0 -29 178 0 c248 1 463 16
553 39 97 25 208 80 265 133 63 58 104 145 104 223 0 149 -85 255 -245 304
l-53 17 53 28 c124 65 175 135 183 251 4 58 0 80 -18 123 -30 69 -112 143
-196 176 -123 50 -199 56 -664 56 -402 0 -429 -1 -451 -19 -22 -17 -23 -25
-24 -152 -1 -74 0 -140 3 -146 2 -8 22 -13 47 -13 26 0 45 -5 48 -12 4 -12 -3
-270 -7 -275 -1 -2 -130 56 -287 128 -156 72 -319 147 -362 166 -61 28 -75 39
-66 49 6 7 21 16 32 20 12 4 135 58 272 122 138 63 295 133 350 157 168 71
362 157 499 221 72 34 133 61 136 60 3 -1 34 -16 70 -33z m-420 -923 l0 -580
-26 -12 c-23 -11 -28 -9 -42 10 -10 11 -43 33 -74 47 -32 15 -58 28 -58 30 0
2 19 9 42 16 24 6 55 20 70 31 l28 19 0 433 c0 238 -2 435 -5 438 -3 3 -33 -3
-66 -13 -100 -31 -212 -20 -131 13 86 35 152 72 190 108 77 73 72 110 72 -540z
m592 436 c110 -33 163 -91 155 -172 -13 -128 -159 -183 -479 -184 l-148 0 0
188 0 188 208 -2 c159 -1 220 -6 264 -18z m0 -557 c156 -33 239 -135 192 -235
-49 -103 -188 -144 -491 -144 l-173 0 0 195 0 195 210 0 c117 0 232 -5 262
-11z m1539 -120 c40 -20 210 -98 499 -229 58 -26 197 -90 310 -142 113 -52
274 -125 357 -164 84 -38 153 -71 153 -74 0 -3 -37 -22 -83 -42 -45 -20 -199
-91 -342 -158 -143 -67 -311 -144 -373 -172 l-113 -50 -172 77 c-95 43 -235
107 -312 143 -77 36 -155 71 -172 79 l-33 13 0 169 0 169 88 4 87 4 110 -52
c174 -80 217 -100 268 -119 32 -12 47 -23 47 -35 0 -10 14 -30 31 -44 84 -71
243 9 182 92 -30 41 -83 55 -137 37 -47 -16 -54 -15 -139 24 -23 11 -82 37
-132 59 -49 22 -119 54 -155 71 -58 28 -75 31 -157 31 l-93 0 0 108 0 109 118
56 c64 30 117 56 118 56 0 1 20 -9 45 -20z m-951 -414 c9 -11 10 -36 4 -97 -5
-46 -9 -157 -9 -247 0 -160 0 -164 -22 -172 l-23 -8 -1 122 c-1 124 -12 275
-25 335 -5 27 -2 38 17 58 26 28 41 30 59 9z m-233 -147 c20 -18 23 -31 23
-88 0 -57 -4 -72 -28 -106 -42 -58 -44 -70 -17 -103 21 -25 25 -39 25 -98 0
-65 -2 -71 -25 -81 l-25 -12 0 76 c0 61 -4 81 -20 101 -26 33 -25 43 5 103 32
62 31 69 -5 115 -36 45 -38 67 -8 95 28 26 46 25 75 -2z m-237 -193 c0 -133
-2 -148 -21 -175 -28 -37 -20 -63 17 -54 26 7 26 6 19 -27 -4 -19 -8 -53 -9
-77 -2 -42 -16 -62 -45 -62 -11 0 -12 11 -7 49 6 46 4 53 -24 84 -37 43 -38
68 -2 114 27 36 27 38 24 165 l-3 128 26 0 25 0 0 -145z m-3273 -31 c125 -59
266 -123 313 -144 47 -21 189 -86 315 -145 127 -59 283 -131 347 -161 64 -29
128 -60 142 -69 l26 -17 0 -423 c0 -232 -3 -470 -7 -529 l-6 -106 -38 -22
c-21 -12 -41 -28 -45 -37 -3 -9 -5 -100 -4 -203 1 -104 0 -188 -2 -188 -2 0
-59 27 -126 60 -67 33 -137 66 -155 74 l-34 14 -6 152 c-4 84 -7 258 -7 386 0
224 1 233 20 239 34 11 52 59 40 105 -23 85 -124 118 -180 58 -33 -36 -26 -82
20 -132 l40 -43 0 -362 c0 -198 -3 -361 -6 -361 -3 0 -45 18 -93 41 l-88 41
-8 602 -7 602 31 31 c46 46 43 93 -8 144 -32 32 -45 39 -79 39 -71 0 -101 -62
-66 -136 9 -19 26 -41 36 -49 19 -13 20 -29 25 -408 3 -217 3 -411 -1 -430
l-7 -37 -101 78 c-151 116 -143 96 -140 330 3 195 3 197 27 215 47 35 40 126
-12 167 -34 26 -92 26 -127 -1 -21 -17 -26 -29 -26 -65 0 -36 6 -51 35 -83
l35 -38 0 -217 0 -217 43 -42 c23 -23 83 -70 132 -105 50 -35 103 -79 119 -99
29 -34 29 -36 23 -135 -3 -55 -7 -102 -10 -104 -5 -5 -585 271 -599 285 -8 7
-22 1551 -14 1551 3 0 108 -48 233 -106z m1338 23 c66 -30 190 -85 275 -122
85 -37 158 -70 162 -73 4 -4 -41 -29 -100 -56 -509 -234 -456 -214 -496 -193
-37 19 -444 207 -501 232 l-40 17 30 14 c17 7 116 52 220 100 105 47 217 99
250 115 33 16 65 27 70 25 6 -2 64 -29 130 -59z m4765 5 l0 -59 -107 -48 c-60
-26 -151 -68 -203 -93 -52 -24 -140 -64 -195 -89 -54 -25 -125 -58 -157 -74
l-59 -30 -65 29 -66 29 58 27 c69 31 272 126 569 266 116 54 213 99 218 99 4
1 7 -25 7 -57z m-3480 0 l0 -47 -97 -38 c-136 -54 -228 -100 -227 -115 1 -7 2
-48 3 -92 1 -54 5 -80 13 -80 22 0 48 -33 48 -61 0 -19 -11 -39 -34 -61 -18
-18 -37 -42 -43 -53 -5 -11 -8 -95 -7 -189 l3 -169 35 -36 c32 -33 36 -43 36
-89 0 -51 -1 -54 -35 -68 -19 -7 -37 -14 -40 -14 -9 0 -5 56 6 88 10 28 8 35
-23 73 l-33 41 -5 216 c-5 229 -1 261 39 296 18 17 21 30 21 107 0 48 -3 90
-7 92 -5 3 -48 -14 -98 -38 l-90 -41 6 -125 c4 -68 3 -133 -1 -144 -5 -11 -22
-33 -39 -49 l-31 -30 0 -159 0 -159 30 -35 c35 -40 37 -57 10 -101 -14 -22
-20 -50 -20 -87 0 -30 -2 -55 -4 -55 -2 0 -11 -3 -20 -6 -14 -5 -16 6 -16 85
0 71 -4 98 -17 118 -16 24 -18 49 -14 219 2 132 0 194 -8 198 -6 4 -11 23 -11
43 0 30 8 43 45 77 l45 42 0 72 c0 54 -3 72 -14 72 -7 0 -63 -25 -125 -55
l-111 -54 0 -234 0 -233 -35 -41 -35 -41 0 -201 c0 -200 0 -202 -22 -210 -13
-5 -27 -5 -31 -1 -5 4 -7 102 -5 217 l3 210 38 46 37 45 0 211 c0 116 -2 211
-5 211 -3 0 -91 -44 -195 -97 l-190 -97 0 -448 0 -448 -40 -20 c-21 -11 -42
-20 -45 -20 -3 0 -4 224 -3 497 l3 497 220 104 c218 103 429 200 680 312 72
32 200 90 285 129 85 39 158 71 163 71 4 0 7 -21 7 -48z m1737 -61 c38 -16
136 -60 218 -96 83 -37 242 -107 355 -155 113 -48 241 -105 285 -125 44 -20
125 -56 180 -80 55 -24 132 -57 170 -75 l70 -32 -42 -19 -43 -18 -67 31 c-64
29 -73 30 -153 25 l-85 -6 -194 97 -195 97 -90 0 c-90 0 -92 -1 -249 -68 -148
-65 -159 -68 -193 -57 -19 7 -50 9 -68 6 -43 -8 -86 -48 -86 -79 0 -46 78 -93
137 -82 39 7 93 50 93 74 0 13 39 34 153 81 133 56 160 64 217 64 63 1 72 -3
249 -94 l184 -95 111 -5 c65 -4 121 -12 136 -20 18 -10 21 -15 10 -18 -8 -2
-63 -27 -121 -54 l-106 -50 -159 74 c-124 57 -169 73 -204 73 -33 0 -97 -22
-245 -84 -110 -45 -229 -96 -265 -113 l-65 -29 -55 17 c-30 9 -63 21 -73 26
-10 5 -89 44 -176 88 -153 77 -159 80 -165 115 -12 60 -89 91 -159 62 -61 -26
-64 -101 -4 -138 25 -16 43 -19 85 -15 51 5 59 2 217 -81 l164 -85 -15 -24
c-19 -28 -11 -57 23 -84 53 -41 174 -14 188 42 5 19 39 37 183 97 97 40 208
87 246 104 114 48 126 48 269 -19 113 -53 147 -74 117 -74 -5 0 -91 -39 -192
-86 -479 -226 -582 -274 -591 -274 -11 0 -190 76 -402 170 -218 97 -592 248
-751 303 -71 24 -152 56 -178 69 l-48 24 115 57 c63 31 155 74 203 96 49 21
211 98 359 171 149 72 344 165 435 207 91 41 169 79 175 84 13 13 18 12 92
-20z m-1277 -731 c63 -26 169 -71 235 -98 66 -28 237 -103 380 -167 143 -65
323 -145 400 -179 77 -35 155 -70 173 -80 l32 -17 0 -628 c0 -556 -2 -630 -15
-635 -14 -5 -16 44 -15 450 1 354 -1 459 -11 470 -16 20 -104 64 -334 169
-662 302 -995 455 -1027 471 l-38 18 0 158 0 158 53 -21 c28 -11 104 -42 167
-69z m2680 32 l0 -58 -70 -34 -70 -34 0 -307 c0 -171 -4 -319 -10 -333 -5 -14
-25 -42 -44 -63 -57 -63 -57 -102 0 -163 20 -22 23 -36 25 -124 2 -90 0 -101
-17 -107 -11 -4 -22 -8 -26 -8 -5 -1 -8 39 -8 87 0 86 -1 89 -31 118 -66 62
-64 134 7 212 l44 50 0 306 c0 168 -3 306 -7 306 -6 0 -417 -188 -530 -243
l-63 -30 0 -92 0 -92 45 -45 c33 -34 45 -54 45 -75 0 -16 -3 -33 -7 -36 -4 -4
-5 -79 -4 -167 l3 -159 -29 -28 -28 -28 -5 190 -5 190 -32 32 -33 31 0 126 c0
69 -3 126 -7 126 -5 0 -90 -39 -189 -87 l-182 -88 -6 -65 c-3 -36 -6 -282 -6
-547 l0 -483 -41 -20 c-23 -12 -42 -20 -44 -18 -4 4 -8 459 -6 861 l1 338 35
15 c20 8 163 74 318 148 155 73 372 175 482 226 110 51 265 123 345 161 80 37
146 68 148 68 1 1 2 -25 2 -57z m476 -311 c49 -21 134 -60 189 -86 55 -26 168
-78 250 -115 180 -81 455 -207 618 -283 l118 -55 -53 -25 c-29 -15 -267 -128
-528 -252 l-475 -226 -45 17 c-69 27 -350 162 -350 169 0 28 167 205 194 205
6 0 44 -18 84 -40 83 -45 107 -49 122 -20 15 28 8 36 -58 69 -31 16 -66 38
-76 50 -11 12 -28 21 -39 21 -23 0 -92 -29 -204 -87 -46 -24 -85 -43 -88 -43
-3 0 -5 78 -5 174 l0 175 43 5 c152 18 138 20 264 -35 65 -28 134 -58 153 -66
21 -8 41 -26 48 -42 23 -52 109 -68 169 -32 56 35 56 97 0 131 -40 25 -83 25
-122 2 l-30 -19 -110 49 c-60 27 -131 59 -157 70 -42 19 -60 20 -153 15 l-105
-6 0 102 1 102 122 57 c67 32 125 58 128 58 3 0 46 -17 95 -39z m-6595 -280
c-6 -10 -23 -22 -37 -25 -15 -4 -76 -30 -136 -58 -107 -50 -108 -51 -129 -32
-27 24 -97 24 -134 0 -87 -57 -29 -156 84 -143 37 4 52 12 77 41 17 20 35 36
39 36 4 0 41 16 82 36 41 19 94 41 119 49 l44 13 0 -47 0 -48 143 -70 c78 -39
223 -108 322 -153 99 -45 183 -85 187 -89 4 -4 -74 -47 -175 -96 -100 -49
-249 -122 -331 -162 l-149 -73 -206 94 c-113 52 -280 129 -371 171 -173 81
-508 235 -572 263 -36 16 -50 32 -28 32 6 0 86 37 178 81 91 45 207 99 257
121 49 22 119 55 155 74 36 19 182 89 325 157 l260 124 3 -139 c1 -79 -2 -146
-7 -157z m3333 159 c113 -52 205 -98 206 -101 0 -3 -116 -61 -257 -127 -142
-66 -259 -125 -260 -129 -2 -5 13 -17 33 -26 l36 -18 67 36 c36 20 104 54 151
76 47 23 136 66 198 96 l113 55 157 -70 c210 -95 588 -267 634 -290 l38 -19
-158 -76 c-223 -108 -534 -253 -622 -292 -41 -18 -142 -64 -225 -102 -346
-162 -375 -174 -398 -167 -12 4 -112 47 -222 97 -362 163 -497 223 -735 330
-129 57 -292 131 -363 162 l-127 58 52 24 c107 51 475 216 547 245 l73 30 146
-69 c80 -37 148 -75 152 -83 4 -8 13 -27 20 -42 8 -16 32 -37 56 -49 36 -17
49 -19 80 -10 74 20 104 78 68 129 -31 45 -109 66 -154 42 -15 -8 -45 2 -147
52 -70 35 -130 64 -133 66 -8 6 24 21 170 83 140 59 290 126 435 193 l70 33
47 -21 c25 -12 139 -64 252 -116z m2337 -69 c34 -35 38 -72 8 -102 -20 -20
-21 -29 -17 -208 l3 -188 -29 -37 c-16 -22 -35 -36 -44 -34 -25 5 -27 60 -3
107 19 35 21 59 21 191 0 145 -1 153 -25 188 -29 43 -31 68 -8 94 24 26 60 22
94 -11z m-6526 -641 c6 -5 53 -27 105 -50 97 -42 401 -183 588 -271 l102 -48
0 -400 0 -400 -132 63 c-180 86 -361 168 -713 326 -72 32 -178 81 -237 108
l-108 51 0 404 0 405 193 -90 c105 -50 197 -94 202 -98z m8705 137 l0 -54 -82
-38 c-87 -40 -284 -132 -606 -284 l-193 -91 -61 28 -60 27 363 174 c500 238
612 290 627 291 8 0 12 -17 12 -53z m-6020 -162 c118 -54 267 -121 330 -150
63 -29 214 -97 335 -150 121 -53 284 -127 363 -163 l142 -65 0 -958 c0 -528
-3 -959 -7 -958 -5 0 -159 71 -343 158 l-335 158 -3 134 c-1 74 0 145 3 157 5
19 39 40 171 103 133 64 168 85 184 111 18 30 20 51 20 265 0 222 1 233 20
243 11 6 27 24 35 41 40 77 -58 179 -140 145 -66 -28 -76 -103 -21 -164 l34
-37 7 -200 c10 -268 14 -258 -142 -331 -255 -119 -243 -103 -243 -298 0 -106
-3 -137 -12 -133 -7 2 -91 42 -186 88 l-173 83 3 144 c4 171 -17 145 197 245
253 118 248 115 265 151 14 29 16 85 16 395 0 224 4 361 10 361 23 0 50 45 50
85 0 49 -18 77 -64 99 -47 22 -69 20 -105 -10 -26 -21 -31 -33 -31 -69 0 -36
6 -50 35 -81 l35 -37 0 -344 c0 -231 -4 -351 -11 -365 -6 -12 -67 -47 -147
-85 -349 -165 -322 -138 -322 -326 l0 -127 -60 30 c-33 17 -60 33 -60 35 0 3
7 22 15 42 12 28 15 84 15 272 0 194 3 240 15 258 8 12 54 42 101 68 126 69
124 63 124 331 l0 220 30 29 c24 23 30 37 30 73 0 37 -6 50 -34 78 -46 46
-104 48 -147 5 -45 -45 -33 -114 25 -157 l26 -19 1 -218 c2 -252 6 -238 -101
-292 -73 -37 -103 -62 -125 -106 -14 -25 -15 -71 -13 -303 l3 -274 -35 15
c-19 8 -46 19 -60 24 -23 8 -25 14 -23 62 1 28 -2 458 -5 953 l-7 902 50 -23
c28 -12 147 -66 265 -120z m2680 50 c0 -43 -4 -65 -12 -65 -10 0 -291 -125
-378 -168 l-35 -17 -3 -102 c-2 -87 0 -103 13 -103 8 0 24 -9 36 -21 27 -27
20 -67 -21 -119 l-30 -38 0 -214 c0 -241 4 -258 64 -258 51 0 86 -33 86 -80 0
-34 -4 -42 -30 -55 -16 -8 -36 -15 -45 -15 -24 0 -55 37 -55 67 0 18 -13 40
-37 66 l-38 38 -7 232 c-3 128 -9 253 -13 278 -6 42 -4 49 24 81 30 34 31 39
31 126 0 50 -3 93 -7 95 -5 2 -56 -18 -114 -46 l-107 -50 -6 -58 c-7 -59 0
-109 14 -109 19 0 40 -34 40 -65 0 -24 -9 -45 -32 -71 l-32 -37 -2 -214 c-1
-118 1 -226 5 -241 5 -18 25 -37 61 -58 30 -17 62 -42 72 -54 22 -27 24 -89 3
-116 -11 -14 -14 -52 -15 -160 0 -145 -2 -154 -41 -154 -5 0 -9 75 -9 174 l0
175 -60 70 -61 70 -4 262 c-2 167 -8 266 -14 272 -23 23 -12 76 24 116 33 36
35 42 35 111 0 71 0 72 -24 66 -13 -3 -69 -27 -123 -53 l-98 -48 4 -160 c3
-151 4 -161 26 -185 13 -14 26 -37 30 -51 8 -33 -17 -94 -53 -132 l-27 -28 1
-409 1 -408 -23 -10 c-22 -11 -22 -11 -29 111 -4 67 -5 257 -3 422 l3 300 33
49 c36 56 37 63 17 130 -11 34 -15 95 -15 202 l0 153 -112 -54 c-62 -29 -130
-60 -150 -68 l-38 -16 0 -678 0 -679 -45 -22 c-25 -12 -50 -22 -55 -22 -6 0
-10 265 -10 733 l0 733 63 27 c34 14 145 65 247 112 102 48 275 129 385 180
287 133 370 171 539 252 83 39 152 72 154 72 1 1 2 -28 2 -64z m-3632 -64 l54
-27 -94 -44 c-78 -36 -390 -183 -610 -288 l-58 -27 0 -351 0 -352 -49 -21
c-27 -11 -53 -21 -56 -21 -12 0 2 804 14 808 15 5 671 325 696 340 29 17 44
14 103 -17z m4766 19 c25 -9 26 -12 26 -94 0 -74 -3 -87 -19 -96 -38 -20 -41
-13 -41 95 0 58 2 105 4 105 3 0 16 -4 30 -10z m-298 -82 c60 -47 64 -57 61
-143 -2 -68 -5 -82 -22 -92 -11 -7 -23 -12 -27 -13 -5 0 -8 42 -8 93 0 84 -3
97 -25 127 -40 54 -30 67 21 28z m860 -2 c16 -8 97 -44 179 -81 83 -37 218
-99 300 -138 83 -38 211 -96 285 -129 74 -33 138 -63 143 -67 4 -4 -104 -60
-239 -124 l-247 -116 -176 83 c-351 167 -414 196 -422 196 -5 0 -9 14 -9 31 0
20 -10 40 -29 60 -26 25 -37 29 -85 29 -47 0 -61 -4 -87 -28 -40 -36 -42 -74
-5 -111 24 -23 34 -26 105 -27 61 0 86 -5 112 -22 19 -11 88 -45 154 -75 66
-30 242 -114 390 -187 149 -73 299 -145 334 -160 l64 -28 -44 -20 c-55 -25
-220 -103 -409 -194 -80 -39 -181 -86 -225 -105 -44 -20 -85 -40 -92 -45 -11
-9 -171 57 -378 156 l-69 33 69 32 c268 125 455 217 455 222 0 8 -238 125
-352 174 -50 22 -68 35 -68 48 0 11 -15 34 -34 53 -27 27 -42 34 -72 34 -47 0
-100 -30 -116 -65 -21 -47 41 -105 112 -105 19 0 41 4 49 9 13 8 68 -14 266
-109 77 -37 79 -39 53 -49 -54 -20 -374 -175 -401 -194 -26 -18 -30 -18 -70
-2 -69 27 -821 368 -831 376 -5 4 99 60 230 124 336 164 1111 532 1125 534 3
1 19 -5 35 -13z m-4797 -853 c0 -139 -2 -253 -5 -253 -4 0 -75 32 -158 71
-239 111 -246 115 -346 159 -52 23 -151 68 -220 101 l-125 61 75 34 c157 72
391 182 574 272 l191 92 6 -142 c4 -79 7 -257 8 -395z m5936 336 c77 -34 158
-69 180 -78 l39 -18 -99 -47 c-55 -26 -174 -82 -264 -124 l-163 -76 -163 83
-162 83 146 73 c80 40 175 86 211 103 36 17 74 37 85 46 11 8 27 16 35 16 9 0
79 -27 155 -61z m285 -252 l0 -64 -42 -18 c-60 -25 -405 -185 -638 -295 -285
-135 -574 -270 -577 -270 -2 0 -3 -175 -3 -388 l0 -389 -49 -26 c-27 -15 -51
-27 -55 -27 -3 0 -6 199 -6 443 l0 444 138 66 c198 95 347 165 902 426 102 48
217 104 255 124 39 20 71 36 73 37 1 0 2 -29 2 -63z m-2710 -52 c125 -57 242
-110 873 -395 l337 -152 0 -434 c0 -239 -2 -434 -4 -434 -2 0 -93 42 -202 93
-110 52 -207 97 -216 100 -16 6 -18 23 -18 170 0 157 -1 164 -22 184 -23 20
-136 73 -655 308 l-283 128 0 259 0 258 33 -14 c17 -8 88 -40 157 -71z m-3936
-224 c224 -105 412 -191 417 -191 5 0 9 -111 9 -248 0 -195 3 -252 14 -267 8
-11 88 -54 180 -95 l166 -75 0 -212 0 -211 -127 58 c-71 32 -274 126 -453 209
-179 84 -418 195 -532 248 l-208 97 0 467 0 468 63 -29 c34 -15 246 -114 471
-219z m3822 -371 c87 -39 270 -121 406 -183 l247 -112 -67 -34 c-62 -32 -445
-214 -543 -259 -24 -11 -116 -55 -204 -97 -88 -41 -196 -92 -240 -113 -44 -20
-158 -76 -255 -123 l-175 -86 -110 50 c-60 27 -191 87 -290 132 -234 107 -329
149 -388 172 l-48 19 210 98 c116 53 275 125 353 160 183 80 523 242 748 355
96 49 180 89 186 90 6 0 83 -31 170 -69z m758 -437 c-2 -56 -2 -57 -40 -75
-22 -10 -115 -54 -207 -98 -92 -44 -170 -80 -172 -80 -2 0 -91 -42 -197 -94
-106 -51 -265 -127 -353 -169 -88 -41 -222 -104 -297 -140 l-138 -66 0 -338 0
-339 -45 -22 c-25 -12 -48 -22 -50 -22 -3 0 -4 178 -3 395 l3 396 315 150
c173 83 335 160 360 171 25 11 133 62 240 113 368 176 575 274 580 274 3 1 4
-25 4 -56z m-1941 -539 l307 -138 0 -392 0 -393 -42 18 c-24 10 -74 33 -113
51 -38 18 -113 51 -165 75 -52 24 -129 58 -170 77 -247 115 -625 286 -685 311
-33 14 -126 57 -207 96 l-148 70 0 197 c0 107 3 194 8 192 155 -79 660 -308
679 -308 12 0 27 9 33 19 6 11 10 90 10 185 l0 165 93 -43 c50 -24 230 -106
400 -182z"
                  fill="currentColor"
                />
              </g>
            </svg>
          </div>
        </div>

        <div
          ref={orbitingContainerRef}
          className="absolute inset-0 pointer-events-none"
        >
          <div
            ref={orbitingDotRef}
            className="absolute top-0 left-1/2 w-4 h-4 rounded-full"
            style={{
              backgroundColor: currentTheme.primary,
              boxShadow: `0 0 20px ${currentTheme.primary}`,
              transform: "translateX(-50%) translateY(-50%) translateZ(200px)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
