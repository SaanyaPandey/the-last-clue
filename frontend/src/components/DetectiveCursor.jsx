import React, { useEffect, useRef } from 'react';

/**
 * DetectiveCursor Component
 * High-performance noir crosshair cursor rendered via direct DOM transform
 * and DOM class toggling to avoid per-frame React state re-renders.
 * Automatically disabled on touch devices and respects prefers-reduced-motion.
 */
export default function DetectiveCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    // Check if the device uses a coarse pointer (touch) or prefers reduced motion
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouchDevice || prefersReducedMotion) {
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let rafId = null;
    let isInitialized = false;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isInitialized) {
        isInitialized = true;
        cursorRef.current?.classList.add('active');
        dotRef.current?.classList.add('active');
      }

      // Check if target is interactive or a text input
      const target = e.target;
      if (target && cursorRef.current && dotRef.current) {
        const isTextInput = target.matches('input, textarea, select, [contenteditable="true"]');
        const isActionable = target.closest('button, a, [role="button"], [role="radio"], .graph-node, .clue-card, .suspect-card, .nav-tab, .filter-btn, .difficulty-btn, .seed-random-btn, .noir-nav-link, .noir-btn-primary, .noir-btn-secondary');

        if (isTextInput) {
          cursorRef.current.classList.add('hidden');
          dotRef.current.classList.add('hidden');
        } else {
          cursorRef.current.classList.remove('hidden');
          dotRef.current.classList.remove('hidden');

          if (isActionable) {
            cursorRef.current.classList.add('interactive');
          } else {
            cursorRef.current.classList.remove('interactive');
          }
        }
      }
    };

    const onMouseLeave = () => {
      cursorRef.current?.classList.remove('active');
      dotRef.current?.classList.remove('active');
      isInitialized = false;
    };

    const onMouseEnter = () => {
      cursorRef.current?.classList.add('active');
      dotRef.current?.classList.add('active');
      isInitialized = true;
    };

    // Smooth lerp loop using requestAnimationFrame
    const render = () => {
      currentX += (mouseX - currentX) * 0.35;
      currentY += (mouseY - currentY) * 0.35;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Outer Reticle Crosshair */}
      <div ref={cursorRef} className="detective-cursor-crosshair" aria-hidden="true">
        <div className="crosshair-ring" />
        <div className="crosshair-tick top" />
        <div className="crosshair-tick bottom" />
        <div className="crosshair-tick left" />
        <div className="crosshair-tick right" />
      </div>

      {/* Center Laser Point */}
      <div ref={dotRef} className="detective-cursor-dot" aria-hidden="true" />
    </>
  );
}

