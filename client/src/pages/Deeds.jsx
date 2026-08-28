import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const STATUS_OPTIONS = ['all', 'draft', 'in_progress', 'review', 'completed', 'cancelled'];

export default function Deeds() {
  const [aktas, setAktas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [aktaType, setAktaType] = useState('all');
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
    fetchAktas();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data } = await api.get('/templates');
      setTemplates(data.templates || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAktas = async () => {
    try {
      const params = new URLSearchParams();
      if (status !== 'all') params.append('status', status);
      if (aktaType !== 'all') params.append('aktaType', aktaType);
      const { data } = await api.get(`/aktas?${params.toString()}`);
      setAktas(data.aktas || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAktasSearch(search);
  };

  const fetchAktasSearch = async (q) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (status !== 'all') params.append('status', status);
      if (aktaType !== 'all') params.append('aktaType', aktaType);
      if (q) params.append('search', q);
      const { data } = await api.get(`/aktas?${params.toString()}`);
      setAktas(data.aktas || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Daftar Akta</h1>
        <button className="btn btn-primary" onClick={() => navigate('/app/deeds/create')}>
          + Buat Akta
        </button>
      </div>

      <div className="filter-bar">
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            placeholder="Cari kode / klien / email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 260 }}
          />
          <button type="submit" className="btn btn-outline">Cari</button>
        </form>
        <select value={status} onChange={(e) => { setStatus(e.target.value); setTimeout(fetchAktasSearch, 0); }}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === 'all' ? 'Semua Status' : s.replace('_', ' ')}</option>
          ))}
        </select>
        <select value={aktaType} onChange={(e) => { setAktaType(e.target.value); setTimeout(fetchAktasSearch, 0); }}>
          <option value="all">Semua Jenis</option>
          {templates.map((t) => (
            <option key={t.aktaType} value={t.aktaType}>{t.name}</option>
          ))}
        </select>
      </div>

      <div className="card">
        {aktas.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Kode</th>
                <th>Klien</th>
                <th>Jenis Akta</th>
                <th>Status</th>
                <th>Progres</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {aktas.map((a) => (
                <tr key={a.id}>
                  <td><strong>{a.trackingCode}</strong></td>
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
                  <td>
                    <button className="btn btn-sm btn-outline" onClick={() => navigate(`/app/deeds/${a.id}`)}>
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <h3>Tidak ada akta</h3>
            <p>Belum ada akta yang sesuai filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
