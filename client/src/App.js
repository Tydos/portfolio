import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Errorpage from './components/Errorpage'
import { Analytics } from '@vercel/analytics/react';
function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="*" element={<Errorpage/>} />
    </Routes>
      <Analytics />
    </>
  );
}

export default App;
