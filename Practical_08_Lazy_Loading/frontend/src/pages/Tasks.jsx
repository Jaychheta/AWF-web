import { useState } from 'react';

export default function Tasks() {
  const [tasks, setTasks] = useState(['Study React.lazy', 'Read Vite build report']);
  const [draft, setDraft] = useState('');

  function add(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    setTasks([...tasks, draft.trim()]);
    setDraft('');
  }

  return (
    <section>
      <h1>Tasks</h1>
      <form onSubmit={add} className="row">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a task" />
        <button>Add</button>
      </form>
      <ol>{tasks.map((t, i) => <li key={i}>{t}</li>)}</ol>
    </section>
  );
}
