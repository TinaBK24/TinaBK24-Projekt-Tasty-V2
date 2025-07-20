import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Category from './pages/Category'
import MealDetails from './pages/MealDetails'
import RootLayout from './RootLayout'
import SearchResults from './pages/SearchResults'

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path=":categoryName" element={<Category />} />
          <Route path=":categoryName/:mealId" element={<MealDetails />} />
          <Route path="/search" element={<SearchResults />} />
        </Route>
      </>,
    )
  )

  return (
    <>
      <div>
        <RouterProvider router={router} />
      </div>
    </>
  )
}

export default App
