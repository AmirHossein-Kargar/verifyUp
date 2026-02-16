'use client';

import { motion, useReducedMotion } from 'framer-motion';

/**
 * Generic Motion wrapper for divs
 * Use this to wrap server component content that needs animation
 */
export default function MotionDiv({
  children,
  className = '',
  as = 'div',
  ...motionProps
}) {
  const reduce = useReducedMotion();
  const Component = motion[as] || motion.div;

  if (reduce) {
    const StaticComponent = as === 'div' ? 'div' : as;
    return <StaticComponent className={className}>{children}</StaticComponent>;
  }

  return (
    <Component className={className} {...motionProps}>
      {children}
    </Component>
  );
}