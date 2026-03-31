import React from 'react';

interface MainLayoutProps {
  heroBanner?: React.ReactNode;
  stickyHeader: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
  mobileDrawer?: React.ReactNode;
  errorBanner?: React.ReactNode;
}

export function MainLayout({ 
  heroBanner,
  stickyHeader, 
  sidebar, 
  children, 
  mobileDrawer,
  errorBanner 
}: MainLayoutProps) {
  return (
    <div className="min-h-screen max-w-[1400px] mx-auto flex flex-col">
      {/* Error Banner — floats above content if provided */}
      {errorBanner}

      {/* Responsive Sticky Header Container */}
      {/* On desktop (lg+), this whole wrapper sticks to top-0 and groups the Hero Banner + Search Bar together. */}
      {/* On mobile, we use display: contents so the inner search bar can stick to the entire page independently. */}
      <div className="contents lg:flex lg:flex-col lg:sticky lg:top-0 lg:z-50 lg:bg-slate-50/95 lg:backdrop-blur-xl lg:border-b lg:border-black/[0.04]">
        
        {/* Hero Banner (Scrolls away on mobile, bounds within parent stickiness on desktop) */}
        {heroBanner && (
          <div className="w-full px-4 md:px-8 pt-4 md:pt-8 mb-4 lg:mb-0">
            {heroBanner}
          </div>
        )}

        {/* Slim Global Navbar (Sticky Top independently on mobile, static within sticky parent on desktop) */}
        <div className="sticky top-0 z-50 lg:static lg:z-auto pt-3 md:pt-4 px-4 md:px-8 pb-3 md:pb-4 mb-4 lg:mb-2 bg-slate-50/95 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none border-b border-black/[0.04] lg:border-none transition-all duration-300 shadow-sm lg:shadow-none">
          <header className="relative w-full">
            {stickyHeader}
          </header>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative z-10 px-4 md:px-8 pb-8 flex-1">
        {/* Desktop Sidebar */}
        {/* Offset needs to clear approx 240px of the sticky unified header on desktop */}
        <aside className="hidden lg:block w-[260px] sticky top-[250px] shrink-0 transition-all duration-300">
          <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6">
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
