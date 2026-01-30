import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./components/routes";
import { useAuthStore } from "./stores";

const App = () => {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  // Initialize auth on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    }
  }, [fetchUser]);

  // Use RouterProvider with routes from main
  return <RouterProvider router={router} />;
};

export default App;
