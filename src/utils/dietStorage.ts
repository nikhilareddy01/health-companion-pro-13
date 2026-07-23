export interface MealChoice {
  selectedItem: string;
  calories: string;
  tags: string;
  isEaten: boolean;
}

export interface DailyDietData {
  breakfast?: MealChoice;
  lunch?: MealChoice;
  dinner?: MealChoice;
  snack?: MealChoice;
}

export interface DietTarget {
  calories: string;
  carbs: string;
  protein: string;
  fat: string;
}

export function getTodayDietKey(userId?: string | null): string {
  const todayStr = new Date().toISOString().split("T")[0];
  const userKey = userId || "guest";
  return `daily_diet_${userKey}_${todayStr}`;
}

export function getDietData(userId?: string | null): DailyDietData {
  if (typeof window === "undefined") return {};
  const key = getTodayDietKey(userId);
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return {};
    }
  }
  return {};
}

export function saveDietData(data: DailyDietData, userId?: string | null): void {
  if (typeof window === "undefined") return;
  const key = getTodayDietKey(userId);
  localStorage.setItem(key, JSON.stringify(data));
}

export function getDietTargets(userId?: string | null): DietTarget {
  const defaultTargets: DietTarget = {
    calories: "1,800 kcal",
    carbs: "180g",
    protein: "110g",
    fat: "55g",
  };
  if (typeof window === "undefined") return defaultTargets;
  const userKey = userId || "guest";
  const saved = localStorage.getItem(`diet_targets_${userKey}`);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return defaultTargets;
    }
  }
  return defaultTargets;
}

export function saveDietTargets(targets: DietTarget, userId?: string | null): void {
  if (typeof window === "undefined") return;
  const userKey = userId || "guest";
  localStorage.setItem(`diet_targets_${userKey}`, JSON.stringify(targets));
}

export function setMealSelection(
  mealType: "breakfast" | "lunch" | "dinner" | "snack",
  item: { title: string; calories: string; tags: string },
  isEaten?: boolean,
  userId?: string | null
): DailyDietData {
  const current = getDietData(userId);
  const existingMeal = current[mealType];

  const updatedMeal: MealChoice = {
    selectedItem: item.title,
    calories: item.calories,
    tags: item.tags,
    isEaten: isEaten !== undefined ? isEaten : existingMeal?.isEaten || false,
  };

  const updatedData: DailyDietData = {
    ...current,
    [mealType]: updatedMeal,
  };

  saveDietData(updatedData, userId);
  return updatedData;
}

export function toggleMealEatenStatus(
  mealType: "breakfast" | "lunch" | "dinner" | "snack",
  userId?: string | null
): { data: DailyDietData; newStatus: boolean } {
  const current = getDietData(userId);
  const existingMeal = current[mealType];

  const newStatus = !existingMeal?.isEaten;
  const updatedMeal: MealChoice = {
    selectedItem: existingMeal?.selectedItem || getDefaultMealName(mealType),
    calories: existingMeal?.calories || getDefaultMealCalories(mealType),
    tags: existingMeal?.tags || "Recommended",
    isEaten: newStatus,
  };

  const updatedData: DailyDietData = {
    ...current,
    [mealType]: updatedMeal,
  };

  saveDietData(updatedData, userId);
  return { data: updatedData, newStatus };
}

export function getDefaultMealName(mealType: "breakfast" | "lunch" | "dinner" | "snack"): string {
  switch (mealType) {
    case "breakfast":
      return "Oats with berries & nuts";
    case "lunch":
      return "Grilled chicken bowl";
    case "dinner":
      return "Lentil & veggie soup";
    case "snack":
      return "Almonds & walnuts";
  }
}

export function getDefaultMealCalories(mealType: "breakfast" | "lunch" | "dinner" | "snack"): string {
  switch (mealType) {
    case "breakfast":
      return "320 kcal";
    case "lunch":
      return "520 kcal";
    case "dinner":
      return "380 kcal";
    case "snack":
      return "180 kcal";
  }
}
