import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from './components/Layout';
import Home from './pages/Home';
import MySubmissions from './pages/MySubmissions';
import ComplaintDetail from './pages/ComplaintDetail';
import NewComplaint from './pages/NewComplaint';
import AuthProvider from './context/AuthContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/my-submissions" element={<MySubmissions />} />
              <Route path="/complaints/:id" element={<ComplaintDetail />} />
              <Route path="/new-complaint" element={<NewComplaint />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;