import type { SkillGroup, Experience, Education, Publication } from "../types";

/** Skill groups shown in the Experience / resume section. */
export const RESUME_SKILL_GROUPS: SkillGroup[] = [
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

/** Short summary paragraphs for the About / resume intro. */
export const RESUME_SUMMARY_PARAGRAPHS: string[] = [
  "Software engineer building Python backends with FastAPI and Flask, ML/NLP systems with PyTorch and BERT, and production deployments on AWS and Docker.",
];

/** Work experience entries in reverse chronological order. */
export const RESUME_EXPERIENCE: Experience[] = [
  {
    role: "Software Engineering (AI) Intern",
    company: "Lyntra",
    period: "Jun '26 - Present",
    details: [
      "Deployed Flask REST API on AWS EC2, integrating Amazon Bedrock LLMs and PostgreSQL-backed student LMS data.",
      "Fixed OAuth2 PKCE verifier validation, restoring Google sign-in for React Native users on iOS and Android.",
      "Built React Native course and assignment screens integrated with authenticated Flask REST APIs for LMS workflows.",
    ],
  },
  {
    role: "Data Analyst Intern",
    company: "Wisconsin School of Business",
    period: "Oct '24 - Mar '25",
    details: [
      "Structured 100K+ hotel reviews into embeddings via a Python ETL pipeline, enabling downstream ML workflows.",
      "Trained a Random Forest classifier on review embeddings, improving spam detection F1-score from 0.70 to 0.82.",
      "Modeled 2014–2024 hospitality sentiment shifts using Latent Dirichlet Allocation (LDA), surfacing themes like cleanliness, amenities, and staff responsiveness.",
      "Reduced BERTopic topic-modeling runtime from 45 to 10 minutes via GPU-accelerated embeddings and clustering, surfacing 15 themes for analytics.",
    ],
  },
  {
    role: "Android Development Intern",
    company: "StoccGuru",
    period: "Jun '21 - Aug '21",
    details: [
      "Built Android support chat with RecyclerView, pagination, and in-memory caching for smooth long-thread scrolling.",
      "Built Flask/MongoDB REST API with 5 endpoints for trading support chat, validated with Postman and pytest for 50 users.",
    ],
  },
];

/** Education entries shown in the resume section. */
export const RESUME_EDUCATION: Education[] = [
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

/** Featured publication linked from the resume section. */
export const RESUME_PUBLICATION: Publication = {
  title:
    "LightGBM and Gradient Boosting for Optimizing Shipment Mode in Pharmaceutical Supply Chains",
  publisher: "Springer Singapore",
  url: "https://link.springer.com/chapter/10.1007/978-981-96-2179-8_36",
};

/** UI labels for resume subsections. */
export const RESUME_SECTION_LABELS: Record<string, string> = {
  summary: "Summary",
  skills: "Skills",
  experience: "Experience",
  education: "Education",
  publications: "Publications",
  readPaper: "Read Paper",
};
