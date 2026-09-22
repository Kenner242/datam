export type TutorMode = "tutor" | "pista" | "desafio" | "socratico" | "experto";

export type StudentLearningProfile = {
  userId: string;
  strengths: string[];
  needsReinforcement: string[];
  completedLessons: number;
  averageScore: number;
  currentLevel: string;
};

export type TutorContext = {
  courseSlug?: string;
  lessonTitle?: string;
  mode: TutorMode;
  profile?: StudentLearningProfile;
};

export type KnowledgeDocument = {
  id: string;
  title: string;
  content: string;
  courseSlug?: string;
  tags: string[];
};

// RAG: this contract is ready for embeddings/vector retrieval when the provider is selected.
export type RetrievedKnowledge = KnowledgeDocument & { score: number };
