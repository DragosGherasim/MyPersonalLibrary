import { Routes, Route } from 'react-router-dom'

import './App.css'

import MyLibraryPage from './pages/MyLibraryPage.jsx'
import BookDetailsPage from './pages/BookDetailsPage'
import LoginPage from "./pages/LoginPage.jsx";
import AddBookPage from "./pages/AddBookPage";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/books" element={<MyLibraryPage />} />
                <Route path="/books/:id" element={<BookDetailsPage />} />
                <Route path="/books/new" element={<AddBookPage />} />
            </Routes>
        </>
    )
}

export default App