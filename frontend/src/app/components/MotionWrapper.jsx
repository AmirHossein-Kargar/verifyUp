'use client';

import { motion } from 'framer-motion';

/**
 * Generic motion-enabled wrapper.
 * - `as`: HTML element tag name to animate (e.g. 'div', 'span', 'a', 'li', 'section')
 * - All other props are passed directly to the underlying motion component.
 */
export default function MotionWrapper({ as = 'div', children, ...motionProps }) {
  const MotionComponent = motion[as] || motion.div;

  return (
    <MotionComponent {...motionProps}>
      {children}
    </MotionComponent>
  );
}

