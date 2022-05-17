import axios from "axios";
import {Food, FoodInstruction} from "../types/Food";

// ingredients=apples,+flour,+sugar&number=2

const apiClient = axios.create({
  baseURL: "https://api.spoonacular.com/recipes",
  headers: {
    "Content-type": "application/json",
  },
});

const getIngredients = async (ingredients: string, number: number) => {
  const pathStr = `/findByIngredients?apiKey=b505bf1553be45f19f2f28eb2611b1ff&ingredients=${ingredients}&number=${number}`;
  const response = await apiClient.get<Food>(pathStr);
  return response.data;
}

const getAnalyzedRecipeInstructions = async (id:number) => {
  const pathStr = `/${id}/analyzedInstructions?apiKey=b505bf1553be45f19f2f28eb2611b1ff`;
  const response = await apiClient.get<FoodInstruction>(pathStr);
  return response.data;
}

const FoodService = {
    getIngredients,
    getAnalyzedRecipeInstructions,
}

export default FoodService;