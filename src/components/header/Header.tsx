
import React, { useState, useEffect } from "react";
import { Menu, X, Terminal } from "lucide-react";
import "../../../public/styles/global.css";
import { HeaderProps } from './Header.types';

const Header: React.FC<HeaderProps> = ({ fixedHeader = false, pageName = "Sasstify AI", desktopMenuItems, mobileMenuItems }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);


  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || fixedHeader
          ? "bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">

            <a
              href="/"
              className="text-xl font-bold tracking-tight hover:opacity-80 hover:cursor-pointer transition-opacity flex items-center gap-2"
            >
              <Terminal size={20} />
              {pageName}
            </a>

          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {desktopMenuItems}
          </nav>

          {/* Mobile menu button */}
          {mobileMenuItems && (
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-800 hover:text-slate-600 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white animate-fade-down">
          <div className="pt-2 pb-4 px-4 space-y-1 sm:px-6">
            {mobileMenuItems}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;