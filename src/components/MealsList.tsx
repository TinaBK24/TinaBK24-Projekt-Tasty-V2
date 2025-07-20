import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { IMeal } from "../interfaces/IMeal";
import Loading from "./Loading";
import ErrorDisplay from "./ErrorDisplay";
import { NavLink, useLocation } from "react-router-dom";
import { truncateText } from '../lib/utils';

interface MealsListProps {
    meals: IMeal[] | null // Тепер meals передаються як пропс
    loading: boolean // Тепер loading передається як пропс
    error: string | null // Тепер error передається як пропс
    categoryName?: string | null // categoryName може бути null для пошуку

}

const MealsList: React.FC<MealsListProps> = ({ meals, loading, error, categoryName }) => {
    console.log("MealsList.tsx: Received categoryName prop:", categoryName)
    const location = useLocation()
    // Витягуємо categoryName безпосередньо з URL шляху
    // Припускаємо, що шлях завжди буде /categoryName або /categoryName/mealId
    const pathSegments = location.pathname.split("/").filter(Boolean)
    const currentCategoryFromPath = pathSegments.length > 0 && pathSegments[0] !== "search" ? pathSegments[0] : null

    // Log on initial render
    console.log("MealsList.tsx: Initial render - Received categoryName prop (from path):", currentCategoryFromPath)

    // Log when categoryName prop changes
    useEffect(() => {
        console.log("MealsList.tsx: categoryName prop (from path) CHANGED to:", currentCategoryFromPath)
    }, [currentCategoryFromPath])

    const [columns, setColumns] = useState(1);
    const gridRef = useRef<HTMLElement | null>(null);

    useLayoutEffect(() => {
        const container = gridRef.current;
        if (!container) return;

        const updateColumns = () => {
            const computedStyle = window.getComputedStyle(container);
            const templateColumns = computedStyle.getPropertyValue("grid-template-columns");

            if (templateColumns && templateColumns !== 'none') {
                const newColumnCount = templateColumns.split(' ').length;
                setColumns(newColumnCount);
            } else {
                setColumns(1);
            }
        };

        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (entry.target === container) {
                    updateColumns();
                }
            }
        });

        resizeObserver.observe(container);
        updateColumns(); // Викликаємо один раз одразу після спостереження

        return () => {
            resizeObserver.disconnect();
        };
    }, [meals]); // Додаємо meals в залежності, щоб ResizeObserver ініціалізувався після завантаження даних

    // Функція для визначення класу для шахматному порядку
    const getCheckerboardClass = (index: number) => {
        const currentColumns = columns > 0 ? columns : 1;
        const row = Math.floor(index / currentColumns);
        const col = index % currentColumns;

        return (row + col) % 2 === 0 ? 'even' : 'odd';
    };

    if (loading) {
        return (<Loading />);
    }

    if (error) {
        // onRetry логіка тепер повинна бути оброблена батьківським компонентом
        return <ErrorDisplay errorMessage={error} onRetry={undefined} />
    }

    if (!meals || meals.length === 0) {
        return (
            <section className="flex justify-center items-center h-48">
                <p className="text-lg text-gray-600">No meals found.</p>
            </section>
        )
    }

    return (
        <>
            <section
                className="grid-layout-meal grid gap-5 pt-5"
                ref={gridRef}
            >
                {meals.map((meal, index) => {
                    console.log(
                        `MealsList.tsx: Meal ID: ${meal.idMeal}, meal.strCategory: ${meal.strCategory}, categoryName prop: ${categoryName}`,
                    ) // ДОДАЙТЕ ЦЕЙ ЛОГ
                    const targetCategory = categoryName || meal.strCategory || "unknown"
                    console.log(`MealsList.tsx: Generated NavLink to: /${targetCategory}/${meal.idMeal}`) // ДОДАЙТЕ ЦЕЙ ЛОГ
                    return (
                        <NavLink
                            key={meal.idMeal}
                            to={`/${categoryName || meal.strCategory}/${meal.idMeal}`}
                            className="w-[300px]"
                        >
                            <div
                                className={`chess-board ${getCheckerboardClass(index)} w-[300px] h-full text-decoration-none rounded-lg p-8 flex flex-col justify-between`}
                            >
                                <h3 className="mb-4">{truncateText(meal.strMeal, 40)}</h3>
                                <img
                                    src={meal.strMealThumb || "/placeholder.svg"}
                                    alt={meal.strMeal}
                                    className="w-full h-max object-contain rounded-sm"
                                />
                            </div>
                        </NavLink>
                    )
                })}
            </section></>
    );
}


export default MealsList;