import React from 'react';
import Photo from './Pages/Photo';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Errorpage from './Pages/Errorpage'
import Test from './Test/Test';

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/photo" element={<Photo/>} />
      <Route path='/test' element={<Test/>} />
      <Route path="*" element={<Errorpage/>} />
    </Routes>
    </>
  );
}

export default App;
