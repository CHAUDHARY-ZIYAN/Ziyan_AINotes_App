// src/app/(dashboard)/dashboard/tags/page.tsx
import { Tag } from 'lucide-react';

export default function TagsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Tag className="w-6 h-6 text-gray-600" />
        <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
      </div>

      <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
        <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2"> NO TAGS NOTES </p>
        <p className="text-sm text-gray-500"> AI-powered auto-tagging </p>
      </div>
    </div>
  );
}