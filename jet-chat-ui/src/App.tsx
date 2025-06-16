import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import BookingsPage from './pages/BookingsPage';
import ChatWidget from './components/ChatWidget';
import ChatWidgetEmbed from './pages/ChatWidgetEmbed';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/chat-embed" element={<ChatWidgetEmbed />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/" element={<Navigate to="/chat" replace />} />
      </Routes>
      {/* <ChatWidget /> */}
    </Router>
  );
};

export default App;
