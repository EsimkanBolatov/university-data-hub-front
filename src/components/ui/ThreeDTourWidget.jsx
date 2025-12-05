// ThreeDTourWidget.jsx
import React, { useState } from 'react';
import { 
  Globe, MapPin, X, ExternalLink, 
  Play, Maximize2, Video, Building,
  Star, Users, Award, ChevronDown
} from 'lucide-react';

const ThreeDTourWidget = ({ isOpen, onClose }) => {
  const [selectedUni, setSelectedUni] = useState(null);

  const universities = [
    {
      id: 1,
      name: 'Назарбаев Университет',
      city: 'Астана',
      type: 'Халықаралық',
      rating: 9.8,
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=400&q=80',
      tours: [
        {
          name: 'Негізгі кампус',
          url: 'https://www.google.com/maps/@51.0908,71.4183,3a,75y,90t/data=!3m8!1e2!3m6!1sAF1QipOonB5Cx0vY4TzP0u9E7Q2!2e10!3e10!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipOonB5Cx0vY4TzP0u9E7Q2%3Dw203-h100-k-no-pi-0-ya268.99997-ro-0-fo100!7i8704!8i4352',
          type: 'Google Street View',
          icon: '🌍'
        },
        {
          name: 'Зертханалар',
          url: 'https://my.matterport.com/show/?m=K4rFj9qVvQw',
          type: 'Matterport 3D',
          icon: '📐'
        }
      ],
      youtube: 'https://www.youtube.com/embed/Qg2_a3_mm1w'
    },
    {
      id: 2,
      name: 'КазНУ им. аль-Фараби',
      city: 'Алматы',
      type: 'Мемлекеттік',
      rating: 9.5,
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=80',
      tours: [
        {
          name: 'Тарихи корпус',
          url: 'https://www.google.com/maps/@43.2301,76.9115,3a,75y,90t/data=!3m8!1e2!3m6!1sAF1QipPJUcA6LQ!2e10!3e10!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipPJUcA6LQ%3Dw203-h100-k-no-pi-0-ya345-ro-0-fo100!7i8704!8i4352',
          type: 'Google Street View',
          icon: '🌍'
        },
        {
          name: 'Кітапхана',
          url: 'https://kuula.co/share/collection/7vFp5',
          type: 'Kuula 360°',
          icon: '🎬'
        }
      ],
      youtube: 'https://www.youtube.com/embed/7E8Lx9N3j2k'
    },
    {
      id: 3,
      name: 'Satbayev University',
      city: 'Алматы',
      type: 'Техникалық',
      rating: 9.3,
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80',
      tours: [
        {
          name: 'Инженерлік корпус',
          url: 'https://roundme.com/tour/485234/view/1536724/',
          type: 'Roundme',
          icon: '🔄'
        }
      ],
      youtube: 'https://www.youtube.com/embed/9L5K8p3qGqc'
    },
    {
      id: 4,
      name: 'ЕНУ им. Л.Н. Гумилева',
      city: 'Астана',
      type: 'Мемлекеттік',
      rating: 9.1,
      image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=400&q=80',
      tours: [
        {
          name: 'Заманауи кампус',
          url: 'https://www.google.com/maps/@51.1694,71.4491,3a,75y,90t/data=!3m8!1e2!3m6!1sAF1QipMx_g5x1w!2e10!3e10!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipMx_g5x1w%3Dw203-h100-k-no-pi-0-ya180-ro-0-fo100!7i8704!8i4352',
          type: 'Google Street View',
          icon: '🌍'
        }
      ],
      youtube: 'https://www.youtube.com/embed/r8CpV7wVXyE'
    }
  ];

  const handleStartTour = (tourUrl) => {
    window.open(tourUrl, '_blank', 'noopener,noreferrer');
  };

  const handleYoutubeTour = (youtubeUrl) => {
    window.open(youtubeUrl, '_blank', 'noopener,noreferrer');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Widget */}
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-violet-600 to-purple-700 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">3D ВУЗ Турлары</h2>
                <p className="text-sm text-violet-100">Нақты университет кампустарын виртуалды шолу</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {!selectedUni ? (
            // University Selection Grid
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {universities.map((uni) => (
                <div 
                  key={uni.id}
                  onClick={() => setSelectedUni(uni)}
                  className="group bg-slate-50 hover:bg-slate-100 rounded-xl p-4 cursor-pointer transition-all border border-slate-200 hover:border-violet-300 hover:shadow-lg"
                >
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={uni.image}
                        alt={uni.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-violet-700">
                            {uni.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600">{uni.city}</span>
                            <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                              {uni.type}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          <span className="font-bold text-amber-600">{uni.rating}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-600">{uni.tours.length} тур</span>
                          </div>
                        </div>
                      </div>
                      
                      <button className="mt-4 w-full py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:from-violet-600 hover:to-purple-700 transition-all font-medium flex items-center justify-center gap-2">
                        <Play className="h-4 w-4" />
                        Турларды көру
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // University Details
            <div className="space-y-6">
              {/* Back Button */}
              <button
                onClick={() => setSelectedUni(null)}
                className="flex items-center gap-2 text-slate-600 hover:text-violet-700 font-medium"
              >
                <ChevronDown className="h-5 w-5 rotate-90" />
                Артқа қайту
              </button>

              {/* University Info */}
              <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{selectedUni.name}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-5 w-5 text-slate-500" />
                        <span className="text-slate-700">{selectedUni.city}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-amber-600">{selectedUni.rating}/10</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">Қолжетімді турлар</div>
                    <div className="text-3xl font-bold text-violet-700">{selectedUni.tours.length}</div>
                  </div>
                </div>
              </div>

              {/* Available Tours */}
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-4">Қолжетімді 3D Турлар</h4>
                <div className="space-y-4">
                  {selectedUni.tours.map((tour, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-violet-300 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{tour.icon}</div>
                        <div>
                          <div className="font-medium text-slate-900">{tour.name}</div>
                          <div className="text-sm text-slate-500">{tour.type}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleStartTour(tour.url)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:from-violet-600 hover:to-purple-700 transition-all font-medium"
                      >
                        <Play className="h-4 w-4" />
                        Бастау
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* YouTube Tour */}
              {selectedUni.youtube && (
                <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Video className="h-6 w-6 text-red-600" />
                      <div>
                        <h4 className="font-bold text-slate-900">YouTube Видео Тур</h4>
                        <p className="text-sm text-slate-600">Университеттің ресми тур видеосы</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleYoutubeTour(selectedUni.youtube)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg hover:from-red-600 hover:to-orange-700 transition-all font-medium"
                    >
                      <Play className="h-4 w-4" />
                      Видеоны көру
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="text-center text-sm text-slate-600">
            <span className="font-medium">{universities.length}</span> университеттің 3D турлары қолжетімді
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDTourWidget;