/**
 * Custom hook for hash-based section navigation
 * 
 * Features:
 * - Smooth scroll to sections
 * - Active section detection from scroll position
 * - Hash-based URL navigation
 * - Page reload with hash support
 * - Browser back/forward support
 * 
 * Usage:
 * const { activeSection, scrollToSection } = useSectionNavigation({
 *   sections: ['home', 'features', 'demo', 'about'],
 *   headerOffset: 120,
 *   defaultSection: 'home'
 * });
 */

import { useState, useEffect, useRef } from 'react';

interface UseSectionNavigationOptions {
  sections: string[];
  headerOffset?: number;
  defaultSection?: string;
  scrollThreshold?: number;
  initialScrollDelay?: number;
  navigationDelay?: number;
}

interface UseSectionNavigationReturn {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
  isNavigating: boolean;
}

export const useSectionNavigation = ({
  sections,
  headerOffset = 120,
  defaultSection = 'home',
  scrollThreshold = 50,
  initialScrollDelay = 600,
  navigationDelay = 800,
}: UseSectionNavigationOptions): UseSectionNavigationReturn => {
  const [activeSection, setActiveSection] = useState(() => {
    const hash = window.location.hash.slice(1);
    return hash || defaultSection;
  });

  const isNavigatingRef = useRef(false);
  const isUpdatingHashRef = useRef(false);

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    window.location.hash = sectionId;
    isNavigatingRef.current = true;
    setActiveSection(sectionId);

    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - headerOffset;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });

      setTimeout(() => {
        isNavigatingRef.current = false;
      }, navigationDelay);
    }
  };

  // Handle page load scroll to hash
  useEffect(() => {
    window.scrollTo(0, 0);
    const hash = window.location.hash.slice(1);

    if (hash && hash !== defaultSection) {
      isNavigatingRef.current = true;

      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          const exactTop = element.offsetTop - headerOffset;
          window.scrollTo({
            top: exactTop,
            behavior: 'smooth',
          });
        }

        setTimeout(() => {
          isNavigatingRef.current = false;
        }, 1000);
      }, initialScrollDelay);
    } else {
      window.history.replaceState(null, '', `#${defaultSection}`);
      setActiveSection(defaultSection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update active section based on scroll position
  useEffect(() => {
    const updateHashFromScroll = () => {
      if (isNavigatingRef.current || isUpdatingHashRef.current) {
        return;
      }

      const scrollPosition = window.scrollY;

      if (scrollPosition < scrollThreshold) {
        if (window.location.hash !== `#${defaultSection}`) {
          isUpdatingHashRef.current = true;
          window.history.replaceState(null, '', `#${defaultSection}`);
          setActiveSection(defaultSection);
          setTimeout(() => {
            isUpdatingHashRef.current = false;
          }, 100);
        }
        return;
      }

      const scrollPositionWithOffset = scrollPosition + headerOffset;

      let foundSection = defaultSection;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPositionWithOffset) {
          foundSection = sections[i];
          break;
        }
      }

      if (window.location.hash !== `#${foundSection}`) {
        isUpdatingHashRef.current = true;
        window.history.replaceState(null, '', `#${foundSection}`);
        setActiveSection(foundSection);
        setTimeout(() => {
          isUpdatingHashRef.current = false;
        }, 100);
      }
    };

    window.addEventListener('scroll', updateHashFromScroll, { passive: true });
    updateHashFromScroll();

    return () => {
      window.removeEventListener('scroll', updateHashFromScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections, headerOffset, defaultSection, scrollThreshold]);

  // Handle hash changes (browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || defaultSection;
      setActiveSection(hash);
      scrollToSection(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSection]);

  return {
    activeSection,
    scrollToSection,
    isNavigating: isNavigatingRef.current,
  };
};

