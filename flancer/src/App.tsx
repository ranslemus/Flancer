import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FindJob from './pages/FindJob.tsx'; // Adjust the path if needed
import MainPage from './pages/MainPage.tsx'; // Example other pages
import ForumPage from './pages/Forum.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Adjust the default route to go to the right page */}
        <Route path="/findjob" element={<FindJob/>} />
        <Route path="/main" element={<MainPage/>} />
        <Route path="/forum" element={<ForumPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
