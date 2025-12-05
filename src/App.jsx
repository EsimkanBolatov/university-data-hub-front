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
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="catalog" element={<Catalog />} />
              <Route path="university/:id" element={<UniversityDetail />} />
              <Route path="compare" element={<Compare />} />
              <Route path="favorites" element={<Favorites />} />
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