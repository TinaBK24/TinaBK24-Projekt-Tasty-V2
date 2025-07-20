import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import type { IMeal } from "../interfaces/IMeal";
import { fetchMealById } from "../lib/api/featches";
import Loading from "../components/Loading";
import ErrorDisplay from "../components/ErrorDisplay";

const MealDetails = () => {
    const { mealId } = useParams<{ mealId: string }>();
    const [mealDetails, setMealDetails] = useState<IMeal | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadMealDetails = async (mealId: string) => {
        setLoading(true);
        setError(null);
        console.log("MealDetails useEffect triggered for fetching data");
        try {
            const data = await fetchMealById(mealId);
            if (data) {
                setMealDetails(data);
            } else {
                setError("Meal not found."); // Якщо API повернуло null
            }
        } catch (err: any) {
            setError(`Failed to fetch meals: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (mealId) { // Завантажуємо страви тільки якщо mealId визначена
            loadMealDetails(mealId);
        } else {
            setLoading(false);
            setError("Meal ID is missing.");
        }
    }, [mealId]);

    // Функція для отримання списку інгредієнтів та їх мір
    const getIngredientsAndMeasures = (mealData: IMeal) => {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = (mealData as any)[`strIngredient${i}`];
            const measure = (mealData as any)[`strMeasure${i}`];
            if (ingredient && ingredient.trim() !== "") {
                ingredients.push(`${measure || ""} ${ingredient}`);
            }
        }
        return ingredients;
    };


    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <ErrorDisplay errorMessage={error} onRetry={mealId ? () => loadMealDetails(mealId) : undefined} />;
    }

    if (!mealDetails) { // Якщо дані не завантажились або страви не знайдено
        return (
            <section className="flex justify-center items-center h-48">
                <p className="text-lg text-gray-600">Meal details not available.</p>
            </section>
        );
    }

    const ingredientsList = getIngredientsAndMeasures(mealDetails);
    const youtubeEmbedUrl = mealDetails.strYoutube
        ? mealDetails.strYoutube.replace("watch?v=", "embed/")
        : null;

    // Розділяємо інструкції на окремі речення/абзаци
    const instructionsSentences = mealDetails.strInstructions
        ? mealDetails.strInstructions
            .split("\n") // Спочатку розділяємо за переносами рядків
            .flatMap((paragraph) => paragraph.split(". ").filter(Boolean)) // Потім кожен абзац за ". " та фільтруємо порожні
            .filter((sentence) => sentence.trim() !== "") // Додаткова фільтрація порожніх рядків
        : []

    return (
        <>
            <section className="bg-[#96C0B7] p-8 rounded-lg shadow-md">
                <div className="h-125 overflow-hidden flex justify-center items-center">
                    <img
                        src={mealDetails.strMealThumb || "/placeholder.svg?height=400&width=400&query=meal-detail"}
                        alt={mealDetails.strMeal}
                        className="w-full"
                    />
                </div>

                <div className="mt-6 flex justify-between gap-8">
                    <div className="flex-3">
                        <h4>{mealDetails.strMeal}</h4>
                        <ul className="list-disc list-inside space-y-1 text-white">
                            {instructionsSentences.map((sentence, index) => (
                                <li
                                    key={index}
                                    className="font-thin"
                                >
                                    {sentence.trim()}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex-1">
                        <h4>Ingredients</h4>
                        <ul className="list-inside space-y-1 text-white mb-4">
                            {ingredientsList.map((item, index) => (
                                <li
                                    key={index}
                                    className="font-thin"
                                >{item}</li>
                            ))}
                        </ul>

                        {youtubeEmbedUrl && (
                            <NavLink
                                to={youtubeEmbedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-[#96C0B7] px-6 py-4 rounded-2xl inline-block font-bold"
                            >Watch on YouTube</NavLink>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default MealDetails;