import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result.success) navigate('/');
    else setError(result.error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Decorative bg */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-primary-800 -z-10"></div>

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 relative">
        <div className="flex justify-center -mt-16 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <div className="bg-primary-600 p-3 rounded-xl">
               <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">С возвращением!</h1>
        <p className="text-center text-slate-500 mb-8 text-sm">Введите данные для входа в DataHub</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm border border-red-100 flex items-center justify-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-slate-800"
              placeholder="name@university.kz"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-slate-800"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-700 text-white py-3.5 rounded-xl hover:bg-primary-800 transition font-semibold shadow-lg shadow-primary-700/20 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? 'Вход...' : (
                <>Войти <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-800 font-semibold">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
