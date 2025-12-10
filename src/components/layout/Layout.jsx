// src/components/layout/Layout.jsx
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Heart,
  GitCompare,
  LayoutGrid,
  LogOut,
  Search,
  ShieldCheck,
  ChevronRight,
  Bot,
  MessageSquare,
  Globe,
  Maximize2,
  BarChart3,
  ExternalLink,
  Brain,
  Compass, // <-- Импортируем иконку компаса
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";
import { useState } from "react";
import ThreeDTourWidget from "../../components/ui/ThreeDTourWidget";

const Layout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const [show3DTour, setShow3DTour] = useState(false);

  // Основное меню
  const menuItems = [
    { icon: LayoutGrid, label: "Главная", path: "/home" },
    { icon: Search, label: "Каталог ВУЗов", path: "/catalog" },
    { icon: GitCompare, label: "Сравнение", path: "/compare" },
    { icon: Heart, label: "Избранное", path: "/favorites" },
    { icon: MessageSquare, label: "AI Ассистент", path: "/ai-chat" },
    { icon: Brain, label: "Boljam AI", path: "/boljam" },
  ];

  const handleOpenBoljam = () => {
    window.open("https://boljam.dulaty.kz/", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* SIDEBAR */}
      <aside className="w-80 fixed h-screen bg-white/90 backdrop-blur-xl border-r border-slate-200/50 z-40 flex flex-col">
        {/* Logo */}
        <div className="p-8 border-b border-slate-100 shrink-0">
          <Link to="/home" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-600/30">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="transition-transform group-hover:translate-x-1">
              <h1 className="font-bold text-2xl text-slate-900 leading-tight">
                EduHub
              </h1>
              <span className="text-sm text-slate-500 font-medium">
                University Analytics
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-5 py-8 space-y-2 overflow-y-auto">
          <div className="px-5 mb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="h-3 w-3" />
            Навигация
          </div>
          {menuItems.map((item) => {
            const isActive = pathname === item.path;

            if (item.path === "/boljam") {
              // ... (код кнопки Boljam без изменений)
              return (
                <button
                  key={item.path}
                  onClick={handleOpenBoljam}
                  className={cn(
                    "flex items-center justify-between group px-5 py-3.5 rounded-xl transition-all duration-300 font-medium text-sm relative w-full",
                    isActive
                      ? "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-l-4 border-emerald-500"
                      : "text-slate-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-green-50 hover:text-emerald-700 hover:translate-x-1"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-slate-100 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-500"
                    )}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{item.label}</span>
                      <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                        AI
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <ExternalLink
                      className={cn(
                        "h-4 w-4 transition-all",
                        isActive
                          ? "opacity-100 text-emerald-500"
                          : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                      )}
                    />
                  </div>
                </button>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center justify-between group px-5 py-3.5 rounded-xl transition-all duration-300 font-medium text-sm relative",
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-l-4 border-blue-500"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-600"
                      : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500"
                  )}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span>{item.label}</span>
                </div>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 opacity-0 -translate-x-2 transition-all",
                    isActive
                      ? "opacity-100 text-blue-500"
                      : "group-hover:opacity-100 group-hover:translate-x-0"
                  )}
                />
              </Link>
            );
          })}

          {/* --- НОВАЯ КНОПКА ПРОФ ГИД (ДОБАВЛЕНА СЮДА) --- */}
          <Link
            to="/career-guide"
            className={cn(
              "flex items-center gap-3 w-full px-5 py-3.5 rounded-xl transition-all duration-300 font-medium text-sm mt-6 mb-2 group relative overflow-hidden",
              pathname === '/career-guide' 
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30"
                : "bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-700 hover:from-violet-100 hover:to-fuchsia-100"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-lg transition-colors",
              pathname === '/career-guide' ? "bg-white/20" : "bg-white text-violet-600"
            )}>
              <Compass className="h-4 w-4" />
            </div>
            <span>Проф Гид</span>
            
            {/* Декоративный блик для акцента */}
            {pathname !== '/career-guide' && (
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            )}
            
            {pathname === '/career-guide' && <ChevronRight className="h-4 w-4 ml-auto" />}
          </Link>

          {/* 3D Tour Widget Button */}
          <button
            onClick={() => setShow3DTour(true)}
            className="flex items-center gap-3 w-full px-5 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 transition-all duration-300 font-medium text-sm shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 group"
          >
            <div className="p-1.5 rounded-lg bg-white/20">
              <Globe className="h-4 w-4" />
            </div>
            <span>3D Турды бастау</span>
            <Maximize2 className="h-4 w-4 ml-auto opacity-70 group-hover:opacity-100" />
          </button>

          {/* Admin Section */}
          {isAdmin && (
            <div className="mt-6">
              <div className="px-5 mb-4 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="h-3 w-3" />
                Администрирование
              </div>
              <Link
                to="/admin"
                className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-slate-600 hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 hover:text-rose-700 transition-all duration-300 font-medium text-sm group"
              >
                <div className="relative">
                  <div className="p-2 rounded-lg bg-rose-100 text-rose-600 group-hover:bg-rose-200 group-hover:text-rose-700 transition-colors">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                </div>
                <span>Панель управления</span>
              </Link>
              <button
                onClick={() => navigate("/admin/ai-sync")}
                className="flex items-center gap-3 w-full px-5 py-3.5 rounded-xl text-slate-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 transition-all duration-300 font-medium text-sm text-left group"
              >
                <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200 group-hover:text-blue-700 transition-colors">
                  <Bot className="h-4 w-4" />
                </div>
                <span>Синхронизация AI</span>
              </button>
            </div>
          )}
        </nav>

        {/* User Profile */}
        <div className="shrink-0 p-6 border-t border-slate-100/50 bg-white">
          {user ? (
            <div className="rounded-2xl p-4 bg-gradient-to-r from-slate-50 to-blue-50/30 border border-slate-200">
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center gap-3 overflow-hidden cursor-pointer"
                  onClick={() => navigate("/profile")}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                    {user.full_name?.[0]?.toUpperCase() || "A"}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-slate-800 truncate">
                      {user.full_name || "Aibek Seidazimov"}
                    </span>
                    <span className="text-xs text-slate-500 truncate">
                      {user.email || "aibekseiadazimov08@gmail.com"}
                    </span>
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
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium text-sm shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40"
            >
              <GraduationCap className="h-4 w-4" />
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