import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

function Projects() {
  return (
    <>
    <Navbar/>
  
    <h2 class="text-4xl text-gray-400 font-bold justify-center text-center my-10">Projects</h2>

    <div class="grid grid-cols-1 justify-evenly items-center gap-10 m-5">

        <div class="w-full rounded overflow-hidden shadow-lg bg-white flex flex-col md:flex-row">
      
            <div class="p-6 md:w-2/3">
              <div class="mb-4">
                <div class="font-bold text-3xl mb-2">Cyberbullying Detection using Deep Learning</div>
               
                <p class="text-gray-600 text-lg">The project, titled "Detecting Cyberbullying using Deep Learning", aims to investigate cyber aggression on Twitter, focusing on identifying derogatory tweets based on gender, race, or sexual orientation. It seeks to develop an automated system capable of accurately analyzing text-based content across online platforms to detect instances of cyberbullying.

Leveraging a dataset of approximately 110,000 instances, the study explores various detection methods, including non-deep learning approaches such as SVM, L2 regularization, random forest, and deep learning techniques utilizing BERT. Additionally, an ensemble learning approach combining BERT and LSTM is planned.

The classification system categorizes tweets into six major categories: gender, age, religion, not cyberbullying, and ethnicity. To evaluate the effectiveness of these methods, a test dataset of 20,000 tweets will be employed, facilitating a comparative analysis to determine which model best identifies and classifies cyberbullying tweets accurately.</p>
              </div>
              <div class="flex flex-wrap mb-4">
                <a href="https://github.com/Tydos/Cyberbullying-Detection" class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">GitHub</a>
                <a href="#" class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Python</a>
              </div>
            </div>

            <div class="md:w-1/3">
              <img class="w-full h-auto md:h-full object-cover" src="https://raw.githubusercontent.com/Tydos/Cyberbullying-Detection/main/accuracy_comparison.jpg" alt=""></img>
            </div>
      </div>

   
</div>

    

    <Footer/>
    </>
  )
}

export default Projects