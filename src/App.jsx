// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import HomePage from './pages/HomePage';
import ChargingCalculator from './pages/ChargingCalculator';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a4b9e',
    },
    secondary: {
      main: '#ff6600',
    },
  },
  typography: {
    fontFamily: "'Kanit', 'Roboto', 'Arial', sans-serif",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calculator" element={<ChargingCalculator />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;