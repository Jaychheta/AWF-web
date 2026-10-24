import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function TaskBoard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  async function refresh() {
    const { data } = await api('/api/tasks');
    if (data.tasks) setTasks(data.tasks);
  }

  useEffect(() => { refresh(); }, []);

  async function addTask(e) {
    e.preventDefault();
    const { status, data } = await api('/api/tasks', { method: 'POST', body: { title } });
    if (status === 201) {
      setTitle('');
      setMessage('');
      refresh();
    } else {
      setMessage((data.details || []).join('; ') || data.message || 'Could not create task');
    }
  }

  return (
    <div className="card wide">
      <header className="row">
        <h2>Tasks of {user.name}</h2>
        <button className="ghost" onClick={onLogout}>Logout</button>
      </header>
      <form className="row" onSubmit={addTask}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task title (min 3 chars)" />
        <button>Add task</button>
      </form>
      {message && <p className="error">{message}</p>}
      <ul className="tasks">
        {tasks.map((t) => (
          <li key={t._id}>
            <span className={`badge ${t.status}`}>{t.status}</span>
            <strong>{t.title}</strong>
            {t.description && <em> — {t.description}</em>}
          </li>
        ))}
        {tasks.length === 0 && <li className="hint">No tasks yet. Create the first one above.</li>}
      </ul>
    </div>
  );
}
