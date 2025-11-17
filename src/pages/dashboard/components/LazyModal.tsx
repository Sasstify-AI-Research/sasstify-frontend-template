/**
 * Lazy Modal Component Example
 * 
 * This demonstrates lazy loading a modal/drawer component.
 * Modals are perfect for lazy loading because:
 * - They're hidden initially
 * - Not needed until user interaction
 * - Can be heavy (forms, complex UI)
 */

import { X, Settings, Bell, Lock, Palette } from 'lucide-react';

interface LazyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LazyModal = ({ isOpen, onClose }: LazyModalProps) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                Settings (Lazy Loaded ✅)
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              This modal was loaded only when you clicked the button.
              Perfect for reducing initial bundle size!
            </p>

            {/* Settings Options */}
            <div className="space-y-3">
              <SettingItem 
                icon={<Bell className="w-4 h-4" />}
                title="Notifications"
                description="Manage your notification preferences"
              />
              <SettingItem 
                icon={<Lock className="w-4 h-4" />}
                title="Privacy"
                description="Control your privacy settings"
              />
              <SettingItem 
                icon={<Palette className="w-4 h-4" />}
                title="Appearance"
                description="Customize your theme"
              />
            </div>

            <div className="mt-4 p-3 bg-green-50 rounded-md border border-green-200">
              <p className="text-xs text-green-800">
                💡 <strong>Best Practice:</strong> Load modals, drawers, and tooltips lazily.
                They're not visible on initial render!
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const SettingItem = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
    <div className="text-gray-600 mt-0.5">{icon}</div>
    <div>
      <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  </div>
);

export default LazyModal;

