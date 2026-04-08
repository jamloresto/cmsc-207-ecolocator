'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let initialized = false;

export function initScrollAnimations() {
  if (initialized) {
    ScrollTrigger.refresh();
    return;
  }

  initialized = true;

  const defaultTrigger = {
    start: 'top 85%',
    toggleActions: 'play none none none',
    once: true,
  };

  const reveal = (
    selector: string,
    vars: gsap.TweenVars,
    triggerStart?: string,
  ) => {
    const elements = gsap.utils.toArray<HTMLElement>(selector);

    elements.forEach((el) => {
      gsap.fromTo(
        el,
        {
          opacity: 0,
          ...vars.from,
        } as gsap.TweenVars,
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'all',
          ...vars.to,
          scrollTrigger: {
            trigger: el,
            ...defaultTrigger,
            ...(triggerStart ? { start: triggerStart } : {}),
          },
        },
      );
    });
  };

  reveal('.reveal-fade', {
    from: {},
    to: {},
  });

  reveal('.reveal-up', {
    from: { y: 40 },
    to: { y: 0 },
  });

  reveal('.reveal-down', {
    from: { y: -40 },
    to: { y: 0 },
  });

  reveal('.reveal-left', {
    from: { x: 40 },
    to: { x: 0 },
  });

  reveal('.reveal-right', {
    from: { x: -40 },
    to: { x: 0 },
  });

  reveal('.reveal-scale', {
    from: { scale: 0.92 },
    to: { scale: 1 },
  });

  const stagger = (
    selector: string,
    fromVars: gsap.TweenVars,
    triggerStart = 'top 85%',
  ) => {
    const wrappers = gsap.utils.toArray<HTMLElement>(selector);

    wrappers.forEach((wrap) => {
      const children = Array.from(wrap.children) as HTMLElement[];

      if (!children.length) return;

      gsap.fromTo(
        children,
        {
          opacity: 0,
          ...fromVars,
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: wrap,
            ...defaultTrigger,
            start: triggerStart,
          },
        },
      );
    });
  };

  stagger('.stagger-up', { y: 32 });
  stagger('.stagger-fade', {});
  stagger('.stagger-scale', { scale: 0.94 });

  const counters = gsap.utils.toArray<HTMLElement>('.count-up');
  counters.forEach((el) => {
    const end = Number(el.dataset.count ?? el.textContent ?? 0);

    if (Number.isNaN(end)) return;

    gsap.fromTo(
      el,
      { textContent: 0 },
      {
        textContent: end,
        duration: 1.2,
        ease: 'power2.out',
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: el,
          ...defaultTrigger,
        },
      },
    );
  });

  ScrollTrigger.refresh();
}
