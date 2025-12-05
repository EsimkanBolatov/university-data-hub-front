// src/components/ui/GoogleMap.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  ZoomIn, ZoomOut, X, Filter, 
  MapPin, Users, GraduationCap,
  Target, Download, Layers, Globe,
  BarChart2, TrendingUp,
  Search, Maximize2, Minimize2,
  ExternalLink,
  University, Globe as GlobeIcon,
  Loader2
} from 'lucide-react';

// Google Maps API загрузить үшін скрипт
const loadGoogleMapsScript = (callback) => {
  if (window.google && window.google.maps) {
    callback();
    return;
  }

  // Ескі скрипттерді жою
  const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
  existingScripts.forEach(script => script.remove());

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAiVRT89T8O9MqKDs-iFY0Q4Tj6uviM8L8&libraries=places&v=weekly`;
  script.async = true;
  script.defer = true;
  script.onload = callback;
  script.onerror = (error) => {
    console.error('Google Maps API жүктеу қатесі:', error);
  };
  document.head.appendChild(script);
};

const GoogleMap = ({ onRegionSelect, isOpen = true, onClose }) => {
  const [map, setMap] = useState(null);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [infoWindows, setInfoWindows] = useState([]);
  
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  // Университеттер деректері
  const universities = [
    {
      id: 1,
      name: 'Назарбаев Университет',
      nameKz: 'Назарбаев Университеті',
      city: 'Астана',
      coordinates: { lat: 51.0908, lng: 71.4183 },
      type: 'international',
      rating: 9.8,
      students: '4500',
      founded: 2010,
      website: 'https://nu.edu.kz',
      description: 'Халықаралық зерттеу университеті',
      programs: ['Инженерия', 'Гуманитарлық ғылымдар', 'Бизнес'],
      color: '#FF6B35',
      icon: '🏛️'
    },
    {
      id: 2,
      name: 'КазНУ им. аль-Фараби',
      nameKz: 'Әл-Фараби атындағы ҚазҰУ',
      city: 'Алматы',
      coordinates: { lat: 43.2301, lng: 76.9115 },
      type: 'state',
      rating: 9.5,
      students: '25000',
      founded: 1934,
      website: 'https://www.kaznu.kz',
      description: 'Қазақстанның ең үлкен университеті',
      programs: ['Филология', 'Биология', 'Химия', 'Физика'],
      color: '#3B82F6',
      icon: '🎓'
    },
    {
      id: 3,
      name: 'Satbayev University',
      nameKz: 'Сәтбаев Университеті',
      city: 'Алматы',
      coordinates: { lat: 43.2350, lng: 76.9150 },
      type: 'state',
      rating: 9.3,
      students: '12000',
      founded: 1934,
      website: 'https://satbayev.university',
      description: 'Техникалық және инженерлік университет',
      programs: ['Тау-кен ісі', 'Информатика', 'Машина жасау'],
      color: '#10B981',
      icon: '⚙️'
    },
    {
      id: 4,
      name: 'ЕНУ им. Л.Н. Гумилева',
      nameKz: 'Л.Н. Гумилев атындағы ЕҰУ',
      city: 'Астана',
      coordinates: { lat: 51.1694, lng: 71.4491 },
      type: 'state',
      rating: 9.1,
      students: '18000',
      founded: 1996,
      website: 'https://enu.edu.kz',
      description: 'Көпсалалы мемлекеттік университет',
      programs: ['Құқық', 'Экономика', 'Халықаралық қатынастар'],
      color: '#8B5CF6',
      icon: '🏢'
    },
    {
      id: 5,
      name: 'КБТУ',
      nameKz: 'ҚБТУ',
      city: 'Алматы',
      coordinates: { lat: 43.2400, lng: 76.9200 },
      type: 'private',
      rating: 8.9,
      students: '8500',
      founded: 2001,
      website: 'https://kbtu.edu.kz',
      description: 'Бизнес және технология университеті',
      programs: ['Бизнес', 'Информатика', 'Энергетика'],
      color: '#F59E0B',
      icon: '💼'
    },
    {
      id: 6,
      name: 'КазНПУ им. Абая',
      nameKz: 'Абай атындағы ҚазҰПУ',
      city: 'Алматы',
      coordinates: { lat: 43.2450, lng: 76.9250 },
      type: 'state',
      rating: 8.7,
      students: '15000',
      founded: 1928,
      website: 'https://www.kaznpu.kz',
      description: 'Педагогикалық университет',
      programs: ['Педагогика', 'Психология', 'Әдебиет'],
      color: '#EC4899',
      icon: '📚'
    },
    {
      id: 7,
      name: 'МУИТ',
      nameKz: 'МҰИТ',
      city: 'Астана',
      coordinates: { lat: 51.1500, lng: 71.4300 },
      type: 'state',
      rating: 8.5,
      students: '9000',
      founded: 1997,
      website: 'https://www.astanait.edu.kz',
      description: 'Ақпараттық технологиялар университеті',
      programs: ['Информатика', 'Киберқауіпсіздік', 'Жасанды интеллект'],
      color: '#06B6D4',
      icon: '💻'
    },
    {
      id: 8,
      name: 'ЮКГУ им. М. Ауезова',
      nameKz: 'М. Әуезов атындағы ОҚҰУ',
      city: 'Шымкент',
      coordinates: { lat: 42.3186, lng: 69.5869 },
      type: 'state',
      rating: 8.2,
      students: '22000',
      founded: 1943,
      website: 'https://www.okgu.kz',
      description: 'Оңтүстік қазақстанның ірі университеті',
      programs: ['Медицина', 'Технология', 'Гуманитарлық ғылымдар'],
      color: '#8B5CF6',
      icon: '🏥'
    },
    {
      id: 9,
      name: 'КарГУ им. Е.А. Букетова',
      nameKz: 'Е.А. Бөкетов атындағы ҚарҰУ',
      city: 'Қарағанды',
      coordinates: { lat: 49.8047, lng: 73.1019 },
      type: 'state',
      rating: 8.0,
      students: '16000',
      founded: 1972,
      website: 'https://ksu.kz',
      description: 'Орталық қазақстанның ірі университеті',
      programs: ['Тау-кен ісі', 'Медицина', 'Педагогика'],
      color: '#6366F1',
      icon: '⛏️'
    },
    {
      id: 10,
      name: 'АРГУ им. К. Жубанова',
      nameKz: 'Қ. Жұбанов атындағы Ақтөбе ӨҚТУ',
      city: 'Ақтөбе',
      coordinates: { lat: 50.2797, lng: 57.2072 },
      type: 'state',
      rating: 7.8,
      students: '12000',
      founded: 1966,
      website: 'https://argu.kz',
      description: 'Батыс қазақстанның ірі университеті',
      programs: ['Инженерия', 'Педагогика', 'Экономика'],
      color: '#F97316',
      icon: '🏭'
    }
  ];

  // Қалалар бойынша университеттер
  const cities = [
    { name: 'Алматы', count: 25, coordinates: { lat: 43.2220, lng: 76.8512 } },
    { name: 'Астана', count: 14, coordinates: { lat: 51.1282, lng: 71.4304 } },
    { name: 'Шымкент', count: 8, coordinates: { lat: 42.3150, lng: 69.5930 } },
    { name: 'Қарағанды', count: 6, coordinates: { lat: 49.8019, lng: 73.0875 } },
    { name: 'Ақтөбе', count: 5, coordinates: { lat: 50.3000, lng: 57.1667 } },
    { name: 'Атырау', count: 4, coordinates: { lat: 47.1167, lng: 51.8833 } },
    { name: 'Павлодар', count: 5, coordinates: { lat: 52.3000, lng: 76.9500 } }
  ];

  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    setMapError(null);

    loadGoogleMapsScript(() => {
      console.log('Google Maps API сәтті жүктелді');
      initMap();
    });

    return () => {
      // Clean up markers
      markers.forEach(marker => {
        if (marker) {
          marker.setMap(null);
        }
      });
      
      // Clean up info windows
      infoWindows.forEach(infoWindow => {
        if (infoWindow) {
          infoWindow.close();
        }
      });
    };
  }, [isOpen]);

  const initMap = () => {
    try {
      if (!window.google || !window.google.maps) {
        throw new Error('Google Maps API жүктелмеді');
      }

      if (!mapRef.current) {
        throw new Error('Карта контейнері табылмады');
      }

      const mapOptions = {
        center: { lat: 48.0196, lng: 66.9237 },
        zoom: 5,
        minZoom: 4,
        maxZoom: 15,
        styles: [
          {
            featureType: "all",
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }]
          },
          {
            featureType: "all",
            elementType: "labels.text.fill",
            stylers: [{ color: "#525252" }]
          },
          {
            featureType: "all",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#ffffff" }]
          },
          {
            featureType: "administrative",
            elementType: "geometry",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "administrative.country",
            elementType: "geometry.stroke",
            stylers: [{ color: "#c9c9c9" }, { weight: 1.5 }]
          },
          {
            featureType: "landscape",
            elementType: "geometry",
            stylers: [{ color: "#e5e5e5" }]
          },
          {
            featureType: "poi",
            elementType: "all",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "road",
            elementType: "all",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "transit",
            elementType: "all",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#d1e3ff" }]
          }
        ],
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: "greedy"
      };

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);

      // Маркерлерді қосу
      addMarkers(newMap);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Картаны инициализациялау қатесі:', error);
      setMapError('Картаны жүктеу кезінде қате пайда болды: ' + error.message);
      setIsLoading(false);
    }
  };

  const addMarkers = (mapInstance) => {
    if (!mapInstance || !window.google) return;

    const newMarkers = [];
    const newInfoWindows = [];
    
    // Университет маркерлері
    universities.forEach(uni => {
      if (activeFilter !== 'all' && uni.type !== activeFilter) return;

      // Маркер иконкасы
      const markerIcon = {
        path: window.google.maps.SymbolPath.CIRCLE,
        fillColor: uni.color,
        fillOpacity: 0.9,
        strokeColor: "#FFFFFF",
        strokeWeight: 2,
        scale: 10
      };

      const marker = new window.google.maps.Marker({
        position: uni.coordinates,
        map: mapInstance,
        icon: markerIcon,
        title: uni.name,
        animation: window.google.maps.Animation.DROP
      });

      // Инфо-терезе
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 16px; max-width: 250px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
              <div style="width: 40px; height: 40px; border-radius: 8px; background-color: ${uni.color}; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px;">
                ${uni.icon}
              </div>
              <div>
                <h3 style="margin: 0; font-weight: 600; color: #1e293b; font-size: 16px;">${uni.name}</h3>
                <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">${uni.city}</p>
              </div>
            </div>
            <div style="margin-top: 8px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <span style="font-size: 13px; color: #64748b;">Рейтинг:</span>
                <span style="font-weight: 600; color: #d97706; font-size: 14px;">${uni.rating}/10</span>
              </div>
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <span style="font-size: 13px; color: #64748b;">Студенттер:</span>
                <span style="font-weight: 500; color: #1e293b; font-size: 14px;">${uni.students}</span>
              </div>
              <div style="font-size: 13px; color: #475569; margin-top: 8px;">${uni.description}</div>
            </div>
          </div>
        `
      });

      // Маркерге клик
      marker.addListener('click', () => {
        // Барлық инфо-терезелерді жабу
        newInfoWindows.forEach(iw => iw.close());
        
        setSelectedUniversity(uni);
        infoWindow.open(mapInstance, marker);
        mapInstance.panTo(uni.coordinates);
        mapInstance.setZoom(12);
      });

      newMarkers.push(marker);
      newInfoWindows.push(infoWindow);
    });

    // Қалалар маркерлері
    cities.forEach(city => {
      const cityMarker = new window.google.maps.Marker({
        position: city.coordinates,
        map: mapInstance,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          fillColor: '#3B82F6',
          fillOpacity: 0.3,
          strokeColor: "#3B82F6",
          strokeWeight: 2,
          scale: Math.sqrt(city.count) * 4
        },
        title: `${city.name} - ${city.count} ВУЗ`
      });

      const cityInfo = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <h3 style="margin: 0; font-weight: 600; color: #1e293b; font-size: 14px;">${city.name}</h3>
            <p style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">${city.count} университет</p>
          </div>
        `
      });

      cityMarker.addListener('click', () => {
        newInfoWindows.forEach(iw => iw.close());
        cityInfo.open(mapInstance, cityMarker);
        mapInstance.panTo(city.coordinates);
        mapInstance.setZoom(8);
      });

      newMarkers.push(cityMarker);
      newInfoWindows.push(cityInfo);
    });

    setMarkers(newMarkers);
    setInfoWindows(newInfoWindows);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (map) {
      // Ескі маркерлерді жою
      markers.forEach(marker => {
        if (marker && marker.setMap) {
          marker.setMap(null);
        }
      });
      
      // Ескі инфо-терезелерді жабу
      infoWindows.forEach(infoWindow => {
        if (infoWindow) {
          infoWindow.close();
        }
      });
      
      // Жаңа маркерлерді қосу
      addMarkers(map);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || !map) return;

    const foundUni = universities.find(uni => 
      uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.nameKz.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (foundUni) {
      setSelectedUniversity(foundUni);
      map.panTo(foundUni.coordinates);
      map.setZoom(12);
    }
  };

  const handleResetView = () => {
    if (map) {
      map.setCenter({ lat: 48.0196, lng: 66.9237 });
      map.setZoom(5);
      setSelectedUniversity(null);
      
      // Барлық инфо-терезелерді жабу
      infoWindows.forEach(infoWindow => {
        if (infoWindow) {
          infoWindow.close();
        }
      });
    }
  };

  const handleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleZoomIn = () => {
    if (map) {
      const currentZoom = map.getZoom();
      map.setZoom(currentZoom + 1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      const currentZoom = map.getZoom();
      map.setZoom(currentZoom - 1);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg"
      onClick={onClose}
    >
      <div 
        ref={containerRef}
        className="relative w-full max-w-7xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Үстіңгі панель */}
        <div className="absolute top-0 left-0 right-0 z-30 p-6 bg-gradient-to-r from-white to-white/95 backdrop-blur-lg border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Қазақстан ВУЗ картасы
                </h2>
                <p className="text-slate-600 text-sm">Google Maps API</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Іздеу */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Университет немесе қала іздеу..."
                  className="pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </form>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 rounded-xl transition-all ${
                  showFilters 
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Filter className="h-5 w-5" />
              </button>
              
              <button
                onClick={handleFullscreen}
                className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </button>
              
              <button
                onClick={onClose}
                className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 transition-all shadow-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Негізгі мазмұн */}
        <div className="absolute top-20 bottom-0 left-0 right-0 flex">
          {/* Сол жақ панель - Фильтрлер */}
          {showFilters && (
            <div className="w-80 border-r border-slate-200 bg-white/95 backdrop-blur-sm overflow-y-auto p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Фильтрлер</h3>
                <button 
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg"
                >
                  <X className="h-4 w-4 text-slate-500" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-3">Университет түрі</h4>
                  <div className="space-y-2">
                    {[
                      { id: 'all', label: 'Барлығы', count: 127, color: 'bg-slate-500' },
                      { id: 'state', label: 'Мемлекеттік', count: 89, color: 'bg-blue-500' },
                      { id: 'private', label: 'Жеке', count: 38, color: 'bg-emerald-500' },
                      { id: 'international', label: 'Халықаралық', count: 15, color: 'bg-amber-500' },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleFilterChange(type.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                          activeFilter === type.id 
                            ? 'bg-blue-50 border border-blue-200' 
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${type.color}`}></div>
                          <span className="text-sm text-slate-700">{type.label}</span>
                        </div>
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                          {type.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-slate-800 mb-3">Қалалар</h4>
                  <div className="space-y-2">
                    {cities.map((city) => (
                      <button
                        key={city.name}
                        onClick={() => {
                          if (map) {
                            map.panTo(city.coordinates);
                            map.setZoom(8);
                          }
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm text-slate-700">{city.name}</span>
                        </div>
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                          {city.count} ВУЗ
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ортаңғы бөлім - Карта */}
          <div className="flex-1 relative overflow-hidden">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-20">
                <div className="text-center">
                  <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                  <p className="text-slate-700 font-medium">Карта жүктелуде...</p>
                  <p className="text-sm text-slate-500 mt-2">Google Maps API инициализациялануда</p>
                </div>
              </div>
            )}

            {mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-20">
                <div className="text-center p-8 bg-red-50 rounded-2xl border border-red-200 max-w-md">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <X className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Картаны жүктеу қатесі</h3>
                  <p className="text-slate-600 mb-4">{mapError}</p>
                  <button
                    onClick={() => {
                      setIsLoading(true);
                      setMapError(null);
                      loadGoogleMapsScript(() => {
                        initMap();
                      });
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all font-medium"
                  >
                    Қайта жүктеу
                  </button>
                </div>
              </div>
            )}

            <div 
              ref={mapRef}
              className="w-full h-full"
              style={{ minHeight: '500px' }}
            />
            
            {/* Карта бақылау элементтері */}
            <div className="absolute top-6 left-6 flex flex-col gap-3">
              <div className="flex flex-col gap-2 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-2xl border border-slate-200">
                <button
                  onClick={handleZoomIn}
                  className="p-3 rounded-xl hover:bg-slate-100 transition-all group"
                  title="Үлкейту"
                  disabled={isLoading || !map}
                >
                  <ZoomIn className="h-5 w-5 text-slate-700 group-hover:text-blue-600" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-3 rounded-xl hover:bg-slate-100 transition-all group"
                  title="Кішірейту"
                  disabled={isLoading || !map}
                >
                  <ZoomOut className="h-5 w-5 text-slate-700 group-hover:text-blue-600" />
                </button>
                <div className="h-px bg-slate-200"></div>
                <button
                  onClick={handleResetView}
                  className="p-3 rounded-xl hover:bg-slate-100 transition-all group"
                  title="Бастапқы көрініс"
                  disabled={isLoading || !map}
                >
                  <Target className="h-5 w-5 text-slate-700 group-hover:text-emerald-600" />
                </button>
                <button
                  onClick={handleFullscreen}
                  className="p-3 rounded-xl hover:bg-slate-100 transition-all group"
                  title="Толық экран"
                >
                  {isFullscreen ? 
                    <Minimize2 className="h-5 w-5 text-slate-700 group-hover:text-blue-600" /> : 
                    <Maximize2 className="h-5 w-5 text-slate-700 group-hover:text-blue-600" />
                  }
                </button>
              </div>
            </div>
            
            {/* Легенда */}
            {!isLoading && !mapError && (
              <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-slate-200 max-w-xs">
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
                    <span className="text-xs text-slate-700">Жеке ВУЗ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-xs text-slate-700">Халықаралық ВУЗ</span>
                  </div>
                  <div className="h-px bg-slate-200"></div>
                  <div className="text-xs text-slate-600">
                    Картада <span className="font-medium">{universities.length}</span> университет көрсетілген
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Оң жақ панель - Статистика */}
          <div className="w-96 border-l border-slate-200 bg-white/95 backdrop-blur-sm overflow-y-auto shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Университет ақпараты</h3>
                {selectedUniversity && (
                  <button
                    onClick={() => setSelectedUniversity(null)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4 text-slate-500" />
                  </button>
                )}
              </div>
              
              {/* Таңдалған университет */}
              {selectedUniversity ? (
                <div className="mb-8">
                  <div className={`p-6 rounded-2xl border border-slate-200 shadow-lg`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl" style={{ backgroundColor: selectedUniversity.color }}>
                          {selectedUniversity.icon}
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-slate-900">{selectedUniversity.name}</h4>
                          <p className="text-sm text-slate-600">{selectedUniversity.city}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-amber-600">{selectedUniversity.rating}</div>
                        <div className="text-xs text-slate-500">рейтинг</div>
                      </div>
                    </div>
                    
                    <p className="text-slate-700 mb-6">{selectedUniversity.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-slate-500" />
                          <span className="text-sm text-slate-600">Студенттер</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{selectedUniversity.students}</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <University className="h-4 w-4 text-slate-500" />
                          <span className="text-sm text-slate-600">Негізделген</span>
                        </div>
                        <div className="text-2xl font-bold text-slate-900">{selectedUniversity.founded}</div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h5 className="font-semibold text-slate-800 mb-3">Бағдарламалар</h5>
                      <div className="flex flex-wrap gap-2">
                        {selectedUniversity.programs.map((program, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            {program}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <a
                        href={selectedUniversity.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium text-center flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Сайтқа өту
                      </a>
                      <button
                        onClick={() => onClose()}
                        className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors font-medium"
                      >
                        Толығырақ
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <MapPin className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                  <p className="text-slate-600">Картадан университетті таңдаңыз</p>
                  <p className="text-sm text-slate-500 mt-2">Немесе іздеу арқылы табыңыз</p>
                </div>
              )}
              
              {/* Жалпы статистика */}
              <div className="space-y-6">
                <h4 className="font-semibold text-slate-900">Жалпы көрсеткіштер</h4>
                
                <div className="space-y-4">
                  {[
                    { label: 'Барлық ВУЗ', value: '127', change: '+2', color: 'bg-gradient-to-r from-blue-500 to-blue-600', icon: <GraduationCap className="h-4 w-4" /> },
                    { label: 'Барлық студент', value: '550K+', change: '+5.3%', color: 'bg-gradient-to-r from-emerald-500 to-emerald-600', icon: <Users className="h-4 w-4" /> },
                    { label: 'Халықаралық ВУЗ', value: '15', change: '+3', color: 'bg-gradient-to-r from-amber-500 to-amber-600', icon: <GlobeIcon className="h-4 w-4" /> },
                    { label: 'Орташа рейтинг', value: '8.1', change: '+0.2', color: 'bg-gradient-to-r from-purple-500 to-purple-600', icon: <BarChart2 className="h-4 w-4" /> },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all group">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg text-white ${stat.color}`}>
                          {stat.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-700">{stat.label}</div>
                          <div className="text-xs text-slate-500">Соңғы айда</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">{stat.value}</div>
                        <div className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {stat.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Топ университеттер */}
              <div className="mt-8">
                <h4 className="font-semibold text-slate-900 mb-4">Топ университеттер</h4>
                <div className="space-y-3">
                  {universities
                    .sort((a, b) => b.rating - a.rating)
                    .slice(0, 5)
                    .map((uni, index) => (
                      <button
                        key={uni.id}
                        onClick={() => setSelectedUniversity(uni)}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
                            index === 0 ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                            index === 1 ? 'bg-gradient-to-br from-slate-500 to-slate-600' :
                            'bg-gradient-to-br from-slate-400 to-slate-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-medium text-slate-800 group-hover:text-blue-600">{uni.name}</div>
                            <div className="text-xs text-slate-500">{uni.city}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-amber-600">{uni.rating}</div>
                          <div className="text-xs text-slate-500">рейтинг</div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Төменгі панель */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-slate-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="text-sm text-slate-600">
              <span className="font-medium">Нақты карта:</span> Google Maps API v3 • Деректер жаңартылды: {new Date().toLocaleDateString('kk-KZ')}
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                <Download className="h-4 w-4" />
                Экспорт
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 text-sm font-medium transition-all shadow-lg">
                Толық статистика
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleMap;