
export interface MealPart {
  id: 'appetizer' | 'sideDish' | 'mainCourse' | 'drink';
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
}

export interface ShoppingCategory {
  category: string;
  items: string[];
}

export interface FullMealPlan {
  country: string;
  appetizer: MealPart;
  sideDish: MealPart;
  mainCourse: MealPart;
  drink: MealPart;
  shoppingList: ShoppingCategory[];
}

export interface MealConstraints {
  glutenFree: boolean;
  lowCarb: boolean;
  noAlcohol: boolean;
  noCoffee: boolean;
}
