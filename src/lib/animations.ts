import type { Variants } from 'framer-motion';

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function fadeIn(reducedMotion: boolean): Variants {
  if (reducedMotion) {
    return { hidden: { opacity: 1 }, visible: { opacity: 1 } };
  }

  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.15, ease }
    }
  };
}

export function slideInLeft(reducedMotion: boolean): Variants {
  if (reducedMotion) {
    return { hidden: { opacity: 1, x: 0 }, visible: { opacity: 1, x: 0 } };
  }

  return {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.2, ease }
    }
  };
}

export function scaleIn(reducedMotion: boolean): Variants {
  if (reducedMotion) {
    return { hidden: { opacity: 1, scale: 1 }, visible: { opacity: 1, scale: 1 } };
  }

  return {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.15, ease }
    }
  };
}
