import { Link } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav style={{
      background: '#1B2A4A',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#FF9900', fontWeight: 'bold', fontSize: '20px' }}>
          SLAVA
        </span>
        <span style={{ color: 'white', fontSize: '14px' }}>
          Tournament App
        </span>
      </div>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
          Live Scores
        </Link>
        <Link to="/brackets" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
          Brackets
        </Link>
        <Link to="/score-entry" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
          Score Entry
        </Link>
        <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontSize: '14px' }}>
          Login
        </Link>
        <button
          onClick={handleSignOut}
          style={{
            background: '#FF9900', color: 'white', padding: '6px 14px',
            border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px'
          }}
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}