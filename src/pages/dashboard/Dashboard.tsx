import Layout from '@/components/layout/Layout';
import { lazy, Suspense, useState } from 'react';
import { Settings } from 'lucide-react';

// ✅ Lazy load modal component - only loads when opened
const LazyModal = lazy(() => import('./components/LazyModal'));

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Layout fixedHeader={true}>
      <div className="space-y-8 py-24">
        {/* Navigation Link */}
        <div className="flex justify-center">
          <a
            href="/"
            className="text-xl font-bold tracking-tight hover:opacity-80 hover:cursor-pointer transition-opacity flex items-center gap-2"
          >
            Link to Index
          </a>
        </div>

        {/* Lazy Loading Demo */}
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Settings className="w-6 h-6 text-purple-600" />
              Dashboard - Lazy Modal Demo
            </h2>
            <p className="text-gray-600 mb-4">
              This demonstrates lazy loading a modal component. The modal code only loads when you click the button.
            </p>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-md transition-colors shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <Settings className="w-5 h-5" />
              Open Settings (Lazy Load)
            </button>

            <div className="mt-4 p-4 bg-white rounded-md border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Why Lazy Load Modals?</h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                <li>Modals are hidden on initial render</li>
                <li>Reduces initial JavaScript bundle size</li>
                <li>Improves page load performance</li>
                <li>Only downloads when user needs it</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lazy Loaded Modal */}
      {isModalOpen && (
        <Suspense fallback={null}>
          <LazyModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </Suspense>
      )}
    </Layout>
  );
};

export default Dashboard;
