import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(() => {
    const v = localStorage.getItem('sidebar-collapsed');
    return v === '1';
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', collapsed ? '1' : '0');
  }, [collapsed]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="admin-layout">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(v => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="admin-main">
        <button className="admin-mobile-toggle" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
