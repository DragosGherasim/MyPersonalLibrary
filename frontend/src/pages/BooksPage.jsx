import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { Link } from 'react-router-dom';

import { GET_BOOKS } from '../graphql/queries';

const BooksPage = () => {
    const [targetTitle, setTargetTitle] = useState("");

    const { loading, error, data } = useQuery(GET_BOOKS, {
        variables: {
            first: 5,
            where: { title: { contains: targetTitle } },
            order: [{ title: "ASC" }]
        }
    });

    if (loading) return <p style={{ padding: '20px' }}>Loading library...</p>;
    if (error) return <p style={{ padding: '20px', color: 'red' }}>Error: {error.message}</p>;

    const books = data?.books?.edges?.map(edge => edge.node) || [];

    const searchBook = (formData) => {
        const title = formData.get('title');
        setTargetTitle(title);
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ marginBottom: '20px', color: '#333' }}>My Books</h1>

            <form
                action={searchBook}
                style={{
                    display: 'flex',
                    gap: '10px',
                    marginBottom: '30px',
                    padding: '20px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px'
                }}
            >

                <input
                    type='text'
                    name='title'
                    placeholder='Search books by title...'
                    style={{
                        flex: 1,
                        padding: '12px 15px',
                        fontSize: '16px',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        outline: 'none'
                    }}
                />

                <button
                    type="submit"
                    style={{
                        padding: '12px 24px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        backgroundColor: '#0070f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                >
                    Search
                </button>
            </form>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {books.map((book) => (
                    <div key={book.id} style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ margin: '0 0 10px 0' }}>{book.title}</h3>
                        <p style={{ margin: '0 0 5px 0', color: '#666' }}>Author: <strong>{book.author?.name}</strong></p>
                        <Link
                            to={`/book/${book.id}`}
                            style={{ display: 'inline-block', marginTop: '10px', color: '#0070f3', textDecoration: 'none' }}
                        >
                            View Details →
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BooksPage;