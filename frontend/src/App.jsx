import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Events from './pages/Events.jsx';
import Auth from './pages/Auth.jsx';
import MyRegistrations from './pages/MyRegistrations.jsx';
import Admin from './pages/Admin.jsx';

function Protected({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <header className="topbar">
        <NavLink to="/" className="brand">College Events</NavLink>
        <nav>
          <NavLink to="/" end>Events</NavLink>
          {user?.role === 'STUDENT' && <NavLink to="/my">My registrations</NavLink>}
          {user?.role === 'ADMIN' && <NavLink to="/admin">Admin dashboard</NavLink>}
          {user ? (
            <button className="link" onClick={() => { logout(); navigate('/'); }}>
              Log out ({user.name.split(' ')[0]})
            </button>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <NavLink to="/register" className="pill">Register</NavLink>
            </>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Events />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="/my" element={<Protected role="STUDENT"><MyRegistrations /></Protected>} />
          <Route path="/admin" element={<Protected role="ADMIN"><Admin /></Protected>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
