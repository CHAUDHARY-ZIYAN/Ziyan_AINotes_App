// src/app/page.tsx
import Link from 'next/link';
import { ArrowRight, BookOpen, Zap, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">MyNotes</span>
        </div>
        <div className="flex gap-4">
          <Link
            href="/signin"
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Your thoughts,
            <span className="text-blue-600"> organized</span> &
            <span className="text-purple-600"> enhanced</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A modern note-taking platform with real-time collaboration and
            AI-powered insights. Built for the way you think.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Start Taking Notes
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <Zap className="w-12 h-12 text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
            <p className="text-gray-600">
              Summarize, expand, and enhance your notes with artificial
              intelligence.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <Users className="w-12 h-12 text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-time Collaboration</h3>
            <p className="text-gray-600">
              Work together seamlessly with live updates and shared workspaces.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm">
            <BookOpen className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Rich Editor</h3>
            <p className="text-gray-600">
              Markdown support, code blocks, and beautiful formatting out of the
              box.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}