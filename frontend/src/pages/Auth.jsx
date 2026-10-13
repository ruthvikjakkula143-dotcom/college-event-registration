import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

const DEPARTMENTS = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Management', 'Other'];

export default function Auth({ mode }) {
  const isRegister = mode === 'register';
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', department: DEPARTMENTS[0] });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const data = await api(isRegister ? '/auth/register' : '/auth/login', { method: 'POST', body: form });
      login(data);
      navigate(data.user.role === 'ADMIN' ? '/admin' : '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="card narrow">
      <h1>{isRegister ? 'Create your account' : 'Log in'}</h1>
      <form onSubmit={submit}>
        {isRegister && (
          <label>Full name<input required value={form.name} onChange={set('name')} /></label>
        )}
        <label>Email<input type="email" required value={form.email} onChange={set('email')} /></label>
        <label>Password<input type="password" required minLength={6} value={form.password} onChange={set('password')} /></label>
        {isRegister && (
          <label>Department
            <select value={form.department} onChange={set('department')}>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </label>
        )}
        {error && <p className="notice error" role="alert">{error}</p>}
        <button className="primary" disabled={busy}>{isRegister ? 'Create account' : 'Log in'}</button>
      </form>
      <p className="switch">
        {isRegister ? <>Already have an account? <Link to="/login">Log in</Link></> : <>New here? <Link to="/register">Create an account</Link></>}
      </p>
      {!isRegister && <p className="hint">Admin demo: admin@college.edu / admin123</p>}
    </section>
  );
}
