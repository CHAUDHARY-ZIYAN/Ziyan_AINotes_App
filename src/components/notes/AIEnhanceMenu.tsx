// src/components/notes/AIEnhanceMenu.tsx
'use client';

import { useState } from 'react';
import {
  Sparkles,
  FileText,
  Languages,
  Tag,
  HelpCircle,
  CheckSquare,
  List,
  MessageSquare,
  Lightbulb,
  Maximize2,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AIEnhanceMenuProps {
  content: string;
  onInsert: (text: string) => void;
  onReplace: (text: string) => void;
}

export default function AIEnhanceMenu({
  content,
  onInsert,
  onReplace,
}: AIEnhanceMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const enhanceNote = async (action: string, language?: string) => {
    if (!content || content.trim().length < 10) {
      toast.error('Please write some content first (at least 10 characters)');
      return;
    }

    setLoading(true);
    setIsOpen(false);
    setShowLanguageMenu(false);

    const loadingToast = toast.loading(`AI is ${action === 'translate' ? 'translating' : 'working'}...`);

    try {
      const response = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content, action,language, }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enhance note');
      }

      toast.dismiss(loadingToast);
      toast.success('AI enhancement complete!');

      // Show result in a modal or insert into editor
      if (action === 'tags') {
        toast.success(`Suggested tags: ${data.result}`);
      } else {
        // For now, we'll replace the content. Later we can add a preview modal
        onReplace(data.result);
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to enhance note');
      console.error('Enhancement error:', error);
    } finally {
      setLoading(false);
    }
  };

  const languages = [
    'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Chinese', 'Japanese', 'Korean', 'Hindi', 'Arabic'
  ];

  const aiActions = [
    {
      icon: FileText,
      label: 'Summarize',
      description: 'Create a brief summary',
      action: 'summarize',
      color: 'text-blue-600',
    },
    {
      icon: Maximize2,
      label: 'Expand',
      description: 'Add more details',
      action: 'expand',
      color: 'text-green-600',
    },
    {
      icon: Sparkles,
      label: 'Improve Writing',
      description: 'Enhance clarity & grammar',
      action: 'improve',
      color: 'text-purple-600',
    },
    {
      icon: Lightbulb,
      label: 'Simplify',
      description: 'Make it easier to understand',
      action: 'simplify',
      color: 'text-yellow-600',
    },
    {
      icon: Languages,
      label: 'Translate',
      description: 'Convert to another language',
      action: 'translate',
      color: 'text-pink-600',
      special: true,
    },
    {
      icon: Tag,
      label: 'Generate Tags',
      description: 'Auto-create relevant tags',
      action: 'tags',
      color: 'text-indigo-600',
    },
    {
      icon: HelpCircle,
      label: 'Create Questions',
      description: 'Generate study questions',
      action: 'questions',
      color: 'text-red-600',
    },
    {
      icon: CheckSquare,
      label: 'Extract Actions',
      description: 'Find all action items',
      action: 'actionItems',
      color: 'text-orange-600',
    },
    {
      icon: List,
      label: 'Create Outline',
      description: 'Structure main points',
      action: 'outline',
      color: 'text-teal-600',
    },
    {
      icon: MessageSquare,
      label: 'Critique',
      description: 'Get feedback & suggestions',
      action: 'critique',
      color: 'text-gray-600',
    },
  ];

  return (
    <div className="relative">
      {/* AI Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition disabled:opacity-50 shadow-lg"
      >
        <Sparkles className="w-4 h-4" />
        <span className="font-medium">AI Enhance</span>
      </button>

      {/* Main Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 max-h-[600px] overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                AI Enhancements
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Select an action to enhance your note
              </p>
            </div>

            <div className="py-2">
              {aiActions.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.action}
                    onClick={() => {
                      if (item.special) {
                        setShowLanguageMenu(true);
                      } else {
                        enhanceNote(item.action);
                      }
                    }}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition text-left"
                  >
                    <Icon className={`w-5 h-5 ${item.color} mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Language Selection Menu */}
      {showLanguageMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowLanguageMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 max-h-[400px] overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 text-sm">
                Select Language
              </h3>
            </div>
            <div className="py-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => enhanceNote('translate', lang)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition"
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}