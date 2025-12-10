import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, Eye, EyeOff, GraduationCap } from "lucide-react"; // Добавили GraduationCap

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    if (result.success) navigate("/home");
    else setError(result.error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-primary-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 md:p-10 relative">

        {/* Обновленная секция логотипа (как на странице регистрации) */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-100">
            <div className="bg-primary-600 p-3 rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            С возвращением!
          </h1>
          <p className="text-slate-500">
            Войдите в свой аккаунт DataHub
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 font-bold text-sm">!</span>
              </div>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Электронная почта
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3.5 bg-white border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-200 text-slate-800 placeholder:text-slate-400"
              placeholder="name@university.kz"
              required
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-slate-700">
                Пароль
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-primary-600 hover:text-primary-800 font-medium"
              >
                {showPassword ? "Скрыть" : "Показать"}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 bg-white border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all duration-200 text-slate-800 placeholder:text-slate-400 pr-12"
                placeholder="Введите ваш пароль"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-full bg-gradient-to-r from-primary-600 via-primary-600 to-primary-700 text-white py-4 rounded-xl hover:from-primary-700 hover:via-primary-700 hover:to-primary-800 active:scale-[0.98] transition-all duration-200 font-bold text-lg shadow-lg shadow-primary-600/30 hover:shadow-primary-700/40 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-8"
          >
            {loading ? (
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Вход в систему...</span>
              </div>
            ) : (
              <>
                <span className="font-bold tracking-wide">ВОЙТИ В АККАУНТ</span>
                <ArrowRight 
                  className={`w-5 h-5 transition-transform duration-300 ${
                    isHovered ? "translate-x-2" : ""
                  }`} 
                  strokeWidth={3}
                />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Ещё нет аккаунта?{" "}
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-800 font-semibold hover:underline"
            >
              Создать аккаунт
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;