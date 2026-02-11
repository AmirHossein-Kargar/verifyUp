'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function MotionSection({ children, delay = 0, className = '' }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <section className={className}>{children}</section>;
  }

  return (
    <motion.section
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay }}
    >
      {children}
    </motion.section>
  );
}
