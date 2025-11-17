/**
 * Section Component
 * 
 * Reusable section wrapper with consistent styling, navigation support,
 * and optional viewport-based lazy loading.
 * 
 * @example
 * // Simple section
 * <Section id="about" variant="gray" minHeight="600px">
 *   <AboutContent />
 * </Section>
 * 
 * @example
 * // Section with viewport lazy loading
 * <Section id="features" variant="gray" minHeight="800px" viewportLazyLoad>
 *   <FeaturesContent />
 * </Section>
 */

import { Suspense } from 'react';
import ViewportLazyLoad from '@/components/viewport-lazy-load/ViewportLazyLoad';
import { SectionProps } from './Section.types';

const variantClasses = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  transparent: 'bg-transparent',
};

export const Section = ({
  id,
  children,
  variant = 'white',
  minHeight,
  viewportLazyLoad = false,
  loadingFallback,
  className = '',
  containerized = true,
}: SectionProps) => {
  // Base classes for section
  const baseClasses = 'py-20 px-4';
  const variantClass = variantClasses[variant];
  const minHeightStyle = minHeight ? { minHeight } : {};
  
  // Combine all classes
  const sectionClasses = `${baseClasses} ${variantClass} ${className}`.trim();

  // Default loading fallback
  const defaultFallback = (
    <div className="flex justify-center">
      <div className="animate-pulse text-gray-400">Loading content...</div>
    </div>
  );

  // Render content with or without viewport lazy loading
  const content = viewportLazyLoad ? (
    <ViewportLazyLoad>
      <Suspense fallback={loadingFallback || defaultFallback}>
        {children}
      </Suspense>
    </ViewportLazyLoad>
  ) : (
    children
  );

  return (
    <section id={id} className={sectionClasses} style={minHeightStyle}>
      {containerized ? (
        <div className="max-w-7xl mx-auto">{content}</div>
      ) : (
        content
      )}
    </section>
  );
};

export default Section;

