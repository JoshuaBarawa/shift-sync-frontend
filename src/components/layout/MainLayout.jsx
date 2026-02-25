import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-bg-light">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          isSidebarOpen={sidebarOpen}
        />
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};
