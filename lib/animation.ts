import type { Transition, Variants } from 'framer-motion'

export const EASE_SAMBEL: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94]

export const presetFade: Transition = {
  duration: 0.3,
  ease: EASE_SAMBEL,
}

export const presetSlideUp: Transition = {
  duration: 0.3,
  ease: EASE_SAMBEL,
}

export const presetSlideIn: Transition = {
  duration: 0.35,
  ease: EASE_SAMBEL,
}

export const presetSpring: Transition = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
}

export const presetCrossfade: Transition = {
  duration: 0.25,
  ease: EASE_SAMBEL,
}

export const presetTabIndicator: Transition = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
}

export const fadeInVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_SAMBEL } },
}

export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_SAMBEL } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15, ease: EASE_SAMBEL } },
}

export const tabContentVariants: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 40 : -40,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: EASE_SAMBEL },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction < 0 ? 40 : -40,
    transition: { duration: 0.2, ease: EASE_SAMBEL },
  }),
}

export const cardHoverVariants = {
  rest: { y: 0, scale: 1 },
  hover: { y: -4, scale: 1.02, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } },
  tap: { scale: 0.98, transition: { type: 'spring' as const, stiffness: 400, damping: 25 } },
}

export const yearCardHoverVariants = {
  rest: { y: 0, scale: 1 },
  hover: { y: -6, scale: 1.03, transition: { type: 'spring' as const, stiffness: 250, damping: 20 } },
  tap: { scale: 0.97, transition: { type: 'spring' as const, stiffness: 400, damping: 25 } },
}

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.32, ease: EASE_SAMBEL } },
  exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.15, ease: EASE_SAMBEL } },
}