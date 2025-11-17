import Layout from '@/components/layout/Layout';
import { lazy, Suspense, useState } from 'react';
import { BarChart3, Home, Sparkles, Info } from 'lucide-react';
import Section from '@/components/section/Section';
import HeroSection from './components/sections/HeroSection';
import { useSectionNavigation } from '@/hooks/useSectionNavigation';

// ✅ Lazy load section components - only load when scrolled into viewport
const FeaturesSection = lazy(() => import('./components/sections/FeaturesSection'));
const AboutSection = lazy(() => import('./components/sections/AboutSection'));

// ✅ Lazy load heavy chart component - only loads when button clicked
const HeavyChart = lazy(() => import('./components/HeavyChart'));

const Index = () => {
  const [showChart, setShowChart] = useState(false);

  // 🎯 Use the reusable navigation hook
  const { activeSection, scrollToSection } = useSectionNavigation({
    sections: ['home', 'features', 'demo', 'about'],
    headerOffset: 65,
    defaultSection: 'home',
  });

  // Navigation items configuration
  const navItems = [
    { id: 'home', label: 'Home', icon: <Home className="w-4 h-4" /> },
    { id: 'features', label: 'Features', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'demo', label: 'Demo', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  // Desktop menu items (for Header)
  const desktopMenuItems = (
    <>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            activeSection === item.id
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {item.icon}
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </>
  );

  // Mobile menu items (for Header)
  const mobileMenuItems = (
    <>
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            activeSection === item.id
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {item.icon}
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </>
  );

  return (
    <Layout 
      desktopMenuItems={desktopMenuItems}
      mobileMenuItems={mobileMenuItems}
    >

      {/* Hero Section - Always loaded (above fold) */}
      <HeroSection />

      {/* Features Section - Lazy loaded with reusable Section component */}
      <Section id="features" variant="gray" minHeight="800px" viewportLazyLoad>
        <FeaturesSection />
      </Section>

      {/* Demo Section - Existing lazy loading chart example */}
      <Section id="demo" variant="white" minHeight="600px">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Interactive Demo
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Try the lazy loading examples. Watch the Network tab to see components load on demand.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {/* Chart Lazy Loading Demo */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                Button-Click Lazy Loading
              </h3>
              <p className="text-gray-600 mb-4">
                This demonstrates lazy loading triggered by user interaction.
                The chart component only loads when you click the button below.
              </p>
              
              <button
                onClick={() => setShowChart(!showChart)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors shadow-md hover:shadow-lg"
              >
                {showChart ? 'Hide Chart' : 'Show Chart (Lazy Load)'}
              </button>

              {!showChart && (
                <p className="mt-4 text-sm text-gray-500 italic">
                  Chart not loaded yet - saving bandwidth and improving initial page load!
                </p>
              )}
            </div>

            {/* Lazy Loaded Chart */}
            {showChart && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Suspense 
                  fallback={
                    <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow-md border border-gray-200">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading chart component...</p>
                      </div>
                    </div>
                  }
                >
                  <HeavyChart />
                </Suspense>
              </div>
            )}

            {/* Navigation to Dashboard */}
            <div className="mt-12 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 text-center">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Want to See More Examples?
              </h4>
              <p className="text-gray-600 mb-4">
                Visit the Dashboard page to see lazy-loaded modal examples.
              </p>
              <a
                href="/dashboard/"
                className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors shadow-md hover:shadow-lg"
              >
                Go to Dashboard →
              </a>
            </div>
          </div>
      </Section>

      {/* About Section - Lazy loaded with reusable Section component */}
      <Section id="about" variant="white" minHeight="900px" viewportLazyLoad>
        <AboutSection />
      </Section>
    </Layout>
  );
};

export default Index;
