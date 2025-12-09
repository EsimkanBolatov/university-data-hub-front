import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  X, Check, Minus, AlertCircle, Trash2, Eye, Download, Share2, 
  BookOpen, Users, MapPin, Star, GraduationCap, Award, DollarSign, 
  Building, Globe, Target, Filter, TrendingUp, Clock, Globe2, 
  Award as AwardIcon, ShieldCheck, Briefcase, Home, Library,
  Plus as PlusIcon
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components/ui/Card';

const Compare = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Получаем ID из localStorage или из параметров URL
  const [compareIds, setCompareIds] = useState(() => {
    // Пробуем получить из localStorage
    const savedIds = localStorage.getItem('universityCompareIds');
    if (savedIds) {
      return JSON.parse(savedIds);
    }
    // Пробуем получить из параметров URL
    const params = new URLSearchParams(location.search);
    const idsFromUrl = params.get('ids');
    if (idsFromUrl) {
      return idsFromUrl.split(',').map(id => parseInt(id));
    }
    // Возвращаем тестовые данные
    return [3, 5, 10]; // Satbayev, КБТУ, Туранский
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Сохраняем ID в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('universityCompareIds', JSON.stringify(compareIds));
  }, [compareIds]);

  // Обработка добавления университета из каталога
  useEffect(() => {
    const handleAddToCompare = (event) => {
      if (event.detail && event.detail.universityId) {
        const newId = event.detail.universityId;
        if (!compareIds.includes(newId)) {
          setCompareIds(prev => [...prev, newId]);
        }
      }
    };

    window.addEventListener('addToCompare', handleAddToCompare);
    
    return () => {
      window.removeEventListener('addToCompare', handleAddToCompare);
    };
  }, [compareIds]);

  const { data: comparisonData, isLoading, error } = useQuery({
    queryKey: ['compare', compareIds],
    queryFn: async () => {
      if (compareIds.length === 0) return [];
      
      try {
        // Если API не работает, используем тестовые данные
        // В реальности тут должен быть API запрос
        return generateMockData(compareIds);
      } catch (err) {
        console.error('Error fetching comparison data:', err);
        return generateMockData(compareIds);
      }
    },
    enabled: compareIds.length > 0,
    retry: 2,
  });

  const removeId = (id) => {
    setCompareIds(prev => prev.filter(i => i !== id));
  };

  const clearAll = () => {
    setCompareIds([]);
    localStorage.removeItem('universityCompareIds');
  };

  const addToCompare = () => {
    navigate('/catalog?from=compare');
  };

  // Генерация тестовых данных для демонстрации
  const generateMockData = (ids) => {
    const universities = [
      {
        id: 1,
        name_ru: "Назарбаев Университет",
        city: "Астана",
        rating: 9.8,
        type: "Международный",
        programs_count: 45,
        min_price: 6500000,
        employment_rate: 95,
        has_dormitory: true,
        international_programs: 25,
        students_count: 4500,
        description: "Ведущий исследовательский университет Казахстана с международными стандартами образования.",
        logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/NU_logo.svg/1200px-NU_logo.svg.png",
        accreditation: "Международная",
        established_year: 2010,
        address: "Кабанбай батыра 53, Астана",
        phone: "+7 (7172) 70-66-66",
        email: "info@nu.edu.kz",
        website: "https://nu.edu.kz",
        library_volume: "1.2 млн томов"
      },
      {
        id: 2,
        name_ru: "КазНУ им. аль-Фараби",
        city: "Алматы",
        rating: 9.5,
        type: "Национальный",
        programs_count: 120,
        min_price: 1200000,
        employment_rate: 88,
        has_dormitory: true,
        international_programs: 40,
        students_count: 25000,
        description: "Крупнейший классический университет Казахстана с богатой историей и традициями.",
        logo_url: "https://upload.wikimedia.org/wikipedia/ru/thumb/0/0c/KazNU_logo.svg/1200px-KazNU_logo.svg.png",
        accreditation: "Государственная",
        established_year: 1934,
        address: "проспект аль-Фараби 71, Алматы",
        phone: "+7 (727) 377-33-33",
        email: "info@kaznu.kz",
        website: "https://kaznu.kz",
        library_volume: "3.5 млн томов"
      },
      {
        id: 3,
        name_ru: "Satbayev University",
        city: "Алматы",
        rating: 9.3,
        type: "Исследовательский",
        programs_count: 68,
        min_price: 1800000,
        employment_rate: 92,
        has_dormitory: true,
        international_programs: 32,
        students_count: 12000,
        description: "Ведущий технический университет Казахстана в области инженерии и технологий.",
        logo_url: "https://satbayev.university/assets/images/logo.png",
        accreditation: "Международная",
        established_year: 1934,
        address: "ул. Сатпаева 22, Алматы",
        phone: "+7 (727) 292-58-08",
        email: "info@satbayev.university",
        website: "https://satbayev.university",
        library_volume: "800 тыс. томов"
      },
      {
        id: 4,
        name_ru: "ЕНУ им. Л.Н. Гумилева",
        city: "Астана",
        rating: 9.1,
        type: "Национальный",
        programs_count: 85,
        min_price: 1400000,
        employment_rate: 86,
        has_dormitory: true,
        international_programs: 35,
        students_count: 18000,
        description: "Крупный многопрофильный университет в столице Казахстана.",
        logo_url: "https://enu.kz/images/logo.svg",
        accreditation: "Государственная",
        established_year: 1996,
        address: "ул. Мунайтпасова 5, Астана",
        phone: "+7 (7172) 70-95-00",
        email: "info@enu.kz",
        website: "https://enu.kz",
        library_volume: "1.8 млн томов"
      },
      {
        id: 5,
        name_ru: "КБТУ",
        city: "Алматы",
        rating: 8.9,
        type: "Частный",
        programs_count: 52,
        min_price: 2200000,
        employment_rate: 90,
        has_dormitory: true,
        international_programs: 28,
        students_count: 8500,
        description: "Первый технический университет с британскими стандартами образования.",
        logo_url: "https://kbtu.edu.kz/images/logo.png",
        accreditation: "Международная",
        established_year: 2000,
        address: "ул. Толе би 59, Алматы",
        phone: "+7 (727) 260-40-40",
        email: "info@kbtu.edu.kz",
        website: "https://kbtu.edu.kz",
        library_volume: "650 тыс. томов"
      },
      {
        id: 6,
        name_ru: "Карагандинский университет им. Е.А. Букетова",
        city: "Караганда",
        rating: 8.7,
        type: "Государственный",
        programs_count: 76,
        min_price: 950000,
        employment_rate: 84,
        has_dormitory: true,
        international_programs: 22,
        students_count: 15000,
        description: "Ведущий вуз Центрального Казахстана с сильными научными школами.",
        logo_url: "https://kargu.kz/images/logo.png",
        accreditation: "Государственная",
        established_year: 1972,
        address: "ул. Университетская 28, Караганда",
        phone: "+7 (7212) 77-03-88",
        email: "info@kargu.kz",
        website: "https://kargu.kz",
        library_volume: "2.1 млн томов"
      },
      {
        id: 7,
        name_ru: "Таразский региональный университет",
        city: "Тараз",
        rating: 8.5,
        type: "Государственный",
        programs_count: 58,
        min_price: 850000,
        employment_rate: 82,
        has_dormitory: true,
        international_programs: 18,
        students_count: 11000,
        description: "Крупнейший вуз Жамбылской области с современной инфраструктурой.",
        logo_url: "https://taru.edu.kz/images/logo.png",
        accreditation: "Государственная",
        established_year: 1997,
        address: "ул. Сулейманова 7, Тараз",
        phone: "+7 (7262) 41-08-88",
        email: "info@taru.edu.kz",
        website: "https://taru.edu.kz",
        library_volume: "900 тыс. томов"
      },
      {
        id: 8,
        name_ru: "Южно-Казахстанский университет им. М. Ауэзова",
        city: "Шымкент",
        rating: 8.6,
        type: "Государственный",
        programs_count: 92,
        min_price: 900000,
        employment_rate: 83,
        has_dormitory: true,
        international_programs: 26,
        students_count: 22000,
        description: "Крупнейший университет Южного Казахстана с богатой историей.",
        logo_url: "https://www.ukgu.kz/images/logo.png",
        accreditation: "Государственная",
        established_year: 1943,
        address: "ул. Тауке хана 5, Шымкент",
        phone: "+7 (7252) 21-15-55",
        email: "info@ukgu.kz",
        website: "https://ukgu.kz",
        library_volume: "2.5 млн томов"
      },
      {
        id: 9,
        name_ru: "Восточно-Казахстанский технический университет",
        city: "Оскемен",
        rating: 8.4,
        type: "Технический",
        programs_count: 64,
        min_price: 920000,
        employment_rate: 85,
        has_dormitory: true,
        international_programs: 20,
        students_count: 9500,
        description: "Ведущий технический вуз Восточного Казахстана.",
        logo_url: "https://ektu.kz/images/logo.png",
        accreditation: "Государственная",
        established_year: 1958,
        address: "проспект Протазанова 69, Оскемен",
        phone: "+7 (7232) 26-26-26",
        email: "info@ektu.kz",
        website: "https://ektu.kz",
        library_volume: "1.1 млн томов"
      },
      {
        id: 10,
        name_ru: "Туранский университет",
        city: "Алматы",
        rating: 8.2,
        type: "Частный",
        programs_count: 48,
        min_price: 1600000,
        employment_rate: 81,
        has_dormitory: false,
        international_programs: 15,
        students_count: 6500,
        description: "Один из первых частных университетов Казахстана.",
        logo_url: "https://turan.edu.kz/images/logo.png",
        accreditation: "Государственная",
        established_year: 1992,
        address: "ул. Сатпаева 16А, Алматы",
        phone: "+7 (727) 260-40-50",
        email: "info@turan.edu.kz",
        website: "https://turan.edu.kz",
        library_volume: "750 тыс. томов"
      },
      {
        id: 11,
        name_ru: "Международный университет туризма и гостеприимства",
        city: "Туркистан",
        rating: 8.3,
        type: "Международный",
        programs_count: 32,
        min_price: 1100000,
        employment_rate: 87,
        has_dormitory: true,
        international_programs: 30,
        students_count: 5200,
        description: "Специализированный университет в сфере туризма и гостеприимства.",
        logo_url: "https://iuth.kz/images/logo.png",
        accreditation: "Международная",
        established_year: 1998,
        address: "ул. Жолдасбекова 9, Туркистан",
        phone: "+7 (72533) 5-12-34",
        email: "info@iuth.kz",
        website: "https://iuth.kz",
        library_volume: "450 тыс. томов"
      },
      {
        id: 12,
        name_ru: "Казахстанско-Британский технический университет",
        city: "Алматы",
        rating: 8.8,
        type: "Международный",
        programs_count: 42,
        min_price: 2400000,
        employment_rate: 91,
        has_dormitory: true,
        international_programs: 38,
        students_count: 4800,
        description: "Совместный проект с британскими университетами.",
        logo_url: "https://kbtu.edu.kz/images/logo2.png",
        accreditation: "Международная",
        established_year: 2001,
        address: "ул. Толе би 59, Алматы",
        phone: "+7 (727) 272-72-72",
        email: "info@kbtu.kz",
        website: "https://kbtu.kz",
        library_volume: "550 тыс. томов"
      }
    ];

    return ids.map(id => {
      const uni = universities.find(u => u.id === id);
      if (!uni) {
        // Если не найдено, создаем пустой объект
        return {
          id: id,
          name_ru: `Университет #${id}`,
          name_kz: `Университет #${id}`,
          city: 'Не указан',
          type: 'Не указан',
          rating: 0,
          description: 'Информация отсутствует',
          programs_count: 0,
          min_price: 0,
          has_dormitory: false,
          employment_rate: 0,
          international_programs: 0,
          accreditation: 'Не указана',
          library_volume: 'Не указан'
        };
      }
      return uni;
    }).filter(Boolean);
  };

  if (compareIds.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl mb-6 border border-blue-100 max-w-2xl">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3 text-center">Список сравнения пуст</h2>
          <p className="text-slate-600 text-center mb-8 max-w-md mx-auto">
            Добавьте университеты из каталога для сравнения по программам, стоимости и другим параметрам
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/catalog?from=compare" 
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 flex items-center justify-center gap-3"
            >
              <Filter className="h-5 w-5" />
              Перейти в каталог
            </Link>
            <button
              onClick={() => setCompareIds([3, 5, 10])}
              className="px-8 py-3.5 bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 font-medium flex items-center justify-center gap-3"
            >
              <Eye className="h-5 w-5" />
              Загрузить примеры
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl text-white">
              <Filter className="h-6 w-6" />
            </div>
            Сравнение университетов
          </h1>
          <p className="text-slate-600">
            Подробный анализ и сравнение параметров вузов Казахстана
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={clearAll}
            className="px-5 py-2.5 bg-gradient-to-r from-red-50 to-rose-50 text-red-600 hover:text-red-700 hover:from-red-100 hover:to-rose-100 border border-red-100 rounded-xl transition-all duration-300 font-medium flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Очистить все
          </button>
          <button
            onClick={addToCompare}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 rounded-xl transition-all duration-300 font-medium shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Добавить вуз
          </button>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 rounded-xl transition-all duration-300 font-medium flex items-center gap-2"
          >
            {showAdvanced ? (
              <>
                <Minus className="h-4 w-4" />
                Основные параметры
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                Расширенные
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-slate-600 mb-1">Сравниваем вузов</div>
              <div className="text-3xl font-bold text-slate-900">{compareIds.length}</div>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <GraduationCap className="h-6 w-6" />
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-slate-600 mb-1">Средний рейтинг</div>
              <div className="text-3xl font-bold text-slate-900">
                {comparisonData?.length 
                  ? (comparisonData.reduce((acc, uni) => acc + (uni.rating || 0), 0) / comparisonData.length).toFixed(1)
                  : '8.7'
                }
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white">
              <Star className="h-6 w-6" />
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-slate-600 mb-1">Средняя стоимость</div>
              <div className="text-3xl font-bold text-slate-900">
                {comparisonData?.length 
                  ? ((comparisonData.reduce((acc, uni) => acc + (uni.min_price || 0), 0) / comparisonData.length) / 1000000).toFixed(1) + 'M ₸'
                  : '1.2M ₸'
                }
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-slate-600 mb-1">Трудоустройство</div>
              <div className="text-3xl font-bold text-slate-900">
                {comparisonData?.length 
                  ? Math.round(comparisonData.reduce((acc, uni) => acc + (uni.employment_rate || 0), 0) / comparisonData.length) + '%'
                  : '85%'
                }
              </div>
            </div>
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white">
              <Briefcase className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-16 bg-gradient-to-r from-white to-slate-50 rounded-xl shadow-sm animate-pulse w-full border border-slate-100"></div>
          <div className="h-96 bg-gradient-to-r from-white to-slate-50 rounded-xl shadow-sm animate-pulse w-full border border-slate-100"></div>
        </div>
      ) : error ? (
        <div className="text-center p-8 bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl border border-red-100">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Ошибка загрузки данных</h3>
          <p className="text-slate-600 mb-4">Попробуйте обновить страницу или добавить другие университеты</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-medium"
          >
            Обновить страницу
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Comparison Table */}
          <Card className="overflow-hidden border-2 border-slate-100 hover:border-blue-200 transition-all duration-300">
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Основные параметры сравнения
              </h3>
              <p className="text-slate-600 text-sm mt-1">Ключевые показатели для выбора университета</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse">
                <thead>
                  <tr>
                    <th className="p-6 bg-slate-50 text-left w-80 border-b border-slate-200 font-semibold text-slate-700">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-blue-500" />
                        Параметры
                      </div>
                    </th>
                    {comparisonData?.map((uni) => (
  <th key={uni.id} className="p-6 border-b border-slate-200 min-w-[320px] relative bg-white align-top group">
    <div className="absolute top-4 right-4 flex gap-1">
      <button 
        onClick={() => removeId(uni.id)}
        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        title="Убрать из сравнения"
      >
        <X className="h-4 w-4" />
      </button>
      <Link 
        to={`/university/${uni.id}`}
        className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
        title="Открыть подробнее"
      >
        <Eye className="h-4 w-4" />
      </Link>
    </div>
    
    <div className="flex flex-col items-center text-center pt-8">
      <Link 
        to={`/university/${uni.id}`}
        className="text-xl font-bold text-slate-900 hover:text-blue-600 transition mb-2 hover:underline"
      >
        {uni.name_ru}
      </Link>
      <div className="flex items-center gap-2 text-slate-500 text-sm mb-4">
        <MapPin className="h-3 w-3" />
        {uni.city}
      </div>
      <div className="flex gap-2">
        <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-xs font-medium rounded-full flex items-center gap-1">
          <Star className="h-3 w-3" />
          {uni.rating || "—"}
        </span>
        <span className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
          {uni.type || "Государственный"}
        </span>
      </div>
    </div>
  </th>
))}
                    {/* Кнопка добавления нового университета */}
                    {compareIds.length < 4 && (
                      <th className="p-6 border-b border-slate-200 min-w-[200px] bg-white align-top">
                        <div className="flex flex-col items-center justify-center h-full">
                          <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-200 rounded-2xl mb-4 flex items-center justify-center p-2 group hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                               onClick={addToCompare}>
                            <PlusIcon className="h-8 w-8 text-slate-400 group-hover:text-blue-500" />
                          </div>
                          <div className="text-lg font-medium text-slate-900 mb-1">Добавить вуз</div>
                          <div className="text-sm text-slate-500 text-center">
                            Выберите из каталога
                          </div>
                        </div>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <ComparisonRow 
                    icon={<GraduationCap className="h-4 w-4 text-blue-500" />}
                    label="Об университете"
                    param="description"
                    data={comparisonData}
                    type="text"
                  />
                  
                  <ComparisonRow 
                    icon={<BookOpen className="h-4 w-4 text-emerald-500" />}
                    label="Количество программ"
                    param="programs_count"
                    data={comparisonData}
                    type="number"
                  />
                  
                  <ComparisonRow 
                    icon={<DollarSign className="h-4 w-4 text-amber-500" />}
                    label="Стоимость обучения (в год)"
                    param="min_price"
                    data={comparisonData}
                    type="price"
                  />
                  
                  <ComparisonRow 
                    icon={<Home className="h-4 w-4 text-purple-500" />}
                    label="Общежитие"
                    param="has_dormitory"
                    data={comparisonData}
                    type="boolean"
                  />
                  
                  <ComparisonRow 
                    icon={<Briefcase className="h-4 w-4 text-indigo-500" />}
                    label="Трудоустройство выпускников"
                    param="employment_rate"
                    data={comparisonData}
                    type="percent"
                  />
                  
                  <ComparisonRow 
                    icon={<Globe2 className="h-4 w-4 text-violet-500" />}
                    label="Международные программы"
                    param="international_programs"
                    data={comparisonData}
                    type="number"
                  />
                  
                  <ComparisonRow 
                    icon={<AwardIcon className="h-4 w-4 text-rose-500" />}
                    label="Аккредитация"
                    param="accreditation"
                    data={comparisonData}
                    type="text"
                  />
                  
                  <ComparisonRow 
                    icon={<Library className="h-4 w-4 text-cyan-500" />}
                    label="Библиотечный фонд"
                    param="library_volume"
                    data={comparisonData}
                    type="text"
                  />
                </tbody>
              </table>
            </div>
          </Card>

          {/* Advanced Comparison Section */}
          {showAdvanced && (
            <Card className="border-2 border-slate-100">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  Расширенное сравнение
                </h3>
                <p className="text-slate-600 text-sm mt-1">Детальный анализ академических и инфраструктурных показателей</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 p-6">
                {/* Academics */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    Академические показатели
                  </h4>
                  <div className="space-y-3">
                    {comparisonData?.map((uni, idx) => (
                      <div key={uni.id} className="bg-gradient-to-r from-slate-50 to-white p-4 rounded-xl border border-slate-100 hover:border-blue-200 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-800">{uni.name_ru}</span>
                          <span className="text-sm text-slate-500">#{idx + 1}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="space-y-1">
                            <div className="text-slate-500">Преподаватели с PhD</div>
                            <div className="font-semibold text-slate-900">{Math.floor(Math.random() * 60) + 40}%</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-slate-500">Научные публикации</div>
                            <div className="font-semibold text-slate-900">{Math.floor(Math.random() * 500) + 100}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-slate-500">Лаборатории</div>
                            <div className="font-semibold text-slate-900">{Math.floor(Math.random() * 20) + 5}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-slate-500">Гранты</div>
                            <div className="font-semibold text-slate-900">{Math.floor(Math.random() * 50) + 10}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Infrastructure */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Building className="h-4 w-4 text-emerald-500" />
                    Инфраструктура и кампус
                  </h4>
                  <div className="space-y-3">
                    {comparisonData?.map((uni, idx) => (
                      <div key={uni.id} className="bg-gradient-to-r from-slate-50 to-white p-4 rounded-xl border border-slate-100 hover:border-emerald-200 transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-800">{uni.name_ru}</span>
                          <span className="text-sm text-slate-500">#{idx + 1}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="space-y-1">
                            <div className="text-slate-500">Площадь кампуса</div>
                            <div className="font-semibold text-slate-900">{Math.floor(Math.random() * 50) + 10} га</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-slate-500">Спортивные объекты</div>
                            <div className="font-semibold text-slate-900">{Math.floor(Math.random() * 10) + 3}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-slate-500">Студенческие клубы</div>
                            <div className="font-semibold text-slate-900">{Math.floor(Math.random() * 30) + 5}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-slate-500">Wi-Fi покрытие</div>
                            <div className="font-semibold text-slate-900">100%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg shadow-blue-600/30 flex items-center gap-2">
              <Download className="h-5 w-5" />
              Экспорт в PDF
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-300 font-medium shadow-lg shadow-emerald-500/30 flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Поделиться сравнением
            </button>
            <Link 
              to="/ai-chat" 
              className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg shadow-violet-500/30 flex items-center gap-2"
            >
              <Briefcase className="h-5 w-5" />
              Получить AI рекомендацию
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const ComparisonRow = ({ icon, label, param, data, type }) => {
  const getValue = (uni, param, type) => {
    const value = uni[param];
    
    if (type === 'boolean') {
      return value ? (
        <div className="flex items-center justify-center gap-1 text-emerald-600">
          <Check className="h-4 w-4" />
          <span className="text-sm font-medium">Да</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-1 text-slate-400">
          <Minus className="h-4 w-4" />
          <span className="text-sm font-medium">Нет</span>
        </div>
      );
    }
    
    if (type === 'price') {
      return value ? (
        <div className="text-center">
          <div className="font-bold text-slate-900 text-lg">{value?.toLocaleString()} ₸</div>
          <div className="text-xs text-slate-500">в год</div>
        </div>
      ) : (
        <div className="text-center text-slate-400">—</div>
      );
    }
    
    if (type === 'percent') {
      return value ? (
        <div className="text-center">
          <div className={`font-bold text-lg ${value > 80 ? 'text-emerald-600' : value > 60 ? 'text-amber-600' : 'text-red-600'}`}>
            {value}%
          </div>
          <div className="text-xs text-slate-500">выпускников</div>
        </div>
      ) : (
        <div className="text-center text-slate-400">—</div>
      );
    }
    
    if (type === 'number') {
      return (
        <div className="text-center">
          <div className="font-bold text-slate-900 text-xl">{value || 0}</div>
        </div>
      );
    }
    
    return (
      <div className="text-center px-4">
        <div className="text-sm text-slate-700 line-clamp-2">{value || 'Информация не указана'}</div>
      </div>
    );
  };

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group/row">
      <td className="p-4 pl-6 font-medium text-slate-700 bg-slate-50/30 border-r border-slate-100">
        <div className="flex items-center gap-3">
          {icon}
          <span>{label}</span>
        </div>
      </td>
      {data?.map(uni => (
        <td key={uni.id} className="p-4 text-center align-middle">
          {getValue(uni, param, type)}
        </td>
      ))}
      {/* Пустая ячейка для кнопки добавления */}
      <td className="p-4"></td>
    </tr>
  );
};

export default Compare;