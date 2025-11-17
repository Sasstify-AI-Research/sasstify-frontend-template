/**
 * Viewport Lazy Load Component
 * 
 * Loads children only when they enter the viewport using Intersection Observer.
 * Perfect for heavy content sections that are below the fold.
 * 
 * @example
 * <ViewportLazyLoad threshold={0.2} rootMargin="100px">
 *   <HeavyComponent />
 * </ViewportLazyLoad>
 */

import { useEffect, useRef, useState } from 'react';
import { ViewportLazyLoadProps } from './ViewportLazyLoad.types';

export const ViewportLazyLoad = ({
  children,
  threshold = 0.1,
  rootMargin = '50px',
  placeholder
}: ViewportLazyLoadProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoaded) {
            setIsVisible(true);
            setHasLoaded(true);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, hasLoaded]);

  return (
    <div ref={containerRef}>
      {isVisible ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      ) : (
        placeholder || (
          <div className="flex items-center justify-center p-12 min-h-[200px]">
            <div className="text-center text-gray-400">
              <div className="animate-pulse text-sm">Loading content...</div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default ViewportLazyLoad;

