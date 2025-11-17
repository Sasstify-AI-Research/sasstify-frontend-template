import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { LayoutProps } from './Layout.types';

const Layout: React.FC<LayoutProps> = ({ children, fixedHeader, desktopMenuItems, mobileMenuItems}) => {
  return (
    <div>
      <Header fixedHeader={fixedHeader}
              desktopMenuItems={desktopMenuItems}
              mobileMenuItems={mobileMenuItems}/>
      <section>
        {children}
      </section>
      <Footer />
    </div>
  );
};

export default Layout;
