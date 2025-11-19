// src/app/(dashboard)/dashboard/settings/page.tsx
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-gray-600" />
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
        <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Settings Coming Soon!
        </h2>
        <p className="text-gray-600 mb-4">
          Profile settings, preferences, and customization options will be available in Phase 6.
        </p>
        <p className="text-sm text-gray-500">
          Features planned: Theme customization, notification preferences, account settings, and more!
        </p>
      </div>
    </div>
  );
}
