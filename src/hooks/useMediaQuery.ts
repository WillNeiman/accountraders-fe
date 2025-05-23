import { useState, useEffect } from 'react';
import { breakpoints } from '@/styles/theme/breakpoints';

type Breakpoint = keyof typeof breakpoints;

export const useMediaQuery = (breakpoint: Breakpoint) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${breakpoints[breakpoint]})`);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [breakpoint]);

  return matches;
}; 