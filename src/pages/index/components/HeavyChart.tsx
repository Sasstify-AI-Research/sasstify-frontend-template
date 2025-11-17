/**
 * Heavy Chart Component Example
 * 
 * This simulates a heavy component (like a chart library) that should be lazy loaded.
 * In real projects, this could be:
 * - Chart.js, Recharts, D3.js
 * - Rich text editors
 * - PDF viewers
 * - Data tables with complex features
 */

import { BarChart3 } from 'lucide-react';

export const HeavyChart = () => {
  // Simulate some heavy computation/initialization
  const data = Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    value: Math.floor(Math.random() * 100) + 20,
  }));

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Sales Analytics Chart (Lazy Loaded ✅)
        </h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        This component was loaded on demand. In a real app, this would be a heavy charting library.
      </p>

      {/* Simple bar chart visualization */}
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.month} className="flex items-center gap-3">
            <span className="w-12 text-sm text-gray-600 font-medium">{item.month}</span>
            <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
                style={{ width: `${item.value}%` }}
              >
                <span className="text-xs text-white font-semibold">{item.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
        <p className="text-xs text-blue-800">
          💡 <strong>Performance Tip:</strong> This component only loaded when you clicked "Show Chart".
          This reduces initial page load time!
        </p>
      </div>
    </div>
  );
};

export default HeavyChart;

