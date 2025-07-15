import React from 'react'

const projects = [
  {
    id: 1,
    title: 'Cyberbullying Detection using Deep Learning',
    description: 'The project aims to identify derogatory tweets on Twitter related to gender, race, or sexual orientation. It utilizes a dataset of 110,000 instances to explore various detection methods, including SVM, L2 regularization, random forest, BERT, and an ensemble of BERT and LSTM. Tweets are categorized into six groups: gender, age, religion, not cyberbullying, and ethnicity.',
    link: 'https://github.com/Tydos/Cyberbullying-Detection',
    img_url: 'https://raw.githubusercontent.com/Tydos/Cyberbullying-Detection/main/accuracy_comparison.jpg',
    domain: 'Deep Learning'
  },
  {
    id: 2,
    title: 'Anuvadak: Indian Sign Language (ISL) Recognition ',
    description: 'We used deep learning models such as LSTM CNN, captured data using OpenCV and augmented it, extracted features from image using Mediapipe holistic tool and then fed the data to a model to get an accuracy of 85%. We then later worked on deploying android app as well',
    link: 'https://github.com/Tydos/ISL',
    img_url: 'https://res.cloudinary.com/duws62b88/image/upload/v1719502253/ssnop_g67nmy.png',
    domain: 'Deep Learning'
  },
  {
    id: 3,
    title: 'Portfolio Website',
    description: 'A full-stack project based on the MERN stack and styled using Tailwind CSS. Uses the MongoDB database in order to fetch all of the current projects and an place to showcase my photography where images are being fetched from Cloudinary server',
    link: 'https://github.com/Tydos/portfolio',
    img_url: 'https://res.cloudinary.com/duws62b88/image/upload/v1719500501/Screenshot_2024-06-27_203121_atzojq.png',
    domain: 'Web Development'
  },
  {
    id: 4,
    title: 'Supply chain managment of pharmacuetical drugs',
    description: 'This project deals with the optimisation of shipment mode for pharmaceutical drugs. Based on the supply chain dataset of 10000 rows, and considering factors such as drug expiry dates, shipping costs, drug types the machine learning model finds the best mode of shipping which is the cheapest as well as reaches fast ',
    link: 'https://github.com/Arnav047/Supply-Chain-Management',
    img_url: 'https://res.cloudinary.com/duws62b88/image/upload/v1719502354/summary_bzpbtl.png',
    domain: 'Machine Learning'
  },
  {
    id: 5,
    title: 'DocSpot: Connecting students together',
    description: 'A web portal designed to store student notes on MongoDB and easily retrieve them using ElasticSearch API. Incoming pdf documents are converted into embeddings using Google Gemini, and embeddings are stored in database for efficient retreival of notes according to topics. Google T5 is trained on the notes to act as a chatbot for the document',
    link: 'https://github.com/Tydos/DocSpot',
    img_url: 'https://res.cloudinary.com/duws62b88/image/upload/v1719500204/Screenshot_2024-06-05_214207_k8psav.png',
    domain: 'Web Development'
  },
  {
    id: 6,
    title: 'Gaurdify: Cyber security portal',
    description: 'A portal designed to reduce cyberbullying online. It features a easy to use interface for higher authorities to manage online cyberbullying complaints and allows users to file complaints. The wesbite has a integrated cyberbullying classifer model to classify incoming complaints into separate types and store complaints on MongoDB ',
    link: 'https://github.com/satts27/HackOverflow-1.0-BitbyBit',
    img_url: 'https://res.cloudinary.com/duws62b88/image/upload/v1719500441/acf91f47-97c8-42ed-b66a-a98844e1a0ad_ki38x1.jpg',
    domain: 'Web Development'
  },
  {
    id: 7,
    title: 'CowSense ',
    description: 'A website dedicated to Indian dairy farmers catering to their needs. The website features a integrated ML algorithm trained on 5000 images of cows having lumpy cow disease. The farmer can upload images of his cows to determine if they have lumpy cow disease. Also the website integrates Google Maps API in order to show nearby veternary clincs',
    link: 'https://github.com/SinghShreyansh/LBS-Dairy',
    img_url: 'https://res.cloudinary.com/duws62b88/image/upload/v1719500136/Screenshot_2023-07-22_173642_zsk5l5.png',
    domain: 'Deep Learning'
  },
];


function Projects() {
  return (
    <>
    <section id="projects"></section>
      <div class="p-10 items-start min-h-screen">
      <div class="my-5 text-5xl">
      <h2>Projects</h2>
      </div>
      <div class="py-5"></div>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {projects.map(project => (
        <div key={project.id} className="rounded-3xl overflow-hidden shadow-lg bg- flex flex-col mb-4 hover:bg-gray-100">
          {project.img_url && (
            <div className="md:h-64 overflow-hidden">
              <img className="w-full h-full object-cover" src={project.img_url} alt={project.title} />
            </div>
          )}
          <div className="p-5">
            <div className="font-bold text-3xl mb-4">{project.title}</div>
            <p className="text-gray-600 text-lg mb-4">{project.description}</p>
            <div className="flex flex-wrap">
              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  GitHub Link
                </a>
              )}  
              <div className="inline-block bg-green-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{project.domain}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
      </div>
    </>
  )
}

export default Projects