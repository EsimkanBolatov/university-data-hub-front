import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Heart, GitCompare, LayoutGrid, LogOut, Search, ShieldCheck, ChevronRight, Bot, MessageSquare, Globe, Maximize2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import { useState } from 'react';
import ThreeDTourWidget from '../../components/ui/ThreeDTourWidget';

const Layout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  
  const [show3DTour, setShow3DTour] = useState(false);

  const menuItems = [
    { icon: LayoutGrid, label: 'Главная', path: '/' },
    { icon: Search, label: 'Каталог ВУЗов', path: '/catalog' },
    { icon: GitCompare, label: 'Сравнение', path: '/compare' },
    { icon: Heart, label: 'Избранное', path: '/favorites' },
    { icon: MessageSquare, label: 'AI Чат', path: '/ai-chat' },
    
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* SIDEBAR */}
      <aside className="w-80 fixed h-screen bg-white/90 backdrop-blur-xl border-r border-slate-200/50 z-40 flex flex-col shadow-soft">
        {/* Logo */}
        <div className="p-8 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-3 rounded-2xl text-white shadow-lg shadow-primary-500/30">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="transition-transform group-hover:translate-x-1">
              <h1 className="font-bold text-2xl text-slate-900 leading-tight">EduHub</h1>
              <span className="text-sm text-slate-500 font-medium">University Analytics</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-5 py-8 space-y-2">
          <div className="px-5 mb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Навигация</div>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center justify-between group px-5 py-3.5 rounded-xl transition-all duration-300 font-medium text-sm relative",
                  isActive
                    ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border-l-4 border-primary-500"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("h-5 w-5 transition-colors", isActive ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600")} />
                  <span>{item.label}</span>
                </div>
                <ChevronRight className={cn("h-4 w-4 opacity-0 -translate-x-2 transition-all", isActive ? "opacity-100 text-primary-500" : "group-hover:opacity-100 group-hover:translate-x-0")} />
              </Link>
            );
          })}

          {/* 3D Tour Widget Button */}
          <button
            onClick={() => setShow3DTour(true)}
            className="flex items-center gap-3 w-full px-5 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 transition-all duration-300 font-medium text-sm shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 mt-6 group"
          >
            <Globe className="h-5 w-5" />
            <span>3D Турды бастау</span>
            <Maximize2 className="h-4 w-4 ml-auto opacity-70 group-hover:opacity-100" />
          </button>

          {/* Admin Section */}
          {isAdmin && (
            <>
              <div className="px-5 mt-10 mb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Администрирование</div>
              <Link
                to="/admin"
                className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-slate-600 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:text-rose-700 transition-all duration-300 font-medium text-sm group"
              >
                <div className="relative">
                  <ShieldCheck className="h-5 w-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                </div>
                <span>Панель управления</span>
              </Link>
              <button
                onClick={() => navigate('/admin/ai-sync')}
                className="flex items-center gap-3 w-full px-5 py-3.5 rounded-xl text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 transition-all duration-300 font-medium text-sm text-left group"
              >
                <Bot className="h-5 w-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                <span>Синхронизация AI</span>
              </button>
            </>
          )}
        </nav>

        {/* User Profile */}
        <div className="p-6 border-t border-slate-100/50">
          {user ? (
            <div className="glass rounded-2xl p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden" onClick={() => navigate('/profile')} role="button">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                    {user.full_name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-slate-800 truncate">{user.full_name}</span>
                    <span className="text-xs text-slate-500 truncate">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-xl transition-all duration-300"
                  title="Выйти"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center w-full py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 font-medium text-sm shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40"
            >
              Войти в систему
            </Link>
          )}
        </div>
      </aside>

      {/* 3D Tour Widget */}
      <ThreeDTourWidget 
        isOpen={show3DTour} 
        onClose={() => setShow3DTour(false)} 
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-80 p-8 lg:p-10 overflow-x-hidden">
        <div className="max-w-7xl mx-auto animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;