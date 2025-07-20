"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import type { IMeal } from "../interfaces/IMeal"
import { searchMealsByName } from "../lib/api/featches"
import MealsList from "../components/MealsList"

export default function SearchResults() {
    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get("q") || ""

    const [meals, setMeals] = useState<IMeal[] | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchSearchResults = async () => {
            setLoading(true)
            setError(null)
            if (!searchQuery) {
                setMeals([])
                setLoading(false)
                return
            }
            try {
                const data = await searchMealsByName(searchQuery)
                setMeals(data)
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(`Failed to fetch search results: ${err.message}`)
                } else {
                    setError("Failed to fetch search results: An unknown error occurred.")
                }
            } finally {
                setLoading(false)
            }
        }

        fetchSearchResults()
    }, [searchQuery])

    return (
        <section>
            <h2>Search Results for "{searchQuery}"</h2>
            <MealsList meals={meals} loading={loading} error={error} />
        </section>
    )
}
