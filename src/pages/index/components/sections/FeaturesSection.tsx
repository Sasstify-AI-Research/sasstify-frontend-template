/**
 * Features Section
 * 
 * Showcase key features of the template
 * Lazy loads when scrolled into viewport
 */

import { Zap, Package, Eye, Code2, Rocket, Shield } from 'lucide-react';

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Smart Code Splitting',
    description: 'Automatic vendor chunking separates React, UI libraries, and page code for optimal caching.',
    color: 'from-yellow-400 to-orange-500',
  },
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'Viewport Lazy Loading',
    description: 'Components load only when scrolled into view, reducing initial bundle size and improving performance.',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    icon: <Package className="w-6 h-6" />,
    title: 'Optimized Bundles',
    description: '~79 KB initial load with vendor code cached long-term. Each page only downloads what it needs.',
    color: 'from-purple-400 to-pink-500',
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    title: 'TypeScript + React 19',
    description: 'Full type safety with the latest React features, strict mode enabled, and best practices enforced.',
    color: 'from-green-400 to-teal-500',
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    title: 'Lightning Fast HMR',
    description: 'Vite-powered development with <100ms hot module replacement and instant server start.',
    color: 'from-red-400 to-rose-500',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Production Ready',
    description: 'ESLint, TypeScript checks, optimized builds, and comprehensive documentation included.',
    color: 'from-cyan-400 to-blue-500',
  },
];

export const FeaturesSection = () => {
  return (
    <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Built-in performance optimizations and best practices so you can focus on building features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} text-white mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
              💡
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                This Section Was Lazy Loaded!
              </h4>
              <p className="text-gray-700">
                Notice how this content only loaded when you scrolled to it? That's viewport-based lazy loading in action.
                The Features section didn't download until it entered your viewport, saving bandwidth and improving initial page load.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default FeaturesSection;

