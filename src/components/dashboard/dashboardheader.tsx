// src/components/dashboard/DashboardHeader.tsx
'use client';
import Link from 'next/link';
import NextImage from 'next/image';


import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Bell, Plus, User as UserIcon, LogOut, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { getInitials, logger } from '@/lib/utils';

import { User } from '@supabase/supabase-js';

interface DashboardHeaderProps {
  user: User;
  profile: {
    full_name?: string;
    avatar_url?: string;
    email?: string;
  };
}

export default function DashboardHeader({ user, profile }: DashboardHeaderProps) {
  const router = useRouter();
  const supabase = createClient();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
      router.push('/signin');
      router.refresh();
    } catch (error: unknown) {
      logger.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* New Note Button */}
        <button
          onClick={() => router.push('/dashboard/notes/new')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {profile?.avatar_url ? (
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <NextImage
                  src={profile.avatar_url}
                  alt="User avatar"
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 text-white font-semibold text-sm">
                {user?.email ? getInitials(user.email) : '?'}
              </div>
            )}
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="font-semibold text-gray-900">
                  {profile?.full_name || 'User'}
                </p>
                <p className="text-sm text-gray-500">{user?.email || 'No email'}</p>
              </div>

              <Link
                href="/dashboard/settings"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setShowUserMenu(false)}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>

              <Link
                href="/dashboard/settings"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setShowUserMenu(false)}
              >
                <UserIcon className="w-4 h-4" />
                Profile
              </Link>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}