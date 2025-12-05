import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Filter, X, Star, MapPin, Home, TrendingUp } from 'lucide-react';
import { universitiesAPI } from '../api/axios';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  // Фильтры из URL
  const [filters, setFilters] = useState({
    query: searchParams.get('query') || '',
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    has_dormitory: searchParams.get('has_dormitory') === 'true',
    min_rating: searchParams.get('min_rating') || '',
    max_price: searchParams.get('max_price') || '',
  });

  // Получаем университеты
  const { data: universities, isLoading } = useQuery({
    queryKey: ['universities', filters],
    queryFn: () => {
      const params = {};
      if (filters.query) params.query = filters.query;
      if (filters.city) params.city = filters.city;
      if (filters.type) params.type = filters.type;
      if (filters.has_dormitory) params.has_dormitory = true;
      if (filters.min_rating) params.min_rating = parseFloat(filters.min_rating);
      if (filters.max_price) params.max_price = parseInt(filters.max_price);
      
      return universitiesAPI.getAll(params).then(res => res.data);
    },
  });

  // Синхронизация с URL
  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value.toString();
    });
    setSearchParams(params);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      city: '',
      type: '',
      has_dormitory: false,
      min_rating: '',
      max_price: '',
    });
  };

  const cities = ['Алматы', 'Астана', 'Шымкент', 'Караганда'];
  const types = [
    { value: 'public', label: 'Государственный' },
    { value: 'private', label: 'Частный' },
    { value: 'international', label: 'Международный' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Каталог университетов</h1>
          <p className="text-gray-600">
            Найдено {universities?.length || 0} университетов
          </p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar with Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Фильтры
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Сбросить
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Поиск</label>
                <input
                  type="text"
                  placeholder="Название..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* City */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Город</label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Все города</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Тип</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Все типы</option>
                  {types.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Минимальный рейтинг
                </label>
                <select
                  value={filters.min_rating}
                  onChange={(e) => handleFilterChange('min_rating', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Любой</option>
                  <option value="4.5">4.5+ ⭐</option>
                  <option value="4.0">4.0+ ⭐</option>
                  <option value="3.5">3.5+ ⭐</option>
                </select>
              </div>

              {/* Max Price */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Максимальная цена
                </label>
                <select
                  value={filters.max_price}
                  onChange={(e) => handleFilterChange('max_price', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Любая</option>
                  <option value="1000000">До 1 млн ₸</option>
                  <option value="1500000">До 1.5 млн ₸</option>
                  <option value="2000000">До 2 млн ₸</option>
                  <option value="3000000">До 3 млн ₸</option>
                </select>
              </div>

              {/* Dormitory */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.has_dormitory}
                    onChange={(e) => handleFilterChange('has_dormitory', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">С общежитием</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowFilters(true)}
            className="lg:hidden fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg z-40 flex items-center gap-2"
          >
            <Filter className="h-5 w-5" />
            Фильтры
          </button>

          {/* Main Content */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : universities?.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <p className="text-gray-500 text-lg">
                  Университеты не найдены. Попробуйте изменить фильтры.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {universities?.map((uni) => (
                  <div
                    key={uni.id}
                    onClick={() => navigate(`/university/${uni.id}`)}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition cursor-pointer"
                  >
                    {/* Image */}
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 relative">
                      {uni.logo_url && (
                        <img
                          src={uni.logo_url}
                          alt={uni.name_ru}
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {uni.rating.toFixed(1)}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-xl mb-2 line-clamp-2">
                        {uni.name_ru}
                      </h3>
                      
                      {uni.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {uni.description}
                        </p>
                      )}

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {uni.city}
                        </div>
                        
                        {uni.has_dormitory && (
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <Home className="h-4 w-4" />
                            Общежитие
                          </div>
                        )}

                        {uni.programs_count > 0 && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <TrendingUp className="h-4 w-4" />
                            {uni.programs_count} программ
                          </div>
                        )}
                      </div>

                      {uni.price_range && (
                        <div className="pt-4 border-t">
                          <p className="text-sm text-gray-500">Стоимость обучения</p>
                          <p className="text-blue-600 font-semibold">
                            {uni.price_range}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setShowFilters(false)}>
          <div 
            className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-lg">Фильтры</h2>
              <button onClick={() => setShowFilters(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Same filters as sidebar */}
            <div className="space-y-6">
              {/* ... (copy filter inputs from sidebar) ... */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;