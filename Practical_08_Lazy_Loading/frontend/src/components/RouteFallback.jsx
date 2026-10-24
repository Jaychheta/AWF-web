// Shown inside <Suspense> while a route chunk is being streamed in.
export default function RouteFallback() {
  return (
    <div className="fallback" role="status" aria-live="polite">
      <span className="spinner" />
      <p>Loading route module…</p>
    </div>
  );
}
