export default function Home() {
  return (
    <section>
      <h1>Home</h1>
      <p>
        This entry chunk is the only JavaScript downloaded on first paint. Every other route
        lives in its own chunk and is fetched on demand with <code>React.lazy()</code>.
      </p>
      <p>Open DevTools → Network, tick “Disable cache”, then navigate around and watch a new chunk appear per route.</p>
    </section>
  );
}
