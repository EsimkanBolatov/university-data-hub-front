// src/pages/UniversityDetail.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Star, Share2, Globe, Phone, Layers, CheckCircle, Clock, BookOpen, Heart } from 'lucide-react';
import { universitiesAPI, favoritesAPI } from '../api/axios';
import { Card } from '../components/ui/Card';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';

const UniversityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // 1. Получение данных университета
  const { data: uni, isLoading } = useQuery({
    queryKey: ['university', id],
    queryFn: () => universitiesAPI.getById(id).then(res => res.data),
  });

  // 2. Проверка, находится ли в избранном
  const { data: isFavorite } = useQuery({
    queryKey: ['isFavorite', id],
    queryFn: () => favoritesAPI.checkIsFavorite(id).then(res => res.data.is_favorite),
    enabled: isAuthenticated && !!id,
    retry: false,
  });

  // 3. Мутация для добавления/удаления из избранного
  const { mutate: toggleFavorite, isPending: isFavLoading } = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated) throw new Error('Unauthorized');

      return isFavorite
        ? favoritesAPI.removeFromFavorites(id)
        : favoritesAPI.addToFavorites(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['isFavorite', id]);
      queryClient.invalidateQueries(['favorites']);
    },
    onError: (error) => {
      if (error.message === 'Unauthorized') {
        navigate('/login');
      }
    }
  });

  if (isLoading) return <div className="text-center mt-20 text-slate-400 animate-pulse">Загрузка данных...</div>;
  if (!uni) return <div className="text-center mt-20 text-slate-800">Университет не найден</div>;

  return (
    <div className="space-y-8 pb-12 animate-fade-in">

      {/* HEADER CARD */}
      <Card className="relative overflow-hidden border-none shadow-lg bg-white">
        <div className="h-32 bg-primary-800 relative">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="px-8 pb-8">
            <div className="flex flex-col md:flex-row gap-6 items-start -mt-12 relative z-10">
                <div className="w-32 h-32 bg-white rounded-2xl p-2 shadow-lg border border-slate-100 shrink-0">
                    {uni.logo_url ? (
                        <img src={uni.logo_url} alt="Logo" className="w-full h-full object-contain rounded-xl" />
                    ) : (
                        <div className="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center">
                            <BookOpen className="text-slate-300 w-10 h-10"/>
                        </div>
                    )}
                </div>

                <div className="flex-1 pt-2 md:pt-14">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-slate-900">{uni.name_ru}</h1>
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> {uni.rating}
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-slate-500 text-sm">
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4"/> {uni.city}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="flex items-center gap-1.5"><Globe className="w-4 h-4"/> {uni.type === 'private' ? 'Частный' : 'Государственный'}</span>
                    </div>
                </div>

                <div className="pt-2 md:pt-14 flex gap-3 w-full md:w-auto">
                    {/* Кнопка избранного */}
                    <button
                        onClick={() => toggleFavorite()}
                        disabled={isFavLoading}
                        className={cn(
                            "flex-1 md:flex-none py-2.5 px-4 border rounded-lg transition flex justify-center items-center gap-2",
                            isFavorite
                                ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"
                                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        )}
                        title={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
                    >
                        <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
                    </button>

                    <button className="flex-1 md:flex-none py-2.5 px-4 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition flex justify-center items-center gap-2">
                        <Share2 className="w-4 h-4" />
                    </button>
                    <a
                        href={uni.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 md:flex-none py-2.5 px-6 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md transition flex justify-center items-center gap-2"
                    >
                        Посетить сайт
                    </a>
                </div>
            </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">

          {/* About */}
          <section>
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Layers className="text-primary-600 h-5 w-5" />
              О ВУЗе
            </h3>
            <Card>
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {uni.description || uni.mission}
                </p>
            </Card>
          </section>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatBox label="Студентов" value={uni.total_students ? (uni.total_students/1000).toFixed(1) + 'k' : '—'} />
            <StatBox label="Основан" value={uni.founded_year} />
            <StatBox label="Трудоустройство" value={uni.employment_rate ? uni.employment_rate + '%' : '—'} highlight />
          </div>

          {/* Programs */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Образовательные программы</h2>
            <div className="space-y-3">
              {uni.programs?.map((prog) => (
                <Card key={prog.id} padding="p-4" hover className="flex items-center justify-between group cursor-pointer border-l-4 border-l-transparent hover:border-l-primary-500">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-500 font-mono text-xs flex items-center justify-center">
                        {prog.code?.substring(0,3) || 'IT'}
                    </div>
                    <div>
                        <h4 className="font-semibold text-slate-800 group-hover:text-primary-600 transition">{prog.name_ru}</h4>
                        <p className="text-xs text-slate-500">{prog.degree === 'bachelor' ? 'Бакалавриат' : 'Магистратура'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-900">{prog.price?.toLocaleString()} ₸</div>
                    <div className="text-xs text-slate-400">в год</div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Контакты</h3>
            <div className="space-y-4 text-sm">
              <ContactItem icon={Phone} text={uni.phone || '+7 (700) 000-00-00'} />
              <ContactItem icon={MapPin} text={uni.address || uni.city} />
              <ContactItem icon={Globe} text={uni.email || 'info@university.kz'} />
            </div>
          </Card>

          <Card className="bg-linear-to-br from-primary-600 to-primary-800 text-white border-none shadow-lg shadow-primary-600/20">
            <h3 className="font-bold text-lg mb-2">Приемная комиссия</h3>
            <div className="space-y-3 text-sm text-primary-100 mb-6">
              <div className="flex items-center gap-2"><Clock className="w-4 h-4"/> Старт: 20 Июня</div>
              <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4"/> Гранты: Есть</div>
            </div>
            <button className="w-full py-2.5 bg-white text-primary-700 font-bold rounded-lg hover:bg-primary-50 transition shadow-sm">
              Подать документы
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

// --- ВСПОМОГАТЕЛЬНЫЕ КОМПОНЕНТЫ ---

// 1. Компонент для контактов (Здесь используется Icon)
const ContactItem = ({ icon: Icon, text }) => (
    <div className="flex items-start gap-3 text-slate-600">
        <div className="p-1.5 bg-slate-100 rounded text-slate-500 mt-0.5">
          {/* Использование Icon здесь устраняет ошибку no-unused-vars */}
          <Icon className="w-3.5 h-3.5"/>
        </div>
        <span className="flex-1 break-words">{text}</span>
    </div>
);

// 2. Компонент для статистики
const StatBox = ({ label, value, highlight }) => (
    <Card className="text-center py-4">
        <div className={cn("text-2xl font-bold mb-1", highlight ? "text-primary-600" : "text-slate-800")}>
            {value}
        </div>
        <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{label}</div>
    </Card>
);

export default UniversityDetail;