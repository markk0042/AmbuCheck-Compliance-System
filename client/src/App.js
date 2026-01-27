import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import EquipmentCheck from './components/EquipmentCheck';
import ChecklistList from './components/ChecklistList';
import DynamicForm from './components/DynamicForm';
import Layout from './components/Layout';
import PrivacyPolicy from './components/PrivacyPolicy';
import SplashScreen from './components/SplashScreen';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check if splash has been shown before (optional - remove if you want it every time)
    const splashShown = sessionStorage.getItem('splashShown');
    if (splashShown) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('splashShown', 'true');
  };

  return (
    <AuthProvider>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {!showSplash && (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/checklists"
              element={
                <PrivateRoute>
                  <Layout>
                    <ChecklistList />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/forms/:formId"
              element={
                <PrivateRoute>
                  <Layout>
                    <DynamicForm />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/equipment-check"
              element={
                <PrivateRoute>
                  <Layout>
                    <EquipmentCheck />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/" element={<Navigate to="/checklists" />} />
          </Routes>
        </Router>
      )}
    </AuthProvider>
  );
}

export default App;

