import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import UniversityDetail from "./pages/UniversityDetail";
import Compare from "./pages/Compare";
import Favorites from "./pages/Favorites";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AiChatPage from "./pages/AiChatPage"; // AI чат бетін импорттау

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AiSyncPage from "./pages/admin/AiSyncPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Авторизация беттері */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Негізгі маршрут - / тікелей /login бетіне бағытталады */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Layout бар маршруттар (қорғалған) */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="home" element={<Home />} />
              <Route path="catalog" element={<Catalog />} />
              <Route path="university/:id" element={<UniversityDetail />} />
              <Route path="compare" element={<Compare />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="ai-chat" element={<AiChatPage />} />{" "}
              {/* AI чат қосылды */}
              {/* Admin маршруттары */}
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/ai-sync" element={<AiSyncPage />} />
            </Route>

            {/* Егер жол табылмаса, /login бетіне бағыттау */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
