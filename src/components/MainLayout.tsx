import React from 'react';

interface MainLayoutProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
  mobileDrawer?: React.ReactNode;
  errorBanner?: React.ReactNode;
}

export function MainLayout({ 
  header, 
  sidebar, 
  children, 
  mobileDrawer,
  errorBanner 
}: MainLayoutProps) {
  return (
    <div className="min-h-screen p-4 md:p-8 max-w-[1400px] mx-auto">
      {/* Error Banner — floats above content if provided */}
      {errorBanner}

      {/* Header Section */}
      <header className="mb-6">
        {header}
      </header>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 sticky top-8 shrink-0">
          <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] p-6">
            {sidebar}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 w-full">
          {children}
        </main>
      </div>

      {/* Mobile drawer (Portal-like insertion) */}
      {mobileDrawer}
    </div>
  );
}
