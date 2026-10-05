import { useState, useEffect } from 'react';
import { getApplications, createApplication, updateApplication, deleteApplication, getApplication } from '../services/api';

const Applications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  
  // States for search and filter
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sort, setSort] = useState('newest');
  
  // State for forms/modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState(null);
  const [viewApp, setViewApp] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchApps = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getApplications({ search, status: statusFilter, sort });
      setApps(data);
    } catch (err) {
      console.error(err);
      setError('Unable to load applications. Please check that the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, [search, statusFilter, sort]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const openAddForm = () => {
    setForm({ 
      company_name: '', 
      job_role: '', 
      applied_date: new Date().toISOString().split('T')[0], 
      status: 'Applied',
      source: '',
      location: '',
      job_url: '',
      notes: ''
    });
    setIsFormOpen(true);
    setViewApp(null);
  };

  const openEditForm = (app) => {
    setForm({ ...app });
    setIsFormOpen(true);
    setViewApp(null);
    window.scrollTo(0, 0);
  };

  const loadViewApp = async (id) => {
    try {
      const data = await getApplication(id);
      setViewApp(data);
      setIsFormOpen(false);
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      alert("Unable to load application details.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await deleteApplication(id);
        showSuccess("Application deleted successfully.");
        fetchApps();
      } catch (err) {
        console.error(err);
        alert("Unable to delete application. Please try again.");
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (form.id) {
        await updateApplication(form.id, form);
        showSuccess("Application updated successfully.");
      } else {
        await createApplication(form);
        showSuccess("Application added successfully.");
      }
      setIsFormOpen(false);
      setForm(null);
      fetchApps();
    } catch (err) {
      console.error(err);
      alert(form.id ? "Unable to update application." : "Unable to add application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert date to a nice string e.g., 04 Oct 2026
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.75rem' }}>Applications</h2>
          <p style={{ margin: '0.25rem 0 0 0', color: '#666' }}>Track and manage all your job applications</p>
        </div>
        <button onClick={openAddForm} style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', fontWeight: 'bold' }}>
          + Add Application
        </button>
      </div>

      {successMsg && (
        <div style={{ padding: '1rem', background: '#dcfce7', color: '#16a34a', borderRadius: '4px', marginBottom: '1rem', border: '1px solid #bbf7d0' }}>
          {successMsg}
        </div>
      )}
      
      {error && (
        <div style={{ padding: '1rem', background: '#fee2e2', color: '#dc2626', borderRadius: '4px', marginBottom: '1rem', border: '1px solid #fecaca' }}>
          {error}
        </div>
      )}

      {isFormOpen && form && (
        <div className="card" style={{ marginBottom: '1.5rem', borderTop: '4px solid #3b82f6' }}>
          <h3 style={{ marginTop: 0 }}>{form.id ? 'Edit Application' : 'Add Application'}</h3>
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{display:'block', marginBottom:'0.25rem', fontWeight: 500}}>Company Name *</label>
                <input required placeholder="e.g. ABC Tech" value={form.company_name} onChange={e => setForm({...form, company_name: e.target.value})} />
              </div>
              <div>
                <label style={{display:'block', marginBottom:'0.25rem', fontWeight: 500}}>Job Role *</label>
                <input required placeholder="e.g. Software Engineer" value={form.job_role} onChange={e => setForm({...form, job_role: e.target.value})} />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{display:'block', marginBottom:'0.25rem', fontWeight: 500}}>Applied Date *</label>
                <input required type="date" value={form.applied_date} onChange={e => setForm({...form, applied_date: e.target.value})} />
              </div>
              <div>
                <label style={{display:'block', marginBottom:'0.25rem', fontWeight: 500}}>Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
               <div>
                 <label style={{display:'block', marginBottom:'0.25rem', fontWeight: 500}}>Source</label>
                 <select value={form.source || ''} onChange={e => setForm({...form, source: e.target.value})}>
                  <option value="">Select Source</option>
                  <option value="Company Website">Company Website</option>
                  <option value="Naukri">Naukri</option>
                  <option value="Indeed">Indeed</option>
                  <option value="Glassdoor">Glassdoor</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Referral">Referral</option>
                  <option value="Other">Other</option>
                </select>
               </div>
              <div>
                <label style={{display:'block', marginBottom:'0.25rem', fontWeight: 500}}>Location</label>
                <input placeholder="e.g. Bangalore" value={form.location || ''} onChange={e => setForm({...form, location: e.target.value})} />
              </div>
            </div>

            <label style={{display:'block', marginBottom:'0.25rem', fontWeight: 500}}>Job URL</label>
            <input type="url" placeholder="https://..." value={form.job_url || ''} onChange={e => setForm({...form, job_url: e.target.value})} />
            
            <label style={{display:'block', marginBottom:'0.25rem', fontWeight: 500}}>Notes</label>
            <textarea rows="3" placeholder="Additional notes..." value={form.notes || ''} onChange={e => setForm({...form, notes: e.target.value})} />
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Application'}</button>
              <button type="button" onClick={() => setIsFormOpen(false)} style={{ background: 'transparent', color: '#666', border: '1px solid #ccc' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {viewApp && (
        <div className="card" style={{ marginBottom: '1.5rem', position: 'relative', borderTop: '4px solid #10b981' }}>
          <h3 style={{ marginTop: 0 }}>Application Details</h3>
          <button style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', color: '#666', padding: '0.25rem 0.5rem' }} onClick={() => setViewApp(null)}>✖ Close</button>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div><p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>Company</p><p style={{ margin: 0, fontWeight: 500 }}>{viewApp.company_name}</p></div>
            <div><p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>Role</p><p style={{ margin: 0, fontWeight: 500 }}>{viewApp.job_role}</p></div>
            <div><p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>Applied Date</p><p style={{ margin: 0, fontWeight: 500 }}>{formatDate(viewApp.applied_date)}</p></div>
            <div><p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>Status</p><span className={`badge badge-${viewApp.status}`}>{viewApp.status}</span></div>
            <div><p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>Source</p><p style={{ margin: 0, fontWeight: 500 }}>{viewApp.source || 'N/A'}</p></div>
            <div><p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>Location</p><p style={{ margin: 0, fontWeight: 500 }}>{viewApp.location || 'N/A'}</p></div>
            <div style={{ gridColumn: '1 / -1' }}>
              <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>Job URL</p>
              <p style={{ margin: 0 }}>{viewApp.job_url ? <a href={viewApp.job_url} target="_blank" rel="noreferrer" style={{ color: '#3b82f6' }}>{viewApp.job_url}</a> : 'N/A'}</p>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>Notes</p>
              <p style={{ margin: 0, background: '#f8f9fa', padding: '1rem', borderRadius: '4px' }}>{viewApp.notes || 'No notes provided.'}</p>
            </div>
            <div><p style={{ margin: '0 0 0.25rem 0', color: '#666', fontSize: '0.875rem' }}>Created At</p><p style={{ margin: 0, fontSize: '0.875rem' }}>{new Date(viewApp.created_at).toLocaleString()}</p></div>
            <div><p style={{ margin: '0 0 0.25rem 0', color: '#666', fontSize: '0.875rem' }}>Updated At</p><p style={{ margin: 0, fontSize: '0.875rem' }}>{new Date(viewApp.updated_at).toLocaleString()}</p></div>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input 
          style={{ flex: 1, minWidth: '250px', marginBottom: 0 }} 
          placeholder="Search company or role..." 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
        />
        <select 
          style={{ width: 'auto', marginBottom: 0 }} 
          value={statusFilter} 
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select 
          style={{ width: 'auto', marginBottom: 0 }} 
          value={sort} 
          onChange={e => setSort(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <div className="card" style={{ overflowX: 'auto', padding: 0 }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '3rem' }}>Loading applications...</p>
        ) : apps.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>No applications yet</h3>
            <p style={{ color: '#666', marginBottom: '2rem' }}>Start tracking your job applications by adding your first application.</p>
            <button onClick={openAddForm}>+ Add Application</button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 0 }}>
            <thead>
              <tr>
                <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', textAlign: 'left' }}>Company</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', textAlign: 'left' }}>Location</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', textAlign: 'left' }}>Source</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', background: '#f9fafb', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.map(app => (
                <tr key={app.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem', whiteSpace: 'nowrap' }}>{formatDate(app.applied_date)}</td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{app.company_name}</td>
                  <td style={{ padding: '1rem' }}>{app.job_role}</td>
                  <td style={{ padding: '1rem' }}>{app.location || '-'}</td>
                  <td style={{ padding: '1rem' }}>{app.source || '-'}</td>
                  <td style={{ padding: '1rem' }}><span className={`badge badge-${app.status}`}>{app.status}</span></td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem', background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db' }} onClick={() => loadViewApp(app.id)}>View</button>
                      <button style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' }} onClick={() => openEditForm(app)}>Edit</button>
                      <button style={{ padding: '0.375rem 0.75rem', fontSize: '0.875rem' }} className="danger" onClick={() => handleDelete(app.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Applications;
