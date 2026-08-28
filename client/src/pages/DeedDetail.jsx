import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function DeedDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [akta, setAkta] = useState(null);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stageModal, setStageModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState('');
  const [stageStatus, setStageStatus] = useState('in_progress');
  const [stageNotes, setStageNotes] = useState('');
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchAkta();
  }, [id]);

  const fetchAkta = async () => {
    try {
      const { data } = await api.get(`/aktas/${id}`);
      setAkta(data.akta);
      try {
        const tplRes = await api.get(`/templates/type/${data.akta.aktaType}`);
        setTemplate(tplRes.data.template);
      } catch {}
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const updateStage = async () => {
    try {
      await api.post(`/aktas/${id}/progress`, {
        stageId: selectedStage,
        status: stageStatus,
        notes: stageNotes,
      });
      setStageModal(false);
      setStageNotes('');
      fetchAkta();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update');
    }
  };

  const generateDocument = async () => {
    try {
      const { data } = await api.post(`/aktas/${id}/generate`);
      if (data.documentPath) fetchAkta();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate');
    }
  };

  const downloadDocument = async () => {
    if (!akta?.documentPath) return;
    setDownloading(true);
    try {
      const response = await api.get(`/aktas/${id}/document`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${akta.trackingCode}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error && !akta) return <div className="alert alert-error">{error}</div>;

  const stages = template?.stages || [];

  return (
    <div>
      <div className="page-header">
        <h1>Detail Akta</h1>
        <button className="btn btn-outline" onClick={() => navigate('/app/deeds')}>Kembali</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Informasi Akta</h3>
          <table>
            <tbody>
              <tr><td><strong>Kode Tracking</strong></td><td>{akta.trackingCode}</td></tr>
              <tr><td><strong>Klien</strong></td><td>{akta.clientName}</td></tr>
              <tr><td><strong>Email</strong></td><td>{akta.clientEmail || '-'}</td></tr>
              <tr><td><strong>Telepon</strong></td><td>{akta.clientPhone || '-'}</td></tr>
              <tr><td><strong>Jenis Akta</strong></td><td>{akta.aktaType?.replace(/_/g, ' ')}</td></tr>
              <tr><td><strong>Status</strong></td><td><span className={`badge badge-${akta.status}`}>{akta.status?.replace('_', ' ')}</span></td></tr>
              <tr><td><strong>Progres</strong></td><td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div className="progress-bar" style={{ width: 100 }}>
                    <div className="progress-bar-fill" style={{ width: `${akta.progress}%` }} />
                  </div>
                  {akta.progress}%
                </div>
              </td></tr>
            </tbody>
          </table>

          <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setStageModal(true)}>Update Progres</button>
            <button className="btn btn-success" onClick={generateDocument}>Generate Dokumen</button>
            {akta.documentPath && (
              <button className="btn btn-outline" onClick={downloadDocument} disabled={downloading}>
                {downloading ? 'Download...' : 'Download .docx'}
              </button>
            )}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: 16 }}>Data Form</h3>
          {template?.fields?.length > 0 ? (
            <table>
              <tbody>
                {template.fields.map((f) => (
                  <tr key={f.id}>
                    <td><strong>{f.label}</strong></td>
                    <td>{String(akta.formData?.[f.name] || '-')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">No form data</div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginBottom: 16 }}>Riwayat Progres</h3>
        {akta.progressHistory?.length > 0 ? (
          <div className="timeline">
            {akta.progressHistory.map((h) => (
              <div key={h.id} className={`timeline-item ${h.status}`}>
                <div className="timeline-name">{h.stageName}</div>
                <div className="timeline-date">
                  {new Date(h.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })} - <strong>{h.status}</strong>
                </div>
                {h.notes && <div className="timeline-notes">{h.notes}</div>}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">Belum ada progres</div>
        )}
      </div>

      {stageModal && (
        <div className="modal-overlay" onClick={() => setStageModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Update Progres</h2>
            <div className="form-group">
              <label>Pilih Stage</label>
              <select value={selectedStage} onChange={(e) => setSelectedStage(e.target.value)}>
                <option value="">-- Pilih --</option>
                {stages.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={stageStatus} onChange={(e) => setStageStatus(e.target.value)}>
                <option value="started">Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
              </select>
            </div>
            <div className="form-group">
              <label>Catatan</label>
              <textarea value={stageNotes} onChange={(e) => setStageNotes(e.target.value)} rows={3} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => setStageModal(false)}>Batal</button>
              <button className="btn btn-primary" onClick={updateStage} disabled={!selectedStage}>
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
