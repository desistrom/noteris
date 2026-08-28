import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get('/aktas?limit=100');
      const aktas = data.aktas || [];
      const byStatus = {};
      const byCategory = {};
      aktas.forEach(a => {
        byStatus[a.status] = (byStatus[a.status] || 0) + 1;
        const cat = a.aktaType?.split('_')[0];
        byCategory[cat] = (byCategory[cat] || 0) + 1;
      });
      setStats({ total: aktas.length, byStatus, recent: aktas.slice(0, 5) });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  const statCards = [
    { label: 'Total Akta', value: stats?.total || 0 },
    { label: 'Dalam Proses', value: stats?.byStatus?.in_progress || 0 },
    { label: 'Review', value: stats?.byStatus?.review || 0 },
    { label: 'Selesai', value: stats?.byStatus?.completed || 0 },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <button className="btn btn-primary" onClick={() => navigate('/app/deeds/create')}>
          + Buat Akta Baru
        </button>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 24 }}>
        {statCards.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: 16 }}>Akta Terbaru</h3>
        {stats?.recent?.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Klien</th>
                <th>Jenis</th>
                <th>Status</th>
                <th>Progres</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.map((a) => (
                <tr key={a.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/app/deeds/${a.id}`)}>
                  <td>{a.trackingCode}</td>
                  <td>{a.clientName}</td>
                  <td>{a.aktaType?.replace(/_/g, ' ')}</td>
                  <td><span className={`badge badge-${a.status}`}>{a.status?.replace('_', ' ')}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div className="progress-bar" style={{ width: 80 }}>
                        <div className="progress-bar-fill" style={{ width: `${a.progress}%` }} />
                      </div>
                      {a.progress}%
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <h3>Belum ada akta</h3>
            <p>Mulai dengan membuat akta pertama Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
