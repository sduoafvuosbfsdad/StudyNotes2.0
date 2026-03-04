import { useMemo } from 'react';
import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

export function useReducedMotionPreference(): boolean {
  const reduced = useFramerReducedMotion();

  return useMemo(() => Boolean(reduced), [reduced]);
}
