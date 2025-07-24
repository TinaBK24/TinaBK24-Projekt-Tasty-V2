import { useEffect, useState, useLayoutEffect, useRef } from "react";
import type { ICategory } from "../interfaces/ICategory";
import { fetchCategories } from "../lib/api/featches";
import { NavLink, useNavigate } from "react-router-dom";
import Loading from "./Loading";
import ErrorDisplay from "./ErrorDisplay";

const CategoriesList = () => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [columns, setColumns] = useState(1);
    const gridRef = useRef<HTMLElement>(null);
    const navigate = useNavigate();


    // Визначаємо статичний об'єкт для "Random" (рандомної категорії)
    // Він буде доданий в кінець списку
    const randomCategory: ICategory = {
        idCategory: "random", // Унікальний ID для цього елемента
        strCategory: "Random",
        strCategoryThumb: null,
        strCategoryDescription: null,
    };

    // Функція для завантаження категорій, яку можна викликати повторно
    const loadCategories = () => {
        setLoading(true); // Починаємо завантаження
        setError(null);   // Скидаємо помилку
        console.log("CategoriesList useEffect triggered for fetching data");
        fetchCategories()
            .then((data) => {
                console.log("Successfully fetched categories:", data);
                setCategories([...data, randomCategory]);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error in CategoriesList:", err);
                setError(`Failed to fetch categories: ${err.message}`);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadCategories(); // Викликаємо функцію завантаження при монтуванні
    }, []);

    // useLayoutEffect: Розрахунок кількості стовпців за допомогою ResizeObserver
    useLayoutEffect(() => {
        const container = gridRef.current;
        if (!container) return;

        const updateColumns = () => {
            const computedStyle = window.getComputedStyle(container);
            const templateColumns = computedStyle.getPropertyValue("grid-template-columns");
            console.log("Computed grid-template-columns:", templateColumns);

            if (templateColumns && templateColumns !== 'none') {
                const newColumnCount = templateColumns.split(' ').length;
                console.log("Calculated newColumnCount:", newColumnCount);
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
    }, [categories]); // Додаємо categories в залежності, щоб ResizeObserver ініціалізувався після завантаження даних

    console.log("Current state:", { categories, loading, error, columns });

    // Функція для визначення класу для шахматному порядку
    const getCheckerboardClass = (index: number) => {
        const currentColumns = columns > 0 ? columns : 1;
        const row = Math.floor(index / currentColumns);
        const col = index % currentColumns;

        return (row + col) % 2 === 0 ? 'even' : 'odd';
    };

    // Обробник кліку для "Random"
    const handleRandomClick = () => {
        // Фільтруємо, щоб отримати лише реальні категорії (без "Random" елемента)
        const realCategories = categories.filter(cat => cat.idCategory !== "random");

        if (realCategories.length > 0) {
            const randomIndex = Math.floor(Math.random() * realCategories.length);
            const randomCategory = realCategories[randomIndex];
            // Перенаправляємо на сторінку випадкової категорії
            navigate(`/${randomCategory.strCategory.toLowerCase()}`);
        } else {
            console.warn("No categories available to pick a random one.");
            // Можливо, показати тост або повідомлення користувачу
        }
    };

    if (loading) {
        return (<Loading />);
    }

    if (error) {
        return (<ErrorDisplay errorMessage={error} onRetry={loadCategories} />);
    }

    if (categories.length === 0 && !loading) {
        return (
            <section>
                <p>No categories found</p>
            </section>
        );
    }

    return (
        <>
            <section
                className="grid-layout-category grid gap-5 pt-5"
                ref={gridRef}
            >
                {categories.map((category, index) => {
                    // Якщо це елемент "Random", використовуємо div з onClick
                    if (category.idCategory === "random") {
                        return (
                            <div
                                key={category.idCategory}
                                className={`category-card chess-board ${getCheckerboardClass(index)} min-h-[200px]`}
                                onClick={handleRandomClick}
                                style={{ cursor: 'pointer' }} // Додаємо курсор для візуального підтвердження клікабельності
                            >

                                <h3 className="my-auto">{category.strCategory}</h3>
                                {category.strCategoryThumb && (
                                    <img src={category.strCategoryThumb || "/placeholder.svg"} alt={category.strCategory} />
                                )}
                            </div>
                        );
                    }
                    // Для всіх інших категорій використовуємо NavLink
                    return (
                        <NavLink
                            key={category.idCategory}
                            to={`/${category.strCategory.toLowerCase()}`}
                            className="w-[250px]"
                        >
                            <div className={`category-card chess-board ${getCheckerboardClass(index)}`}>
                                <h3>{category.strCategory}</h3>
                                <img
                                    src={category.strCategoryThumb || "/placeholder.svg"}
                                    alt={category.strCategory}
                                    className="w-full h-32 object-contain rounded-sm"
                                />
                            </div>
                        </NavLink>
                    );
                })}
            </section>
        </>
    );
};

export default CategoriesList;