import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ErrorPage.css';

interface ErrorPageProps {
    statusCode?: number;
    errorId?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
    statusCode = 404,
    errorId = Math.random().toString(36).substring(7).toUpperCase()
}) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const messages = [
        "Something got lost in the digital void",
        "The page took an unexpected detour",
        "We stumbled into uncharted territory",
        "Reality glitched for a moment",
        "The path less traveled led us here",
        "This page decided to go on an adventure",
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    const handleGoHome = () => {
        setIsLoading(true);
        setTimeout(() => navigate('/'), 600);
    };

    const handleGoBack = () => {
        setIsLoading(true);
        setTimeout(() => navigate(-1), 600);
    };

    return (
        <div className="error-page-container">
            {/* Animated background elements */}
            <div className="error-background">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
                <div
                    className="cursor-follow"
                    style={{
                        left: `${mousePos.x}px`,
                        top: `${mousePos.y}px`,
                    }}
                ></div>
            </div>

            {/* Main content */}
            <div className={`error-content ${isLoading ? 'fade-out' : ''}`}>
                {/* Animated status code */}
                <div className="error-code-container">
                    <div className="error-code">
                        {String(statusCode)
                            .split('')
                            .map((char, i) => (
                                <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                                    {char}
                                </span>
                            ))}
                    </div>
                </div>

                {/* Message */}
                <div className="error-message-wrapper">
                    <h1 className="error-message">{randomMessage}</h1>
                    <p className="error-details">Reference code: <code>{errorId}</code></p>
                </div>

                {/* Action buttons */}
                <div className="error-actions">
                    <button
                        onClick={handleGoHome}
                        className="error-btn error-btn-primary"
                        disabled={isLoading}
                    >
                        <span className="btn-text">Back to Home</span>
                        <span className="btn-arrow">→</span>
                    </button>
                    <button
                        onClick={handleGoBack}
                        className="error-btn error-btn-secondary"
                        disabled={isLoading}
                    >
                        <span className="btn-text">Go Back</span>
                        <span className="btn-arrow">←</span>
                    </button>
                </div>

                {/* Footer note */}
                <p className="error-footer">
                    Don't worry, our team has been notified and is on it
                </p>
            </div>

            {/* Glitch effect overlay */}
            <div className="glitch-effect"></div>
        </div>
    );
};

export default ErrorPage;
