import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

export default function App() {
  return (
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  );
}
