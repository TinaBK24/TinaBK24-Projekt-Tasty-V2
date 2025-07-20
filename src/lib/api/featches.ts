import type { ICategory } from "../../interfaces/ICategory"
import type { IMeal } from "../../interfaces/IMeal"

export const BASIC_API_URL = "https://www.themealdb.com/api/json/v1/1/"

export const fetchCategories = async (): Promise<ICategory[]> => {
    const response = await fetch(`${BASIC_API_URL}categories.php`)
    const data = await response.json()
    return data.categories
}

export const fetchMealsByCategory = async (categoryName: string): Promise<IMeal[]> => {
    const response = await fetch(`${BASIC_API_URL}filter.php?c=${categoryName}`)
    const data: { meals: IMeal[] | null } = await response.json();
    return data.meals || [];
}

export const fetchMealById = async (mealId: string) => {
    const response = await fetch(`${BASIC_API_URL}lookup.php?i=${mealId}`)
    const data = await response.json()
    return data.meals ? data.meals[0] : null;
}

export const searchMealsByName = async (searchQuery: string): Promise<IMeal[]> => {
    const response = await fetch(`${BASIC_API_URL}search.php?s=${searchQuery}`)
    const data = await response.json()
    return data.meals || [];
}