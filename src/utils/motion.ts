
export type MotionVariant = {
  hidden: Record<string, any>;
  visible: Record<string, any>;
};

// Fade in animation
export const fadeIn = (
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  delay: number = 0,
  duration: number = 0.5
): MotionVariant => {
  return {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 20 : direction === 'down' ? -20 : 0,
      x: direction === 'left' ? 20 : direction === 'right' ? -20 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        delay,
        duration,
        ease: [0.25, 0.1, 0.25, 1], // Smooth easing
      },
    },
  };
};

// Scale animation
export const scaleIn = (
  delay: number = 0,
  duration: number = 0.5
): MotionVariant => {
  return {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay,
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };
};

// Stagger children animations
export const staggerContainer = (
  staggerChildren: number = 0.1,
  delayChildren: number = 0
) => {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
};

// Page transition variants
export const pageTransition = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Header item animation for staggered reveals
export const headerItem = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    }
  },
};
