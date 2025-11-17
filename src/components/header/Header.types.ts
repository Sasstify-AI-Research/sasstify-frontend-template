/**
 * Header Component Types
 */

import { ReactNode } from 'react';

export interface HeaderProps {
  /**
   * Whether the header should always have a background (fixed style)
   * @default false
   */
  fixedHeader?: boolean;
  
  /**
   * Name/title to display in the header logo area
   * @default 'Sasstify AI'
   */
  pageName?: string;
  
  /**
   * Menu items to display in desktop navigation
   */
  desktopMenuItems?: ReactNode;
  
  /**
   * Menu items to display in mobile hamburger menu
   */
  mobileMenuItems?: ReactNode;
}

