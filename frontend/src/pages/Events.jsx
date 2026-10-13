import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

function DateStub({ iso }) {
  const d = new Date(iso + 'T00:00:00');
  return (
    <div className="stub">
      <span className="day">{d.getDate()}</span>
      <span className="month">{d.toLocaleString('en', { month: 'short' })}</span>
      <span className="year">{d.getFullYear()}</span>
    </div>
  );
}

export default function Events() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [mine, setMine] = useState(new Set());
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setEvents(await api('/events'));
      if (user?.role === 'STUDENT') {
        const regs = await api('/registrations/me');
        setMine(new Set(regs.map((r) => r.event.id)));
      }
    } catch (e) {
      setMessage({ type: 'error', text: e.message });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, [user]);

  const register = async (event) => {
    if (!user) return navigate('/login');
    try {
      await api('/registrations', { method: 'POST', body: { eventId: event.id, department: user.department } });
      setMessage({ type: 'ok', text: `You're registered for ${event.title}. Track it under My registrations.` });
      load();
    } catch (e) {
      setMessage({ type: 'error', text: e.message });
    }
  };

  return (
    <section>
      <h1>Upcoming events</h1>
      <p className="lede">Pick an event, register in one click, and follow your status online.</p>
      {message && <p className={`notice ${message.type}`} role="status">{message.text}</p>}
      {loading && <p>Loading events…</p>}
      {!loading && events.length === 0 && <p>No events are scheduled yet. Check back soon.</p>}

      <div className="event-list">
        {events.map((e) => {
          const full = e.registeredCount >= e.capacity;
          const joined = mine.has(e.id);
          return (
            <article className="event" key={e.id}>
              <DateStub iso={e.eventDate} />
              <div className="event-body">
                <span className="tag">{e.category}</span>
                <h2>{e.title}</h2>
                <p>{e.description}</p>
                <p className="meta">{e.venue} · {e.registeredCount} of {e.capacity} seats taken</p>
              </div>
              <div className="event-action">
                {user?.role === 'ADMIN' ? null : joined ? (
                  <span className="chip confirmed">Registered</span>
                ) : (
                  <button className="primary" disabled={full} onClick={() => register(e)}>
                    {full ? 'Event full' : 'Register'}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
