import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./components/routes";
import { useAuthStore } from "./stores";
import { ErrorBoundary } from "./components/auth";

/**
 * App Component - Phase 10 Enhanced
 * Root application component with error boundary and auth initialization
 * 
 * Phase 10 Enhancements:
 * - Wrapped in ErrorBoundary for global error handling
 * - Performance optimized with proper auth initialization
 */
const App = () => {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  // Initialize auth on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchUser();
    }
  }, [fetchUser]);

  // Use RouterProvider with routes wrapped in error boundary
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

export default App;
