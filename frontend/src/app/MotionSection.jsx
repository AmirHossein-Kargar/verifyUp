'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Generic Motion wrapper for sections
 * Use this to wrap server component content that needs animation
 */
export default function MotionSection({
  children,
  delay = 0,
  className = '',
  initial = { opacity: 0, y: 12 },
  animate = { opacity: 1, y: 0 },
  transition
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <section className={className}>{children}</section>;
  }

  const defaultTransition = { duration: 0.55, delay };

  return (
    <motion.section
      className={className}
      initial={initial}
      animate={animate}
      transition={transition || defaultTransition}
    >
      {children}
    </motion.section>
  );
}
