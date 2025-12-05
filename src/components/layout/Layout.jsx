import { Outlet, Link, useLocation } from 'react-router-dom';
import { GraduationCap, Heart, GitCompare, LayoutGrid, LogOut, Search, User, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

const Layout = () => {
  const { pathname } = useLocation();
  const { user, logout, isAdmin } = useAuth();

  const menuItems = [
    { icon: LayoutGrid, label: 'Главная', path: '/' },
    { icon: Search, label: 'Каталог ВУЗов', path: '/catalog' },
    { icon: GitCompare, label: 'Сравнение', path: '/compare' },
    { icon: Heart, label: 'Избранное', path: '/favorites' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* === SIDEBAR === */}
      <aside className="w-72 fixed h-screen bg-white border-r border-slate-200 z-50 flex flex-col shadow-sm">
        {/* Logo */}
        <div className="p-8 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-primary-600 p-2.5 rounded-xl text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-slate-900 leading-none">DataHub</h1>
              <span className="text-xs text-slate-500 font-medium">University Analytics</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          <div className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Меню</div>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm",
                  isActive 
                    ? "bg-primary-50 text-primary-700" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-primary-600" : "text-slate-400")} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Admin Section */}
          {isAdmin && (
            <>
              <div className="px-4 mt-8 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Администрирование</div>
              <Link
                to="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-all duration-200 font-medium text-sm"
              >
                <ShieldCheck className="h-5 w-5 text-slate-400" />
                <span>Панель управления</span>
              </Link>
            </>
          )}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-100">
          {user ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm shrink-0">
                  {user.full_name?.[0] || 'U'}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-slate-800 truncate block">{user.full_name}</span>
                  <span className="text-xs text-slate-500 truncate block">{user.email}</span>
                </div>
              </div>
              <button onClick={logout} className="text-slate-400 hover:text-danger hover:bg-red-50 p-1.5 rounded-lg transition">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="flex items-center justify-center w-full py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition font-medium text-sm shadow-lg shadow-primary-500/20"
            >
              Войти в систему
            </Link>
          )}
        </div>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="flex-1 ml-72 p-8 lg:p-12 overflow-x-hidden w-full">
        <div className="max-w-7xl mx-auto">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;