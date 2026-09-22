import type { Course, CourseModule, Lesson } from "@/lib/courses";

export type StudyCard = {
  id: string;
  setId: string;
  term: string;
  definition: string;
  source: "topic" | "content";
};

export type StudySet = {
  id: string;
  courseSlug: string;
  moduleTitle?: string;
  lessonTitle?: string;
  title: string;
  description: string;
  cards: StudyCard[];
};

export type CardProgress = {
  box: 1 | 2 | 3 | 4 | 5;
  repetitions: number;
  lastReviewedAt?: string;
  nextReviewAt?: string;
};

export type StudyResult = "know" | "review";

const BOX_INTERVALS_DAYS: Record<CardProgress["box"], number> = {
  1: 0,
  2: 1,
  3: 3,
  4: 7,
  5: 14,
};

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function cardFromTopic(setId: string, topic: string, index: number): StudyCard {
  return {
    id: `${setId}-topic-${index + 1}`,
    setId,
    term: topic,
    definition: `Explica qué significa "${topic}" y cómo se aplica en ${setId.split("-")[0]}.`,
    source: "topic",
  };
}

function cardFromContent(setId: string, lesson: Lesson): StudyCard | null {
  if (!lesson.content) return null;
  return {
    id: `${setId}-content`,
    setId,
    term: lesson.content.realExample.title,
    definition: lesson.content.realExample.description,
    source: "content",
  };
}

function buildLessonSet(course: Course, courseModule: CourseModule, lesson: Lesson, moduleIndex: number, lessonIndex: number): StudySet {
  const setId = `${course.slug}-${moduleIndex + 1}-${lessonIndex + 1}`;
  const cards = lesson.topics.map((topic, index) => cardFromTopic(setId, topic, index));
  const contentCard = cardFromContent(setId, lesson);
  if (contentCard) cards.push(contentCard);
  return {
    id: setId,
    courseSlug: course.slug,
    moduleTitle: courseModule.title,
    lessonTitle: lesson.title,
    title: `Repaso: ${lesson.title}`,
    description: `Practica los conceptos de ${courseModule.title} antes de continuar.`,
    cards,
  };
}

export function buildStudySets(course: Course): StudySet[] {
  return course.modules.flatMap((courseModule, moduleIndex) => courseModule.lessons.map((lesson, lessonIndex) => buildLessonSet(course, courseModule, lesson, moduleIndex, lessonIndex)));
}

export function createInitialProgress(): CardProgress {
  return { box: 1, repetitions: 0 };
}

export function reviewCard(progress: CardProgress, result: StudyResult, reviewedAt = new Date()): CardProgress {
  const nextBox = result === "know" ? Math.min(5, progress.box + 1) : Math.max(1, progress.box - 1) as CardProgress["box"];
  const nextReview = new Date(reviewedAt);
  nextReview.setDate(nextReview.getDate() + BOX_INTERVALS_DAYS[nextBox]);
  return {
    box: nextBox as CardProgress["box"],
    repetitions: progress.repetitions + 1,
    lastReviewedAt: reviewedAt.toISOString(),
    nextReviewAt: nextReview.toISOString(),
  };
}

export function getDueCards(cards: StudyCard[], progress: Record<string, CardProgress>, now = new Date()) {
  return cards.filter((card) => {
    const cardProgress = progress[card.id];
    return !cardProgress?.nextReviewAt || new Date(cardProgress.nextReviewAt) <= now;
  });
}

export function studySetStorageKey(setId: string) {
  return `datam-study-set:${slugify(setId)}`;
}
