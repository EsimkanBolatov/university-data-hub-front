import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Star, Heart, Share2, Globe, Phone, Mail, BookOpen, Home as HomeIcon, Award } from 'lucide-react';
import { universitiesAPI } from '../api/axios';
import { useAuth } from '../context/AuthContext';

const UniversityDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const queryClient = useQueryClient();

  // Получение данных
  const { data: uni, isLoading } = useQuery({
    queryKey: ['university', id],
    queryFn: () => universitiesAPI.getOne(id).then(res => res.data),
  });

  // Мутация для избранного
  const favoriteMutation = useMutation({
    mutationFn: () => universitiesAPI.addFavorite(id), // В реале нужно проверять добавлен или нет
    onSuccess: () => {
      queryClient.invalidateQueries(['favorites']);
      alert('Добавлено в избранное!');
    },
    onError: () => alert('Нужна авторизация'),
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  if (!uni) return <div className="min-h-screen flex items-center justify-center">Университет не найден</div>;

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: BookOpen },
    { id: 'programs', label: 'Программы', icon: Award },
    { id: 'admission', label: 'Поступление', icon: MapPin },
    { id: 'dormitory', label: 'Общежитие', icon: HomeIcon },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="h-64 bg-linear-to-r from-blue-600 to-indigo-800 relative">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto flex items-end gap-6">
            <div className="w-32 h-32 bg-white rounded-xl shadow-lg p-2 flex items-center justify-center -mb-12 relative z-10">
               {uni.logo_url ? (
                <img src={uni.logo_url} alt="Logo" className="w-full h-full object-contain" />
               ) : (
                <span className="text-4xl">🎓</span>
               )}
            </div>
            <div className="text-white mb-2 flex-1">
              <h1 className="text-4xl font-bold mb-2">{uni.name_ru}</h1>
              <div className="flex items-center gap-4 text-blue-100">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {uni.city}</span>
                <span className="flex items-center gap-1 text-yellow-300"><Star className="h-4 w-4 fill-current" /> {uni.rating}</span>
              </div>
            </div>
            <div className="flex gap-3 mb-2">
              <button 
                onClick={() => favoriteMutation.mutate()}
                className="bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/30 text-white transition"
              >
                <Heart className="h-6 w-6" />
              </button>
              <button className="bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/30 text-white transition">
                <Share2 className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="flex border-b overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Main) */}
          <div className="lg:col-span-2 space-y-8">
            
            {activeTab === 'overview' && (
              <div className="bg-white rounded-xl p-8 shadow-sm animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">Об университете</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-6">
                  {uni.description || 'Описание отсутствует.'}
                </p>
                
                <h3 className="text-xl font-bold mb-4">Галерея</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="aspect-video bg-gray-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'programs' && (
              <div className="space-y-4 animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">Образовательные программы</h2>
                {uni.programs && uni.programs.length > 0 ? (
                  uni.programs.map((prog, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{prog.name}</h3>
                          <p className="text-gray-500 text-sm">{prog.degree} • {prog.code || 'Код не указан'}</p>
                        </div>
                        <div className="text-right">
                          <span className="block text-blue-600 font-bold text-lg">{prog.price?.toLocaleString()} ₸</span>
                          <span className="text-gray-400 text-xs">в год</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-8 rounded-xl text-center text-gray-500">
                    Программы не найдены
                  </div>
                )}
              </div>
            )}

            {activeTab === 'admission' && (
              <div className="bg-white rounded-xl p-8 shadow-sm animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">Условия поступления</h2>
                <div className="prose max-w-none text-gray-600">
                  {/* Здесь можно рендерить HTML или текст из uni.admissions */}
                  <p>Информация о проходных баллах, сроках подачи документов и необходимых экзаменах.</p>
                  <ul className="list-disc pl-5 mt-4 space-y-2">
                    <li>Срок подачи: с 20 июня по 25 августа</li>
                    <li>ЕНТ: Профильные предметы зависят от специальности</li>
                    <li>Минимальный балл: 50</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'dormitory' && (
              <div className="bg-white rounded-xl p-8 shadow-sm animate-fade-in">
                <h2 className="text-2xl font-bold mb-4">Общежитие</h2>
                {uni.has_dormitory ? (
                  <div>
                    <div className="flex items-center gap-2 text-green-600 font-medium mb-4">
                      <HomeIcon className="h-5 w-5" />
                      Есть общежитие
                    </div>
                    <p className="text-gray-600">Университет предоставляет места в общежитии для иногородних студентов.</p>
                  </div>
                ) : (
                  <p className="text-gray-500">Общежитие не предоставляется.</p>
                )}
              </div>
            )}
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Контакты</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-gray-600">
                  <Globe className="h-5 w-5 text-blue-500" />
                  <a href={uni.website || '#'} target="_blank" className="hover:text-blue-600 transition">
                    {uni.website || 'website.kz'}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <Phone className="h-5 w-5 text-blue-500" />
                  <span>{uni.phone || '+7 (700) 000-00-00'}</span>
                </li>
                <li className="flex items-center gap-3 text-gray-600">
                  <Mail className="h-5 w-5 text-blue-500" />
                  <span>{uni.email || 'info@uni.kz'}</span>
                </li>
              </ul>
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-2">Адрес</h4>
                <p className="text-gray-500 text-sm">{uni.address || uni.city}</p>
                {/* Placeholder map */}
                <div className="mt-3 bg-gray-200 h-32 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                  Карта
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UniversityDetail;