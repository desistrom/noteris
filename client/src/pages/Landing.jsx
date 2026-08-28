import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Landing() {
  const [trackingCode, setTrackingCode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { data } = await api.get(`/aktas/track/${trackingCode.trim()}`);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Akta tidak ditemukan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing">
      <h1>Notaris App</h1>
      <p>Sistem Pemantauan Progres dan Pencatatan Akta Notaris</p>

      <div className="landing-card">
        <h2>Lacak Progres Akta</h2>
        <form onSubmit={handleTrack}>
          <div className="form-group">
            <label>Masukkan Kode Tracking</label>
            <input
              type="text"
              placeholder="Contoh: AKT-2026-ABC123"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Mencari...' : 'Lacak'}
          </button>
        </form>

        {error && <div className="alert alert-error" style={{ marginTop: 16 }}>{error}</div>}

        {result && (
          <div style={{ marginTop: 20, textAlign: 'left' }}>
            <div className="alert alert-info">
              <strong>Kode: {result.trackingCode}</strong><br />
              Jenis: {result.aktaType?.replace(/_/g, ' ')}
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13 }}>{result.progress}% selesai</span>
                <span className={`badge badge-${result.status}`}>{result.status?.replace('_', ' ')}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${result.progress}%` }} />
              </div>
            </div>

            <h3 style={{ fontSize: 14, marginBottom: 12 }}>Riwayat Progres</h3>
            <div className="timeline">
              {result.timeline?.map((item, i) => (
                <div key={i} className={`timeline-item ${item.status}`}>
                  <div className="timeline-name">{item.stageName}</div>
                  <div className="timeline-date">
                    {new Date(item.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                  {item.notes && <div className="timeline-notes">{item.notes}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <button className="btn btn-outline" onClick={() => navigate('/login')}>
            Login untuk Admin
          </button>
        </div>
      </div>
    </div>
  );
}
