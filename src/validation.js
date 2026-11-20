export function normalizeCourse(course) {
  return String(course ?? "").trim().toUpperCase();
}

export function requireCourse(course) {
  const normalizedCourse = normalizeCourse(course);
  if (!normalizedCourse) {
    throw new Error("Course name is required");
  }
  return normalizedCourse;
}

export function requireGrade(grade) {
  const numericGrade = Number(grade);
  if (!Number.isInteger(numericGrade) || numericGrade < 0 || numericGrade > 100) {
    throw new Error("Grade must be an integer from 0 to 100");
  }
  return numericGrade;
}