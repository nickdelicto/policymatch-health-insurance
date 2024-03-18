import logo from './logo.svg';
import './App.css';

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ComparePage from './pages/ComparePage';
import GetStartedPage from './pages/GetStartedPage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/compare" element= {<ComparePage/>} />
          <Route path="/get-started" element={<GetStartedPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
