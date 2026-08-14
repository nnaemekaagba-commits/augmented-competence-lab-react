import { useState } from 'react';
import { api, monthYear } from '../api.js';
import { THEME_NAME } from './Home.jsx';

const GROUPS = ['Principal Investigator', 'Postdoctoral Researchers', 'PhD Students', 'Undergraduate Research Assistants'];

export default function Admin({
  publications, setPublications,
  news, setNews,
  blogs, setBlogs,
  team, setTeam,
  refreshSiteData,
}) {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hint, setHint] = useState({ text: '', bad: false });
  const [signingIn, setSigningIn] = useState(false);

  async function handleLogin() {
    if (!email || !password) { setHint({ text: 'Enter your email and password.', bad: true }); return; }
    setSigningIn(true);
    setHint({ text: 'Signing in…', bad: false });
    try {
      const t = await api.login(email, password);
      setToken(t);
      setPassword('');
    } catch (err) {
      const msg = /fetch|network/i.test(err.message) ? 'Could not reach the API — check VITE_API_BASE_URL.' : err.message;
      setHint({ text: msg, bad: true });
    } finally {
      setSigningIn(false);
    }
  }

  if (!token) {
    return (
      <div className="admin-shell">
        <div className="admin-gate">
          <div className="eyebrow" style={{ color: '#8fb3ff' }}><span className="node" style={{ background: '#8fb3ff' }}></span>Restricted</div>
          <h2>Lab admin</h2>
          <p>Sign in to publish publications, news, blog posts, and team members.</p>
          <input type="email" placeholder="Email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
          <input type="password" placeholder="Password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
          <button className="submit-btn" style={{ width: '100%' }} onClick={handleLogin} disabled={signingIn}>Sign in</button>
          <div className="hint" style={{ color: hint.bad ? '#e39a86' : 'rgba(143,179,255,0.8)' }}>{hint.text}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <div className="admin-body active">
        <div className="admin-top">
          <h2>Publishing dashboard</h2>
          <button className="logout-btn" onClick={() => setToken(null)}>Log out</button>
        </div>

        <div className="stat-row">
          <Stat label="Publications" value={publications.length} />
          <Stat label="News posts" value={news.length} />
          <Stat label="Blog posts" value={blogs.length} />
          <Stat label="Team members" value={team.length} />
        </div>

        <div className="admin-grid">
          <PublicationPanel token={token} publications={publications} setPublications={setPublications} refreshSiteData={refreshSiteData} />
          <NewsPanel token={token} news={news} setNews={setNews} refreshSiteData={refreshSiteData} />
          <BlogPanel token={token} blogs={blogs} setBlogs={setBlogs} refreshSiteData={refreshSiteData} />
          <TeamPanel token={token} team={team} setTeam={setTeam} refreshSiteData={refreshSiteData} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <div className="eyebrow" style={{ color: '#8fb3ff' }}>{label}</div>
      <div className="val">{value}</div>
    </div>
  );
}

