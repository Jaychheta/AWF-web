import { useEffect, useState } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [health, setHealth] = useState(null);
  const [draft, setDraft] = useState('');

  async function refresh() {
    const [t, h] = await Promise.all([fetch('/api/tasks').then((r) => r.json()), fetch('/api/health').then((r) => r.json())]);
    setTasks(t.tasks || []);
    setHealth(h);
  }
  useEffect(() => { refresh(); }, []);

  async function add(e) {
    e.preventDefault();
    await fetch('/api/tasks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: draft }) });
    setDraft('');
    refresh();
  }

  return (
    <main style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '40px auto', padding: 16 }}>
      <h1>Practical 11 — Docker Compose stack</h1>
      {health && <p>Served by container <code>{health.container}</code> via the compose bridge network.</p>}
      <form onSubmit={add} style={{ display: 'flex', gap: 8 }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="New task" style={{ flex: 1, padding: 8 }} />
        <button type="submit" style={{ padding: 8 }}>Add</button>
      </form>
      <ul>{tasks.map((t) => <li key={t._id}>{t.title}</li>)}</ul>
    </main>
  );
}
