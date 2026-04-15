import { Component, type ErrorInfo, type ReactNode } from "react";

interface AppErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("AppErrorBoundary caught a rendering error", {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDomMutationError =
        this.state.error?.message.includes("removeChild") || false;

      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8F7F3] px-6">
          <div className="bg-white border border-black/10 rounded-[14px] shadow-sm p-6 w-full max-w-md">
            <h2 className="font-['Poppins',sans-serif] text-[20px] font-semibold text-[#171717]">
              We hit a rendering issue
            </h2>
            <p className="mt-2 font-['Poppins',sans-serif] text-[14px] text-[#4A504E] leading-relaxed">
              {isDomMutationError
                ? "A browser extension changed the page while it was updating."
                : "An unexpected UI error occurred while rendering this view."}
            </p>
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={this.handleRetry}
                className="px-4 py-2 rounded-[10px] border border-[#F49B31] text-[#F49B31] font-medium text-sm hover:bg-[#FEF5EA]"
              >
                Try again
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="px-4 py-2 rounded-[10px] bg-[#F49B31] text-white font-medium text-sm hover:bg-[#d88429]"
              >
                Reload app
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;