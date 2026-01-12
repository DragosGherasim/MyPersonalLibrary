import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { Link } from 'react-router-dom';

import { GET_MY_LIBRARY } from '../graphql/queries';
import EditBookModal from "../components/EditBookModal.jsx";

const MyLibraryPage = () => {
    const [targetTitle, setTargetTitle] = useState("");
    const [editingBook, setEditingBook] = useState(null);

    const [pagination, setPagination] = useState({
        cursor: null,
        page: 1,
        history: []
    });

    const PAGE_SIZE = 5;

    const { loading, error, data, refetch } = useQuery(GET_MY_LIBRARY, {
        variables: {
            first: PAGE_SIZE,
            after: pagination.cursor,
            where: targetTitle ? { book: { title: { contains: targetTitle } } } : {},
            order: [{ book: { title: "ASC" } }]
        }
    });

    const userBooks = data?.myLibrary?.edges?.map(edge => edge.node) || [];
    const pageInfo = data?.myLibrary?.pageInfo || {}; // Get connection info


    const handleSearchSubmit = (formData) => {
        const titleInput = formData.get('title');
        setTargetTitle(titleInput || "");

        setPagination({ cursor: null, page: 1, history: [] });
    };

    const handleNextPage = () => {
        if (pageInfo.hasNextPage) {
            setPagination(prev => ({
                cursor: pageInfo.endCursor,
                page: prev.page + 1,
                history: [...prev.history, prev.cursor]
            }));
        }
    };

    const handlePrevPage = () => {
        if (pagination.page > 1) {
            setPagination(prev => {
                const newHistory = [...prev.history];
                const prevCursor = newHistory.pop();
                return {
                    cursor: prevCursor,
                    page: prev.page - 1,
                    history: newHistory
                };
            });
        }
    };

    if (loading) return <div className="page-container"><p>Loading library...</p></div>;
    if (error) return <div className="page-container"><div className="login-error-alert">Error: {error.message}</div></div>;

    return (
        <div className="page-container">
            <h1 className="page-header">My Books</h1>
            <Link to="/books/new" style={{ display: "inline-block", marginBottom: 16 }}>
                + Add book
            </Link>

            <form action={handleSearchSubmit} className="search-form">
                <input
                    type='text'
                    name='title'
                    placeholder='Search books by title...'
                    className="search-input"
                    defaultValue={targetTitle}
                />
                <button type="submit" className="btn-primary">Search</button>
            </form>

            <div className="book-grid">
                {userBooks.map((node) => (
                    <div key={node.bookId} className="book-list-item">
                        <h3>{node.book.title}</h3>
                        <p>Author: <strong>{node.book.author?.name}</strong></p>
                        <p>Status: <strong>{node.status}</strong></p>

                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                            <Link
                                to={`/books/${node.bookId}`}
                                className="btn-primary"
                                style={{ textDecoration: 'none', fontSize: '14px', padding: '8px 12px' }}
                            >
                                View Details
                            </Link>

                            <button
                                onClick={() => setEditingBook(node)}
                                className="btn-secondary"
                            >
                                Edit / Remove
                            </button>
                        </div>
                    </div>
                ))}

                {userBooks.length === 0 && (
                    <p className="text-subtle" style={{ fontStyle: 'italic', padding: '20px', textAlign: 'center' }}>
                        No books found.
                    </p>
                )}
            </div>

            {userBooks.length > 0 && (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '20px',
                    marginTop: '30px',
                    paddingTop: '20px',
                    borderTop: '1px solid #eee'
                }}>
                    <button
                        onClick={handlePrevPage}
                        disabled={pagination.page === 1}
                        className="btn-secondary"
                        style={{ opacity: pagination.page === 1 ? 0.5 : 1 }}
                    >
                        ← Previous
                    </button>

                    <span style={{ fontWeight: 'bold', color: '#555' }}>
                        Page {pagination.page}
                    </span>

                    <button
                        onClick={handleNextPage}
                        disabled={!pageInfo.hasNextPage}
                        className="btn-secondary"
                        style={{ opacity: !pageInfo.hasNextPage ? 0.5 : 1 }}
                    >
                        Next →
                    </button>
                </div>
            )}

            {editingBook && (
                <EditBookModal
                    bookNode={editingBook}
                    onClose={() => setEditingBook(null)}
                    onSuccess={() => {
                        setEditingBook(null);
                        refetch();
                    }}
                />
            )}
        </div>
    );
};

export default MyLibraryPage;