import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function CreateDeed() {
  const [templates, setTemplates] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [template, setTemplate] = useState(null);
  const [formData, setFormData] = useState({});
  const [client, setClient] = useState({ clientId: '', clientName: '', clientEmail: '', clientPhone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data } = await api.get('/templates');
      setTemplates(data.templates || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load templates');
    }
  };

  const handleTypeChange = async (type) => {
    setSelectedType(type);
    setFormData({});
    if (type) {
      try {
        const { data } = await api.get(`/templates/type/${type}`);
        setTemplate(data.template);
      } catch {}
    } else {
      setTemplate(null);
    }
  };

  const handleFieldChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        aktaType: selectedType,
        clientId: client.clientId,
        clientName: client.clientName,
        clientEmail: client.clientEmail || undefined,
        clientPhone: client.clientPhone || undefined,
        formData,
      };
      await api.post('/aktas', payload);
      navigate('/app/deeds');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create akta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Buat Akta Baru</h1>
        <button className="btn btn-outline" onClick={() => navigate('/app/deeds')}>Batal</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 16 }}>Pilih Jenis Akta</h3>
        <div className="form-group">
          <label>Kategori & Jenis Akta</label>
          <select value={selectedType} onChange={(e) => handleTypeChange(e.target.value)}>
            <option value="">-- Pilih Jenis Akta --</option>
            {templates.map((t) => (
              <option key={t.id} value={t.aktaType}>{t.category} - {t.name}</option>
            ))}
          </select>
        </div>
      </div>

      {template && (
        <form onSubmit={handleSubmit}>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 16 }}>Data Klien</h3>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="required">ID Klien</label>
                <input value={client.clientId} onChange={(e) => setClient({ ...client, clientId: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="required">Nama Klien</label>
                <input value={client.clientName} onChange={(e) => setClient({ ...client, clientName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={client.clientEmail} onChange={(e) => setClient({ ...client, clientEmail: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Telepon</label>
                <input value={client.clientPhone} onChange={(e) => setClient({ ...client, clientPhone: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 16 }}>Data Akta: {template.name}</h3>
            <div className="grid grid-2">
              {template.fields.map((f) => (
                <div key={f.id} className="form-group">
                  <label className={f.required ? 'required' : ''}>{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={formData[f.name] || ''}
                      onChange={(e) => handleFieldChange(f.name, e.target.value)}
                      required={f.required}
                    />
                  ) : f.type === 'select' ? (
                    <select
                      value={formData[f.name] || ''}
                      onChange={(e) => handleFieldChange(f.name, e.target.value)}
                      required={f.required}
                    >
                      <option value="">-- Pilih --</option>
                      {(f.options || []).map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={f.type === 'date' ? 'date' : f.type === 'number' ? 'number' : 'text'}
                      value={formData[f.name] || ''}
                      onChange={(e) => handleFieldChange(f.name, e.target.value)}
                      required={f.required}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="modal-actions" style={{ justifyContent: 'flex-start' }}>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan Akta'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
