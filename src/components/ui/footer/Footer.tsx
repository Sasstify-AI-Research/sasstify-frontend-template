import { Heart } from "lucide-react";
import React from "react";

const Footer: React.FC = () => {

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mt-12 border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-600 font-medium">
            &copy; {currentYear} Sasstify AI LLP. All rights reserved.
          </p>
          <p className="text-sm text-slate-600 mt-4 md:mt-0 flex items-center gap-2 font-medium">
            Made with 
            <Heart 
              size={16} 
              className="text-red-500 fill-current animate-pulse hover:scale-110 transition-transform" 
              aria-label="love"
            /> 
            from developers for developers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
