import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <ProtectedRoute>
      <Header />
      <div className="main-content">
        <Outlet />
      </div>
    </ProtectedRoute>
  );
}
