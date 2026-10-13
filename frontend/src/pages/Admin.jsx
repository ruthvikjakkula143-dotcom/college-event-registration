import { useEffect, useState } from 'react';
import { api } from '../api.js';
import StatusChip from '../components/StatusChip.jsx';

const EMPTY = { title: '', category: 'Technical', venue: '', eventDate: '', capacity: 100, description: '' };

export default function Admin() {
  const [tab, setTab] = useState('events');
  const [events, setEvents] = useState([]);
  const [regs, setRegs] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setEvents(await api('/events'));
      setRegs(await api('/registrations'));
    } catch (e) { setError(e.message); }
  };
  useEffect(() => { load(); }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const body = { ...form, capacity: Number(form.capacity) };
      await api(editingId ? `/events/${editingId}` : '/events', { method: editingId ? 'PUT' : 'POST', body });
      setForm(EMPTY);
      setEditingId(null);
      load();
    } catch (err) { setError(err.message); }
  };

  const edit = (ev) => {
    setEditingId(ev.id);
    setForm({ title: ev.title, category: ev.category || '', venue: ev.venue || '', eventDate: ev.eventDate,
              capacity: ev.capacity, description: ev.description || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (ev) => {
    if (!confirm(`Delete "${ev.title}" and all its registrations?`)) return;
    try { await api(`/events/${ev.id}`, { method: 'DELETE' }); load(); } catch (err) { setError(err.message); }
  };

  const setStatus = async (id, status) => {
    try { await api(`/registrations/${id}/status`, { method: 'PATCH', body: { status } }); load(); }
    catch (err) { setError(err.message); }
  };

  return (
    <section>
      <h1>Admin dashboard</h1>
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'events'} onClick={() => setTab('events')}>Manage events ({events.length})</button>
        <button role="tab" aria-selected={tab === 'regs'} onClick={() => setTab('regs')}>Registrations ({regs.length})</button>
      </div>
      {error && <p className="notice error" role="alert">{error}</p>}

      {tab === 'events' && (
        <>
          <form className="card grid" onSubmit={save}>
            <h2>{editingId ? 'Edit event' : 'Add an event'}</h2>
            <label>Title<input required value={form.title} onChange={set('title')} /></label>
            <label>Category
              <select value={form.category} onChange={set('category')}>
                {['Technical', 'Cultural', 'Sports', 'Workshop', 'Other'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>Venue<input value={form.venue} onChange={set('venue')} /></label>
            <label>Date<input type="date" required value={form.eventDate} onChange={set('eventDate')} /></label>
            <label>Seats<input type="number" min="1" required value={form.capacity} onChange={set('capacity')} /></label>
            <label className="wide">Description<textarea rows="3" value={form.description} onChange={set('description')} /></label>
            <div className="wide actions">
              <button className="primary">{editingId ? 'Save changes' : 'Add event'}</button>
              {editingId && <button type="button" className="link" onClick={() => { setEditingId(null); setForm(EMPTY); }}>Cancel</button>}
            </div>
          </form>

          <div className="table-wrap">
            <table>
              <thead><tr><th>Event</th><th>Date</th><th>Seats</th><th></th></tr></thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td>{ev.title}</td>
                    <td>{ev.eventDate}</td>
                    <td>{ev.registeredCount} / {ev.capacity}</td>
                    <td className="row-actions">
                      <button className="link" onClick={() => edit(ev)}>Edit</button>
                      <button className="link danger" onClick={() => remove(ev)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'regs' && (
        regs.length === 0 ? <p>No one has registered yet.</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Participant</th><th>Department</th><th>Event</th><th>Status</th><th>Update</th></tr></thead>
              <tbody>
                {regs.map((r) => (
                  <tr key={r.id}>
                    <td>{r.user.name}<br /><small>{r.user.email}</small></td>
                    <td>{r.department}</td>
                    <td>{r.event.title}</td>
                    <td><StatusChip status={r.status} /></td>
                    <td>
                      <select value={r.status} onChange={(e) => setStatus(r.id, e.target.value)} aria-label={`Status for ${r.user.name}`}>
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </section>
  );
}
