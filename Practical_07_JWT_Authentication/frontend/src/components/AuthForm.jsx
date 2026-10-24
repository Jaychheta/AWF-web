import { useState } from 'react';
import { api, setToken } from '../api.js';

export default function AuthForm({ mode, onAuthenticated }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const isRegister = mode === 'register';

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { status, data } = await api(isRegister ? '/api/auth/register' : '/api/auth/login', {
      method: 'POST',
      body: form
    });
    setBusy(false);
    if (status === 200 || status === 201) {
      setToken(data.token);
      onAuthenticated(data.user);
    } else {
      setError(data.message || data.error || `Request failed with HTTP ${status}`);
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <h2>{isRegister ? 'Create account' : 'Sign in'}</h2>
      {isRegister && (
        <label>
          Name
          <input value={form.name} onChange={update('name')} placeholder="Your name" required />
        </label>
      )}
      <label>
        Email
        <input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" required />
      </label>
      <label>
        Password
        <input type="password" value={form.password} onChange={update('password')} placeholder="min 6 characters" required />
      </label>
      {error && <p className="error">{error}</p>}
      <button disabled={busy}>{busy ? 'Please wait…' : isRegister ? 'Register' : 'Login'}</button>
      <p className="hint">
        Passwords are hashed with bcrypt (10 salt rounds) and the session token is a JWT that expires after 1 hour.
      </p>
    </form>
  );
}
