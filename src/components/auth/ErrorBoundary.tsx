import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AuthLayout } from "./index";
import AuthCard from "./AuthCard";
import AuthButton from "./AuthButton";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component - Phase 8 Implementation
 * Catches React errors in authentication flow and provides user-friendly fallback UI
 * 
 * Usage:
 * <ErrorBoundary>
 *   <YourAuthComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log the error to an error reporting service
        console.error("Error Boundary caught an error:", error, errorInfo);

        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    handleGoHome = () => {
        window.location.href = "/";
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI provided by parent
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default fallback UI
            return (
                <AuthLayout>
                    <AuthCard>
                        {/* Error Icon */}
                        <div className="flex items-center justify-center">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-8 h-8 sm:w-10 sm:h-10 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="text-center w-full">
                            <h1
                                className="text-[22px] sm:text-[26px] md:text-[28px] font-semibold text-[#4a504e] mb-2.5"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                Something Went Wrong
                            </h1>
                            <p
                                className="text-[12px] sm:text-[13px] text-[#838383] font-normal leading-relaxed"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                We encountered an unexpected error. Please try again.
                            </p>
                        </div>

                        {/* Error Details (dev mode only) */}
                        {import.meta.env.DEV && this.state.error && (
                            <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4 text-left">
                                <p className="text-sm font-semibold text-red-800 mb-2">
                                    Error Details:
                                </p>
                                <p className="text-xs text-red-700 font-mono wrap-break-word">
                                    {this.state.error.toString()}
                                </p>
                                {this.state.errorInfo && (
                                    <details className="mt-2">
                                        <summary className="text-xs text-red-600 cursor-pointer">
                                            Stack Trace
                                        </summary>
                                        <pre className="text-xs text-red-600 mt-2 overflow-auto max-h-40">
                                            {this.state.errorInfo.componentStack}
                                        </pre>
                                    </details>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="w-full flex flex-col gap-3">
                            <AuthButton onClick={this.handleReset}>Try Again</AuthButton>
                            <button
                                onClick={this.handleGoHome}
                                className="w-full py-3 px-4 text-[14px] font-medium text-[#838383] hover:text-[#4a504e] transition-colors"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                Go to Home
                            </button>
                        </div>
                    </AuthCard>
                </AuthLayout>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
