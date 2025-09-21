import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './pages/Dashboard';
import AddSale from './pages/AddSale';
import Reports from './pages/Reports';
import { SocketProvider } from './contexts/SocketContext';

function App() {
  return (
    <SocketProvider>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Navbar />
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: '64px',
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-sale" element={<AddSale />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </Box>
      </Box>
    </SocketProvider>
  );
}

export default App;
