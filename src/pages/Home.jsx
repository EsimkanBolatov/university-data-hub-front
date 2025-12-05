import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { MapPin, TrendingUp, Users, BookOpen } from 'lucide-react';
import { universitiesAPI } from '../api/axios';
import { Card } from '../components/ui/Card';

const Home = () => {
  const navigate = useNavigate();

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => universitiesAPI.getStats().then(res => res.data),
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Обзор системы</h1>
          <p className="text-slate-500 mt-1">Аналитика высших учебных заведений Казахстана</p>
        </div>
        <button 
            onClick={() => navigate('/catalog')}
            className="bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
        >
            Перейти в каталог →
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Всего ВУЗов" value={stats?.total_universities || 0} icon={BookOpen} color="bg-blue-500" />
        <StatCard title="Активных программ" value={stats?.total_programs || 0} icon={TrendingUp} color="bg-indigo-500" />
        <StatCard title="Студентов" value={stats?.total_students?.toLocaleString() || 0} icon={Users} color="bg-emerald-500" />
        <StatCard title="Городов" value={stats?.total_cities || 0} icon={MapPin} color="bg-orange-500" />
      </div>

      {/* Main Dashboard Area */}
      <div className="grid lg:grid-cols-3 gap-8 h-[500px]">
        {/* Map / Main Feature Area */}
        <Card className="lg:col-span-2 relative overflow-hidden p-0 flex flex-col bg-slate-800 text-white border-none">
            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/e0/Kazakhstan_adm_location_map.svg')] bg-cover bg-center opacity-20 invert"></div>
            <div className="relative z-10 p-8">
                <h3 className="text-2xl font-bold mb-2">География университетов</h3>
                <p className="text-slate-300 max-w-md">
                    Наибольшая концентрация учебных заведений находится в Алматы и Астане.
                </p>
                
                <div className="mt-10 flex gap-4">
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                        <div className="text-2xl font-bold">Алматы</div>
                        <div className="text-sm text-slate-300">25 ВУЗов</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                        <div className="text-2xl font-bold">Астана</div>
                        <div className="text-sm text-slate-300">14 ВУЗов</div>
                    </div>
                </div>
            </div>
            
            <div className="mt-auto p-8 border-t border-white/10 bg-white/5 backdrop-blur-md flex justify-between items-center">
               <span>Используйте поиск для детализации</span>
               <button onClick={() => navigate('/catalog')} className="text-blue-300 hover:text-white transition">Открыть карту</button>
            </div>
        </Card>

        {/* Top Rated List */}
        <Card className="flex flex-col">
            <h3 className="font-bold text-lg mb-6">Топ Рейтинга</h3>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {stats?.top_universities?.map((uni, idx) => (
                    <div key={uni.id} onClick={() => navigate(`/university/${uni.id}`)} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition group">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-600 group-hover:bg-primary-500 group-hover:text-white transition">
                            {idx + 1}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-sm text-slate-800 line-clamp-1">{uni.name}</h4>
                            <div className="text-xs text-slate-500">Рейтинг: {uni.rating}</div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }) => (
    <Card className="flex items-center gap-4 hover:-translate-y-1 transition-transform">
        <div className={`${color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-slate-500 text-xs uppercase font-semibold tracking-wider">{title}</p>
            <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
        </div>
    </Card>
);

export default Home;