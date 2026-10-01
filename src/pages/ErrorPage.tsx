import React, { useEffect, useState } from 'react';
import {
    useNavigate,
    useRouteError,
    isRouteErrorResponse,
    useInRouterContext,
} from 'react-router-dom';
import './ErrorPage.css';
import {
    isChunkLoadError,
    tryAutoReloadForChunkError,
    clearChunkReloadState,
} from '../utils/chunkRetry';

export interface ErrorPageProps {
    statusCode?: number;
    errorId?: string;
    message?: string;
    onRetry?: () => void;
}

interface ErrorPageContentProps extends ErrorPageProps {
    routeError?: unknown;
    navigate?: ((to: any) => void) | null;
}

const ERROR_404_MESSAGES = [
    "Something got lost in the digital void",
    "The page took an unexpected detour",
    "We stumbled into uncharted territory",
    "Reality glitched for a moment",
    "The path less traveled led us here",
    "This page decided to go on an adventure",
];

const ErrorPageContent: React.FC<ErrorPageContentProps> = ({
    statusCode: propStatusCode,
    errorId: propErrorId,
    message: propMessage,
    onRetry,
    routeError,
    navigate,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [random404] = useState(
        () => ERROR_404_MESSAGES[Math.floor(Math.random() * ERROR_404_MESSAGES.length)]
    );
    const [displayErrorId] = useState(
        () => propErrorId || Math.random().toString(36).substring(7).toUpperCase()
    );

    const isChunk = isChunkLoadError(routeError);

    // If a chunk loading error occurs, automatically attempt a reload
    // to fetch the fresh bundle without requiring user intervention.
    useEffect(() => {
        if (isChunk && routeError) {
            tryAutoReloadForChunkError(routeError);
        }
    }, [isChunk, routeError]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Resolve status code
    let displayStatusCode = propStatusCode || 404;
    let displayMessage = propMessage || random404;

    if (propStatusCode) {
        displayStatusCode = propStatusCode;
        if (!propMessage) {
            if (propStatusCode === 404) displayMessage = random404;
            else if (propStatusCode === 503) displayMessage = "Service temporarily unavailable or updating";
            else displayMessage = "An unexpected error occurred";
        }
    } else if (isChunk) {
        displayStatusCode = 503;
        displayMessage =
            propMessage ||
            "A new update was deployed or your connection was interrupted. Please reload.";
    } else if (isRouteErrorResponse(routeError)) {
        displayStatusCode = routeError.status;
        displayMessage =
            propMessage ||
            routeError.statusText ||
            (routeError.data as { message?: string })?.message ||
            random404;
    } else if (routeError instanceof Error) {
        displayStatusCode = 500;
        displayMessage =
            propMessage || "Something went wrong while displaying this page.";
    }

    const isFailureState = isChunk || displayStatusCode >= 500;

    const handleReload = () => {
        setIsLoading(true);
        clearChunkReloadState();
        setTimeout(() => {
            if (onRetry) {
                onRetry();
            } else {
                window.location.reload();
            }
        }, 300);
    };

    const handleGoHome = () => {
        setIsLoading(true);
        setTimeout(() => {
            const hasAuth =
                typeof window !== 'undefined' &&
                (localStorage.getItem('token') ||
                    localStorage.getItem('accessToken') ||
                    localStorage.getItem('access_token') ||
                    localStorage.getItem('auth-storage'));
            const destination = hasAuth ? '/feed' : '/';

            if (navigate) {
                navigate(destination);
            } else {
                window.location.href = destination;
            }
        }, 300);
    };

    const handleGoBack = () => {
        setIsLoading(true);
        setTimeout(() => {
            if (navigate) {
                navigate(-1);
            } else {
                window.history.back();
            }
        }, 300);
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
                        {String(displayStatusCode)
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
                    <h1 className="error-message">{displayMessage}</h1>
                    <p className="error-details">
                        Reference code: <code>{displayErrorId}</code>
                    </p>
                </div>

                {/* Action buttons */}
                <div className="error-actions">
                    {isFailureState ? (
                        <>
                            <button
                                type="button"
                                onClick={handleReload}
                                className="error-btn error-btn-primary"
                                disabled={isLoading}
                            >
                                <span className="btn-text">Reload App</span>
                                <span className="btn-arrow">&#8635;</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleGoHome}
                                className="error-btn error-btn-secondary"
                                disabled={isLoading}
                            >
                                <span className="btn-text">Back to Home</span>
                                <span className="btn-arrow">&rarr;</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={handleGoHome}
                                className="error-btn error-btn-primary"
                                disabled={isLoading}
                            >
                                <span className="btn-text">Back to Home</span>
                                <span className="btn-arrow">&rarr;</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleGoBack}
                                className="error-btn error-btn-secondary"
                                disabled={isLoading}
                            >
                                <span className="btn-text">Go Back</span>
                                <span className="btn-arrow">&larr;</span>
                            </button>
                        </>
                    )}
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

class SafeErrorPageBoundary extends React.Component<
    { fallback: React.ReactNode; children: React.ReactNode },
    { hasError: boolean }
> {
    state = { hasError: false };
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    render() {
        if (this.state.hasError) return this.props.fallback;
        return this.props.children;
    }
}

/**
 * Connected router component that safely extracts route error context and navigation
 */
const ErrorPageInRouter: React.FC<ErrorPageProps> = (props) => {
    let navigate: ((to: any) => void) | null = null;
    let routeError: unknown = undefined;

    try {
        navigate = useNavigate();
    } catch {
        navigate = null;
    }

    try {
        routeError = useRouteError();
    } catch {
        routeError = undefined;
    }

    return (
        <ErrorPageContent
            {...props}
            navigate={navigate}
            routeError={routeError}
        />
    );
};

/**
 * Universal Error Page component that can be used either as a route element
 * inside React Router, an errorElement, or as a standalone component inside AppErrorBoundary.
 */
const ErrorPage: React.FC<ErrorPageProps> = (props) => {
    let inRouter = false;
    try {
        inRouter = Boolean(useInRouterContext());
    } catch {
        inRouter = false;
    }

    if (inRouter) {
        return (
            <SafeErrorPageBoundary fallback={<ErrorPageContent {...props} />}>
                <ErrorPageInRouter {...props} />
            </SafeErrorPageBoundary>
        );
    }

    return <ErrorPageContent {...props} />;
};

export default ErrorPage;
