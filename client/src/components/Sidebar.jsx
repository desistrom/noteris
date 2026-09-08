import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Files, FilePlus2, Users, LogOut, PanelLeftClose, PanelLeft, Scale, FileUp } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/app/deeds', label: 'Daftar Akta', icon: Files },
    { to: '/app/deeds/create', label: 'Buat Akta', icon: FilePlus2 },
  ];

  const adminItems = user?.role === 'super_admin' ? [{ to: '/app/templates', label: 'Template Akta', icon: FileUp }, { to: '/app/users', label: 'Manajemen User', icon: Users }] : [];

  const initials = (user?.name || 'A').split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase();

  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={onCloseMobile} />}
      <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="sidebar-logo"><Scale size={20} /></div>
            {!collapsed && <span className="sidebar-brand-text">Notaris App</span>}
          </div>
          <button className="sidebar-toggle" onClick={onToggle} aria-label="Toggle sidebar">
            {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">{!collapsed && 'Menu Utama'}</div>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({isActive})=> isActive? 'sidebar-link active' : 'sidebar-link'} onClick={onCloseMobile} title={collapsed ? item.label : undefined}>
              <item.icon size={18} className="sidebar-icon" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
          {adminItems.length > 0 && (
            <>
              <div className="sidebar-divider" />
              <div className="sidebar-section-title">{!collapsed && 'Admin'}</div>
              {adminItems.map(item => (
                <NavLink key={item.to} to={item.to} className={({isActive})=> isActive? 'sidebar-link active' : 'sidebar-link'} onClick={onCloseMobile} title={collapsed ? item.label : undefined}>
                  <item.icon size={18} className="sidebar-icon" />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div className={`sidebar-user ${collapsed ? 'collapsed' : ''}`}>
              <div className="sidebar-avatar">{initials}</div>
              {!collapsed && (
                <div className="sidebar-user-info">
                  <div className="sidebar-user-name">{user.name}</div>
                  <div className="sidebar-user-role">{user.role === 'super_admin' ? 'Super Admin' : 'Admin'}</div>
                </div>
              )}
            </div>
          )}
          <button className="sidebar-logout" onClick={handleLogout} title={collapsed ? 'Logout' : undefined}>
            <LogOut size={16} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
