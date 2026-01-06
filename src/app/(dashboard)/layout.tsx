// src/app/(dashboard)/layout.tsx
import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/dashboard/dashboardsidebar';
import DashboardHeader from '@/components/dashboard/dashboardheader';

import { WorkspaceProvider } from '@/contexts/WorkspaceContext';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/signin');
  }

  return (
    <WorkspaceProvider>
      <div className="h-screen flex overflow-hidden bg-gray-50">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader user={user} profile={user.user_metadata} />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </WorkspaceProvider>
  );
}