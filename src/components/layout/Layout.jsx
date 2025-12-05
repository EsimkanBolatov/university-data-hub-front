import { Outlet, Link, useLocation } from 'react-router-dom';
import { GraduationCap, Heart, GitCompare, LayoutGrid, Settings, LogOut, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

const Layout = () => {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { icon: LayoutGrid, label: 'Главная', path: '/' },
    { icon: Search, label: 'Каталог', path: '/catalog' },
    { icon: GitCompare, label: 'Сравнение', path: '/compare' },
    { icon: Heart, label: 'Избранное', path: '/favorites' },
  ];

  return (
    <div className="flex min-h-screen bg-deep-blue-900 text-white">
      {/* === LEFT SIDEBAR === */}
      <aside className="w-64 fixed h-screen border-r border-white/10 bg-deep-blue-900/50 backdrop-blur-xl z-50 flex flex-col">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-neon-blue/20 p-2 rounded-xl group-hover:bg-neon-blue/30 transition">
              <GraduationCap className="h-8 w-8 text-neon-blue" />
            </div>
            <span className="font-bold text-xl tracking-tight">DataHub</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                  isActive 
                    ? "bg-neon-blue text-white shadow-lg shadow-neon-blue/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "group-hover:text-neon-blue")} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          {user ? (
            <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* ISPFRAVLENO: bg-linear-to-tr */}
                <div className="w-10 h-10 rounded-full bg-linear-to-tr from-neon-blue to-purple-500 flex items-center justify-center font-bold text-sm">
                  {user.full_name?.[0] || 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold truncate w-24">{user.full_name}</span>
                  <span className="text-xs text-slate-400">Student</span>
                </div>
              </div>
              <button onClick={logout} className="text-slate-400 hover:text-red-400 transition">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="flex items-center justify-center w-full py-3 bg-white/10 rounded-xl hover:bg-white/20 transition font-medium text-sm"
            >
              Войти в аккаунт
            </Link>
          )}
        </div>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="flex-1 ml-64 p-8 overflow-x-hidden relative">
        <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-neon-blue/20 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen" />
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen" />
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;