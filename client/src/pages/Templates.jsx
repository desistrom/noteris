import { useEffect, useState } from 'react';
import { FileUp, Eye, Download, Trash2, Search, X, FileText, File } from 'lucide-react';
import api from '../api';

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name:'', aktaType:'', category:'', description:'', prefix:'AKT', stagesJson:'', fieldsJson:'' });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const [previewHtml, setPreviewHtml] = useState('');

  const year = new Date().getFullYear();

  useEffect(()=>{ fetchAll(); },[]);

  const fetchAll = async ()=>{
    setLoading(true);
    try{ const {data}= await api.get('/templates'); setTemplates(data.templates||[]);}catch(e){ setError(e.response?.data?.error||'Gagal load');}finally{setLoading(false);}
  };

  const openCreate = ()=>{
    setEditItem(null);
    setForm({ name:'', aktaType:'', category:'Pendirian Perusahaan', description:'', prefix:'AKT', stagesJson:'', fieldsJson:''});
    setFile(null); setError(''); setShowModal(true);
  };
  const openEdit = (t)=>{
    setEditItem(t);
    setForm({ name:t.name, aktaType:t.aktaType, category:t.category, description:t.description||'', prefix:t.prefix||'AKT', stagesJson: JSON.stringify(t.stages||[], null,2), fieldsJson: JSON.stringify(t.fields||[], null,2)});
    setFile(null); setError(''); setShowModal(true);
  };

  const handleSave = async (e)=>{
    e.preventDefault();
    setSaving(true); setError('');
    try{
      let stages=[]; let fields=[];
      if(form.stagesJson.trim()) try{ stages=JSON.parse(form.stagesJson);}catch{ throw new Error('Stages JSON invalid');}
      if(form.fieldsJson.trim()) try{ fields=JSON.parse(form.fieldsJson);}catch{ throw new Error('Fields JSON invalid');}
      if(!editItem){
        if(!file) throw new Error('File .docx/.pdf wajib untuk template baru');
        const fd = new FormData();
        fd.append('file', file);
        fd.append('name', form.name);
        fd.append('aktaType', form.aktaType);
        fd.append('category', form.category);
        fd.append('description', form.description);
        fd.append('prefix', form.prefix);
        fd.append('stages', JSON.stringify(stages));
        fd.append('fields', JSON.stringify(fields));
        await api.post('/templates/upload', fd, { headers:{'Content-Type':'multipart/form-data'}});
      } else {
        if(file){
          const fd = new FormData();
          fd.append('file', file);
          fd.append('name', form.name);
          fd.append('category', form.category);
          fd.append('description', form.description);
          fd.append('prefix', form.prefix);
          fd.append('stages', JSON.stringify(stages));
          fd.append('fields', JSON.stringify(fields));
          await api.put(`/templates/${editItem.id}/upload`, fd, { headers:{'Content-Type':'multipart/form-data'}});
        } else {
          await api.put(`/templates/${editItem.id}`, { name:form.name, description:form.description, prefix:form.prefix, stages, fields });
        }
      }
      setShowModal(false); fetchAll();
    }catch(err){ setError(err.response?.data?.error|| err.message || 'Gagal simpan');}finally{setSaving(false);}
  };

  const handleDelete = async (id)=>{
    if(!confirm('Hapus template? File akan terhapus.')) return;
    try{ await api.delete(`/templates/${id}`); fetchAll();}catch(e){ alert(e.response?.data?.error||'Gagal hapus');}
  };

  const handlePreview = async (t)=>{
    setPreview(t);
    setPreviewHtml('Loading...');
    try{
      const isPdf = t.templateMime?.includes('pdf') || t.templateFileName?.endsWith('.pdf');
      if(isPdf){
        setPreviewHtml('pdf');
      } else {
        const {data}= await api.get(`/templates/${t.id}/preview-html`);
        setPreviewHtml(data.html || '<p>Tidak ada preview</p>');
      }
    }catch{ setPreviewHtml('<p>Gagal load preview</p>');}
  };

  const handleDownload = async (t)=>{
    try{
      const res = await api.get(`/templates/${t.id}/file`, { responseType:'blob'});
      const url = URL.createObjectURL(res.data);
      const a=document.createElement('a'); a.href=url; a.download=t.templateFileName||'template'; a.click(); URL.revokeObjectURL(url);
    }catch{ alert('Gagal download');}
  };

  const filtered = templates.filter(t=> !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.aktaType.toLowerCase().includes(search.toLowerCase()) || t.prefix?.toLowerCase().includes(search.toLowerCase()));

  if(loading) return <div className="loading">Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Template Akta</h1>
        <button className="btn btn-primary" onClick={openCreate}><FileUp size={16}/> Upload Template</button>
      </div>

      {error && !showModal && <div className="alert alert-error">{error}</div>}

      <div className="card" style={{marginBottom:16}}>
        <div className="filter-bar">
          <div style={{position:'relative', flex:1, maxWidth:360}}>
            <Search size={16} style={{position:'absolute', left:10, top:11, color:'#94a3b8'}}/>
            <input placeholder="Cari nama / type / prefix..." value={search} onChange={e=>setSearch(e.target.value)} style={{paddingLeft:32, width:'100%'}}/>
          </div>
          <span style={{fontSize:13, color:'var(--text-secondary)'}}>{filtered.length} template</span>
        </div>
      </div>

      <div className="card">
        {filtered.length===0 ? <div className="empty-state"><h3>Belum ada template</h3><p>Upload file .docx/.pdf sebagai template.</p></div> : (
        <table>
          <thead><tr><th>Nama</th><th>Type</th><th>Prefix</th><th>Kategori</th><th>File</th><th>Preview No.</th><th>Aksi</th></tr></thead>
          <tbody>
            {filtered.map(t=>(
              <tr key={t.id}>
                <td><strong>{t.name}</strong><div style={{fontSize:11, color:'#64748b'}}>{t.description?.slice(0,60)}</div></td>
                <td><code style={{fontSize:12}}>{t.aktaType}</code></td>
                <td><span className="badge badge-in_progress" style={{fontFamily:'monospace'}}>{t.prefix}/{year}/001</span><div style={{fontSize:10, color:'#94a3b8'}}>{t.prefix}</div></td>
                <td>{t.category}</td>
                <td>
                  {t.templateFileName ? <span style={{display:'flex', alignItems:'center', gap:6, fontSize:12}}>{t.templateFileName.endsWith('.pdf')? <File size={14} color="#dc2626"/> : <FileText size={14} color="#2563eb"/>} {t.templateFileName} <span style={{color:'#94a3b8'}}>({t.templateFileSize? (t.templateFileSize/1024).toFixed(1)+'KB':''})</span></span> : <span style={{color:'#94a3b8', fontSize:12}}>— no file</span>}
                </td>
                <td style={{fontFamily:'monospace', fontSize:12}}>{t.prefix}/{year}/001</td>
                <td style={{display:'flex', gap:6}}>
                  <button className="btn btn-sm btn-outline" onClick={()=>handlePreview(t)} title="Preview"><Eye size={14}/></button>
                  <button className="btn btn-sm btn-outline" onClick={()=>handleDownload(t)} disabled={!t.templateFilePath} title="Download"><Download size={14}/></button>
                  <button className="btn btn-sm btn-outline" onClick={()=>openEdit(t)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={()=>handleDelete(t.id)}><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={()=>setShowModal(false)}>
          <div className="modal" style={{maxWidth:720}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
              <h2>{editItem ? 'Edit Template' : 'Upload Template Baru'}</h2>
              <button className="btn btn-sm btn-outline" onClick={()=>setShowModal(false)}><X size={14}/></button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSave}>
              <div className="grid grid-2">
                <div className="form-group"><label className="required">Nama Template</label><input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/></div>
                <div className="form-group"><label className="required">Akta Type (unik)</label><input value={form.aktaType} onChange={e=>setForm({...form, aktaType:e.target.value})} disabled={!!editItem} required placeholder="PT_Pendirian"/></div>
                <div className="form-group"><label className="required">Kategori</label><input value={form.category} onChange={e=>setForm({...form, category:e.target.value})} required /></div>
                <div className="form-group">
                  <label className="required">Prefix No. Akta (bebas)</label>
                  <input value={form.prefix} onChange={e=>setForm({...form, prefix:e.target.value})} maxLength={20} required placeholder="AKT atau AKT/NOT"/>
                  <div style={{fontSize:11, color:'#64748b', marginTop:4}}>Preview: <code>{form.prefix||'AKT'}/{year}/001</code> → <code>{form.prefix||'AKT'}/{year}/002</code> (reset otomatis tiap tahun)</div>
                </div>
              </div>
              <div className="form-group"><label>Deskripsi</label><textarea rows={2} value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/></div>

              <div className="form-group">
                <label className={editItem ? '' : 'required'}>File Template (.docx / .pdf) {editItem && '(kosongkan jika tidak ganti)'}</label>
                <div className="upload-drop">
                  <input type="file" accept=".docx,.pdf" onChange={e=>setFile(e.target.files[0]||null)} />
                  {file ? <div style={{fontSize:12, marginTop:6}}>{file.name} — {(file.size/1024).toFixed(1)}KB</div> : editItem?.templateFileName ? <div style={{fontSize:12, color:'#64748b'}}>File saat ini: {editItem.templateFileName}</div> : <div style={{fontSize:12, color:'#94a3b8'}}>Pilih file .docx atau .pdf (max 10MB). File akan menggantikan content.</div>}
                </div>
              </div>

              <details style={{marginBottom:12}}><summary style={{cursor:'pointer', fontSize:13, color:'#334155'}}>Advanced: Stages JSON</summary>
                <textarea rows={4} value={form.stagesJson} onChange={e=>setForm({...form, stagesJson:e.target.value})} placeholder='[{"id":"draft","name":"Draft","order":0}]' style={{width:'100%', fontFamily:'monospace', fontSize:12, marginTop:8}}/>
              </details>
              <details style={{marginBottom:12}}><summary style={{cursor:'pointer', fontSize:13, color:'#334155'}}>Advanced: Fields JSON</summary>
                <textarea rows={4} value={form.fieldsJson} onChange={e=>setForm({...form, fieldsJson:e.target.value})} placeholder='[{"name":"companyName","label":"Nama Perusahaan","type":"text","required":true}]' style={{width:'100%', fontFamily:'monospace', fontSize:12, marginTop:8}}/>
              </details>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={()=>setShowModal(false)}>Batal</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Menyimpan...':'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {preview && (
        <div className="modal-overlay" onClick={()=>setPreview(null)}>
          <div className="modal" style={{maxWidth:900, width:'95%', maxHeight:'85vh'}} onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
              <h2>Preview: {preview.name} <span style={{fontWeight:400, fontSize:12, color:'#64748b'}}>{preview.templateFileName}</span></h2>
              <button className="btn btn-sm btn-outline" onClick={()=>setPreview(null)}><X size={14}/></button>
            </div>
            {preview.templateMime?.includes('pdf') || preview.templateFileName?.endsWith('.pdf') ? (
              <iframe src={`/api/templates/${preview.id}/preview`} style={{width:'100%', height:'65vh', border:'1px solid #e2e8f0', borderRadius:8}} title="pdf preview"/>
            ) : previewHtml==='pdf' ? (
              <iframe src={`/api/templates/${preview.id}/preview`} style={{width:'100%', height:'65vh', border:'1px solid #e2e8f0', borderRadius:8}} title="pdf preview"/>
            ) : (
              <div style={{border:'1px solid #e2e8f0', borderRadius:8, padding:16, maxHeight:'65vh', overflow:'auto', background:'white'}} dangerouslySetInnerHTML={{__html: previewHtml}} />
            )}
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={()=>handleDownload(preview)}><Download size={14}/> Download</button>
              <button className="btn btn-primary" onClick={()=>setPreview(null)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
