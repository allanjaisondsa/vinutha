import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api, { SERVER_URL } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './styles/Admin.css';

// ── Video input with URL / Upload toggle per lesson ───────────────
function LessonVideoInput({ lesson, index, onVideoUrlChange }) {
  const [mode, setMode] = useState(
    lesson.videoUrl?.startsWith('/uploads/') ? 'file' : 'url'
  );
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedName, setUploadedName] = useState(
    lesson.videoUrl?.startsWith('/uploads/') ? lesson.videoUrl.split('/').pop() : ''
  );
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadError('');
    setUploading(true);
    setProgress(0);
    const formData = new FormData();
    formData.append('video', file);
    try {
      const res = await api.post('/upload/video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (evt.total) setProgress(Math.round((evt.loaded / evt.total) * 100));
        },
      });
      onVideoUrlChange(index, res.data.url);
      setUploadedName(res.data.filename);
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="lesson-video-input">
      <div className="video-mode-toggle">
        <button type="button" className={`btn btn-sm ${mode === 'url' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setMode('url')}>🔗 YouTube / URL</button>
        <button type="button" className={`btn btn-sm ${mode === 'file' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setMode('file')}>📁 Upload File</button>
      </div>

      {mode === 'url' ? (
        <div className="form-group" style={{ marginTop: '10px', marginBottom: 0 }}>
          <input
            value={lesson.videoUrl?.startsWith('/uploads/') ? '' : (lesson.videoUrl || '')}
            onChange={(e) => onVideoUrlChange(index, e.target.value)}
            placeholder="https://youtube.com/watch?v=... or direct MP4 URL"
          />
        </div>
      ) : (
        <div className="upload-area">
          {!uploading && !uploadedName && (
            <label className="file-upload-label">
              <input type="file" accept="video/mp4,video/mov,video/avi,video/mkv,video/webm" onChange={handleFileChange} style={{ display: 'none' }} />
              <span className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>📂 Choose Video File</span>
            </label>
          )}
          {uploading && (
            <div className="upload-progress">
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
              <span>{progress}% uploading…</span>
            </div>
          )}
          {!uploading && uploadedName && (
            <div className="upload-success">
              <span>✅ {uploadedName}</span>
              <label className="file-upload-label">
                <input type="file" accept="video/mp4,video/mov,video/avi,video/mkv,video/webm" onChange={handleFileChange} style={{ display: 'none' }} />
                <span className="btn btn-ghost btn-sm" style={{ cursor: 'pointer' }}>Replace</span>
              </label>
            </div>
          )}
          {uploadError && <p className="upload-error">{uploadError}</p>}
        </div>
      )}
    </div>
  );
}

