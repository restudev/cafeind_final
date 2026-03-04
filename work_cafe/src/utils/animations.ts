import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const fadeIn = (element: string, delay: number = 0, duration: number = 1) => {
  return gsap.fromTo(
    element,
    { 
      opacity: 0,
      y: 30 
    },
    { 
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease: 'power3.out'
    }
  );
};

export const staggerFadeIn = (elements: string, stagger: number = 0.1, delay: number = 0) => {
  return gsap.fromTo(
    elements,
    { 
      opacity: 0,
      y: 20 
    },
    { 
      opacity: 1,
      y: 0,
      stagger,
      delay,
      duration: 0.8,
      ease: 'power2.out'
    }
  );
};

export const fadeSlideIn = (element: string, direction: 'left' | 'right' | 'up' | 'down' = 'up', delay: number = 0) => {
  const x = direction === 'left' ? -50 : direction === 'right' ? 50 : 0;
  const y = direction === 'up' ? -50 : direction === 'down' ? 50 : 0;
  
  return gsap.fromTo(
    element,
    { 
      opacity: 0,
      x,
      y
    },
    { 
      opacity: 1,
      x: 0,
      y: 0,
      duration: 1,
      delay,
      ease: 'power3.out'
    }
  );
};

export const floatingAnimation = (element: string, duration: number = 2, amount: number = 10) => {
  return gsap.to(element, {
    y: `+=${amount}`,
    duration,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });
};

export const heroAnimation = (container: string) => {
  const tl = gsap.timeline();
  
  tl.fromTo(
    `${container} .hero-title`, 
    { opacity: 0, y: 50 }, 
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
  )
  .fromTo(
    `${container} .hero-subtitle`, 
    { opacity: 0, y: 30 }, 
    { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
    '-=0.4'
  )
  .fromTo(
    `${container} .hero-buttons .btn`, 
    { opacity: 0, y: 20 }, 
    { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, ease: 'back.out(1.7)' },
    '-=0.4'
  )
  .fromTo(
    `${container} .hero-image`, 
    { opacity: 0, scale: 0.9 }, 
    { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' },
    '-=0.6'
  );
  
  return tl;
};

export const scrollAnimations = () => {
  // Fade in elements when scrolled into view
  gsap.utils.toArray<HTMLElement>('.scroll-fade').forEach((element) => {
    gsap.fromTo(
      element,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // Stagger items when scrolled into view
  gsap.utils.toArray<HTMLElement>('.scroll-stagger-container').forEach((container) => {
    const items = container.querySelectorAll('.scroll-stagger-item');
    
    gsap.fromTo(
      items,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        scrollTrigger: {
          trigger: container,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });
};

export const initializeAnimations = () => {
  scrollAnimations();
};