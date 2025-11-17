/**
 * Hero Section - Home Section
 * 
 * Welcome section with call-to-action
 */

import { Rocket, ArrowRight } from 'lucide-react';

export const HeroSection = () => {
  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-[60vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-6">
          <Rocket className="w-4 h-4" />
          <span>Production-Ready MPA Template</span>
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Build Faster with
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Smart Lazy Loading
          </span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          A modern React template with automatic code splitting, viewport-based lazy loading,
          and smooth navigation. Optimized for performance out of the box.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={scrollToDemo}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group"
          >
            See Live Demo
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="/dashboard/"
            className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all"
          >
            View Dashboard
          </a>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">79 KB</div>
            <div className="text-sm text-gray-600">Initial Bundle</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">&lt;2s</div>
            <div className="text-sm text-gray-600">Time to Interactive</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">95+</div>
            <div className="text-sm text-gray-600">Lighthouse Score</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

