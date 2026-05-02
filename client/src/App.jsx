import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Main from './pages/Main.jsx';
import Enroll from './pages/Enroll.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/main" element={<Main />} />
      <Route path="/enroll" element={<Enroll />} />
      <Route path="/login" element={<Landing />} />
    </Routes>
  );
}
