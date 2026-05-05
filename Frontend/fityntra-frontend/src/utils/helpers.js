export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export function calculateMacros(calories) {
  return {
    protein: calories * 0.3,
    carbs: calories * 0.4,
    fat: calories * 0.3,
  };
}