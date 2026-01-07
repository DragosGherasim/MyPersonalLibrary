import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';

import { GET_BOOK_DETAILS } from '../graphql/queries';

const BookDetailsPage = () => {
    const { id } = useParams();

    const { loading, error, data } = useQuery(GET_BOOK_DETAILS, {
        variables: { id: parseInt(id) }
    });

    if (loading) return <p style={{ padding: '20px' }}>Loading details...</p>;
    if (error) return <p style={{ padding: '20px', color: 'red' }}>Error: {error.message}</p>;

    const book = data.bookById;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>

            <Link
                to="/"
                style={{
                    display: 'inline-block',
                    marginBottom: '20px',
                    color: '#666',
                    textDecoration: 'none',
                    fontSize: '14px'
                }}
            >
                ← Back to Library
            </Link>

            <div style={{
                border: '1px solid #eee',
                borderRadius: '8px',
                padding: '30px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                backgroundColor: '#fff'
            }}>

                <h1 style={{ marginTop: 0, marginBottom: '10px', color: '#333' }}>
                    {book.title} <span style={{ fontWeight: 'normal', color: '#888', fontSize: '0.8em' }}>({book.year})</span>
                </h1>

                <h3 style={{ marginTop: 0, color: '#555', fontWeight: '500' }}>
                    Written by: <span style={{ color: '#0070f3' }}>{book.author?.name}</span>
                </h3>

                <div style={{ margin: '20px 0' }}>
                    <span style={{
                        backgroundColor: '#f4f4f4',
                        padding: '8px 12px',
                        borderRadius: '20px',
                        fontSize: '14px',
                        color: '#333'
                    }}>
                        Current Status: <strong>{book.status}</strong>
                    </span>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '30px 0' }} />


                <h4 style={{ marginBottom: '15px', color: '#333' }}>Other books by this author:</h4>

                {book.author?.books && book.author.books.length > 0 ? (
                    <ul style={{ paddingLeft: '20px', lineHeight: '1.6', color: '#555' }}>
                        {book.author.books.map((b, index) => (
                            <li key={index} style={{ marginBottom: '5px' }}>
                                {b.title}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ color: '#999', fontStyle: 'italic' }}>No other books found.</p>
                )}
            </div>
        </div>
    );
};

export default BookDetailsPage;