import React from 'react';

function SkillCardComponent() {
  return (
    <>
      <div className="overflow-x-auto no-scrollbar py-5">
        <div className="flex space-x-5 w-[1200px]">
          {[
            {
              icon: "fa-solid fa-eye",
              title: "Computer Vision",
              description: "Used OpenCV architecture to manually capture a dataset for my sign language translator project and detect hand signs using Haarcascade object detection models. Also, I've used OpenCV in my projects to perform image data augmentation before training CNN models.",
            },
            {
              icon: "fa-solid fa-language",
              title: "Natural Language Processing",
              description: "I implemented a custom BERT-CNN architecture to classify Twitter-based cyberbullying into six categories. I have experience working with the NLTK library for cleaning and preprocessing text. I have utilized Huggingface T5, Google Gemini API, and Google GenAI embedding API, as well as FAISS in my projects.",
            },
            {
              icon: "fa-solid fa-gear",
              title: "Machine Learning",
              description: "I've worked on training various types of machine learning models such as Random Forests, Support Vector Machines during my projects. Also, I've worked with time series models such as ARIMA and SARIMAX for price forecasting.",
            },
            {
              icon: "fa-brands fa-react",
              title: "React JS",
              description: "I am skilled in developing React Single Page Applications (SPAs), creating and evaluating API endpoints in Node.js, connecting to NoSQL databases such as MongoDB and hosting on cloud platforms such as Google Firebase and Vercel. Additionally, I have worked on projects with a Flask backend and have experience integrating machine learning models into React pages.",
            },
            {
              icon: "fa-brands fa-android",
              title: "Android App Development",
              description: "During my internship at StoccGuru, I designed and implemented the XML layouts for the messaging section of the app, integrated the application with a Flask backend and evaluated HTTP requests using Postman API. For the ISL project, I have experience in creating and using TensorFlow Lite-based machine learning models on Android.",
            },
            {
              icon: "fa-brands fa-python",
              title: "Python",
              description: "I've worked with multiple python libraries such as Scikit-learn, and have experience working with Django Web framework, visualizing data using Matplotlib and Seaborn, and performing data scraping using BeautifulSoup.",
            },
          ].map((skill, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-lg p-10 overflow-hidden hover:bg-gray-100  h-[600px] w-[400px] flex-shrink-0"
            >
              <div className="grid grid-cols-1 gap-7">
                <div className="flex items-center justify-center">
                  <i className={`${skill.icon} fa-3x`}></i>
                </div>
                <div className="text-gray-500 p-5 text-center text-xl">{skill.title}</div>
                <div className="text-gray-700 text-lg text-start overflow-hidden break-words whitespace-pre-line">
                  {skill.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default SkillCardComponent;
