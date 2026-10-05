import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';

function App() {
  return (
    <Router>
      <div>
        <nav style={{ background: '#2c3e50', padding: '1rem', color: 'white' }}>
          <div className="container" style={{ display: 'flex', gap: '1rem', padding: '0' }}>
            <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Job Tracker</Link>
            <Link to="/applications" style={{ color: '#ecf0f1', textDecoration: 'none' }}>Applications</Link>
          </div>
        </nav>
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/applications" element={<Applications />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
