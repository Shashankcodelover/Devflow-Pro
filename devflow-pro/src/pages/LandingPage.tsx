import { Navigate, Link } from 'react-router-dom';
import { Layers, ArrowRight, Play } from 'lucide-react';

export default function LandingPage() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleDemo = () => {
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = '/dashboard';
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      color: '#1e293b',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 24px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <div style={{ backgroundColor: '#e0e7ff', padding: '20px', borderRadius: '50%' }}>
            <Layers size={48} color="#4f46e5" />
          </div>
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', letterSpacing: '-0.025em', marginBottom: '24px', lineHeight: '1.1' }}>
          Devflow <span style={{ color: '#4f46e5' }}>Pro</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#64748b', marginBottom: '48px', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 48px' }}>
          The ultimate intelligent workflow orchestrator for modern engineering teams. 
          Streamline sprints, visualize architecture, and manage dependencies without the clutter.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link 
            to="/login"
            style={{
              padding: '16px 32px',
              fontSize: '1rem',
              fontWeight: '600',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)'
            }}
          >
            Sign Up / Login <ArrowRight size={18} />
          </Link>
          <button 
            onClick={handleDemo}
            style={{
              padding: '16px 32px',
              fontSize: '1rem',
              fontWeight: '600',
              backgroundColor: '#ffffff',
              color: '#1e293b',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}
          >
            <Play size={18} /> Demo Mode
          </button>
        </div>
      </div>
    </div>
  );
}
