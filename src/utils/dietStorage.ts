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

export interface NutrientBreakdown {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
}

export const FOOD_NUTRIENTS_MAP: Record<
  string,
  { carbs: number; protein: number; fat: number; fiber: number; calories: number }
> = {
  "Oats with berries & nuts": { calories: 320, carbs: 45, protein: 12, fat: 10, fiber: 8 },
  "Veggie omelette": { calories: 280, carbs: 8, protein: 22, fat: 18, fiber: 3 },
  "Greek yogurt + chia": { calories: 240, carbs: 20, protein: 16, fat: 8, fiber: 5 },
  "Grilled chicken bowl": { calories: 520, carbs: 55, protein: 42, fat: 15, fiber: 7 },
  "Quinoa salad": { calories: 460, carbs: 62, protein: 18, fat: 14, fiber: 9 },
  "Lentil & spinach curry": { calories: 480, carbs: 68, protein: 24, fat: 12, fiber: 14 },
  "Almonds & walnuts": { calories: 180, carbs: 6, protein: 6, fat: 16, fiber: 4 },
  "Apple slices with peanut butter": { calories: 200, carbs: 24, protein: 6, fat: 10, fiber: 5 },
  "Carrot sticks & hummus": { calories: 150, carbs: 18, protein: 5, fat: 7, fiber: 6 },
  "Lentil & veggie soup": { calories: 380, carbs: 52, protein: 20, fat: 8, fiber: 11 },
  "Grilled salmon + greens": { calories: 520, carbs: 12, protein: 44, fat: 32, fiber: 6 },
  "Tofu stir-fry brown rice": { calories: 490, carbs: 65, protein: 22, fat: 14, fiber: 8 },
};

export function getMealNutrients(title: string, caloriesStr?: string): NutrientBreakdown {
  if (FOOD_NUTRIENTS_MAP[title]) {
    return FOOD_NUTRIENTS_MAP[title];
  }
  const cal = parseInt(caloriesStr?.replace(/[^0-9]/g, "") || "300", 10) || 300;
  return {
    calories: cal,
    carbs: Math.round((cal * 0.45) / 4),
    protein: Math.round((cal * 0.25) / 4),
    fat: Math.round((cal * 0.3) / 9),
    fiber: Math.max(2, Math.round(cal / 60)),
  };
}

export function calculateEatenNutrition(dietData: DailyDietData): {
  consumedCalories: number;
  consumedCarbs: number;
  consumedProtein: number;
  consumedFat: number;
  consumedFiber: number;
  eatenMealsCount: number;
  eatenList: Array<{ mealType: string; title: string; calories: number; caloriesStr: string }>;
} {
  const mealTypes: Array<"breakfast" | "lunch" | "snack" | "dinner"> = ["breakfast", "lunch", "snack", "dinner"];
  let consumedCalories = 0;
  let consumedCarbs = 0;
  let consumedProtein = 0;
  let consumedFat = 0;
  let consumedFiber = 0;
  let eatenMealsCount = 0;
  const eatenList: Array<{ mealType: string; title: string; calories: number; caloriesStr: string }> = [];

  mealTypes.forEach((type) => {
    const meal = dietData[type];
    if (meal && meal.isEaten) {
      eatenMealsCount++;
      const title = meal.selectedItem || getDefaultMealName(type);
      const calStr = meal.calories || getDefaultMealCalories(type);
      const nutrients = getMealNutrients(title, calStr);

      consumedCalories += nutrients.calories;
      consumedCarbs += nutrients.carbs;
      consumedProtein += nutrients.protein;
      consumedFat += nutrients.fat;
      consumedFiber += nutrients.fiber;

      eatenList.push({
        mealType: type.charAt(0).toUpperCase() + type.slice(1),
        title,
        calories: nutrients.calories,
        caloriesStr: calStr,
      });
    }
  });

  return {
    consumedCalories,
    consumedCarbs,
    consumedProtein,
    consumedFat,
    consumedFiber,
    eatenMealsCount,
    eatenList,
  };
}

