/**
 * Section Component Types
 */

import { ReactNode } from 'react';

export interface SectionProps {
  /**
   * Unique ID for section navigation
   */
  id: string;
  
  /**
   * Content to render inside the section
   */
  children: ReactNode;
  
  /**
   * Background color variant
   * @default 'white'
   */
  variant?: 'white' | 'gray' | 'transparent';
  
  /**
   * Minimum height for the section
   * @example '600px', '800px', '100vh'
   */
  minHeight?: string;
  
  /**
   * Whether to enable viewport-based lazy loading for children
   * Uses IntersectionObserver to load content when visible
   * @default false
   */
  viewportLazyLoad?: boolean;
  
  /**
   * Suspense fallback to show while lazy content loads
   */
  loadingFallback?: ReactNode;
  
  /**
   * Additional CSS classes to apply
   */
  className?: string;
  
  /**
   * Whether to apply max-width container
   * @default true
   */
  containerized?: boolean;
}

