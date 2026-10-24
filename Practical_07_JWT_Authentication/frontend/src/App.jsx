import { useState } from 'react';
import AuthForm from './components/AuthForm.jsx';
import TaskBoard from './components/TaskBoard.jsx';
import { getToken, clearToken } from './api.js';

export default function App() {
  const [mode, setMode] = useState('login');
  const [user, setUser] = useState(null);
  const [authed, setAuthed] = useState(Boolean(getToken()));

  function logout() {
    clearToken();
    setUser(null);
    setAuthed(false);
    setMode('login');
  }

  return (
    <main className="page">
      <h1>Task Management — Practical 7</h1>
      <p className="subtitle">JWT authentication + bcrypt hashing + protected task routes</p>
      {authed ? (
        <TaskBoard user={user || { name: 'student' }} onLogout={logout} />
      ) : (
        <>
          <AuthForm mode={mode} onAuthenticated={(u) => { setUser(u); setAuthed(true); }} />
          <p className="switch">
            {mode === 'login' ? (
              <>New here? <button className="link" onClick={() => setMode('register')}>Create an account</button></>
            ) : (
              <>Already registered? <button className="link" onClick={() => setMode('login')}>Sign in</button></>
            )}
          </p>
        </>
      )}
    </main>
  );
}
