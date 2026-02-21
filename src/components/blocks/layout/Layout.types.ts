/**
 * Layout Component Types
 */

import { ReactNode } from 'react';

export interface LayoutProps {
  /**
   * Page content to render inside the layout
   */
  children: ReactNode;
  
  /**
   * Whether the header should always have a background (fixed style)
   * @default false
   */
  fixedHeader?: boolean;
  
  /**
   * Menu items to display in desktop header navigation
   */
  desktopMenuItems?: ReactNode;
  
  /**
   * Menu items to display in mobile header menu
   */
  mobileMenuItems?: ReactNode;
}

