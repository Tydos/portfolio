/** { title, items[] } for SkillStack */
export const RESUME_SKILL_GROUPS = [
  {
    title: "Languages",
    items: ["Python", "C++", "SQL", "Bash", "Java"],
  },
  {
    title: "Backend & APIs",
    items: ["FastAPI", "Flask", "REST APIs", "Async APIs", "Pydantic"],
  },
  {
    title: "Data & Databases",
    items: ["PostgreSQL", "MongoDB", "PySpark", "Elasticsearch", "ETL Pipelines"],
  },
  {
    title: "Machine Learning",
    items: ["scikit-learn", "PyTorch", "NLP", "BERT", "Clustering", "SVD", "KNN"],
  },
];

export const RESUME_SUMMARY_PARAGRAPHS = [
  "On the application side, I build backend systems using FastAPI and Flask, and create user interfaces with React and Tailwind. I work with databases such as PostgreSQL and MongoDB to design reliable data systems. I deploy projects using AWS, Docker, and CI/CD pipelines to ensure smooth, production-ready performance.",
  "I’ve worked on ML projects using PyTorch and BERT for NLP tasks, including spam detection and topic modeling with BERTopic. My experience also covers distributed training and hyperparameter optimization with Optuna.",
  "I’ve also explored search and retrieval systems using FAISS and Elasticsearch, and recently started experimenting with LangChain for LLM-based applications, along with blockchain-based projects to better understand decentralized system design.",
];

export const RESUME_EXPERIENCE = [
  {
    role: "Data Analyst Intern (NLP)",
    company: "Wisconsin School of Business",
    period: "Oct '24 - Present",
    details: [
      "Engineered a batch ETL pipeline in Python and SQL to ingest and normalize structured hotel reviews, enabling downstream NLP analysis at scale.",
      "Stabilized model performance across demographic segments by implementing a robust SpaCy text preprocessing pipeline, reducing variance in F1 scores.",
      "Designed a modular topic modeling service using Sequential LDA to automate the categorization of customer sentiment in reviews.",
      "Improved topic coherence by 7% by transitioning from Sequential LDA to BERTopic with transformer-based embeddings.",
    ],
  },
  {
    role: "Android Development Intern",
    company: "StoccGuru",
    period: "Jun '21 - Aug '21",
    details: [
      "Integrated the Android XML front-end with a Python Flask backend via REST APIs, achieving response times under 250ms.",
      "Developed a comprehensive automated testing suite using Postman for unit and integration tests, significantly reducing API failure rates in production.",
      "Delivered core backend modules across 5 sprints using Agile/Jira methodologies, ensuring 100% on-time release.",
    ],
  },
];

export const RESUME_EDUCATION = [
  {
    school: "University of Wisconsin - Madison",
    degree: "M.S. Data Science",
    period: "2024 - 2026",
  },
  {
    school: "University of Mumbai",
    degree: "B.Tech. AI & DS",
    period: "2020 - 2024",
  },
];

export const RESUME_PUBLICATION = {
  title:
    "LightGBM and Gradient Boosting for Optimizing Shipment Mode in Pharmaceutical Supply Chains",
  publisher: "Springer Singapore",
  url: "https://link.springer.com/chapter/10.1007/978-981-96-2179-8_36",
};

export const RESUME_SECTION_LABELS = {
  summary: "Summary",
  skills: "Skills",
  experience: "Experience",
  education: "Education",
  publications: "Publications",
  readPaper: "Read Paper",
};
