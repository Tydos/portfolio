import React from 'react'
 const titles = [
  'Computer Vision',
  'Natural Language Processing',
  'Machine Learning',
  'React JS',
  'Android App Development',
  'Python',
];

const LANGUAGES = [
  "Python",
  "C/C++",
  "Java",
  "HTML/CSS",
  "R",
  "SQL",
  "JavaScript",
];

const TECHNOLOGIES_FRAMEWORKS = [
  "Pytorch",
  "TensorFlow",
  "Gensim",
  "Spacy",
  "Apache Spark",
  "Hadoop",
  "Scikit-Learn",
  "Pandas",
  "Flask",
];

const CONTAINERS_CLOUD = [
  "Docker",
  "Kubernetes",
  "Docker Swarm",
  "MongoDB NoSQL",
  "Google Colab",
  "Google Firebase",
  "AWS EC2 & S3",
];


function Skills() {
  return (
    <>
  <section
      id="skills"
      className="min-h-screen flex flex-col bg-white items-center justify-center"
    >
      <h2 className="text-3xl text-center my-10 mb-4">About me</h2>
      <img
        src="https://res.cloudinary.com/duws62b88/image/upload/v1737421606/myimg_x0kuyo.jpg"
        alt="profilepic"
        width="250px"
        height="250px"
        className="rounded-full mx-auto mb-6"
      />

      <div className="w-full max-w-7xl p-6 rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">

          <div className="max-w-xl text-center lg:text-left space-y-6">
            <p className="md:text-justify text-xl">
              I'm currently a graduate student at UW - Madison. I'm interested in building websites, machine learning models, and photography. Apart from that, I have experience in building Android Java applications and working with API testing tools and NoSQL databases.
            </p>
             <p className="md:text-justify text-xl">
              In my free time, I like reading books, playing video games and photographing stuff
            </p>
          
          </div>
         
           

          {/* Tech Stack */}
          <div>
          
            {/* Languages */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2 text-lg">Languages</h4>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((skill) => (
                  <div
                    key={skill}
                    className="bg-violet-300 text-gray-800 rounded-full px-4 py-1 shadow-sm hover:shadow-md hover:bg-violet-200 transition duration-200 ease-in-out flex items-center justify-center"
                  >
                    <span className="text-md font-bold">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies & Frameworks */}
            <div className="mb-6">
              <h4 className="font-semibold mb-2 text-lg">Technologies & Frameworks</h4>
              <div className="flex flex-wrap gap-2">
                {TECHNOLOGIES_FRAMEWORKS.map((skill) => (
                  <div
                    key={skill}
                    className="bg-violet-300 text-gray-800 rounded-full px-4 py-1 shadow-sm hover:shadow-md hover:bg-violet-200 transition duration-200 ease-in-out flex items-center justify-center"
                  >
                    <span className="text-md font-bold">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Containers & Cloud */}
            <div>
              <h4 className="font-semibold mb-2 text-lg">Containers & Cloud</h4>
              <div className="flex flex-wrap gap-2">
                {CONTAINERS_CLOUD.map((skill) => (
                  <div
                    key={skill}
                    className="bg-violet-300 text-gray-800 rounded-full px-4 py-1 shadow-sm hover:shadow-md hover:bg-violet-200 transition duration-200 ease-in-out flex items-center justify-center"
                  >
                    <span className="text-md font-bold">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    </>
  )
}

export default Skills