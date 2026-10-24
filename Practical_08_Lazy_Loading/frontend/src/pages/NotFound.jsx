import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section>
      <h1>404</h1>
      <p>Nothing lives at this route. <Link to="/">Back to home</Link></p>
    </section>
  );
}
