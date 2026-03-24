import { useState, useEffect } from 'react';

export default function Brackets() {
  const [brackets, setBrackets] = useState([]);
  const [tournamentId, setTournamentId] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchBrackets = async () => {
    if (!tournamentId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://3ue90epph4.execute-api.us-east-1.amazonaws.com/prod/brackets/${tournamentId}`
      );
      const data = await res.json();
      setBrackets(data.rankings || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: '#1B2A4A' }}>Brackets</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          placeholder="Enter Tournament ID"
          value={tournamentId}
          onChange={e => setTournamentId(e.target.value)}
          style={{
            padding: '10px', border: '1px solid #C8CDD8',
            borderRadius: '4px', fontSize: '14px', width: '300px'
          }}
        />
        <button
          onClick={fetchBrackets}
          style={{
            background: '#1B2A4A', color: 'white', padding: '10px 20px',
            border: 'none', borderRadius: '4px', cursor: 'pointer'
          }}
        >
          Load Brackets
        </button>
      </div>
      {loading && <p>Loading brackets...</p>}
      {brackets.length === 0 && !loading && (
        <p style={{ color: '#888' }}>No bracket data yet. Enter a Tournament ID above.</p>
      )}
      {brackets.map((team, index) => (
        <div key={team.teamId} style={{
          border: '1px solid #C8CDD8',
          padding: '16px',
          marginBottom: '10px',
          borderRadius: '8px',
          background: index === 0 ? '#FFF8EC' : 'white',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <span style={{
            fontSize: '24px', fontWeight: 'bold',
            color: index === 0 ? '#FF9900' : '#1B2A4A',
            minWidth: '40px'
          }}>
            #{index + 1}
          </span>
          <div>
            <strong style={{ fontSize: '16px' }}>{team.teamId}</strong>
            <p style={{ color: '#888', fontSize: '12px', margin: '4px 0 0' }}>
              Wins: {team.wins} | Losses: {team.losses} | Point Diff: {team.pointDiff}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}