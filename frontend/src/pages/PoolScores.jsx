import { useState, useEffect } from 'react';

export default function PoolScores() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = () => {
    fetch('https://3ue90epph4.execute-api.us-east-1.amazonaws.com/prod/scores')
      .then(r => r.json())
      .then(data => { setScores(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchScores();

    const ws = new WebSocket('wss://4xv6sgx7b2.execute-api.us-east-1.amazonaws.com/prod/');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'scoreUpdate') {
        setScores(prev => {
          const updated = [...prev];
          const idx = updated.findIndex(s => s.matchId === data.data.matchId);
          if (idx >= 0) updated[idx] = data.data;
          else updated.push(data.data);
          return updated;
        });
      }
    };

    return () => ws.close();
  }, []);

  const handleDelete = async (matchId, poolId) => {
    const confirm = window.confirm(`Are you sure you want to delete match ${matchId}?`);
    if (!confirm) return;

    try {
      const res = await fetch(
        'https://3ue90epph4.execute-api.us-east-1.amazonaws.com/prod/scores',
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matchId, poolId }),
        }
      );

      if (res.ok) {
        setScores(prev => prev.filter(s => s.matchId !== matchId));
      } else {
        alert('Error deleting score');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#1B2A4A' }}>Live Pool Scores</h1>
      {loading && <p>Loading scores...</p>}
      {scores.length === 0 && !loading && (
        <p style={{ color: '#888' }}>No scores yet for this tournament.</p>
      )}
      {scores.map(match => (
        <div key={match.matchId} style={{
          border: '1px solid #C8CDD8',
          padding: '16px',
          marginBottom: '10px',
          borderRadius: '8px',
          background: 'white',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ fontSize: '16px' }}>{match.team1Id}</strong>
            <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9900' }}>
              {match.team1Score} — {match.team2Score}
            </span>
            <strong style={{ fontSize: '16px' }}>{match.team2Id}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>
              Pool: {match.poolId} | Updated: {new Date(match.updatedAt).toLocaleTimeString()}
            </p>
            <button
              onClick={() => handleDelete(match.matchId, match.poolId)}
              style={{
                background: '#B03020',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 12px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}