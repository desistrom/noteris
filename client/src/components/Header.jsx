import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-brand">Notaris App</div>
      {user && (
        <nav className="header-nav">
          <NavLink to="/app" end>Dashboard</NavLink>
          <NavLink to="/app/deeds">Akta</NavLink>
          <NavLink to="/app/deeds/create">Buat Akta</NavLink>
          {user.role === 'super_admin' && (
            <NavLink to="/app/users">Users</NavLink>
          )}
        </nav>
      )}
      <div className="header-user">
        {user && (
          <>
            <span>{user.name}</span>
            <span className="role">{user.role}</span>
            <button className="btn btn-sm btn-outline" onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </header>
  );
}
