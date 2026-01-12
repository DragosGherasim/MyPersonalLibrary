import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';

import { UPDATE_BOOK_STATUS_MUTATION, REMOVE_BOOK_FROM_LIBRARY_MUTATION } from '../graphql/mutations';

const EditBookModal = ({ bookNode, onClose, onSuccess }) => {
    const [status, setStatus] = useState(bookNode.status);
    const [showConfirm, setShowConfirm] = useState(false);

    const [updateStatus, { loading: updating }] = useMutation(UPDATE_BOOK_STATUS_MUTATION, {
        onCompleted: () => onSuccess(),
        onError: (err) => alert(err.message)
    });

    const [removeBook, { loading: removing }] = useMutation(REMOVE_BOOK_FROM_LIBRARY_MUTATION, {
        onCompleted: () => onSuccess(),
        onError: (err) => alert(err.message)
    });

    const handleSaveStatus = () => {
        updateStatus({
            variables: { bookId: bookNode.bookId, status: status }
        });
    };

    const handleConfirmDelete = () => {
        removeBook({
            variables: { bookId: bookNode.bookId }
        });
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {!showConfirm ? (
                    <>
                        <h2 style={{ marginTop: 0 }}>Edit "{bookNode.book.title}"</h2>
                        <div style={{ marginBottom: '20px' }}>
                            <label className="login-label">Update Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="login-input"
                            >
                                <option value="WANT_TO_READ">Want to Read</option>
                                <option value="READING">Reading</option>
                                <option value="FINISHED">Finished</option>
                            </select>
                            <button
                                onClick={handleSaveStatus}
                                className="btn-primary"
                                style={{ marginTop: '10px', width: '100%' }}
                                disabled={updating}
                            >
                                {updating ? 'Saving...' : 'Save New Status'}
                            </button>
                        </div>
                        <hr className="divider" />
                        <div style={{ marginTop: '20px' }}>
                            <button onClick={() => setShowConfirm(true)} className="btn-danger">
                                Remove from Library
                            </button>
                        </div>
                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}>
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ color: '#dc3545', marginTop: 0 }}>Are you sure?</h2>
                        <p style={{ color: '#555', marginBottom: '25px' }}>
                            Do you really want to remove <strong>{bookNode.book.title}</strong> from your library?
                            <br/>
                            <span style={{ fontSize: '0.9em', color: '#888' }}>This action cannot be undone.</span>
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button onClick={() => setShowConfirm(false)} className="btn-secondary" disabled={removing}>
                                No, Cancel
                            </button>
                            <button onClick={handleConfirmDelete} className="btn-danger" style={{ width: 'auto' }} disabled={removing}>
                                {removing ? 'Removing...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditBookModal;