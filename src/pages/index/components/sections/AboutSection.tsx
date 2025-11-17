/**
 * About Section
 * 
 * Information about the template and its benefits
 * Lazy loads when scrolled into viewport
 */

import { BookOpen, Github, FileText } from 'lucide-react';

export const AboutSection = () => {
  return (
    <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Info */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              A Template Built for Performance
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              This Multi-Page Application (MPA) template is designed from the ground up for optimal performance.
              With smart code splitting, viewport-based lazy loading, and automatic optimization, you get
              production-ready performance without the complexity.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  ✓
                </div>
                <div>
                  <strong className="text-gray-900">Zero Configuration Needed:</strong>
                  <span className="text-gray-600"> All optimizations work automatically</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  ✓
                </div>
                <div>
                  <strong className="text-gray-900">Learn By Example:</strong>
                  <span className="text-gray-600"> Working demos show best practices</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  ✓
                </div>
                <div>
                  <strong className="text-gray-900">Production Ready:</strong>
                  <span className="text-gray-600"> Deploy to any static host immediately</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <a
                href="./docs/LAZY_LOADING.md"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                Read the Guide
              </a>
              <a
                href="https://github.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-colors"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Template Highlights
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Lazy Loading Patterns</div>
                  <div className="text-sm text-gray-600">
                    Button click, viewport scroll, and modal interaction examples
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold">
                  4
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Vendor Chunks</div>
                  <div className="text-sm text-gray-600">
                    React, Query, UI, and general vendors split for optimal caching
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Documentation Guides</div>
                  <div className="text-sm text-gray-600">
                    Complete lazy loading and performance optimization guides
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-1">Working Examples</div>
                  <div className="text-sm text-gray-600">
                    Real code you can copy and adapt for your projects
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-white rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 italic">
                💡 <strong>Fun Fact:</strong> This section was also lazy loaded when you scrolled to it!
                Open DevTools Network tab and scroll to see sections load on demand.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AboutSection;

