import { Component, type ErrorInfo, type ReactNode } from "react";
import ErrorPage from "../../pages/ErrorPage";
import { isChunkLoadError, tryAutoReloadForChunkError } from "../../utils/chunkRetry";

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

    if (isChunkLoadError(error)) {
      tryAutoReloadForChunkError(error);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isDomMutationError =
        this.state.error?.message.includes("removeChild") || false;
      const isChunk = isChunkLoadError(this.state.error);

      return (
        <ErrorPage
          statusCode={isChunk ? 503 : 500}
          message={
            isChunk
              ? "A new update was deployed or your connection was interrupted. Please reload."
              : isDomMutationError
              ? "A browser extension modified the page while it was updating."
              : "An unexpected UI error occurred while rendering this view."
          }
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;