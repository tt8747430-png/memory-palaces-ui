import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768;

const subscribe = (callback: () => void) => {
  const mediaQuery = matchMedia(
    `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
  );
  mediaQuery.addEventListener("change", callback);
  return () =>
    mediaQuery.removeEventListener("change", callback);
};

const getSnapshot = () => window.innerWidth < MOBILE_BREAKPOINT;

export function useIsMobile() {
  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => false,
  );
}