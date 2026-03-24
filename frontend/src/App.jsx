import { Routes, Route } from 'react-router-dom';
import PoolScores from './pages/PoolScores';
import Brackets from './pages/Brackets';
import ScoreEntry from './pages/ScoreEntry';
import Login from './pages/Login';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#F6F6F6' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        <Routes>
          <Route path="/" element={<PoolScores />} />
          <Route path="/brackets" element={<Brackets />} />
          <Route path="/score-entry" element={<ScoreEntry />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}