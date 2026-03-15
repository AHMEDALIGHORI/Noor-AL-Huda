import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Stories from './pages/Stories';
import StoryDetail from './pages/StoryDetail';
import Chat from './pages/Chat';
import Science from './pages/Science';
import Books from './pages/Books';
import Login from './pages/Login';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="stories" element={<Stories />} />
            <Route path="stories/:id" element={<StoryDetail />} />
            <Route path="chat" element={<Chat />} />
            <Route path="science" element={<Science />} />
            <Route path="books" element={<Books />} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
