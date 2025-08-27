import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import Leaderboard from "./pages/Leaderboard";
import "./index.css";

export default function App() {
  return (
    <Router>
      <div className="app">
        <header className="site-header">
          <Link to="/" className="brand">
            Photo Tag Game
          </Link>
          <nav>
            <Link to="/" className="navlink">
              Home
            </Link>
          </nav>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game/:levelId" element={<GamePage />} />
            <Route path="/leaderboard/:levelId" element={<Leaderboard />} />
          </Routes>
        </main>

        <footer className="site-footer">© Photo Tag Game</footer>
      </div>
    </Router>
  );
}
