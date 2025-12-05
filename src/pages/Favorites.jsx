import { useQuery } from '@tanstack/react-query';
import { universitiesAPI } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Favorites = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data: favorites, isLoading, isError } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => universitiesAPI.getFavorites().then(res => res.data),
    enabled: isAuthenticated, // Загружать только если авторизован
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Войдите в систему</h2>
        <p className="text-gray-600 mb-6">Чтобы просматривать избранные университеты, необходимо авторизоваться.</p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Войти
        </button>
      </div>
    );
  }

  if (isLoading) return <div className="p-8 text-center">Загрузка избранного...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Ошибка загрузки данных</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Star className="h-8 w-8 text-yellow-400 fill-current" />
        Моё избранное
      </h1>

      {favorites?.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <p className="text-gray-500 text-lg mb-6">Вы пока ничего не добавили в избранное</p>
          <button 
            onClick={() => navigate('/catalog')}
            className="text-blue-600 font-medium hover:underline"
          >
            Перейти в каталог университетов →
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((uni) => (
            <div
              key={uni.id}
              onClick={() => navigate(`/university/${uni.id}`)}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden">
                {uni.logo_url && (
                  <img src={uni.logo_url} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" alt={uni.name_ru} />
                )}
                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                  ⭐ {uni.rating}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                  {uni.name_ru}
                </h3>
                
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <MapPin className="h-4 w-4" />
                  {uni.city}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Подробнее</span>
                  <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;