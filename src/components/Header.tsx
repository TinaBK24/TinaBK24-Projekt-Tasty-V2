import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Header = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
            setSearchQuery("") // Очистити поле пошуку після відправки
        }
    }

    return (
        <header className="w-full">
            <NavLink to="/" className="">
                <img src="/img/Nav.png" alt="" className="w-30 mx-auto mb-16" />
            </NavLink>
            <h1 className="mb-6">Find a recipe, an idea, an inspiration...</h1>
            <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-auto mb-10">
                <input
                    type="text"
                    placeholder="Type something to search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-2 rounded-md bg-[#D4DFC7]/50 text-[#96C0B7] placeholder-[#96C0B7] ring-1 ring-[#878E88] w-80"
                    aria-label="Search for meals"
                />
                <button
                    type="submit"
                    className="py-2 px-6 bg-[#96C0B7] rounded-md flex items-center justify-center text-white"
                    aria-label="Perform search"
                >
                    Search
                </button>
            </form>
        </header>
    );
}

export default Header;