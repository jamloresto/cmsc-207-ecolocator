'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let initialized = false;

const DEFAULT_TRIGGER = {
  start: 'top 85%',
  toggleActions: 'play none none none',
  once: true,
};

function reveal(
  selector: string,
  fromVars: gsap.TweenVars,
  triggerStart?: string,
) {
  const elements = gsap.utils.toArray<HTMLElement>(selector);

  elements.forEach((element) => {
    gsap.fromTo(
      element,
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
        ease: 'power3.out',
        clearProps: 'all',
        scrollTrigger: {
          trigger: element,
          ...DEFAULT_TRIGGER,
          ...(triggerStart ? { start: triggerStart } : {}),
        },
      },
    );
  });
}

function stagger(
  selector: string,
  fromVars: gsap.TweenVars,
  triggerStart = 'top 85%',
) {
  const wrappers = gsap.utils.toArray<HTMLElement>(selector);

  wrappers.forEach((wrapper) => {
    const children = Array.from(wrapper.children) as HTMLElement[];
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
          trigger: wrapper,
          ...DEFAULT_TRIGGER,
          start: triggerStart,
        },
      },
    );
  });
}

function countUp(selector: string) {
  const elements = gsap.utils.toArray<HTMLElement>(selector);

  elements.forEach((element) => {
    const endValue = Number(element.dataset.count ?? element.textContent ?? 0);
    if (Number.isNaN(endValue)) return;

    gsap.fromTo(
      element,
      { textContent: 0 },
      {
        textContent: endValue,
        duration: 1.2,
        ease: 'power2.out',
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: element,
          ...DEFAULT_TRIGGER,
        },
      },
    );
  });
}

export function initScrollAnimations() {
  if (initialized) {
    ScrollTrigger.refresh();
    return;
  }

  initialized = true;

  reveal('.reveal-fade', {});
  reveal('.reveal-up', { y: 40 });
  reveal('.reveal-down', { y: -40 });
  reveal('.reveal-left', { x: 40 });
  reveal('.reveal-right', { x: -40 });
  reveal('.reveal-scale', { scale: 0.92 });

  stagger('.stagger-up', { y: 32 });
  stagger('.stagger-fade', {});
  stagger('.stagger-scale', { scale: 0.94 });
  stagger('.stagger-left', { x: 32 });
  stagger('.stagger-right', { x: -32 });

  countUp('.count-up');

  ScrollTrigger.refresh();
}
