import React, { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';

import { LOGIN_USER } from '../graphql/mutations';

const LoginPage = () => {
    const navigate = useNavigate();
    const [uiError, setUiError] = useState('');

    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        onCompleted: (data) => {
            const businessErrors = data.login?.errors;

            if (businessErrors && businessErrors.length > 0) {
                setUiError(businessErrors[0].message);
                return;
            }

            if (data.login?.token) {
                localStorage.setItem('token', data.login.token);
                navigate('/books');
            }
        },
        onError: (error) => {
            setUiError(error.message || 'An unexpected error occurred.');
        }
    });

    const handleLogin = async (formData) => {
        setUiError('');
        const username = formData.get('username');
        const password = formData.get('password');

        try {
            await loginUser({ variables: { username, password } });
        } catch (err) {
            console.error("Mutation failed", err);
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-header">Welcome Back</h1>

            <div className="login-card">
                {uiError && (
                    <div className="login-error-alert" role="alert">
                        Error: {uiError}
                    </div>
                )}

                <form action={handleLogin} className="login-form">
                    <div>
                        <label htmlFor="username" className="login-label">Username</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            required
                            placeholder="Enter your username"
                            className="login-input"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="login-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            required
                            placeholder="Enter your password"
                            className="login-input"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="login-button"
                    >
                        {loading ? 'Signing in...' : 'Log In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;