import {useEffect, type RefObject} from 'react';
import {createTorinoMotion} from './createTorinoMotion';
/** Scene listeners are cleaned up on navigation and Strict Mode remount. */
export function useTorinoMotion(ref: RefObject<HTMLDivElement | null>, paused = false, contentKey = '') {
 useEffect(() => {
  const root = ref.current;
  if (!root) return;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let cleanup = () => {};
  const mount = () => {
   cleanup();
   const reduced = paused || preference.matches;
   root.classList.toggle('reduce-motion', reduced);
   cleanup = createTorinoMotion(root, reduced);
  };
  mount(); preference.addEventListener('change', mount);
  return () => { cleanup(); preference.removeEventListener('change', mount); root.classList.remove('reduce-motion'); };
 }, [ref, paused, contentKey]);
}
