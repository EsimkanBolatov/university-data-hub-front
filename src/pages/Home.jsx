import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, TrendingUp, Users, Building2, Award } from 'lucide-react';
import { universitiesAPI } from '../api/axios';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Получаем статистику
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => universitiesAPI.getStats().then(res => res.data),
  });

  // Топ университеты
  const { data: topUniversities, isLoading } = useQuery({
    queryKey: ['universities', { limit: 6 }],
    queryFn: () => universitiesAPI.getAll({ limit: 6, min_rating: 4.0 }).then(res => res.data),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  const features = [
    {
      icon: Search,
      title: 'Умный поиск',
      description: 'Найдите идеальный университет по названию, специальности или городу'
    },
    {
      icon: TrendingUp,
      title: 'Сравнение',
      description: 'Сравните до 5 университетов по всем параметрам'
    },
    {
      icon: Award,
      title: 'Гранты',
      description: 'Информация о грантах и стипендиях для каждого ВУЗа'
    },
    {
      icon: Building2,
      title: '3D Туры',
      description: 'Виртуальные экскурсии по кампусам университетов'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Найдите свой идеальный <span className="text-yellow-300">университет</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Полная информация о {stats?.total_universities || 5}+ университетах Казахстана 
              в одном месте
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Поиск по названию, специальности, городу..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-2xl"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-blue-600 text-white px-8 py-2 rounded-full hover:bg-blue-700 transition flex items-center gap-2 font-semibold"
              >
                <Search className="h-5 w-5" />
                Найти
              </button>
            </form>

            {/* Quick Links */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button
                onClick={() => navigate('/catalog?city=Алматы')}
                className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full hover:bg-white/30 transition"
              >
                🏙️ Алматы
              </button>
              <button
                onClick={() => navigate('/catalog?has_dormitory=true')}
                className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full hover:bg-white/30 transition"
              >
                🏠 С общежитием
              </button>
              <button
                onClick={() => navigate('/catalog?max_price=1500000')}
                className="bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full hover:bg-white/30 transition"
              >
                💰 До 1.5 млн ₸
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-12 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">
                  {stats.total_universities}
                </div>
                <div className="text-gray-600 mt-2">Университетов</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">
                  {stats.total_programs}+
                </div>
                <div className="text-gray-600 mt-2">Программ</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">
                  {stats.total_cities}
                </div>
                <div className="text-gray-600 mt-2">Городов</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600">
                  {(stats.total_students / 1000).toFixed(0)}K+
                </div>
                <div className="text-gray-600 mt-2">Студентов</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Почему выбирают нас?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Universities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Популярные университеты</h2>
            <button
              onClick={() => navigate('/catalog')}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              Смотреть все
              <span>→</span>
            </button>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-100 h-64 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topUniversities?.map((uni) => (
                <div
                  key={uni.id}
                  onClick={() => navigate(`/university/${uni.id}`)}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer"
                >
                  {/* Image placeholder */}
                  <div className="h-40 bg-gradient-to-br from-blue-500 to-indigo-600 relative">
                    {uni.logo_url && (
                      <img
                        src={uni.logo_url}
                        alt={uni.name_ru}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      {uni.rating.toFixed(1)}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2">
                      {uni.name_ru}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {uni.description || 'Ведущий университет Казахстана'}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">📍 {uni.city}</span>
                      {uni.price_range && (
                        <span className="text-blue-600 font-medium">
                          {uni.price_range}
                        </span>
                      )}
                    </div>

                    {uni.has_dormitory && (
                      <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        🏠 Общежитие
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">
            Готовы выбрать свой университет?
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Создайте профиль, сохраняйте избранное и получайте персональные рекомендации
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition shadow-lg"
          >
            Начать поиск
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;