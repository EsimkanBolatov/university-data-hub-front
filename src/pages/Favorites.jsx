import { useQuery } from '@tanstack/react-query';
import { universitiesAPI } from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, ArrowRight, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';

const Favorites = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { data: favorites, isLoading, isError } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => universitiesAPI.getFavorites().then(res => res.data),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
            <Heart className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Войдите в систему</h2>
        <p className="text-slate-500 mb-6 max-w-md">Чтобы сохранять университеты в избранное и возвращаться к ним позже.</p>
        <button 
          onClick={() => navigate('/login')}
          className="bg-primary-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-primary-700 transition shadow-lg shadow-primary-500/20"
        >
          Войти в аккаунт
        </button>
      </div>
    );
  }

  if (isLoading) return <div className="p-8 text-center text-slate-500">Загрузка избранного...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Ошибка загрузки данных</div>;

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
        Моё избранное <span className="text-slate-400 font-normal text-lg">({favorites?.length || 0})</span>
      </h1>

      {favorites?.length === 0 ? (
        <Card className="py-16 text-center border-dashed border-2">
          <p className="text-slate-500 text-lg mb-6">Вы пока ничего не добавили в избранное</p>
          <button 
            onClick={() => navigate('/catalog')}
            className="text-primary-600 font-medium hover:underline"
          >
            Перейти в каталог университетов →
          </button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((uni) => (
            <Card
              key={uni.id}
              hover
              padding="p-0"
              onClick={() => navigate(`/university/${uni.id}`)}
              className="group cursor-pointer flex flex-col h-full"
            >
              <div className="h-32 bg-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary-900/10"></div>
                {uni.logo_url && (
                  <img src={uni.logo_url} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500" alt={uni.name_ru} />
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                  <Star className="w-3 h-3 text-orange-400 fill-current"/> {uni.rating}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-slate-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition">
                  {uni.name_ru}
                </h3>
                
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
                  <MapPin className="h-3.5 w-3.5" />
                  {uni.city}
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-sm font-medium text-slate-400 group-hover:text-primary-600 transition">Подробнее</span>
                  <ArrowRight className="h-4 w-4 text-primary-600 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;