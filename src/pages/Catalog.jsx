import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Filter, Star, MapPin, Search, X } from 'lucide-react';
import { universitiesAPI } from '../api/axios';
import { Card } from '../components/ui/Card'; // Исправлен импорт
import { cn } from '../utils/cn';

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    query: searchParams.get('query') || '',
    city: searchParams.get('city') || '',
    min_rating: searchParams.get('min_rating') || '',
    max_price: searchParams.get('max_price') || '',
  });

  const { data: universities, isLoading } = useQuery({
    queryKey: ['universities', filters],
    queryFn: () => {
      const params = {};
      if (filters.query) params.query = filters.query;
      if (filters.city) params.city = filters.city;
      if (filters.min_rating) params.min_rating = parseFloat(filters.min_rating);
      if (filters.max_price) params.max_price = parseInt(filters.max_price);
      return universitiesAPI.getAll(params).then(res => res.data);
    },
  });

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

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Каталог университетов</h1>
        <p className="text-slate-500">
          Найдено {universities?.length || 0} вузов
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR FILTERS */}
        <aside className={cn(
            "lg:w-72 shrink-0 space-y-6 lg:block", // flex-shrink-0 -> shrink-0
            showFilters ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto" : "hidden"
        )}>
          {/* Mobile Header */}
          <div className="lg:hidden flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-slate-900">Фильтры</h2>
             <button onClick={() => setShowFilters(false)}><X className="h-6 w-6 text-slate-500"/></button>
          </div>

          <Card className="sticky top-24 space-y-6 border-slate-200 shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary-600" />
                Фильтры
              </h2>
              <button 
                onClick={() => setFilters({ query: '', city: '', min_rating: '', max_price: '' })} 
                className="text-xs text-primary-600 hover:text-primary-700 font-medium"
              >
                Сбросить
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Поиск по названию..."
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Город</label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-primary-500 transition text-slate-700"
              >
                <option value="">Все города</option>
                <option value="Алматы">Алматы</option>
                <option value="Астана">Астана</option>
                <option value="Шымкент">Шымкент</option>
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Рейтинг</label>
              <div className="flex gap-2">
                {[4.5, 4.0, 3.5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => handleFilterChange('min_rating', rating === parseFloat(filters.min_rating) ? '' : rating)}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-medium border transition",
                      parseFloat(filters.min_rating) === rating 
                        ? "bg-primary-50 text-primary-700 border-primary-200" 
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {rating}+ ⭐
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </aside>

        {/* MOBILE FILTER BUTTON */}
        <button
          onClick={() => setShowFilters(true)}
          className="lg:hidden fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-xl shadow-primary-600/30 z-40 flex items-center justify-center"
        >
          <Filter className="h-6 w-6" />
        </button>

        {/* MAIN GRID */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-white border border-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {universities?.map((uni) => (
                <Card
                  key={uni.id}
                  hover={true}
                  padding="p-0"
                  onClick={() => navigate(`/university/${uni.id}`)}
                  className="cursor-pointer overflow-hidden group flex flex-col h-full"
                >
                  {/* Image Area */}
                  <div className="h-40 bg-slate-100 relative overflow-hidden">
                    {/* ISPFRAVLENO: bg-gradient-to-t -> bg-linear-to-t */}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent z-10" />
                    
                    {uni.logo_url ? (
                        <img 
                            src={uni.logo_url} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                            alt={uni.name_ru}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-50 text-primary-200">
                            <Star className="h-12 w-12" />
                        </div>
                    )}

                    <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end z-20">
                      <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm">
                        <Star className="h-3 w-3 text-orange-400 fill-current" /> {uni.rating.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-primary-600 transition line-clamp-2">
                      {uni.name_ru}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      {uni.city}
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                      <div className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                        {uni.programs_count > 0 ? `${uni.programs_count} программ` : 'Нет данных'}
                      </div>
                      <span className="text-primary-700 font-bold text-sm">
                        {uni.price_range || 'Цена по запросу'}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;