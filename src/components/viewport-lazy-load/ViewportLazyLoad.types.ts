/**
 * ViewportLazyLoad Component Types
 */

import { ReactNode } from 'react';

export interface ViewportLazyLoadProps {
  /**
   * Content to lazy load when visible in viewport
   */
  children: ReactNode;
  
  /**
   * Percentage of element visibility required to trigger loading (0.0 - 1.0)
   * @default 0.1
   */
  threshold?: number;
  
  /**
   * Margin around the viewport for early/delayed loading
   * @default '50px'
   * @example '100px' - Load 100px before element enters viewport
   */
  rootMargin?: string;
  
  /**
   * Custom placeholder to show while content is loading
   * @default Loading spinner
   */
  placeholder?: ReactNode;
}

