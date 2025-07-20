import { useParams } from "react-router-dom";
import MealsList from "../components/MealsList";
import { useEffect, useState } from "react";
import type { IMeal } from "../interfaces/IMeal";
import { fetchMealsByCategory } from "../lib/api/featches";

const Category = () => {
    const { categoryName } = useParams<{ categoryName: string }>();
    const [meals, setMeals] = useState<IMeal[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadMeals = async (categoryName: string) => {
        setLoading(true)
        setError(null)
        try {
            const data = await fetchMealsByCategory(categoryName)
            console.log("Category.tsx: Fetched meals data:", data)
            setMeals(data)
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(`Failed to fetch meals: ${err.message}`)
            } else {
                setError("Failed to fetch meals: An unknown error occurred.")
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        console.log("Category.tsx: useParams categoryName:", categoryName)
        if (categoryName) {
            loadMeals(categoryName)
        } else {
            setLoading(false)
            setError("Category name is missing.")
        }
    }, [categoryName])

    console.log("Category.tsx: Rendering MealsList with categoryName prop:", categoryName)

    return (
        <section>
            <h2>{`Everything ${categoryName}`}</h2>
            <MealsList key={categoryName} meals={meals} loading={loading} error={error} categoryName={categoryName} />
        </section>
    );
}

export default Category;