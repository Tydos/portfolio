import React from 'react'

const publications = [
  {
    id: 1,
    title: 'Comparative analysis of pharmacuetical supply chain optimisation using machine learning techniques',
    description: 'The paper discusses on automating the selection of optimal shipping modes for pharmaceutical products within supply chain management (SCM). The study uses a dataset with various features including unit price, product characteristics, and delivery dates. Data cleaning and feature engineering are employed to extract meaningful insights from 10,000 instances. The performance of five machine learning algorithms (LightGBM, XGBoost, Random Forest, Decision Trees, and Support Vector Machines) is evaluated, with LightGBM demonstrating superior accuracy and f1-score in predicting shipment modes. The study concludes that ML models can effectively optimize pharmaceutical SCM by reducing costs, improving delivery timeliness, and enhancing patient satisfaction.',
    link: 'https://drive.google.com/file/d/1HM-Wimj2DxkaAlmPr4S8Nc67Y7gb0dod/view',
    domain: 'Published'
  },
  {
    id: 2,
    title: 'Cyberbullying detection using machine learning techniques',
    description: 'The project aims to investigate cyberbullying on Twitter, examining its prevalence, types, and impacts on victims using a dataset of approximately 100,000 tweets. It also seeks to develop strategies for preventing and responding to cyberbullying on the platform. The outcomes aim to provide insights for developing effective interventions and supporting victims of cyberbullying. The project will employ advanced data analysis techniques to identify patterns and trends in cyberbullying behavior on Twitter. By categorizing tweets into specific types of cyberbullying, such as harassment, hate speech, or impersonation, the study aims to provide a nuanced understanding of the issue. Additionally, it will explore how demographic factors, such as age and gender, correlate with the likelihood of being targeted by cyberbullying on the platform. These insights will inform comprehensive recommendations aimed at promoting a safer and more supportive online environment for all users of Twitter.',
    link: 'https://drive.google.com/file/d/1Wd2-F6OligOaT0C0ajKmG-HC0RrtP8LZ/view',
    domain: 'Submitted for review'
  },
  // Add more publications as needed
];

function Publications() {
  return (
    <>
    <section id="papers"></section>
     <div class="p-10 items-start min-h-screen">
    <div class="my-5 text-5xl">
    <h2>Publications</h2>
    </div>
    <div class="py-5"></div>
     <div>
      {publications.map(publication => (
        <div key={publication.id} className="w-full rounded-3xl text-justify overflow-hidden shadow-lg bg-white flex flex-col md:flex-row mb-4 hover:bg-gray-100">
          <div className="w-full p-5">
            <div className="">
              <div className="font-bold text-3xl p-5"><p>{publication.title}</p></div>
              <p className="text-gray-600 text-lg p-5">{publication.description}</p>
            </div>
            <div className="flex flex-wrap p-5">
              {publication.link && (
                <a href={publication.link} target="_blank" rel="noopener noreferrer" className="inline-block bg-gray-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                  View Paper
                </a>
              )}
              <div className="inline-block bg-green-300 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{publication.domain}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
    </div>
    
    </>
  )
}

export default Publications
