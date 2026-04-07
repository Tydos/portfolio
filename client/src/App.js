import React from 'react';
import Photo from './Pages/Photo';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Errorpage from './Pages/Errorpage'
import { Analytics } from '@vercel/analytics/react';
function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/photo" element={<Photo/>} />
      <Route path="*" element={<Errorpage/>} />
    </Routes>
      <Analytics />
    </>
  );
}

export default App;
