
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="text-center glass-panel rounded-xl p-12 max-w-md w-full animate-fade-in">
        <h1 className="text-6xl font-bold text-ath-blue mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <p className="text-gray-500 mb-8">
          We couldn't find the page you were looking for. It might have been
          moved or doesn't exist.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-ath-blue text-white rounded-lg hover:bg-ath-blue-dark transition-colors shadow-sm"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
