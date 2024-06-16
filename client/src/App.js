import React from 'react';
import Resume from './Resume';
import Projects from './Projects';
import Contact from './Contact';
import Photo from './Photo';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Errorpage from './Errorpage';
import Publications from './Publications';
import Test from './Test';

function App() {

  return (

    <>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/contact" element={<Contact/>} />
      <Route path="/photo" element={<Photo/>} />
      <Route path="/resume" element={<Resume/>} />
      <Route path="/projects" element={<Projects/>} />
      <Route path="/publications" element={<Publications/>} />
      <Route path='/test' element={<Test/>} />
      <Route path="*" element={<Errorpage/>} />
    </Routes>
    </>
  
  );
}

export default App;
