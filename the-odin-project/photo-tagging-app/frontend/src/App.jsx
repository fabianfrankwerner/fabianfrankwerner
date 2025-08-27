import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import Leaderboard from "./pages/Leaderboard";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-black text-white p-4 flex justify-between">
          <Link to="/" className="font-bold text-lg">
            Photo Tag Game
          </Link>
        </header>

        <main className="p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game/:levelId" element={<GamePage />} />
            <Route path="/leaderboard/:levelId" element={<Leaderboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
