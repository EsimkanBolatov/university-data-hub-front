import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Heart, GitCompare, LogOut, User, Menu } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = [
    { name: 'Главная', path: '/' },
    { name: 'Каталог', path: '/catalog' },
    { name: 'Сравнение', path: '/compare', icon: GitCompare },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                DataHub <span className="text-blue-600">ВУЗ-ов</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-gray-700 hover:text-blue-600 transition font-medium flex items-center gap-2"
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.name}
                </Link>
              ))}
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/favorites"
                    className="text-gray-700 hover:text-blue-600 transition flex items-center gap-2"
                  >
                    <Heart className="h-5 w-5" />
                    <span>Избранное</span>
                  </Link>
                  
                  <div className="flex items-center gap-3 pl-4 border-l">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">
                        {user?.full_name || user?.email}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-gray-600 hover:text-red-600 transition"
                      title="Выйти"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600 transition font-medium"
                  >
                    Войти
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Регистрация
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-gray-700 hover:text-blue-600"
                >
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/favorites"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-blue-600"
                  >
                    Избранное
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-2 text-red-600 hover:text-red-700"
                  >
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-gray-700 hover:text-blue-600"
                  >
                    Войти
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-blue-600 hover:text-blue-700"
                  >
                    Регистрация
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="h-8 w-8 text-blue-500" />
                <span className="text-xl font-bold text-white">DataHub ВУЗ-ов</span>
              </div>
              <p className="text-gray-400 text-sm">
                Единая платформа для поиска и сравнения университетов Казахстана
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Навигация</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-blue-400">Главная</Link></li>
                <li><Link to="/catalog" className="hover:text-blue-400">Каталог</Link></li>
                <li><Link to="/compare" className="hover:text-blue-400">Сравнение</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Контакты</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Email: info@datahub.kz</li>
                <li>Телефон: +7 (700) 123-45-67</li>
                <li>г. Алматы, Казахстан</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>© 2025 DataHub ВУЗ-ов РК. Создано для ITU HACKATHON-2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;