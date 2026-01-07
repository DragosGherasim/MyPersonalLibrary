import { Routes, Route } from 'react-router-dom'
import BooksPage from './pages/BooksPage'
import BookDetailsPage from './pages/BookDetailsPage'

function App() {
    return (
        <>
            <nav>
                <h1>My Personal Library</h1>
            </nav>

            <Routes>
                <Route path="/" element={<BooksPage />} />

                <Route path="/book/:id" element={<BookDetailsPage />} />
            </Routes>
        </>
    )
}

export default App