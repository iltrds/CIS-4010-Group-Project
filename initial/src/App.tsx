import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login';
import AccountPage from './pages/create_account';
import Surveys from './pages/surveys'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create_account" element={<AccountPage />} />
        <Route path="/surveys" element={<Surveys />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;