/* ---------------- Publications ---------------- */
function PublicationPanel({ token, publications, setPublications, refreshSiteData }) {
  const empty = { title: '', meta: '', abstract: '' };
  const [form, setForm] = useState(empty);
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');

  function startEdit(p) {
    setEditingId(p.id);
    setForm({ title: p.title, meta: p.meta, abstract: p.abstract });
    setFile(null);
    setStatus('');
  }
  function cancelEdit() { setEditingId(null); setForm(empty); setFile(null); setStatus(''); }

  async function submit() {
    if (!form.title || !form.meta || !form.abstract) { setStatus('Fill in title, meta, and abstract.'); return; }
    if (file && file.size > 8 * 1024 * 1024) { setStatus('That PDF is too large — please keep it under 8MB.'); return; }
    try {
      if (editingId) {
        setStatus('Saving…');
        const updated = await api.updatePublication(editingId, { ...form, tag: THEME_NAME }, token);
        setPublications((prev) => prev.map((p) => (p.id === editingId ? updated : p)));
        await refreshSiteData();
        setStatus('Saved.');
        cancelEdit();
      } else {
        setStatus(file ? 'Uploading…' : 'Publishing…');
        const fd = new FormData();
        fd.append('title', form.title); fd.append('meta', form.meta); fd.append('abstract', form.abstract); fd.append('tag', THEME_NAME);
        if (file) fd.append('file', file);
        const entry = await api.addPublication(fd, token);
        setPublications((prev) => [...prev, entry]);
        await refreshSiteData();
        setStatus('Published.');
        setForm(empty); setFile(null);
      }
    } catch (err) {
      setStatus('Could not save — ' + err.message);
    }
  }

  async function remove(id) {
    try {
      await api.deletePublication(id, token);
      setPublications((prev) => prev.filter((p) => p.id !== id));
      await refreshSiteData();
      if (editingId === id) cancelEdit();
    } catch (err) {
      alert('Could not remove this — ' + err.message);
    }
  }

  return (
    <div className="panel">
      <h3><span className="node" style={{ background: '#8fb3ff' }}></span>{editingId ? 'Edit publication' : 'Add a publication'}</h3>
      <div className="a-form-row"><input type="text" placeholder="Paper title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
      <div className="a-form-row"><input type="text" placeholder="Authors · Venue · Year" value={form.meta} onChange={(e) => setForm({ ...form, meta: e.target.value })} /></div>
      <div className="a-form-row"><textarea placeholder="Abstract" value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} /></div>
      {!editingId && (
        <div className="a-form-row">
          <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files[0] || null)} />
          <div style={{ fontSize: 10.5, color: 'rgba(238,242,251,0.45)', marginTop: 6, fontFamily: "'IBM Plex Mono',monospace" }}>Optional — PDF, up to 8MB</div>
        </div>
      )}
      {editingId && <div style={{ fontSize: 10.5, color: 'rgba(238,242,251,0.45)', margin: '0 0 11px', fontFamily: "'IBM Plex Mono',monospace" }}>To replace the PDF itself, delete and re-add.</div>}
      <button className="submit-btn" onClick={submit}>{editingId ? 'Save changes' : 'Publish paper'}</button>
      {editingId && <button className="logout-btn" style={{ marginLeft: 8 }} onClick={cancelEdit}>Cancel</button>}
      <div className="status-msg">{status}</div>
      <div className="manage-list">
        {publications.length === 0 && <div className="mi-sub">No publications yet.</div>}
        {publications.slice().reverse().map((p) => (
          <div className="manage-item" key={p.id}>
            <div><div className="mi-title">{p.title}</div><div className="mi-sub">{p.tag} · {monthYear(p.createdAt)}</div></div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="del-btn" style={{ borderColor: 'rgba(143,179,255,0.4)', color: '#8fb3ff' }} onClick={() => startEdit(p)}>Edit</button>
              <button className="del-btn" onClick={() => remove(p.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- News ---------------- */
function NewsPanel({ token, news, setNews, refreshSiteData }) {
  const empty = { title: '', body: '' };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');

  function startEdit(n) { setEditingId(n.id); setForm({ title: n.title, body: n.body }); setStatus(''); }
  function cancelEdit() { setEditingId(null); setForm(empty); setStatus(''); }

  async function submit() {
    if (!form.title || !form.body) { setStatus('Add a headline and body.'); return; }
    try {
      if (editingId) {
        setStatus('Saving…');
        const updated = await api.updateNews(editingId, form, token);
        setNews((prev) => prev.map((n) => (n.id === editingId ? updated : n)));
        await refreshSiteData();
        setStatus('Saved.'); cancelEdit();
      } else {
        setStatus('Publishing…');
        const entry = await api.addNews(form, token);
        setNews((prev) => [...prev, entry]);
        await refreshSiteData();
        setStatus('Published.'); setForm(empty);
      }
    } catch (err) { setStatus('Could not save — ' + err.message); }
  }

  async function remove(id) {
    try {
      await api.deleteNews(id, token);
      setNews((prev) => prev.filter((n) => n.id !== id));
      await refreshSiteData();
      if (editingId === id) cancelEdit();
    } catch (err) { alert('Could not remove this — ' + err.message); }
  }

  return (
    <div className="panel">
      <h3><span className="node" style={{ background: '#8fb3ff' }}></span>{editingId ? 'Edit news update' : 'Post a news update'}</h3>
      <div className="a-form-row"><input type="text" placeholder="Headline" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
      <div className="a-form-row"><textarea placeholder="What happened?" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
      <button className="submit-btn" onClick={submit}>{editingId ? 'Save changes' : 'Publish news'}</button>
      {editingId && <button className="logout-btn" style={{ marginLeft: 8 }} onClick={cancelEdit}>Cancel</button>}
      <div className="status-msg">{status}</div>
      <div className="manage-list">
        {news.length === 0 && <div className="mi-sub">No news yet.</div>}
        {news.slice().reverse().map((n) => (
          <div className="manage-item" key={n.id}>
            <div><div className="mi-title">{n.title}</div><div className="mi-sub">{monthYear(n.createdAt)}</div></div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="del-btn" style={{ borderColor: 'rgba(143,179,255,0.4)', color: '#8fb3ff' }} onClick={() => startEdit(n)}>Edit</button>
              <button className="del-btn" onClick={() => remove(n.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Blogs ---------------- */
function BlogPanel({ token, blogs, setBlogs, refreshSiteData }) {
  const empty = { title: '', read: '', body: '' };
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');

  function startEdit(b) { setEditingId(b.id); setForm({ title: b.title, read: b.read, body: b.body }); setStatus(''); }
  function cancelEdit() { setEditingId(null); setForm(empty); setStatus(''); }

  async function submit() {
    if (!form.title || !form.body) { setStatus('Add a title and body.'); return; }
    const payload = { ...form, read: form.read || '5 min read' };
    try {
      if (editingId) {
        setStatus('Saving…');
        const updated = await api.updateBlog(editingId, payload, token);
        setBlogs((prev) => prev.map((b) => (b.id === editingId ? updated : b)));
        await refreshSiteData();
        setStatus('Saved.'); cancelEdit();
      } else {
        setStatus('Publishing…');
        const entry = await api.addBlog(payload, token);
        setBlogs((prev) => [...prev, entry]);
        await refreshSiteData();
        setStatus('Published.'); setForm(empty);
      }
    } catch (err) { setStatus('Could not save — ' + err.message); }
  }

  async function remove(id) {
    try {
      await api.deleteBlog(id, token);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
      await refreshSiteData();
      if (editingId === id) cancelEdit();
    } catch (err) { alert('Could not remove this — ' + err.message); }
  }

  return (
    <div className="panel">
      <h3><span className="node" style={{ background: '#8fb3ff' }}></span>{editingId ? 'Edit blog post' : 'Write a blog post'}</h3>
      <div className="a-form-row"><input type="text" placeholder="Post title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
      <div className="a-form-row"><input type="text" placeholder="Read time, e.g. 5 min read" value={form.read} onChange={(e) => setForm({ ...form, read: e.target.value })} /></div>
      <div className="a-form-row"><textarea placeholder="Write the post..." value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></div>
      <button className="submit-btn" onClick={submit}>{editingId ? 'Save changes' : 'Publish post'}</button>
      {editingId && <button className="logout-btn" style={{ marginLeft: 8 }} onClick={cancelEdit}>Cancel</button>}
      <div className="status-msg">{status}</div>
      <div className="manage-list">
        {blogs.length === 0 && <div className="mi-sub">No posts yet.</div>}
        {blogs.slice().reverse().map((b) => (
          <div className="manage-item" key={b.id}>
            <div><div className="mi-title">{b.title}</div><div className="mi-sub">{b.read}</div></div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="del-btn" style={{ borderColor: 'rgba(143,179,255,0.4)', color: '#8fb3ff' }} onClick={() => startEdit(b)}>Edit</button>
              <button className="del-btn" onClick={() => remove(b.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Team ---------------- */
function TeamPanel({ token, team, setTeam, refreshSiteData }) {
  const empty = { name: '', group: GROUPS[0], role: '', focus: '' };
  const [form, setForm] = useState(empty);
  const [photo, setPhoto] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');

  function startEdit(m) { setEditingId(m.id); setForm({ name: m.name, group: m.group, role: m.role, focus: m.focus }); setPhoto(null); setStatus(''); }
  function cancelEdit() { setEditingId(null); setForm(empty); setPhoto(null); setStatus(''); }

  async function submit() {
    if (!form.name || !form.role) { setStatus('Add a name and role.'); return; }
    if (photo && photo.size > 4 * 1024 * 1024) { setStatus('That photo is too large — please keep it under 4MB.'); return; }
    try {
      if (editingId) {
        setStatus('Saving…');
        const updated = await api.updateMember(editingId, form, token);
        setTeam((prev) => prev.map((m) => (m.id === editingId ? updated : m)));
        await refreshSiteData();
        setStatus('Saved.'); cancelEdit();
      } else {
        setStatus(photo ? 'Uploading…' : 'Adding…');
        const fd = new FormData();
        fd.append('name', form.name); fd.append('group', form.group); fd.append('role', form.role); fd.append('focus', form.focus);
        if (photo) fd.append('photo', photo);
        const entry = await api.addMember(fd, token);
        setTeam((prev) => [...prev, entry]);
        await refreshSiteData();
        setStatus('Added.'); setForm(empty); setPhoto(null);
      }
    } catch (err) { setStatus('Could not save — ' + err.message); }
  }

  async function remove(id) {
    try {
      await api.deleteMember(id, token);
      setTeam((prev) => prev.filter((m) => m.id !== id));
      await refreshSiteData();
      if (editingId === id) cancelEdit();
    } catch (err) { alert('Could not remove this — ' + err.message); }
  }

  return (
    <div className="panel">
      <h3><span className="node" style={{ background: '#8fb3ff' }}></span>{editingId ? 'Edit team member' : 'Add a team member'}</h3>
      <div className="a-form-row"><input type="text" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
      <div className="a-form-row">
        <select value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })}>
          {GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div className="a-form-row"><input type="text" placeholder="Role, e.g. PhD Candidate" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></div>
      <div className="a-form-row"><input type="text" placeholder="Focus area" value={form.focus} onChange={(e) => setForm({ ...form, focus: e.target.value })} /></div>
      {!editingId && (
        <div className="a-form-row">
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => setPhoto(e.target.files[0] || null)} />
          <div style={{ fontSize: 10.5, color: 'rgba(238,242,251,0.45)', marginTop: 6, fontFamily: "'IBM Plex Mono',monospace" }}>Optional — JPG, PNG, or WEBP, up to 4MB</div>
        </div>
      )}
      {editingId && <div style={{ fontSize: 10.5, color: 'rgba(238,242,251,0.45)', margin: '0 0 11px', fontFamily: "'IBM Plex Mono',monospace" }}>To replace the photo itself, delete and re-add.</div>}
      <button className="submit-btn" onClick={submit}>{editingId ? 'Save changes' : 'Add member'}</button>
      {editingId && <button className="logout-btn" style={{ marginLeft: 8 }} onClick={cancelEdit}>Cancel</button>}
      <div className="status-msg">{status}</div>
      <div className="manage-list">
        {team.length === 0 && <div className="mi-sub">No members yet.</div>}
        {team.slice().reverse().map((m) => (
          <div className="manage-item" key={m.id}>
            <div><div className="mi-title">{m.name}</div><div className="mi-sub">{m.group}</div></div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="del-btn" style={{ borderColor: 'rgba(143,179,255,0.4)', color: '#8fb3ff' }} onClick={() => startEdit(m)}>Edit</button>
              <button className="del-btn" onClick={() => remove(m.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
