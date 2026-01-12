import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { Link } from 'react-router-dom';
import { CREATE_AUTHOR_MUTATION, ADD_BOOK_MUTATION } from '../graphql/mutations';

const AddBookPage = () => {
  const [authorName, setAuthorName] = useState('');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [description, setDescription] = useState('');

  const [successMessage, setSuccessMessage] = useState('');
  const [formErrors, setFormErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createAuthor] = useMutation(CREATE_AUTHOR_MUTATION);
  const [addBook] = useMutation(ADD_BOOK_MUTATION);

  const handleCombinedSubmit = async () => {
    setSuccessMessage('');
    setFormErrors([]);
    setIsSubmitting(true);

    try {
      const authorResponse = await createAuthor({
        variables: { name: authorName }
      });

      const authorErrors = authorResponse.data.createAuthor.errors;
      if (authorErrors && authorErrors.length > 0) {
        setFormErrors(authorErrors.map(err => `Author Error: ${err.message}`));
        setIsSubmitting(false);
        return;
      }

      const newAuthor = authorResponse.data.createAuthor.authorPayload.author;
      const newAuthorId = newAuthor.id;

      const bookResponse = await addBook({
        variables: {
          title: title,
          year: parseInt(year),
          description: description,
          authorId: newAuthorId
        }
      });

      const bookErrors = bookResponse.data.addBook.errors;
      if (bookErrors && bookErrors.length > 0) {
        setFormErrors(bookErrors.map(err => `Book Error: ${err.message}`));
      } else {
        setSuccessMessage(`Success! Added "${bookResponse.data.addBook.book.title}" by ${newAuthor.name}.`);
        setAuthorName('');
        setTitle('');
        setDescription('');
      }

    } catch (err) {
      setFormErrors([err.message || "An unexpected error occurred."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="page-container">
        <Link to="/books" className="link-back">
          ← Back to Library
        </Link>

        <h1 className="page-header">Add New Book</h1>

        {successMessage && (
            <div
                className="login-error-alert"
                style={{ backgroundColor: '#d4edda', borderColor: '#c3e6cb', color: '#155724' }}
            >
              {successMessage}
            </div>
        )}

        {formErrors.length > 0 && (
            <div className="login-error-alert">
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {formErrors.map((err, idx) => <li key={idx}>{err}</li>)}
              </ul>
            </div>
        )}

        {/* --- Single Form for Both Steps --- */}
        <div className="login-card">
          <form action={handleCombinedSubmit} className="login-form">

            <h2 className="details-title" style={{ fontSize: '1.2rem', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              1. Author Details
            </h2>

            <div>
              <label className="login-label">Author Name</label>
              <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="login-input"
                  placeholder="e.g. J.R.R. Tolkien"
                  required
                  disabled={isSubmitting}
              />
            </div>

            <h2 className="details-title" style={{ fontSize: '1.2rem', borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: '20px' }}>
              2. Book Details
            </h2>

            <div>
              <label className="login-label">Book Title</label>
              <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="login-input"
                  placeholder="e.g. The Hobbit"
                  required
                  disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="login-label">Year</label>
              <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="login-input"
                  required
                  disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="login-label">Description</label>
              <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="login-input"
                  rows="3"
                  style={{ fontFamily: 'Arial, sans-serif' }}
                  disabled={isSubmitting}
              />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
                style={{ marginTop: '20px', width: '100%', padding: '15px' }}
            >
              {isSubmitting ? 'Processing...' : 'Add Book to Library'}
            </button>
          </form>
        </div>
      </div>
  );
};

export default AddBookPage;