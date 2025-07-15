import React from 'react'
import Splash from './Splash'
import Navbar from './Navbar'
import Footer from './Footer'
import Projects from './Projects'
import Skills from './Skills'
import Publications from './Publications'

import Gallery from './Gallery'

function Home() {
  return (
    <div>
        <Navbar/>  
        <Splash/>
        {/* <Gallery/> */}
        <Skills/> 
        <Projects/>
       <Publications/>
        {/* <Gallery/> */}
        <Footer/>
    </div>
  )
}

export default Home