import type { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const drawerSlideVariants: Variants = {
  closed: {
    x: '100%',
    transition: {
      type: 'spring' as const,
      damping: 30,
      stiffness: 300,
    },
  },
  open: {
    x: '0%',
    transition: {
      type: 'spring' as const,
      damping: 28,
      stiffness: 280,
    },
  },
};

export const drawerItemVariants: Variants = {
  closed: {
    opacity: 0,
    x: 25,
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};
