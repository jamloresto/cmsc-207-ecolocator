'use client';

import gsap from 'gsap';

export function initHeroAnimations(scope?: string | Element | null) {
  const ctx = gsap.context(() => {
    gsap.to('.hero-orb-a', {
      x: 28,
      y: -18,
      duration: 5.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to('.hero-orb-b', {
      x: -24,
      y: 18,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to('.hero-chip-a', {
      y: -12,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to('.hero-chip-b', {
      y: -18,
      duration: 3.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to('.hero-chip-c', {
      y: -10,
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to('.hero-pin-pulse', {
      scale: 1.08,
      opacity: 0.35,
      duration: 1.6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, scope ?? undefined);

  return () => ctx.revert();
}
