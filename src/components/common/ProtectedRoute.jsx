import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Компонент для защиты маршрутов, требующих аутентификации.
 * Если пользователь не аутентифицирован, перенаправляет на /login.
 * Если аутентифицирован, рендерит дочерний компонент.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Можно показать лоадер
    return (
      <div className="flex justify-center items-center h-screen">
        Загрузка...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
