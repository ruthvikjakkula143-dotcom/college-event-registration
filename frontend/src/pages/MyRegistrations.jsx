import { useEffect, useState } from 'react';
import { api } from '../api.js';
import StatusChip from '../components/StatusChip.jsx';

export default function MyRegistrations() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () =>
    api('/registrations/me').then(setRows).catch((e) => setError(e.message)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const withdraw = async (id) => {
    if (!confirm('Withdraw this registration?')) return;
    try { await api(`/registrations/${id}`, { method: 'DELETE' }); load(); }
    catch (e) { setError(e.message); }
  };

  return (
    <section>
      <h1>My registrations</h1>
      {error && <p className="notice error">{error}</p>}
      {loading && <p>Loading…</p>}
      {!loading && rows.length === 0 && <p>You haven't registered for any events yet. Browse Events to get started.</p>}
      {rows.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Event</th><th>Date</th><th>Venue</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.event.title}</td>
                  <td>{r.event.eventDate}</td>
                  <td>{r.event.venue}</td>
                  <td><StatusChip status={r.status} /></td>
                  <td><button className="link danger" onClick={() => withdraw(r.id)}>Withdraw</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
