
import { GoogleGenAI, Type } from "@google/genai";
import { FullMealPlan, MealConstraints, MealPart } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

const MEAL_PART_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    description: { type: Type.STRING },
    ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
    instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["name", "description", "ingredients", "instructions"],
};

const FULL_PLAN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    country: { type: Type.STRING },
    appetizer: MEAL_PART_SCHEMA,
    sideDish: MEAL_PART_SCHEMA,
    mainCourse: MEAL_PART_SCHEMA,
    drink: MEAL_PART_SCHEMA,
    shoppingList: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          items: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ["category", "items"],
      },
    },
  },
  required: ["country", "appetizer", "sideDish", "mainCourse", "drink", "shoppingList"],
};

const createConstraintPrompt = (constraints: MealConstraints) => {
  const active = [];
  if (constraints.glutenFree) active.push("Gluten Free");
  if (constraints.lowCarb) active.push("Low Carb");
  if (constraints.noAlcohol) active.push("No Alcohol");
  if (constraints.noCoffee) active.push("No Coffee");
  return active.length > 0 ? `Constraints: ${active.join(", ")}.` : "";
};

export async function generateFullMealPlan(country: string, constraints: MealConstraints): Promise<FullMealPlan> {
  const constraintText = createConstraintPrompt(constraints);
  const prompt = `Plan a traditional 4-course meal from ${country}. 
    The meal must include: 
    1. An Appetizer 
    2. A Side Dish 
    3. A Main Course 
    4. A Drink. 
    ${constraintText}
    Provide a unified, categorized shopping list for all items. Ensure the recipes are authentic yet accessible.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: FULL_PLAN_SCHEMA,
      systemInstruction: "You are a Michelin-star chef and world traveler. You specialize in authentic international cuisines and dietary adaptations.",
    },
  });

  return JSON.parse(response.text);
}

export async function swapMealPart(
  country: string, 
  category: string, 
  currentName: string, 
  constraints: MealConstraints,
  guidance?: string
): Promise<MealPart> {
  const constraintText = createConstraintPrompt(constraints);
  const guidanceText = guidance ? `The user would like the new dish to be related to: "${guidance}".` : "The replacement must be distinct from the previous one but still authentic to the culture.";
  
  const prompt = `Suggest a different ${category} from ${country} to replace "${currentName}". 
    ${constraintText}
    ${guidanceText}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: MEAL_PART_SCHEMA,
      systemInstruction: "You are a culinary expert providing a single meal part replacement. Ensure authenticity to the specified country.",
    },
  });

  const parsed = JSON.parse(response.text);
  return { ...parsed, id: category };
}

export async function updateShoppingList(plan: FullMealPlan): Promise<FullMealPlan["shoppingList"]> {
  const prompt = `Based on these 4 dishes from ${plan.country}:
    1. ${plan.appetizer.name}: ${plan.appetizer.ingredients.join(", ")}
    2. ${plan.sideDish.name}: ${plan.sideDish.ingredients.join(", ")}
    3. ${plan.mainCourse.name}: ${plan.mainCourse.ingredients.join(", ")}
    4. ${plan.drink.name}: ${plan.drink.ingredients.join(", ")}
    Create a unified, categorized shopping list (e.g., Produce, Meat/Protein, Pantry, Spices). 
    Deduplicate common items like salt, oil, or onions.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            items: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["category", "items"],
        },
      },
    },
  });

  return JSON.parse(response.text);
}
