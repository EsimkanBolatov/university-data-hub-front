import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Filter, X, Star, MapPin, Search } from 'lucide-react';
import { universitiesAPI } from '../api/axios';
import { GlassCard } from '../components/ui/GlassCard';
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
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Каталог университетов</h1>
          <p className="text-slate-400">
            Найдено {universities?.length || 0} вузов
          </p>
        </div>
      </div>

      <div className="flex gap-8">
        {/* SIDEBAR FILTERS (Desktop) */}
        {/* ISPFRAVLENO: flex-shrink-0 -> shrink-0 */}
        <aside className="hidden lg:block w-72 shrink-0">
          <GlassCard className="sticky top-24 p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg text-white flex items-center gap-2">
                <Filter className="h-5 w-5 text-neon-blue" />
                Фильтры
              </h2>
              <button onClick={() => setFilters({ query: '', city: '', min_rating: '', max_price: '' })} className="text-xs text-slate-400 hover:text-white">
                Сбросить
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Поиск..."
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-neon-blue transition"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Город</label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white focus:outline-none focus:border-neon-blue [&>option]:bg-deep-blue-900"
              >
                <option value="">Все города</option>
                <option value="Алматы">Алматы</option>
                <option value="Астана">Астана</option>
                <option value="Шымкент">Шымкент</option>
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Рейтинг</label>
              <div className="flex gap-2">
                {[4.5, 4.0, 3.5].map(rating => (
                  <button
                    key={rating}
                    onClick={() => handleFilterChange('min_rating', rating === parseFloat(filters.min_rating) ? '' : rating)}
                    className={cn(
                      "flex-1 py-2 rounded-lg text-xs font-medium border border-white/10 transition",
                      parseFloat(filters.min_rating) === rating 
                        ? "bg-neon-blue text-white border-neon-blue" 
                        : "bg-white/5 text-slate-300 hover:bg-white/10"
                    )}
                  >
                    {rating}+ ⭐
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        </aside>

        {/* MOBILE FILTER BUTTON */}
        <button
          onClick={() => setShowFilters(true)}
          className="lg:hidden fixed bottom-6 right-6 bg-neon-blue text-white p-4 rounded-full shadow-lg z-40 flex items-center gap-2"
        >
          <Filter className="h-5 w-5" />
        </button>

        {/* MAIN GRID */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-white/5 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {universities?.map((uni) => (
                <div
                  key={uni.id}
                  onClick={() => navigate(`/university/${uni.id}`)}
                  className="group relative bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-neon-blue/10 cursor-pointer flex flex-col"
                >
                  {/* Image Area */}
                  {/* ISPFRAVLENO: bg-linear-to-br */}
                  <div className="h-48 bg-linear-to-br from-blue-600/20 to-purple-600/20 relative p-6 flex flex-col justify-between">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition" />
                    
                    <div className="flex justify-between items-start z-10">
                      <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
                         {uni.logo_url ? <img src={uni.logo_url} className="w-10 h-10 object-contain" /> : '🎓'}
                      </div>
                      <div className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-yellow-400 flex items-center gap-1">
                        <Star className="h-3 w-3 fill-current" /> {uni.rating.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-xl text-white mb-2 group-hover:text-neon-blue transition">
                      {uni.name_ru}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                      <MapPin className="h-4 w-4 text-neon-blue" />
                      {uni.city}
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
                      <div className="text-xs text-slate-500">
                        {uni.programs_count > 0 ? `${uni.programs_count} программ` : 'Нет программ'}
                      </div>
                      <span className="text-neon-blue font-bold text-sm">
                        {uni.price_range || 'Цена по запросу'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;