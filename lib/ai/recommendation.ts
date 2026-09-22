import type { Course } from "@/lib/courses";
import type { StudentLearningProfile } from "./contracts";
import { learningMissions, type LearningMission } from "@/lib/learningMissions";

export function recommendMission(profile: StudentLearningProfile, courses: Course[]): LearningMission {
  const preferredCategory = profile.needsReinforcement[0];
  const matchingMission = learningMissions.find((mission) => mission.category === preferredCategory && courses.some((course) => course.slug === mission.courseSlug));
  return matchingMission ?? learningMissions[0];
}
