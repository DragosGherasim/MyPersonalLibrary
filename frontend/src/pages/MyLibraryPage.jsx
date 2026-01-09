import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { Link } from 'react-router-dom';

import { GET_MY_LIBRARY } from '../graphql/queries';

const MyLibraryPage = () => {
    const [targetTitle, setTargetTitle] = useState("");

    const { loading, error, data } = useQuery(GET_MY_LIBRARY, {
        variables: {
            first: 5,
            where: targetTitle
                ? { book: { title: { contains: targetTitle } } }
                : {},
            order: [{ bookId: "DESC" }]
        }
    });

    if (loading) return <div className="page-container"><p>Loading library...</p></div>;

    if (error) return (
        <div className="page-container">
            <div className="login-error-alert">Error: {error.message}</div>
        </div>
    );

    const userBooks = data?.myLibrary?.edges?.map(edge => edge.node) || [];

    const searchBook = (e) => {
        e.preventDefault(); // Prevent page reload
        const formData = new FormData(e.currentTarget);
        setTargetTitle(formData.get('title'));
    }

    return (
        <div className="page-container">
            <h1 className="page-header">My Books</h1>

            <form onSubmit={searchBook} className="search-form">
                <input
                    type='text'
                    name='title'
                    placeholder='Search books by title...'
                    className="search-input"
                />
                <button type="submit" className="btn-primary">
                    Search
                </button>
            </form>

            <div className="book-grid">
                {userBooks.map((node) => (
                    <div key={node.bookId} className="book-list-item">
                        <h3>{node.book.title}</h3>
                        <p>Author: <strong>{node.book.author?.name}</strong></p>
                        <p>Status: <strong>{node.status}</strong></p>
                        <Link
                            to={`/books/${node.bookId}`}
                            className="link-action"
                        >
                            View Details →
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyLibraryPage;