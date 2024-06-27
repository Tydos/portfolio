import React from 'react';

const Timeline = () => {
  const educationDetails = [
    {
      degree: "Bachelor of Technology in Artificial Intelligence and Data Science",
      institution: "Vivekanand Education Society's Institute of Technology",
      description: "Learned foundational concepts of computer science and developed skills in software development, algorithms, and data structures."
    },
    {
      degree: "Master of Science in Data Science",
      institution: "University of Wisconsin - Madison",
      description: "Specialized in advanced software engineering principles, including software design patterns, project management, and system architecture."
    }
  ];

  return (
    <div className="container mx-auto">
      <div className="relative flex justify-start items-center overflow-x-auto">
        <div className="flex space-x-20">
          {educationDetails.map((item, index) => (
            <div key={index} className="relative flex flex-col items-center mx-4">
              <div className="bg-gray-200 p-6 rounded-xl shadow-lg w-80">
                <h3 className="text-xl font-semibold">{item.degree}</h3>
                <h4 className="text-md font-medium text-gray-600">{item.institution}</h4>
                <p className="mt-2 text-gray-700">{item.description}</p>
              </div>
              {index < educationDetails.length - 1 && (
                <div className="absolute top-1/2 left-full transform -translate-y-1/2 w-24 border-t-2 border-blue-500"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
