const projects = [
  { name: 'Task Manager API', stack: 'Express + MongoDB' },
  { name: 'Lazy Loading SPA', stack: 'React + Vite' },
  { name: 'Cache Benchmark', stack: 'node-cache' }
];

export default function Projects() {
  return (
    <section>
      <h1>Projects</h1>
      <ul className="grid">
        {projects.map((p) => (
          <li key={p.name}>
            <strong>{p.name}</strong>
            <span>{p.stack}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
