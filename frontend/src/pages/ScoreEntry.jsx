import { useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

export default function ScoreEntry() {
  const [form, setForm] = useState({
    matchId: '',
    poolId: '',
    team1Id: '',
    team2Id: '',
    team1Score: '',
    team2Score: '',
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString() ?? '';

      const res = await fetch(
        'https://3ue90epph4.execute-api.us-east-1.amazonaws.com/prod/scores',
        {
          method: 'POST',
          headers: {
           'Content-Type': 'application/json',
            ...(token && { Authorization: token }),
          },
          body: JSON.stringify(form),
        }
      );

      if (res.ok) {
        setStatus('✅ Score saved successfully!');
        setForm({ matchId: '', poolId: '', team1Id: '', team2Id: '', team1Score: '', team2Score: '' });
      } else {
        setStatus('❌ Error saving score. Please try again.');
      }
    } catch (err) {
      setStatus('❌ ' + err.message);
    }
    setLoading(false);
  };

  const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #C8CDD8',
    borderRadius: '4px',
    fontSize: '14px',
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <h1 style={{ color: '#1B2A4A' }}>Score Entry</h1>
      <p style={{ color: '#888' }}>Site Directors Only</p>
      <input placeholder="Match ID" value={form.matchId}
        onChange={e => setForm({ ...form, matchId: e.target.value })} style={inputStyle} />
      <input placeholder="Pool ID" value={form.poolId}
        onChange={e => setForm({ ...form, poolId: e.target.value })} style={inputStyle} />
      <input placeholder="Team 1 Name" value={form.team1Id}
        onChange={e => setForm({ ...form, team1Id: e.target.value })} style={inputStyle} />
      <input placeholder="Team 2 Name" value={form.team2Id}
        onChange={e => setForm({ ...form, team2Id: e.target.value })} style={inputStyle} />
      <input placeholder="Team 1 Score" type="number" value={form.team1Score}
        onChange={e => setForm({ ...form, team1Score: +e.target.value })} style={inputStyle} />
      <input placeholder="Team 2 Score" type="number" value={form.team2Score}
        onChange={e => setForm({ ...form, team2Score: +e.target.value })} style={inputStyle} />
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          background: '#FF9900', color: 'white', padding: '12px 24px',
          border: 'none', borderRadius: '4px', cursor: 'pointer',
          fontSize: '16px', width: '100%'
        }}
      >
        {loading ? 'Saving...' : 'Save Score'}
      </button>
      {status && (
        <p style={{ marginTop: '16px', fontWeight: 'bold',
          color: status.includes('✅') ? 'green' : 'red' }}>
          {status}
        </p>
      )}
    </div>
  );
}