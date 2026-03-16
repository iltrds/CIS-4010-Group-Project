import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login';
import AccountPage from './pages/create_account';
import Surveys from './pages/surveys'
import Survey from './pages/survey'
import Success from './pages/submission_success'
import CreateSurvey from './pages/create_survey'
import './amplifyConfig';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create_account" element={<AccountPage />} />
        <Route path="/surveys" element={<Surveys />} />
        <Route path="/survey/:surveyId" element={<Survey />} />
        <Route path="/submission_success" element={<Success />} />
        <Route path="/create" element={<CreateSurvey />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;