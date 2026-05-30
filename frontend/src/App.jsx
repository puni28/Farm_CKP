import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import OrchardGrid from './pages/OrchardGrid';
import TreeDetails from './pages/TreeDetails';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orchard" element={<OrchardGrid />} />
            <Route path="/trees/:id" element={<TreeDetails />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
