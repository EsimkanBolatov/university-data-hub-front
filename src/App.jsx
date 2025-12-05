import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import UniversityDetail from './pages/UniversityDetail';
import Compare from './pages/Compare';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import AiChatPage from './pages/AiChatPage'; // AI чат бетін импорттау

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AiSyncPage from './pages/admin/AiSyncPage';

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
            {/* Layout бар маршруттар */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="catalog" element={<Catalog />} />
              <Route path="university/:id" element={<UniversityDetail />} />
              <Route path="compare" element={<Compare />} />
              <Route path="favorites" element={<Favorites />} />
              <Route path="ai-chat" element={<AiChatPage />} /> {/* AI чат қосылды */}
              
              {/* Admin маршруттары */}
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/ai-sync" element={<AiSyncPage />} />
            </Route>
            
            {/* Auth routes без layout */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;