import type { Project } from "../types";

/**
 * Curated projects shown on the home page and project detail routes.
 *
 * Order is display order for the Projects section.
 */
export const FEATURED_PROJECTS: Project[] = [
  {
    slug: "cyberbullying-detection",
    title: "Cyberbullying Detection using Deep Learning",
    description:
      "A deep learning system to identify derogatory tweets related to gender, race, age, religion, ethnicity, or sexual orientation. Built on a dataset of 110,000 tweets and evaluated using SVM, Random Forest, BERT, and an ensemble of BERT and LSTM models.",
    tags: [
      "Deep Learning",
      "Natural Language Processing",
      "BERT",
      "LSTM",
      "Text Classification",
      "Social Media Analysis",
      "Python",
    ],
    link: "https://github.com/Tydos/Cyberbullying-Detection",
    github: "https://github.com/Tydos/Cyberbullying-Detection",
    image:
      "https://raw.githubusercontent.com/Tydos/Cyberbullying-Detection/main/accuracy_comparison.jpg",
  },
  {
    slug: "anuvadak",
    title: "Anuvadak: Indian Sign Language Recognition",
    description:
      "A deep learning based ISL recognition system using CNN-LSTM architectures. Data was captured via OpenCV, augmented, and processed using MediaPipe Holistic for feature extraction, achieving 85% accuracy. Includes Android deployment.",
    tags: [
      "Deep Learning",
      "Computer Vision",
      "Gesture Recognition",
      "CNN",
      "LSTM",
      "MediaPipe",
      "OpenCV",
    ],
    link: "https://github.com/Tydos/ISL",
    github: "https://github.com/Tydos/ISL",
    image:
      "https://res.cloudinary.com/duws62b88/image/upload/v1719502253/ssnop_g67nmy.png",
  },
  {
    slug: "portfolio-website",
    title: "Portfolio Website",
    description:
      "Full-stack personal portfolio built with TypeScript and Python with PostgreSQL. Deployed on Vercel.",
    tags: ["Full Stack", "TypeScript", "Python", "PostgreSQL", "Vercel"],
    link: "https://www.prasadjawale.live/",
    github: "https://github.com/Tydos/portfolio",
    image: "https://opengraph.githubassets.com/1/Tydos/portfolio",
  },
  {
    slug: "credit-risk-scorer",
    title: "Credit Risk Scorer",
    description:
      "End-to-end ML pipeline for predicting loan payback, featuring data prep, model training, MLflow tracking, FastAPI deployment, monitoring, and orchestration.",
    tags: ["Machine Learning", "MLflow", "FastAPI", "MLOps", "Python"],
    link: "https://3qfrmicsqfwp2qgv3l5ofy4m7y0lkbds.lambda-url.us-east-1.on.aws/",
    github: "https://github.com/Tydos/Credit-Risk-Scorer",
    image: "https://opengraph.githubassets.com/1/Tydos/Credit-Risk-Scorer",
  },
  {
    slug: "gpt-2",
    title: "GPT-2 from Scratch",
    description:
      "GPT-2 built from scratch in PyTorch. Trained on WikiText-103 in ~25 mins/epoch on an A100.",
    tags: ["Deep Learning", "PyTorch", "Transformers", "NLP", "Python"],
    link: "https://github.com/Tydos/GPT-2",
    github: "https://github.com/Tydos/GPT-2",
    image: "https://opengraph.githubassets.com/1/Tydos/GPT-2",
  },
  {
    slug: "antares",
    title: "Antares: RAG PDF Assistant",
    description:
      "An AI system for intelligent PDF retrieval and question answering, built with a retrieval-augmented generation pipeline.",
    tags: ["Retrieval Augmented Generation", "NLP", "Python"],
    link: "https://rag-pdf-fawn.vercel.app",
    github: "https://github.com/Tydos/Antares",
    image: "https://opengraph.githubassets.com/1/Tydos/Antares",
  },
  {
    slug: "playlist-recommendation-system",
    title: "Playlist Recommendation System",
    description:
      "Using the Spotify Million Playlist Dataset, builds a song recommendation model that generates playlists matching a given vibe.",
    tags: ["Machine Learning", "Recommendation Systems", "Python", "Spotify"],
    link: "https://playlist-recommender-sage.vercel.app",
    github: "https://github.com/Tydos/Playlist-Recommendation-System",
    image:
      "https://opengraph.githubassets.com/1/Tydos/Playlist-Recommendation-System",
  },
  {
    slug: "pharmaceutical-supply-chain",
    title: "Pharmaceutical Supply Chain Optimisation",
    description:
      "A machine learning pipeline for predicting pharmaceutical shipment delivery risk. Processes supply chain data, engineers features, and trains models to identify shipments at risk of late delivery, enabling proactive supply chain management.",
    tags: [
      "Machine Learning",
      "Supply Chain",
      "Predictive Modeling",
      "Data Analysis",
      "Python",
    ],
    link: "https://github.com/Tydos/Pharmaceutical-Supply-Chain-Optimisation",
    github: "https://github.com/Tydos/Pharmaceutical-Supply-Chain-Optimisation",
    image:
      "https://opengraph.githubassets.com/1/Tydos/Pharmaceutical-Supply-Chain-Optimisation",
  },
  {
    slug: "docspot",
    title: "DocSpot",
    description:
      "A document-sharing platform for students using MongoDB and ElasticSearch. PDFs are converted into embeddings using Google Gemini, enabling semantic retrieval. A fine-tuned Google T5 model acts as a chatbot over stored notes.",
    tags: [
      "Retrieval Augmented Generation",
      "Semantic Search",
      "NLP",
      "ElasticSearch",
      "MongoDB",
      "Chatbot",
      "Embeddings",
    ],
    link: "https://github.com/Tydos/DocSpot",
    github: "https://github.com/Tydos/DocSpot",
    image:
      "https://res.cloudinary.com/duws62b88/image/upload/v1719500204/Screenshot_2024-06-05_214207_k8psav.png",
  },
  {
    slug: "guardify",
    title: "Guardify: Cyber Security Portal",
    description:
      "A cyber security portal for managing and reporting cyberbullying complaints. Integrates a machine learning classifier to categorize complaints and stores records in MongoDB for administrative review.",
    tags: [
      "Cybersecurity",
      "Web Application",
      "Machine Learning",
      "Text Classification",
      "MongoDB",
      "Full Stack",
    ],
    link: "https://github.com/satts27/HackOverflow-1.0-BitbyBit",
    github: "https://github.com/satts27/HackOverflow-1.0-BitbyBit",
    image:
      "https://res.cloudinary.com/duws62b88/image/upload/v1719500441/acf91f47-97c8-42ed-b66a-a98844e1a0ad_ki38x1.jpg",
  },
];
