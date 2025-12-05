import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, TrendingUp, Award, ArrowRight, MapPin } from 'lucide-react';
import { universitiesAPI } from '../api/axios';
import { GlassCard } from '../components/ui/GlassCard';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: topUniversities, isLoading } = useQuery({
    queryKey: ['universities', { limit: 3 }],
    queryFn: () => universitiesAPI.getAll({ limit: 3, min_rating: 4.5 }).then(res => res.data),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative py-20 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-blue/20 rounded-full blur-[100px] -z-10" />
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Найди свой <span className="text-transparent bg-clip-text bg-linear-to-r from-neon-blue to-purple-400">путь</span>
        </h1>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Единая платформа для поиска, сравнения и поступления в университеты Казахстана.
        </p>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto relative group">
          {/* Исправлен градиент ниже */}
          <div className="absolute -inset-1 bg-linear-to-r from-neon-blue to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
          <div className="relative flex items-center bg-deep-blue-900 border border-white/10 rounded-full p-2 pl-6">
            <Search className="h-5 w-5 text-slate-400 mr-3" />
            <input
              type="text"
              placeholder="ВУЗ, специальность или город..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none"
            />
            <button type="submit" className="bg-neon-blue text-white px-6 py-2 rounded-full font-medium hover:bg-blue-600 transition">
              Найти
            </button>
          </div>
        </form>
      </section>

      {/* Stats / Features */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: Search, title: 'Умный поиск', desc: 'Фильтры по ЕНТ и цене' },
          { icon: TrendingUp, title: 'Сравнение', desc: 'Аналитика и рейтинги' },
          { icon: Award, title: 'Гранты', desc: 'База грантов 2025' },
        ].map((item, idx) => (
          <GlassCard key={idx} className="flex flex-col items-center text-center p-8 hover:border-neon-blue/50">
            <div className="bg-white/5 p-4 rounded-2xl mb-4 text-neon-blue">
              <item.icon className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
            <p className="text-slate-400 text-sm">{item.desc}</p>
          </GlassCard>
        ))}
      </div>

      {/* Top Universities */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-white">Популярные ВУЗы</h2>
          <button onClick={() => navigate('/catalog')} className="text-neon-blue hover:text-white flex items-center gap-2 transition">
            Весь каталог <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {isLoading ? (
            [1,2,3].map(i => <div key={i} className="h-80 bg-white/5 rounded-3xl animate-pulse"/>)
          ) : (
            topUniversities?.map(uni => (
              <div 
                key={uni.id} 
                onClick={() => navigate(`/university/${uni.id}`)}
                className="group relative h-96 rounded-3xl overflow-hidden cursor-pointer"
              >
                {/* Исправлен градиент ниже */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-deep-blue-900/50 to-deep-blue-900 z-10"/>
                
                <div className="absolute inset-0 bg-blue-900/20 group-hover:scale-105 transition duration-700">
                   {uni.logo_url && <img src={uni.logo_url} className="w-full h-full object-cover opacity-50 blur-sm group-hover:blur-0 transition" />}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <div className="bg-neon-blue w-fit px-3 py-1 rounded-full text-xs font-bold text-white mb-3">
                    ⭐ {uni.rating}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{uni.name_ru}</h3>
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <MapPin className="h-4 w-4 text-neon-blue"/> {uni.city}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;