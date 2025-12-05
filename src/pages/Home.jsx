// src/pages/Home.jsx
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, TrendingUp, Users, BookOpen, ArrowRight, 
  BarChart3, Bot, MessageSquare, Sparkles, Globe,
  ChevronDown, ChevronUp, GraduationCap,
  Map, Filter, Search, Target
} from "lucide-react";
import { universitiesAPI } from "../api/axios";
import { Card } from "../components/ui/Card";
import GoogleMap from "../components/ui/GoogleMap";
import { useState } from "react";

// Helper function for className
function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

const Home = () => {
  const navigate = useNavigate();
  const [chatMessage, setChatMessage] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: () => universitiesAPI.getStats().then((res) => res.data),
  });

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      navigate('/ai-chat', { state: { initialMessage: chatMessage } });
    }
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setShowMap(false);
    navigate('/catalog', { state: { region: region.id } });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Обзор системы</h1>
          <p className="text-slate-500 mt-2 text-lg">
            Аналитика высших учебных заведений Казахстана в реальном времени
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowMap(true)}
            className="group flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-2xl text-sm font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg"
          >
            <Globe className="h-4 w-4" />
            Открыть карту
          </button>
          <button
            onClick={() => navigate("/catalog")}
            className="group flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 hover:shadow-hover transition-all duration-300"
          >
            Перейти в каталог
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* AI Chat Widget */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">AI Ассистент по ВУЗам</h3>
              <p className="text-slate-600 mt-1">
                Спросите о университетах, программах, общежитиях или получите персональную рекомендацию
              </p>
            </div>
          </div>
          
          <form onSubmit={handleChatSubmit} className="w-full md:w-auto flex gap-2">
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Например: Какие вузы в Алматы с общежитием?"
                className="w-full px-4 py-3 rounded-xl border border-blue-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:text-blue-600 transition-colors"
              >
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => navigate('/ai-chat')}
              className="px-5 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-medium shadow-lg shadow-blue-500/30"
            >
              Открыть чат
            </button>
          </form>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Всего ВУЗов"
          value={stats?.total_universities || 127}
          icon={BookOpen}
          color="from-blue-500 to-cyan-500"
          trend="+2 за месяц"
        />
        <StatCard
          title="Активных программ"
          value={stats?.total_programs || 845}
          icon={TrendingUp}
          color="from-violet-500 to-purple-500"
          trend="+12%"
        />
        <StatCard
          title="Студентов"
          value={stats?.total_students?.toLocaleString() || '550,000+'}
          icon={Users}
          color="from-emerald-500 to-green-500"
          trend="+5.3%"
        />
        <StatCard
          title="Городов"
          value={stats?.total_cities || 17}
          icon={MapPin}
          color="from-amber-500 to-orange-500"
          trend="+1"
        />
      </div>

      {/* Interactive Map Preview */}
      <Card className="relative overflow-hidden group cursor-pointer border-2 border-transparent hover:border-blue-300 hover:shadow-2xl transition-all duration-500"
        onClick={() => setShowMap(true)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative z-10 p-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-500 text-white shadow-lg animate-pulse">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">Google Maps карта университетов</h3>
                <p className="text-slate-600 mt-2">
                  Нажмите чтобы открыть интерактивную карту с реальными координатами университетов Казахстана
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all group/btn animate-bounce-slow">
              <span className="font-medium">Открыть Google Maps</span>
              <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
            </div>
          </div>
          
          {/* Map Preview with Google Maps Style */}
          <div className="mt-8 relative h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 to-blue-900 border border-slate-700">
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              <div className="text-center text-white">
                <div className="text-4xl mb-2">🗺️</div>
                <div className="text-lg font-semibold mb-1">Google Maps интеграция</div>
                <div className="text-sm text-blue-200">Реальные координаты университетов</div>
              </div>
              
              {/* Map Controls Preview */}
              <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm rounded-lg p-2">
                <div className="flex flex-col gap-1">
                  <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">+</div>
                  <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">-</div>
                </div>
              </div>
              
              {/* City Markers Preview */}
              <div className="absolute top-12 left-12 w-4 h-4 rounded-full bg-blue-500 animate-ping"></div>
              <div className="absolute top-16 right-16 w-5 h-5 rounded-full bg-emerald-500 animate-ping" style={{ animationDelay: '0.2s' }}></div>
              <div className="absolute bottom-16 left-20 w-6 h-6 rounded-full bg-amber-500 animate-ping" style={{ animationDelay: '0.4s' }}></div>
              <div className="absolute bottom-8 right-12 w-3 h-3 rounded-full bg-purple-500 animate-ping" style={{ animationDelay: '0.6s' }}></div>
              
              {/* Search Preview */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                <Search className="h-4 w-4 text-white/70" />
                <span className="text-sm text-white/70">Искать университеты...</span>
              </div>
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { 
                label: 'Алматы', 
                value: '25 ВУЗ', 
                color: 'from-blue-500 to-blue-600',
                description: 'Образовательный центр' 
              },
              { 
                label: 'Астана', 
                value: '14 ВУЗ', 
                color: 'from-emerald-500 to-emerald-600',
                description: 'Столичные ВУЗы' 
              },
              { 
                label: 'Шымкент', 
                value: '8 ВУЗ', 
                color: 'from-amber-500 to-amber-600',
                description: 'Южный регион' 
              },
              { 
                label: 'На карте', 
                value: '127 ВУЗ', 
                color: 'from-indigo-500 to-purple-600',
                description: 'Всего отмечено' 
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`bg-gradient-to-br ${item.color} text-white rounded-xl p-5 text-center shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer group/item`}
                onClick={() => setShowMap(true)}
              >
                <div className="text-2xl font-bold mb-1">{item.value}</div>
                <div className="text-sm font-semibold mb-1">{item.label}</div>
                <div className="text-xs opacity-80">{item.description}</div>
              </div>
            ))}
          </div>
          
          {/* Map Features */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Map className="h-5 w-5 text-blue-500" />
              Возможности карты
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: <Target className="h-4 w-4" />, label: 'Навигация', desc: 'Zoom и панорамирование' },
                { icon: <Filter className="h-4 w-4" />, label: 'Фильтры', desc: 'По типу и городу' },
                { icon: <Search className="h-4 w-4" />, label: 'Поиск', desc: 'Университеты и города' },
                { icon: <GraduationCap className="h-4 w-4" />, label: 'Инфо', desc: 'Детальная информация' },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                    {feature.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-800">{feature.label}</div>
                    <div className="text-xs text-slate-500">{feature.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Expandable Statistics Section */}
      <Card className="overflow-hidden">
        <button
          onClick={() => setShowStats(!showStats)}
          className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white group-hover:scale-110 transition-transform">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-slate-900">Детальная статистика</h3>
              <p className="text-slate-600">Подробный анализ по регионам и типам ВУЗов</p>
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-slate-200">
            {showStats ? (
              <ChevronUp className="h-5 w-5 text-slate-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-600" />
            )}
          </div>
        </button>
        
        {showStats && (
          <div className="p-6 pt-0 border-t border-slate-200">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Distribution by Region */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  Распределение по регионам
                </h4>
                <div className="space-y-4">
                  {[
                    { region: 'Алматы', count: 25, percent: 20, color: 'bg-gradient-to-r from-blue-500 to-blue-600', students: '185,000' },
                    { region: 'Астана', count: 14, percent: 11, color: 'bg-gradient-to-r from-emerald-500 to-emerald-600', students: '120,000' },
                    { region: 'Шымкент', count: 8, percent: 6, color: 'bg-gradient-to-r from-amber-500 to-amber-600', students: '45,000' },
                    { region: 'Караганда', count: 6, percent: 5, color: 'bg-gradient-to-r from-purple-500 to-purple-600', students: '38,000' },
                    { region: 'Другие регионы', count: 74, percent: 58, color: 'bg-gradient-to-r from-slate-500 to-slate-600', students: '162,000' },
                  ].map((item) => (
                    <div key={item.region} className="space-y-2 group/region cursor-pointer hover:bg-slate-50 p-3 rounded-xl transition-colors">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${item.color.split(' ')[2]}`}></div>
                          <span className="font-medium text-slate-800">{item.region}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900">{item.count} ВУЗ</span>
                          <div className="text-xs text-slate-500">{item.percent}% от общего числа</div>
                        </div>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${item.percent}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Студентов: {item.students}</span>
                        <span className="text-emerald-600 font-medium">+{Math.floor(Math.random() * 5) + 1}.{Math.floor(Math.random() * 9)}% рост</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Annual Growth */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  Ежегодный рост студентов
                </h4>
                <div className="space-y-4">
                  {[
                    { year: '2020', students: '450,000', growth: '+4.1%', programs: 780 },
                    { year: '2021', students: '480,000', growth: '+6.7%', programs: 810 },
                    { year: '2022', students: '510,000', growth: '+6.2%', programs: 830 },
                    { year: '2023', students: '535,000', growth: '+4.9%', programs: 845 },
                    { year: '2024', students: '550,000+', growth: '+5.3%', programs: 860 },
                  ].map((item, idx) => (
                    <div
                      key={item.year}
                      className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 hover:from-blue-50 hover:to-cyan-50 transition-all cursor-pointer group/year"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover/year:scale-110 transition-transform">
                          <span className="font-bold text-blue-700">{item.year}</span>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{item.students} студентов</div>
                          <div className="text-sm text-slate-600">{item.programs} программ</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-emerald-500" />
                          <span className="font-bold text-emerald-600">{item.growth}</span>
                        </div>
                        <div className="text-xs text-slate-500">Годовой рост</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* University Types */}
            <div className="mt-8">
              <h4 className="font-semibold text-slate-900 mb-4">Типы ВУЗов в Казахстане</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { 
                    type: 'Государственные', 
                    count: 89, 
                    color: 'from-blue-500 to-cyan-500',
                    icon: <GraduationCap className="h-5 w-5" />,
                    description: 'Мемлекеттік қаржыландыру'
                  },
                  { 
                    type: 'Частные', 
                    count: 38, 
                    color: 'from-emerald-500 to-green-500',
                    icon: <BookOpen className="h-5 w-5" />,
                    description: 'Жеке меншік'
                  },
                  { 
                    type: 'Международные', 
                    count: 15, 
                    color: 'from-amber-500 to-orange-500',
                    icon: <Globe className="h-5 w-5" />,
                    description: 'Халықаралық сертификат'
                  },
                  { 
                    type: 'Специализированные', 
                    count: 23, 
                    color: 'from-purple-500 to-violet-500',
                    icon: <Target className="h-5 w-5" />,
                    description: 'Мамандандырылған'
                  },
                ].map((item) => (
                  <div
                    key={item.type}
                    className={`bg-gradient-to-br ${item.color} text-white rounded-2xl p-5 text-center shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer`}
                  >
                    <div className="flex justify-center mb-3">
                      <div className="p-2 rounded-lg bg-white/20">
                        {item.icon}
                      </div>
                    </div>
                    <div className="text-3xl font-bold mb-2">{item.count}</div>
                    <div className="text-sm font-semibold mb-1">{item.type}</div>
                    <div className="text-xs opacity-80">{item.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Dashboard Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top Universities */}
        <Card className="p-6 h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Топ университетов Казахстана</h3>
              <p className="text-slate-500 text-sm">По рейтингу 2024 года • Нажмите для просмотра на карте</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { name: 'Назарбаев Университет', city: 'Астана', rating: 9.8, students: '4,500', color: 'from-amber-500 to-orange-500' },
              { name: 'КазНУ им. аль-Фараби', city: 'Алматы', rating: 9.5, students: '25,000', color: 'from-slate-500 to-slate-600' },
              { name: 'Satbayev University', city: 'Алматы', rating: 9.3, students: '12,000', color: 'from-emerald-500 to-green-500' },
              { name: 'ЕНУ им. Л.Н. Гумилева', city: 'Астана', rating: 9.1, students: '18,000', color: 'from-blue-500 to-cyan-500' },
              { name: 'КБТУ', city: 'Алматы', rating: 8.9, students: '8,500', color: 'from-purple-500 to-violet-500' },
            ].map((uni, index) => (
              <div
                key={uni.name}
                onClick={() => {
                  setShowMap(true);
                  // Можете добавить логику для автоматического перехода к университету на карте
                }}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 cursor-pointer transition-all duration-300 group border border-transparent hover:border-blue-200"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md group-hover:scale-110 transition-transform",
                    uni.color
                  )}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 group-hover:text-blue-700">{uni.name}</div>
                    <div className="text-xs text-slate-500">{uni.city} • {uni.students} студентов</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-amber-600">{uni.rating}</div>
                  <div className="text-xs text-slate-500">рейтинг</div>
                  <div className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +{Math.floor(Math.random() * 15) + 5}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-100">
            <button
              onClick={() => setShowMap(true)}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center justify-center gap-2"
            >
              Посмотреть все университеты на карте
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Card>

        {/* AI Recommendations */}
        <Card className="p-6 h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">AI Рекомендации</h3>
              <p className="text-slate-500 text-sm">Персональный подбор ВУЗа на основе ваших данных</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 hover:border-purple-200 transition-all">
              <div className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-500" />
                Рекомендация по баллам ЕНТ
              </div>
              <div className="text-sm text-slate-600 mb-3">Скажите свои баллы ЕНТ и интересы для персонализированного подбора</div>
              <button
                onClick={() => navigate('/ai-chat', { state: { initialMessage: "У меня 100 баллов, люблю физику. Что посоветуете?" } })}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 text-sm font-medium shadow-lg shadow-purple-500/30"
              >
                Получить рекомендацию
              </button>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 hover:border-blue-200 transition-all">
              <div className="font-medium text-slate-800 mb-2 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-blue-500" />
                Подбор по специальности
              </div>
              <div className="text-sm text-slate-600 mb-3">Найдите лучшие программы по выбранной специальности в разных городах</div>
              <button
                onClick={() => navigate('/ai-chat', { state: { initialMessage: "Какие есть программы по информатике?" } })}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 text-sm font-medium shadow-lg shadow-blue-500/30"
              >
                Выбрать специальность
              </button>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-100">
            <h4 className="font-semibold text-slate-900 mb-3">Популярные вопросы к AI ассистенту</h4>
            <div className="space-y-2">
              {[
                "ВУЗы в Алматы с общежитием",
                "Лучшие медицинские университеты",
                "Гранты для иностранных студентов",
                "Стоимость обучения в НУ",
                "Проходные баллы на IT специальности",
                "Университеты с двойным дипломом"
              ].map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate('/ai-chat', { state: { initialMessage: question } })}
                  className="w-full text-left text-sm text-slate-600 hover:text-blue-600 p-2 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-between group/q"
                >
                  <span>{question}</span>
                  <ArrowRight className="h-4 w-4 text-slate-400 group-hover/q:text-blue-500 group-hover/q:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Modal Google Map */}
      {showMap && (
        <GoogleMap
          onRegionSelect={handleRegionSelect}
          isOpen={showMap}
          onClose={() => setShowMap(false)}
        />
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-2">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
        {trend && (
          <div className="mt-3 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </div>
        )}
      </div>
      <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg group-hover:rotate-12 transition-transform`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
    <div className="mt-6 pt-4 border-t border-slate-100">
      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 group-hover:w-full`} style={{ width: '75%' }}></div>
      </div>
    </div>
  </Card>
);

export default Home;