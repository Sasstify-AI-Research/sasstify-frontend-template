/**
 * Smooth scroll utility functions
 * 
 * Standalone helper for smooth scrolling to elements or positions
 */

export interface SmoothScrollOptions {
  offset?: number;
  behavior?: ScrollBehavior;
  onComplete?: () => void;
  delay?: number;
}

/**
 * Smooth scroll to an element by ID
 */
export const smoothScrollToElement = (
  elementId: string,
  options: SmoothScrollOptions = {}
): void => {
  const {
    offset = 0,
    behavior = 'smooth',
    onComplete,
    delay = 0,
  } = options;

  const executeScroll = () => {
    const element = document.getElementById(elementId);
    if (element) {
      const offsetTop = element.offsetTop - offset;
      window.scrollTo({
        top: offsetTop,
        behavior,
      });

      if (onComplete) {
        setTimeout(onComplete, 800);
      }
    }
  };

  if (delay > 0) {
    setTimeout(executeScroll, delay);
  } else {
    executeScroll();
  }
};

/**
 * Smooth scroll to a specific Y position
 */
export const smoothScrollToPosition = (
  position: number,
  behavior: ScrollBehavior = 'smooth'
): void => {
  window.scrollTo({
    top: position,
    behavior,
  });
};

/**
 * Smooth scroll to top of page
 */
export const smoothScrollToTop = (behavior: ScrollBehavior = 'smooth'): void => {
  window.scrollTo({
    top: 0,
    behavior,
  });
};

/**
 * Get element's scroll position accounting for offset
 */
export const getElementScrollPosition = (
  elementId: string,
  offset: number = 0
): number | null => {
  const element = document.getElementById(elementId);
  return element ? element.offsetTop - offset : null;
};

