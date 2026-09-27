;
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '16px' }}>404</h1>
      <h2 style={{ marginBottom: '24px' }}>Page Not Found</h2>
      <p style={{ marginBottom: '32px', color: 'var(--text-muted)' }}>The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  );
}
