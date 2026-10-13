import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { clearTokens, isAuthenticated, adminGetMessages } from '../../api/client';
import { ExternalLink, LogOut, Menu, X } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login');
      return;
    }

    // Fetch unread messages count
    adminGetMessages()
      .then((msgs) => {
        const unread = msgs.filter((m) => !m.is_read).length;
        setUnreadCount(unread);
      })
      .catch(() => {});
  }, [navigate]);

  const handleLogout = () => {
    clearTokens();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Men haqimda va rasm', path: '/admin/profile' },
    { label: 'Loyihalar', path: '/admin/projects' },
    { label: "Ko'nikmalar", path: '/admin/skills' },
    { label: 'Xizmatlar', path: '/admin/services' },
    { label: "Tajriba va ta'lim", path: '/admin/timeline' },
    { label: 'Fikrlar', path: '/admin/testimonials' },
    { label: "Aloqa ma'lumotlari", path: '/admin/contact-info' },
    { label: 'Kelgan xabarlar', path: '/admin/messages', badge: unreadCount },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-6 bg-[#071126] border-r border-border-subtle/40">
      <div>
        {/* Brand */}
        <div className="mb-8">
          <span className="font-mono text-xl font-bold text-text-main tracking-wider">
            admin<span className="text-accent">_</span>
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-[#1E3FA0] text-text-main font-medium shadow-sm'
                    : 'text-text-muted hover:text-text-main hover:bg-[#102250]/40'
                }`
              }
            >
              <span>{item.label}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-accent text-[#06122B] font-bold">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom actions */}
      <div className="pt-6 border-t border-border-subtle/30 flex flex-col gap-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-text-muted hover:text-text-main px-3.5 py-2 rounded-lg transition-colors"
        >
          <ExternalLink size={15} />
          <span>Saytni ko'rish</span>
        </a>

        <button
          onClick={handleLogout}
          type="button"
          className="flex items-center gap-2 text-sm text-rose-300 hover:text-rose-200 px-3.5 py-2 rounded-lg transition-colors text-left"
        >
          <LogOut size={15} />
          <span>Chiqish</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#071126] text-text-main flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between px-5 py-4 bg-[#071126] border-b border-border-subtle/40">
        <span className="font-mono text-lg font-bold text-text-main">
          admin<span className="text-accent">_</span>
        </span>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="btn-ghost p-1.5"
          aria-label="Menyu"
        >
          {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-[#071126]/95 backdrop-blur-md">
          <div className="flex justify-end p-4">
            <button onClick={() => setMobileSidebarOpen(false)} className="btn-ghost p-2">
              <X size={20} />
            </button>
          </div>
          <div className="h-[calc(100vh-80px)]">{sidebarContent}</div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 lg:w-72 shrink-0 min-h-screen sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl overflow-y-auto">
        <Outlet context={{ refreshUnread: () => {} }} />
      </main>
    </div>
  );
};
