import React from 'react'
import Splash from './Splash'
import Navbar from './Navbar'
import Footer from './Footer'
import Projects from './Projects'
import Contact from './Contact'
import Skills from './Skills'
import Publications from './Publications'

function Home() {
  return (
    <div>
        <Navbar/> 
        <Splash/> 
        <Skills/>
        <Projects/>
        <Publications/>
        <Contact/>
        <Footer/>
    </div>
  )
}

export default Home