// ── Image upload with URL / Upload toggle ────────────────────────
function ImageUploadInput({ value, onChange, label = 'Image' }) {
  const [mode, setMode] = useState(value?.startsWith('/uploads/') ? 'file' : 'url');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadError('');
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const res = await api.post('/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      onChange(res.data.url);
    } catch (err) {
      setUploadError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const previewSrc = value ? (value.startsWith('/uploads/') ? `${SERVER_URL}${value}` : value) : null;

  return (
    <div className="image-upload-input">
      <div className="video-mode-toggle">
        <button type="button" className={`btn btn-sm ${mode === 'url' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setMode('url')}>🔗 Paste URL</button>
        <button type="button" className={`btn btn-sm ${mode === 'file' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setMode('file')}>🖼️ Upload Photo</button>
      </div>

      {mode === 'url' ? (
        <div className="form-group" style={{ marginTop: '10px', marginBottom: 0 }}>
          <input value={value?.startsWith('/uploads/') ? '' : (value || '')} onChange={(e) => onChange(e.target.value)} placeholder="https://..." />
        </div>
      ) : (
        <div className="img-upload-area">
          <label>
            <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleFile} style={{ display: 'none' }} />
            <span className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
              {uploading ? 'Uploading…' : previewSrc ? '🔄 Replace Photo' : '📷 Choose Photo'}
            </span>
          </label>
          {previewSrc && <img src={previewSrc} alt="preview" className="img-preview" />}
          {uploadError && <p className="upload-error">{uploadError}</p>}
        </div>
      )}
    </div>
  );
}

// ── Reusable form for Course ───────────────────────────────────────
function CourseForm({ initial, onSave, onCancel }) {
  const empty = { title: '', description: '', thumbnail: '', price: 0, category: 'Resin Art', isPublished: true, lessons: [] };
  const [form, setForm] = useState(initial || empty);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setLesson = (i, k, v) => {
    const ls = [...form.lessons];
    ls[i] = { ...ls[i], [k]: v };
    setForm((f) => ({ ...f, lessons: ls }));
  };
  const addLesson = () => setForm((f) => ({ ...f, lessons: [...f.lessons, { title: '', videoUrl: '', description: '', duration: '' }] }));
  const removeLesson = (i) => setForm((f) => ({ ...f, lessons: f.lessons.filter((_, idx) => idx !== i) }));

  return (
    <div className="admin-form">
      <div className="form-row">
        <div className="form-group"><label>Title</label><input value={form.title} onChange={(e) => setField('title', e.target.value)} /></div>
        <div className="form-group"><label>Category</label><input value={form.category} onChange={(e) => setField('category', e.target.value)} /></div>
      </div>
      <div className="form-group"><label>Description</label><textarea value={form.description} onChange={(e) => setField('description', e.target.value)} /></div>
      <div className="form-row">
        <div className="form-group">
          <label>Thumbnail</label>
          <ImageUploadInput value={form.thumbnail} onChange={(url) => setField('thumbnail', url)} />
        </div>
        <div className="form-group"><label>Price (₹)</label><input type="number" value={form.price} onChange={(e) => setField('price', Number(e.target.value))} /></div>
      </div>
      <div className="form-group check-group">
        <input type="checkbox" id="pub" checked={form.isPublished} onChange={(e) => setField('isPublished', e.target.checked)} />
        <label htmlFor="pub">Published (visible to public)</label>
      </div>

      <div className="lessons-section">
        <div className="lessons-header">
          <h4>Lessons</h4>
          <button type="button" className="btn btn-outline btn-sm" onClick={addLesson}>+ Add Lesson</button>
        </div>
        {form.lessons.map((l, i) => (
          <div key={i} className="lesson-form">
            <div className="lesson-form-header"><strong>Lesson {i + 1}</strong><button type="button" className="btn btn-danger btn-sm" onClick={() => removeLesson(i)}>Remove</button></div>
            <div className="form-row">
              <div className="form-group"><label>Title</label><input value={l.title} onChange={(e) => setLesson(i, 'title', e.target.value)} /></div>
              <div className="form-group"><label>Duration (e.g. 10:30)</label><input value={l.duration} onChange={(e) => setLesson(i, 'duration', e.target.value)} /></div>
            </div>
            <div className="form-group">
              <label>Video</label>
              <LessonVideoInput lesson={l} index={i} onVideoUrlChange={(idx, url) => setLesson(idx, 'videoUrl', url)} />
            </div>
            <div className="form-group"><label>Description</label><textarea value={l.description} onChange={(e) => setLesson(i, 'description', e.target.value)} /></div>
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button className="btn btn-primary" onClick={() => onSave(form)}>Save Course</button>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ── Reusable form for Product ──────────────────────────────────────
function ProductForm({ initial, onSave, onCancel }) {
  const empty = { title: '', description: '', images: [''], price: 0, category: 'General', inStock: true };
  const [form, setForm] = useState(initial ? { ...initial, images: initial.images?.length ? initial.images : [''] } : empty);
  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="admin-form">
      <div className="form-row">
        <div className="form-group"><label>Title</label><input value={form.title} onChange={(e) => setField('title', e.target.value)} /></div>
        <div className="form-group"><label>Category</label><input value={form.category} onChange={(e) => setField('category', e.target.value)} /></div>
      </div>
      <div className="form-group"><label>Description</label><textarea value={form.description} onChange={(e) => setField('description', e.target.value)} /></div>
      <div className="form-row">
        <div className="form-group">
          <label>Product Image</label>
          <ImageUploadInput value={form.images[0]} onChange={(url) => setField('images', [url])} />
        </div>
        <div className="form-group"><label>Price (₹)</label><input type="number" value={form.price} onChange={(e) => setField('price', Number(e.target.value))} /></div>
      </div>
      <div className="form-group check-group">
        <input type="checkbox" id="stock" checked={form.inStock} onChange={(e) => setField('inStock', e.target.checked)} />
        <label htmlFor="stock">In Stock</label>
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" onClick={() => onSave(form)}>Save Product</button>
        <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ── Main Admin Panel ───────────────────────────────────────────────
export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('users');

  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [products, setProducts] = useState([]);

  const [inviteForm, setInviteForm] = useState({ name: '', email: '' });
  const [inviteLink, setInviteLink] = useState('');
  const [msg, setMsg] = useState('');

  const [courseForm, setCourseForm] = useState(null);
  const [productForm, setProductForm] = useState(null);

  const [assignUser, setAssignUser] = useState('');
  const [assignCourse, setAssignCourse] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const quickAssignIds = searchParams.get('assignCourses');

  const loadAll = () => {
    api.get('/admin/users').then((r) => setUsers(r.data));
    api.get('/admin/courses').then((r) => setCourses(r.data));
    api.get('/admin/products').then((r) => setProducts(r.data));
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    loadAll();
  }, [user]);

  const createUser = async () => {
    try {
      const res = await api.post('/admin/create-user', inviteForm);
      setInviteLink(res.data.inviteLink);
      setMsg('✅ Invite link created!');
      setInviteForm({ name: '', email: '' });
      loadAll();
    } catch (err) { setMsg('❌ ' + (err.response?.data?.message || 'Error')); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await api.delete(`/admin/users/${id}`);
    loadAll();
  };

  const assignCourseToUser = async () => {
    if (!assignUser || !assignCourse) return setMsg('Select a user and course first');
    try {
      await api.post('/admin/assign-course', { userId: assignUser, courseId: assignCourse });
      setMsg('✅ Course assigned!');
      loadAll();
    } catch (err) { setMsg('❌ ' + err.response?.data?.message); }
  };

  const assignMultipleCourses = async () => {
    if (!assignUser || !quickAssignIds) return setMsg('Select a user to assign these courses');
    const ids = quickAssignIds.split(',').map(id => id.trim());
    try {
      for (const id of ids) {
        if (id) await api.post('/admin/assign-course', { userId: assignUser, courseId: id });
      }
      setMsg(`✅ Successfully assigned ${ids.length} course(s)!`);
      loadAll();
      searchParams.delete('assignCourses');
      setSearchParams(searchParams);
    } catch (err) {
      setMsg('❌ Error assigning courses: ' + err.response?.data?.message);
    }
  };

  const removeCourseFromUser = async (userId, courseId) => {
    await api.post('/admin/remove-course', { userId, courseId });
    loadAll();
  };

  const saveCourse = async (form) => {
    try {
      if (form.id) await api.put(`/admin/courses/${form.id}`, form);
      else await api.post('/admin/courses', form);
      setCourseForm(null);
      loadAll();
      setMsg('✅ Course saved!');
    } catch (err) { setMsg('❌ ' + err.response?.data?.message); }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    await api.delete(`/admin/courses/${id}`);
    loadAll();
  };

  const saveProduct = async (form) => {
    try {
      if (form.id) await api.put(`/admin/products/${form.id}`, form);
      else await api.post('/admin/products', form);
      setProductForm(null);
      loadAll();
      setMsg('✅ Product saved!');
    } catch (err) { setMsg('❌ ' + err.response?.data?.message); }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/admin/products/${id}`);
    loadAll();
  };

  return (
    <div className="admin-page">
      <div className="admin-header container">
        <h1 className="section-title" style={{ color: '#fff' }}>Admin Panel</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)' }}>Manage users, courses, and products</p>
      </div>

      <div className="container admin-body">
        {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`} onClick={() => setMsg('')}>{msg} <span style={{ float: 'right', cursor: 'pointer' }}>×</span></div>}

        <div className="admin-tabs">
          {['users', 'courses', 'products'].map((t) => (
            <button key={t} className={`btn btn-sm ${tab === t ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* ── USERS TAB ── */}
        {tab === 'users' && (
          <div>
            <div className="admin-section card">
              <h3>Create Invite Link</h3>
              <div className="form-row">
                <div className="form-group"><label>Name</label><input value={inviteForm.name} onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })} placeholder="User's full name" /></div>
                <div className="form-group"><label>Email</label><input type="email" value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} placeholder="user@email.com" /></div>
              </div>
              <button className="btn btn-primary" onClick={createUser}>Generate Invite Link</button>
              {inviteLink && (
                <div className="invite-link-box">
                  <p>📋 Share this link with the user:</p>
                  <div className="invite-link">
                    <input readOnly value={inviteLink} />
                    <button className="btn btn-outline btn-sm" onClick={() => { navigator.clipboard.writeText(inviteLink); setMsg('✅ Link copied!'); }}>Copy</button>
                  </div>
                </div>
              )}
            </div>

            {quickAssignIds && (
              <div className="admin-section card" style={{ border: '2px solid #0e7490', background: '#f0f9ff' }}>
                <h3 style={{ color: '#0c4a6e' }}>🛒 WhatsApp Enquiry: Quick Assign</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: 16 }}>
                  You clicked a link from WhatsApp. Select the user who bought these courses to assign them all at once.
                </p>
                <div className="form-row">
                  <div className="form-group">
                    <label>Select Registered User</label>
                    <select value={assignUser} onChange={(e) => setAssignUser(e.target.value)}>
                      <option value="">-- Select user --</option>
                      {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                    </select>
                  </div>
                </div>
                <button className="btn btn-teal" onClick={assignMultipleCourses}>
                  Assign All Selected Courses
                </button>
              </div>
            )}

            <div className="admin-section card">
              <h3>Assign Single Course to User</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>User</label>
                  <select value={assignUser} onChange={(e) => setAssignUser(e.target.value)}>
                    <option value="">-- Select user --</option>
                    {users.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Course</label>
                  <select value={assignCourse} onChange={(e) => setAssignCourse(e.target.value)}>
                    <option value="">-- Select course --</option>
                    {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
              </div>
              <button className="btn btn-primary" onClick={assignCourseToUser}>Assign Course</button>
            </div>

            <div className="admin-section">
              <h3>All Users ({users.length})</h3>
              {users.length === 0 ? <p className="empty-msg">No users yet.</p> : (
                <div className="admin-table">
                  {users.map((u) => (
                    <div key={u.id} className="admin-row card">
                      <div className="user-info">
                        <strong>{u.name}</strong>
                        <span className="user-email">{u.email}</span>
                        <span className={`badge ${u.isRegistered ? 'badge-primary' : ''}`}>{u.isRegistered ? 'Registered' : 'Invite Pending'}</span>
                      </div>
                      <div className="user-courses">
                        {u.purchasedCourses?.length > 0 && (
                          <div className="user-course-tags">
                            {u.purchasedCourses.map((c) => (
                              <span key={c.id} className="course-tag">
                                {c.title}
                                <button onClick={() => removeCourseFromUser(u.id, c.id)} className="remove-tag">×</button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteUser(u.id)}>Delete</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── COURSES TAB ── */}
        {tab === 'courses' && (
          <div>
            <div className="tab-header">
              <h3>All Courses ({courses.length})</h3>
              <button className="btn btn-primary" onClick={() => setCourseForm({})}>+ New Course</button>
            </div>
            {courseForm !== null && (
              <div className="admin-section card">
                <h3>{courseForm.id ? 'Edit Course' : 'New Course'}</h3>
                <CourseForm initial={courseForm.id ? courseForm : null} onSave={saveCourse} onCancel={() => setCourseForm(null)} />
              </div>
            )}
            <div className="admin-table">
              {courses.map((c) => (
                <div key={c.id} className="admin-row card">
                  <div className="row-thumb">{c.thumbnail && <img src={c.thumbnail} alt={c.title} />}</div>
                  <div className="row-info">
                    <strong>{c.title}</strong>
                    <span className="badge">{c.category}</span>
                    <span className="price" style={{ fontSize: '0.92rem' }}>₹{c.price}</span>
                    <span className="badge" style={{ background: c.isPublished ? '#eafaf1' : '#fdecea', color: c.isPublished ? '#27ae60' : '#e74c3c' }}>{c.isPublished ? 'Published' : 'Draft'}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--gray-dark)' }}>{c.lessons?.length || 0} lessons</span>
                  </div>
                  <div className="row-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => setCourseForm(c)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteCourse(c.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PRODUCTS TAB ── */}
        {tab === 'products' && (
          <div>
            <div className="tab-header">
              <h3>All Products ({products.length})</h3>
              <button className="btn btn-primary" onClick={() => setProductForm({})}>+ New Product</button>
            </div>
            {productForm !== null && (
              <div className="admin-section card">
                <h3>{productForm.id ? 'Edit Product' : 'New Product'}</h3>
                <ProductForm initial={productForm.id ? productForm : null} onSave={saveProduct} onCancel={() => setProductForm(null)} />
              </div>
            )}
            <div className="admin-table">
              {products.map((p) => (
                <div key={p.id} className="admin-row card">
                  <div className="row-thumb">{p.images?.[0] && <img src={p.images[0]} alt={p.title} />}</div>
                  <div className="row-info">
                    <strong>{p.title}</strong>
                    <span className="badge">{p.category}</span>
                    <span className="price" style={{ fontSize: '0.92rem' }}>₹{p.price}</span>
                    <span className="badge">{p.inStock ? '✅ In Stock' : '❌ Out of Stock'}</span>
                  </div>
                  <div className="row-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => setProductForm(p)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(p.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
