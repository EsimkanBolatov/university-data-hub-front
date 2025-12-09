import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Filter, Star, MapPin, Search, X, Grid, List, 
  GraduationCap, Building, Users, BookOpen, 
  DollarSign, Target, TrendingUp, Eye, Heart, GitCompare,
  ChevronDown, ChevronUp, Briefcase, Home, ArrowRight,
  Building2, School, Landmark, Phone, Mail, Globe,
  Award, Calendar, Clock, CheckCircle, ExternalLink,
  Plus
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { cn } from '../utils/cn';

// Қазақстанның негізгі университеттерінің мәліметтері
const universitiesData = [
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
    image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/NU_logo.svg/1200px-NU_logo.svg.png",
    accreditation: "Международная",
    established_year: 2010,
    address: "Кабанбай батыра 53, Астана",
    phone: "+7 (7172) 70-66-66",
    email: "info@nu.edu.kz",
    website: "https://nu.edu.kz"
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
    image_url: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    logo_url: "https://upload.wikimedia.org/wikipedia/ru/thumb/0/0c/KazNU_logo.svg/1200px-KazNU_logo.svg.png",
    accreditation: "Государственная",
    established_year: 1934,
    address: "проспект аль-Фараби 71, Алматы",
    phone: "+7 (727) 377-33-33",
    email: "info@kaznu.kz",
    website: "https://kaznu.kz"
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
    image_url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    logo_url: "https://satbayev.university/assets/images/logo.png",
    accreditation: "Международная",
    established_year: 1934,
    address: "ул. Сатпаева 22, Алматы",
    phone: "+7 (727) 292-58-08",
    email: "info@satbayev.university",
    website: "https://satbayev.university"
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
    image_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    logo_url: "https://enu.kz/images/logo.svg",
    accreditation: "Государственная",
    established_year: 1996,
    address: "ул. Мунайтпасова 5, Астана",
    phone: "+7 (7172) 70-95-00",
    email: "info@enu.kz",
    website: "https://enu.kz"
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
    image_url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    logo_url: "https://kbtu.edu.kz/images/logo.png",
    accreditation: "Международная",
    established_year: 2000,
    address: "ул. Толе би 59, Алматы",
    phone: "+7 (727) 260-40-40",
    email: "info@kbtu.edu.kz",
    website: "https://kbtu.edu.kz"
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
    image_url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    logo_url: "https://kargu.kz/images/logo.png",
    accreditation: "Государственная",
    established_year: 1972,
    address: "ул. Университетская 28, Караганда",
    phone: "+7 (7212) 77-03-88",
    email: "info@kargu.kz",
    website: "https://kargu.kz"
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
    image_url: "https://images.unsplash.com/photo-1568607689150-17e625c1586e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    logo_url: "https://taru.edu.kz/images/logo.png",
    accreditation: "Государственная",
    established_year: 1997,
    address: "ул. Сулейманова 7, Тараз",
    phone: "+7 (7262) 41-08-88",
    email: "info@taru.edu.kz",
    website: "https://taru.edu.kz"
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
    image_url: "https://images.unsplash.com/photo-1576495199012-b0214ab25a7a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    logo_url: "https://www.ukgu.kz/images/logo.png",
    accreditation: "Государственная",
    established_year: 1943,
    address: "ул. Тауке хана 5, Шымкент",
    phone: "+7 (7252) 21-15-55",
    email: "info@ukgu.kz",
    website: "https://ukgu.kz"
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
    image_url: "https://images.unsplash.com/photo-1524178234883-043d5c3f3cf4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    logo_url: "https://ektu.kz/images/logo.png",
    accreditation: "Государственная",
    established_year: 1958,
    address: "проспект Протазанова 69, Оскемен",
    phone: "+7 (7232) 26-26-26",
    email: "info@ektu.kz",
    website: "https://ektu.kz"
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
    image_url: "https://images.unsplash.com/photo-1524178234883-043d5c3f3cf4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    logo_url: "https://turan.edu.kz/images/logo.png",
    accreditation: "Государственная",
    established_year: 1992,
    address: "ул. Сатпаева 16А, Алматы",
    phone: "+7 (727) 260-40-50",
    email: "info@turan.edu.kz",
    website: "https://turan.edu.kz"
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
    image_url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    logo_url: "https://iuth.kz/images/logo.png",
    accreditation: "Международная",
    established_year: 1998,
    address: "ул. Жолдасбекова 9, Туркистан",
    phone: "+7 (72533) 5-12-34",
    email: "info@iuth.kz",
    website: "https://iuth.kz"
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
    image_url: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    logo_url: "https://kbtu.edu.kz/images/logo2.png",
    accreditation: "Международная",
    established_year: 2001,
    address: "ул. Толе би 59, Алматы",
    phone: "+7 (727) 272-72-72",
    email: "info@kbtu.kz",
    website: "https://kbtu.kz"
  }
];

const cities = ['Алматы', 'Астана', 'Шымкент', 'Караганда', 'Тараз', 'Оскемен', 'Туркистан'];
const types = ['Государственный', 'Частный', 'Международный', 'Национальный', 'Исследовательский', 'Технический'];

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [expandedId, setExpandedId] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [selectedUni, setSelectedUni] = useState(null);

  // Сравнение списокті localStorage-тан аламыз
  const [compareList, setCompareList] = useState(() => {
    const savedIds = localStorage.getItem('universityCompareIds');
    return savedIds ? new Set(JSON.parse(savedIds)) : new Set();
  });

  const [filters, setFilters] = useState({
    query: searchParams.get('query') || '',
    city: searchParams.get('city') || '',
    type: searchParams.get('type') || '',
    min_rating: searchParams.get('min_rating') || '',
    max_price: searchParams.get('max_price') || '',
    has_dormitory: searchParams.get('has_dormitory') || '',
    has_international: searchParams.get('has_international') || '',
    employment_rate: searchParams.get('employment_rate') || '',
  });

  // Mock API simulation
  const { data: universities, isLoading } = useQuery({
    queryKey: ['universities', filters],
    queryFn: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          let filtered = [...universitiesData];
          
          if (filters.query) {
            const query = filters.query.toLowerCase();
            filtered = filtered.filter(uni => 
              uni.name_ru.toLowerCase().includes(query) ||
              uni.description.toLowerCase().includes(query)
            );
          }
          
          if (filters.city) {
            filtered = filtered.filter(uni => uni.city === filters.city);
          }
          
          if (filters.type) {
            filtered = filtered.filter(uni => uni.type === filters.type);
          }
          
          if (filters.min_rating) {
            filtered = filtered.filter(uni => uni.rating >= parseFloat(filters.min_rating));
          }
          
          if (filters.max_price) {
            filtered = filtered.filter(uni => uni.min_price <= parseInt(filters.max_price));
          }
          
          if (filters.has_dormitory === 'true') {
            filtered = filtered.filter(uni => uni.has_dormitory);
          }
          
          if (filters.has_international === 'true') {
            filtered = filtered.filter(uni => uni.international_programs > 0);
          }
          
          if (filters.employment_rate) {
            filtered = filtered.filter(uni => uni.employment_rate >= parseInt(filters.employment_rate));
          }
          
          resolve(filtered);
        }, 300);
      });
    },
  });

  useEffect(() => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value.toString();
    });
    setSearchParams(params);
  }, [filters]);

  // Сравнениеге қосу функциясы
  const handleAddToCompare = (universityId) => {
    // Добавляем в localStorage
    const currentIds = JSON.parse(localStorage.getItem('universityCompareIds') || '[]');
    if (!currentIds.includes(universityId)) {
      if (currentIds.length < 4) {
        const newIds = [...currentIds, universityId];
        localStorage.setItem('universityCompareIds', JSON.stringify(newIds));
        setCompareList(new Set(newIds));
        
        // Отправляем событие для обновления страницы сравнения
        window.dispatchEvent(new CustomEvent('addToCompare', { 
          detail: { universityId } 
        }));
        
        // Показываем уведомление
        alert('Университет добавлен в сравнение');
      } else {
        alert('Максимум можно добавить 4 университета для сравнения');
      }
    } else {
      // Если уже есть, удаляем
      const newIds = currentIds.filter(id => id !== universityId);
      localStorage.setItem('universityCompareIds', JSON.stringify(newIds));
      setCompareList(new Set(newIds));
      
      window.dispatchEvent(new CustomEvent('addToCompare', { 
        detail: { universityId } 
      }));
      
      alert('Университет удален из сравнения');
    }
  };

  // Сравнениеге өту функциясы
  const goToCompare = () => {
    const compareIds = Array.from(compareList);
    if (compareIds.length > 0) {
      navigate(`/compare?ids=${compareIds.join(',')}`);
    } else {
      alert('Добавьте университеты для сравнения');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleUniClick = (uni) => {
    setSelectedUni(uni);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="mb-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 p-6 text-white">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-20 translate-x-20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
              <Landmark className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Каталог университетов Казахстана</h1>
              <p className="text-sm text-blue-100 mt-1">
                Найдите подходящий вуз и получите подробную информацию
              </p>
            </div>
          </div>
          
          {/* City Quick Filters */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-blue-200" />
              <span className="text-sm font-medium text-blue-100">Выберите город:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => handleFilterChange('city', filters.city === city ? '' : city)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 backdrop-blur-sm",
                    filters.city === city 
                      ? "bg-white text-blue-700 shadow-md" 
                      : "bg-white/10 text-blue-100 hover:bg-white/20"
                  )}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected University Info Modal */}
      {selectedUni && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">{selectedUni.name_ru}</h2>
              <button 
                onClick={() => setSelectedUni(null)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6">
              {/* University Header */}
              <div className="flex flex-col lg:flex-row gap-6 mb-6">
                <div className="lg:w-1/3">
                  <img 
                    src={selectedUni.image_url} 
                    alt={selectedUni.name_ru}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span className="font-bold text-slate-900">Рейтинг: {selectedUni.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="text-slate-600">{selectedUni.city}</span>
                  </div>
                </div>
                
                <div className="lg:w-2/3">
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Основная информация</h3>
                  <p className="text-slate-600 mb-4">{selectedUni.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Тип</div>
                      <div className="font-semibold text-slate-900">{selectedUni.type}</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Год основания</div>
                      <div className="font-semibold text-slate-900">{selectedUni.established_year}</div>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Аккредитация</div>
                      <div className="font-semibold text-slate-900">{selectedUni.accreditation}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Контактная информация</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-500" />
                    <span className="text-slate-600">{selectedUni.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-500" />
                    <span className="text-slate-600">{selectedUni.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    <span className="text-slate-600">{selectedUni.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <a href={selectedUni.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {selectedUni.website}
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Programs and Stats */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Академические программы</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Количество программ</span>
                      <span className="font-semibold text-slate-900">{selectedUni.programs_count}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Международные программы</span>
                      <span className="font-semibold text-slate-900">{selectedUni.international_programs}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Стоимость обучения</span>
                      <span className="font-semibold text-slate-900">{selectedUni.min_price.toLocaleString()} ₸/год</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Статистика</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Количество студентов</span>
                      <span className="font-semibold text-slate-900">{selectedUni.students_count.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Трудоустройство выпускников</span>
                      <span className="font-semibold text-slate-900">{selectedUni.employment_rate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Общежитие</span>
                      <span className="font-semibold text-slate-900">{selectedUni.has_dormitory ? 'Есть' : 'Нет'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-3 mt-8 pt-6 border-t border-slate-200">
                <button
                  onClick={() => navigate(`/university/${selectedUni.id}`)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-medium text-sm flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Подробнее о вузе
                </button>
                <button
                  onClick={() => navigate(`/university/${selectedUni.id}/programs`)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 font-medium text-sm flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Смотреть программы
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-600">
            <span className="font-bold text-slate-900">{universities?.length || 0}</span> университетов найдено
          </div>
          {Object.values(filters).some(v => v) && (
            <button 
              onClick={() => setFilters({})}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 hover:underline"
            >
              <X className="h-3 w-3" />
              Сбросить фильтры
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                "p-1.5 rounded-md transition-all duration-200",
                viewMode === 'grid' ? "bg-blue-100 text-blue-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              )}
              title="Плитка"
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "p-1.5 rounded-md transition-all duration-200",
                viewMode === 'list' ? "bg-blue-100 text-blue-600" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              )}
              title="Список"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          
          {compareList.size > 0 && (
            <button
              onClick={goToCompare}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all duration-300 text-sm font-medium shadow-md flex items-center gap-1"
            >
              <GitCompare className="h-3.5 w-3.5" />
              Сравнить ({compareList.size})
            </button>
          )}
          
          <button
            onClick={() => setShowFilters(true)}
            className="lg:hidden px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 text-sm font-medium shadow-md flex items-center gap-1"
          >
            <Filter className="h-3.5 w-3.5" />
            Фильтры
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* SIDEBAR FILTERS */}
        <aside className={cn(
          "lg:w-72 shrink-0 space-y-4 lg:block",
          showFilters ? "fixed inset-0 z-40 bg-white p-4 overflow-y-auto" : "hidden"
        )}>
          {/* Mobile Header */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Filter className="h-4 w-4 text-blue-500" />
              Фильтры
            </h2>
            <button 
              onClick={() => setShowFilters(false)}
              className="p-1.5 hover:bg-slate-100 rounded transition-colors"
            >
              <X className="h-5 w-5 text-slate-500"/>
            </button>
          </div>

          <Card className="sticky top-20 space-y-4 border-slate-200 shadow-md p-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" />
                Поиск
              </h2>
              <button 
                onClick={() => setFilters({})} 
                className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                Сбросить
              </button>
            </div>

            {/* Search */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5 text-slate-400" />
                По названию
              </label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Введите название..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                Город
              </label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-slate-700"
              >
                <option value="">Все города</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-slate-400" />
                Тип ВУЗа
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-slate-700"
              >
                <option value="">Все типы</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Star className="h-3.5 w-3.5 text-amber-400" />
                Рейтинг
              </label>
              <div className="flex flex-wrap gap-1.5">
                {[4.5, 4.0, 3.5, 3.0].map(rating => (
                  <button
                    key={rating}
                    onClick={() => handleFilterChange('min_rating', rating === parseFloat(filters.min_rating) ? '' : rating)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 flex items-center gap-1",
                      parseFloat(filters.min_rating) === rating 
                        ? "bg-amber-50 text-amber-700 border-amber-200" 
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                    )}
                  >
                    <Star className="h-3 w-3" />
                    {rating}+
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                Цена до
              </label>
              <select
                value={filters.max_price}
                onChange={(e) => handleFilterChange('max_price', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-slate-700"
              >
                <option value="">Любая</option>
                <option value="1000000">1,000,000 ₸</option>
                <option value="2000000">2,000,000 ₸</option>
                <option value="3000000">3,000,000 ₸</option>
              </select>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Особенности</label>
              
              <label className="flex items-center gap-2 p-2 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={filters.has_dormitory === 'true'}
                  onChange={(e) => handleFilterChange('has_dormitory', e.target.checked ? 'true' : '')}
                  className="h-3.5 w-3.5 text-blue-600 rounded border-slate-300"
                />
                <Home className="h-3.5 w-3.5 text-blue-500" />
                <span className="text-xs text-slate-700">С общежитием</span>
              </label>
            </div>
          </Card>
        </aside>

        {/* MAIN CONTENT */}
        <div className="flex-1">
          {isLoading ? (
            <div className={cn(
              "grid gap-4",
              viewMode === 'grid' ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
            )}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-gradient-to-r from-white to-slate-50 border border-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : universities?.length === 0 ? (
            <Card className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Университеты не найдены</h3>
              <p className="text-slate-600 text-sm mb-4">Попробуйте изменить параметры поиска</p>
              <button 
                onClick={() => setFilters({})}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 text-sm font-medium shadow-md"
              >
                Показать все университеты
              </button>
            </Card>
          ) : (
            <>
              {/* University Grid/List */}
              <div className={cn(
                "grid gap-4",
                viewMode === 'grid' ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
              )}>
                {universities?.map((uni) => (
                  <UniversityCard
                    key={uni.id}
                    uni={uni}
                    viewMode={viewMode}
                    expandedId={expandedId}
                    setExpandedId={setExpandedId}
                    isFavorite={favorites.has(uni.id)}
                    toggleFavorite={() => toggleFavorite(uni.id)}
                    isInCompare={compareList.has(uni.id)}
                    handleAddToCompare={() => handleAddToCompare(uni.id)}
                    onUniClick={() => handleUniClick(uni)}
                    navigate={navigate}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const UniversityCard = ({ 
  uni, 
  viewMode, 
  expandedId, 
  setExpandedId, 
  isFavorite, 
  toggleFavorite, 
  isInCompare, 
  handleAddToCompare,
  onUniClick,
  navigate 
}) => {
  const isExpanded = expandedId === uni.id;

  return (
    <Card className="h-full overflow-hidden group transition-all duration-300 border hover:shadow-md border-slate-200 cursor-pointer"
      onClick={onUniClick}
    >
      {/* Image Section */}
      <div className={cn(
        "relative overflow-hidden",
        viewMode === 'list' ? "md:w-48 h-40 md:h-auto" : "h-40"
      )}>
        <img 
          src={uni.image_url} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          alt={uni.name_ru}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/15 to-transparent"></div>
        
        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
          <Star className="h-2.5 w-2.5 fill-white" />
          {uni.rating.toFixed(1)}
        </div>
        
        {/* City Badge */}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-slate-900 flex items-center gap-1 shadow-sm">
          <MapPin className="h-2.5 w-2.5 text-blue-500" />
          {uni.city}
        </div>
      </div>

      {/* Content Section */}
      <div className={cn(
        "p-3 flex-1 flex flex-col",
        viewMode === 'list' && "md:p-3"
      )}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 mb-1 hover:text-blue-600 transition-colors line-clamp-2 text-sm leading-tight">
              {uni.name_ru}
            </h3>
            
            <div className="flex flex-wrap gap-1 mb-2">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                {uni.type}
              </span>
              {uni.has_dormitory && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                  Общежитие
                </span>
              )}
              {uni.international_programs > 0 && (
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                  Международный
                </span>
              )}
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpandedId(isExpanded ? null : uni.id);
            }}
            className="p-1 hover:bg-slate-100 rounded transition-colors ml-1"
          >
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            )}
          </button>
        </div>
        
        <p className="text-xs text-slate-600 mb-3 line-clamp-2 flex-grow">
          {uni.description}
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 mb-3">
          <div className="bg-slate-50 rounded p-1.5">
            <div className="flex items-center gap-1 text-slate-500 text-xs mb-0.5">
              <BookOpen className="h-2.5 w-2.5" />
              Программы
            </div>
            <div className="font-bold text-slate-900 text-sm">{uni.programs_count}</div>
          </div>
          <div className="bg-slate-50 rounded p-1.5">
            <div className="flex items-center gap-1 text-slate-500 text-xs mb-0.5">
              <DollarSign className="h-2.5 w-2.5" />
              Стоимость
            </div>
            <div className="font-bold text-slate-900 text-xs">{uni.min_price.toLocaleString()} ₸</div>
          </div>
          <div className="bg-slate-50 rounded p-1.5">
            <div className="flex items-center gap-1 text-slate-500 text-xs mb-0.5">
              <Briefcase className="h-2.5 w-2.5" />
              Трудоустройство
            </div>
            <div className="font-bold text-slate-900 text-sm">{uni.employment_rate}%</div>
          </div>
          <div className="bg-slate-50 rounded p-1.5">
            <div className="flex items-center gap-1 text-slate-500 text-xs mb-0.5">
              <Users className="h-2.5 w-2.5" />
              Студенты
            </div>
            <div className="font-bold text-slate-900 text-sm">
              {uni.students_count >= 1000 
                ? `${(uni.students_count / 1000).toFixed(0)}K`
                : uni.students_count}
            </div>
          </div>
        </div>
        
        <div className="flex gap-1.5 mt-2 pt-2 border-t border-slate-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/university/${uni.id}`);
            }}
            className="px-2.5 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 text-xs font-medium flex items-center gap-1 flex-1 justify-center"
          >
            <Eye className="h-3 w-3" />
            Подробнее
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCompare();
            }}
            className={cn(
              "px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 rounded hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 text-xs font-medium flex items-center gap-1 justify-center",
              isInCompare && "bg-emerald-100 text-emerald-700 border-emerald-200"
            )}
          >
            <GitCompare className="h-3 w-3" />
            Сравнить
          </button>
        </div>
      </div>
    </Card>
  );
};

export default Catalog;