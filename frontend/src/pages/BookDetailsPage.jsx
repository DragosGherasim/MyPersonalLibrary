import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';

import { GET_BOOK_DETAILS } from '../graphql/queries';

const BookDetailsPage = () => {
    const { id } = useParams();

    const { loading, error, data } = useQuery(GET_BOOK_DETAILS, {
        variables: { id: parseInt(id) }
    });

    if (loading) return <div className="page-container"><p>Loading details...</p></div>;

    if (error) return (
        <div className="page-container">
            <div className="login-error-alert">Error: {error.message}</div>
        </div>
    );

    const book = data?.bookById;

    if (!book) return <div className="page-container"><p>Book not found.</p></div>;

    return (
        <div className="page-container">
            <Link to="/books" className="link-back">
                ← Back to Library
            </Link>

            <div className="login-card">
                <h1 className="details-title">
                    {book.title}
                </h1>

                <p className="details-meta">
                    by <strong className="text-highlight">{book.author?.name}</strong>
                    <span style={{ margin: '0 8px', color: '#ccc' }}>|</span>
                    {book.year}
                </p>

                <hr className="divider" />

                <div style={{ marginBottom: '30px' }}>
                    <h3 style={{ marginBottom: '10px', color: '#444' }}>About this Book</h3>
                    <p style={{ lineHeight: '1.6', color: '#555', fontSize: '1rem' }}>
                        {book.description || "No description available for this book."}
                    </p>
                </div>

                <div className="more-books-section">
                    <h4 style={{ marginTop: 0, marginBottom: '10px', color: '#333' }}>
                        More from {book.author?.name}:
                    </h4>

                    {book.author?.books && book.author.books.length > 1 ? (
                        <ul className="more-books-list">
                            {book.author.books
                                .filter(b => b.title !== book.title)
                                .map((b, index) => (
                                    <li key={index} style={{ marginBottom: '5px' }}>
                                        {b.title}
                                    </li>
                                ))
                            }
                        </ul>
                    ) : (
                        <p className="text-subtle" style={{ fontSize: '0.9em' }}>
                            No other books listed.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookDetailsPage;