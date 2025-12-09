// src/components/ui/ModernMap.jsx
import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, ZoomOut, Maximize2, Minimize2, X, Filter, 
  ChevronDown, ChevronUp, MapPin, Users, GraduationCap,
  Target, Download, Settings, Layers, Navigation,
  BarChart2, PieChart, TrendingUp, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ModernMap = ({ onRegionSelect, className, isOpen = true, onClose }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [viewMode, setViewMode] = useState('map'); // map, stats, compare
  const [activeFilters, setActiveFilters] = useState({
    type: 'all',
    language: 'all',
    funding: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  
  const mapRef = useRef(null);

  // Заманауи анимациялық аймақтар деректері
  const regions = [
    {
      id: 'almaty',
      name: 'Алматы',
      nameKz: 'Алматы',
      coordinates: { x: 65, y: 35 },
      color: 'bg-gradient-to-br from-blue-400 to-cyan-500',
      colorLight: 'bg-blue-100',
      borderColor: 'border-blue-400',
      stats: {
        universities: 25,
        students: '185,000',
        growth: '+4.2%',
        rating: 9.2,
        international: 8,
        state: 17
      },
      topUnis: ['КазНУ', 'Satbayev', 'КазНПУ', 'КазУМО', 'АУЭС'],
      description: 'Ұлттық білім орталығы'
    },
    {
      id: 'astana',
      name: 'Астана',
      nameKz: 'Астана',
      coordinates: { x: 48, y: 32 },
      color: 'bg-gradient-to-br from-emerald-400 to-green-500',
      colorLight: 'bg-emerald-100',
      borderColor: 'border-emerald-400',
      stats: {
        universities: 14,
        students: '120,000',
        growth: '+6.8%',
        rating: 9.4,
        international: 5,
        state: 9
      },
      topUnis: ['НУ', 'ЕНУ', 'МУИТ', 'КазГЮУ', 'МУА'],
      description: 'Астаналық инновациялық орталық'
    },
    {
      id: 'shymkent',
      name: 'Шымкент',
      nameKz: 'Шымкент',
      coordinates: { x: 58, y: 48 },
      color: 'bg-gradient-to-br from-amber-400 to-orange-500',
      colorLight: 'bg-amber-100',
      borderColor: 'border-amber-400',
      stats: {
        universities: 8,
        students: '45,000',
        growth: '+3.1%',
        rating: 7.8,
        international: 2,
        state: 6
      },
      topUnis: ['ЮКГУ', 'Шымкент Университеті', 'Медициналық'],
      description: 'Оңтүстік аймақтың білім ордасы'
    },
    {
      id: 'karaganda',
      name: 'Караганда',
      nameKz: 'Қарағанды',
      coordinates: { x: 42, y: 40 },
      color: 'bg-gradient-to-br from-purple-400 to-violet-500',
      colorLight: 'bg-purple-100',
      borderColor: 'border-purple-400',
      stats: {
        universities: 6,
        students: '38,000',
        growth: '+2.5%',
        rating: 7.5,
        international: 1,
        state: 5
      },
      topUnis: ['КарГУ', 'Медициналық Университет', 'Техникалық'],
      description: 'Тау-кен білімінің орталығы'
    },
    {
      id: 'aktobe',
      name: 'Актобе',
      nameKz: 'Ақтөбе',
      coordinates: { x: 30, y: 40 },
      color: 'bg-gradient-to-br from-rose-400 to-pink-500',
      colorLight: 'bg-rose-100',
      borderColor: 'border-rose-400',
      stats: {
        universities: 5,
        students: '25,000',
        growth: '+2.8%',
        rating: 7.2,
        international: 1,
        state: 4
      },
      topUnis: ['АРГУ', 'Медицина академиясы'],
      description: 'Батыс білім гүлзары'
    },
    {
      id: 'atyrau',
      name: 'Атырау',
      nameKz: 'Атырау',
      coordinates: { x: 25, y: 42 },
      color: 'bg-gradient-to-br from-cyan-400 to-teal-500',
      colorLight: 'bg-cyan-100',
      borderColor: 'border-cyan-400',
      stats: {
        universities: 4,
        students: '18,000',
        growth: '+3.5%',
        rating: 7.0,
        international: 1,
        state: 3
      },
      topUnis: ['Атырау Университеті', 'Мұнай-газ институты'],
      description: 'Мұнай-газ білімінің ошағы'
    }
  ];

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    if (e.target.closest('.map-control') || e.target.closest('.region-marker')) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    if (onRegionSelect) {
      onRegionSelect(region);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Картаны SVG түрінде салу
  const renderMapSVG = () => (
    <motion.svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid meet"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Қазақстан контуры */}
      <path
        d="M100,100 L250,80 L400,120 L550,90 L650,150 L700,250 L650,350 L550,400 L450,450 L350,500 L250,450 L150,400 L80,350 L50,250 L60,150 Z"
        fill="#F8FAFC"
        stroke="#E2E8F0"
        strokeWidth="2"
        strokeDasharray="4,4"
      />
      
      {/* Облыстар */}
      {regions.map((region, idx) => {
        const isHovered = hoveredRegion === region.id;
        const isSelected = selectedRegion?.id === region.id;
        const x = region.coordinates.x * 8;
        const y = region.coordinates.y * 8;
        
        return (
          <g key={region.id}>
            {/* Облыс ауданы */}
            <motion.circle
              cx={x}
              cy={y}
              r={isSelected ? 30 : isHovered ? 25 : 20}
              fill="white"
              stroke={isSelected ? "#3B82F6" : isHovered ? "#60A5FA" : "#CBD5E1"}
              strokeWidth={isSelected ? 3 : isHovered ? 2 : 1.5}
              className="cursor-pointer region-marker"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setHoveredRegion(region.id)}
              onMouseLeave={() => setHoveredRegion(null)}
              onClick={() => handleRegionClick(region)}
            />
            
            {/* Орталық нүкте */}
            <motion.circle
              cx={x}
              cy={y}
              r={8}
              fill={isSelected ? "#3B82F6" : isHovered ? "#60A5FA" : "#94A3B8"}
              className="cursor-pointer"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1, type: "spring" }}
            />
            
            {/* Атауы */}
            {(isHovered || isSelected) && (
              <motion.g
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <rect
                  x={x - 50}
                  y={y - 45}
                  width="100"
                  height="30"
                  rx="8"
                  fill="white"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                  filter="url(#shadow)"
                />
                <text
                  x={x}
                  y={y - 25}
                  textAnchor="middle"
                  fill="#1E293B"
                  fontSize="12"
                  fontWeight="600"
                >
                  {region.name}
                </text>
              </motion.g>
            )}
            
            {/* Университеттер нүктелері */}
            {[0, 1, 2].map((i) => {
              const angle = (Math.PI * 2 * i) / 3;
              const markerX = x + Math.cos(angle) * 40;
              const markerY = y + Math.sin(angle) * 40;
              
              return (
                <motion.circle
                  key={i}
                  cx={markerX}
                  cy={markerY}
                  r="4"
                  fill="#10B981"
                  stroke="white"
                  strokeWidth="2"
                  className="cursor-pointer"
                  whileHover={{ scale: 1.5 }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.1 + i * 0.05, type: "spring" }}
                />
              );
            })}
          </g>
        );
      })}
      
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.1)" />
        </filter>
        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </motion.svg>
  );

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ type: "spring", damping: 25 }}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm ${className}`}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-7xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Үстіңгі панель */}
        <div className="absolute top-0 left-0 right-0 z-20 p-6 bg-gradient-to-r from-white to-white/95 backdrop-blur-lg border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Қазақстан ВУЗ картасы</h2>
                <p className="text-slate-500">Интерактивті карта - білім орталықтарын зерттеңіз</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode(viewMode === 'map' ? 'stats' : 'map')}
                className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                {viewMode === 'map' ? <BarChart2 className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 rounded-xl ${showFilters ? 'bg-primary-500 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'} transition-all`}
              >
                <Filter className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Негізгі мазмұн */}
        <div className="absolute top-20 bottom-0 left-0 right-0 flex">
          {/* Сол жақ панель - Фильтрлер */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="w-80 border-r border-slate-200 bg-white/95 backdrop-blur-sm overflow-y-auto p-6"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Фильтрлер</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Білім түрі</h4>
                    <div className="space-y-2">
                      {['Мемлекеттік', 'Жеке', 'Халықаралық', 'Қаржыландырылған'].map((type) => (
                        <label key={type} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer">
                          <div className="w-4 h-4 rounded border border-slate-300"></div>
                          <span className="text-sm text-slate-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Оқыту тілі</h4>
                    <div className="space-y-2">
                      {['Қазақ', 'Орыс', 'Ағылшын', 'Екі тілді'].map((lang) => (
                        <label key={lang} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer">
                          <div className="w-4 h-4 rounded border border-slate-300"></div>
                          <span className="text-sm text-slate-700">{lang}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ортаңғы бөлім - Карта */}
          <div 
            ref={mapRef}
            className={`flex-1 relative overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseDown={handleMouseDown}
          >
            {/* Карта */}
            <div 
              className="absolute inset-0"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                transition: isDragging ? 'none' : 'transform 0.2s ease',
              }}
            >
              {renderMapSVG()}
            </div>
            
            {/* Карта бақылау элементтері */}
            <div className="absolute top-6 left-6 flex flex-col gap-3">
              <motion.div 
                className="flex flex-col gap-2 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-xl border border-slate-200"
                whileHover={{ scale: 1.05 }}
              >
                <button
                  onClick={handleZoomIn}
                  className="p-3 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <ZoomIn className="h-5 w-5 text-slate-700" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-3 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <ZoomOut className="h-5 w-5 text-slate-700" />
                </button>
                <div className="h-px bg-slate-200"></div>
                <button
                  onClick={handleReset}
                  className="p-3 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <Target className="h-5 w-5 text-slate-700" />
                </button>
              </motion.div>
            </div>
            
            {/* Масштаб көрсеткіші */}
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl border border-slate-200">
              <div className="text-sm font-medium text-slate-700">
                Масштаб: <span className="font-bold">{Math.round(zoom * 100)}%</span>
              </div>
            </div>
            
            {/* Легенда */}
            <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-slate-200 max-w-xs">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-semibold text-slate-900">Легенда</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-slate-700">Мемлекеттік ВУЗ</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs text-slate-700">Халықаралық ВУЗ</span>
                </div>
                <div className="h-px bg-slate-200"></div>
                <div className="grid grid-cols-2 gap-2">
                  {regions.slice(0, 4).map(region => (
                    <div key={region.id} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${region.color}`}></div>
                      <span className="text-xs text-slate-700 truncate">{region.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Оң жақ панель - Статистика */}
          <motion.div 
            className="w-96 border-l border-slate-200 bg-white/95 backdrop-blur-sm overflow-y-auto"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-6">Аймақ статистикасы</h3>
              
              {/* Таңдалған аймақ */}
              {selectedRegion ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <div className={`p-6 rounded-2xl ${selectedRegion.colorLight} border ${selectedRegion.borderColor}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-slate-900">{selectedRegion.name}</h4>
                      <div className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700">
                        {selectedRegion.description}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="h-4 w-4 text-slate-500" />
                          <span className="text-sm text-slate-600">Университеттер</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{selectedRegion.stats.universities}</div>
                      </div>
                      <div className="bg-white rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-slate-500" />
                          <span className="text-sm text-slate-600">Студенттер</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{selectedRegion.stats.students}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Өсу қарқыны</span>
                        <span className="text-sm font-medium text-emerald-600">{selectedRegion.stats.growth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-slate-600">Орташа рейтинг</span>
                        <span className="text-sm font-medium text-amber-600">{selectedRegion.stats.rating}/10</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Картадан аймақты таңдаңыз</p>
                </div>
              )}
              
              {/* Жалпы статистика */}
              <div className="space-y-6">
                <h4 className="font-semibold text-slate-900">Жалпы көрсеткіштер</h4>
                
                <div className="space-y-4">
                  {[
                    { label: 'Барлық ВУЗ', value: '127', change: '+2', color: 'bg-blue-500' },
                    { label: 'Барлық студент', value: '550K+', change: '+5.3%', color: 'bg-emerald-500' },
                    { label: 'Халықаралық ВУЗ', value: '23', change: '+3', color: 'bg-amber-500' },
                    { label: 'Орташа рейтинг', value: '8.1', change: '+0.2', color: 'bg-purple-500' },
                  ].map((stat, idx) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-8 rounded-full ${stat.color}`}></div>
                        <div>
                          <div className="text-sm font-medium text-slate-700">{stat.label}</div>
                          <div className="text-xs text-slate-500">Соңғы айда</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">{stat.value}</div>
                        <div className="text-xs text-emerald-600">{stat.change}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Топ университеттер */}
              <div className="mt-8">
                <h4 className="font-semibold text-slate-900 mb-4">Топ университеттер</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Назарбаев Университет', city: 'Астана', rating: 9.8 },
                    { name: 'КазНУ им. аль-Фараби', city: 'Алматы', rating: 9.5 },
                    { name: 'Satbayev University', city: 'Алматы', rating: 9.3 },
                    { name: 'ЕНУ им. Л.Н. Гумилева', city: 'Астана', rating: 9.1 },
                  ].map((uni, idx) => (
                    <div
                      key={uni.name}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white ${
                          idx === 0 ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                          idx === 1 ? 'bg-gradient-to-br from-slate-500 to-slate-600' :
                          'bg-gradient-to-br from-slate-400 to-slate-500'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-800">{uni.name}</div>
                          <div className="text-xs text-slate-500">{uni.city}</div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-primary-600">{uni.rating}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Төменгі панель - Экспорт батырмалары */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-lg border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Деректер жаңартылды: {new Date().toLocaleDateString('kk-KZ')}
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                <Download className="h-4 w-4" />
                Экспорт
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 text-sm font-medium transition-all">
                Толық статистика
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ModernMap;