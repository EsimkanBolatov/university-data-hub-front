import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Star, Share2, Globe, Phone, BookOpen, Layers, CheckCircle } from 'lucide-react';
import { universitiesAPI } from '../api/axios';
import { GlassCard } from '../components/ui/GlassCard';

const UniversityDetail = () => {
  const { id } = useParams();
  const { data: uni, isLoading } = useQuery({
    queryKey: ['university', id],
    queryFn: () => universitiesAPI.getById(id).then(res => res.data),
  });

  if (isLoading) return <div className="text-center mt-20 text-neon-blue animate-pulse">Загрузка данных...</div>;
  if (!uni) return <div className="text-center mt-20 text-white">Университет не найден</div>;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* HEADER BLOCK */}
      <div className="relative rounded-[2.5rem] overflow-hidden min-h-[300px] flex items-center p-10 shadow-2xl">
        {/* ISPFRAVLENO: bg-linear-to-r */}
        <div className="absolute inset-0 bg-linear-to-r from-blue-900 via-indigo-900 to-deep-blue-900">
           <div className="absolute inset-0 opacity-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-neon-blue/40 rounded-full blur-3xl"></div>
           <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/40 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 w-full">
          <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-4 flex items-center justify-center shadow-lg">
            {uni.logo_url ? (
              <img src={uni.logo_url} alt="Logo" className="w-full h-full object-contain drop-shadow-md" />
            ) : (
              <BookOpen className="w-12 h-12 text-white" />
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-neon-blue text-xs font-bold text-white shadow-lg shadow-neon-blue/50">
                TOP #{uni.national_ranking || '10'}
              </span>
              <span className="flex items-center gap-1 text-yellow-400 font-bold">
                <Star className="w-4 h-4 fill-current" /> {uni.rating}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
              {uni.name_ru}
            </h1>
            <p className="text-blue-200 text-lg flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-5 h-5" /> {uni.city}
            </p>
          </div>

          <div className="flex gap-3">
            <button className="p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/10 transition">
              <Share2 className="w-6 h-6 text-white" />
            </button>
            <a href={uni.website} target="_blank" className="px-6 py-4 bg-neon-blue hover:bg-blue-600 rounded-full text-white font-bold shadow-lg shadow-neon-blue/30 transition flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Сайт
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="border-l-4 border-l-neon-blue">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Layers className="text-neon-blue" />
              Миссия
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {uni.mission || uni.description}
            </p>
          </GlassCard>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <GlassCard className="text-center py-6">
              <div className="text-3xl font-bold text-white mb-1">{uni.total_students ? (uni.total_students/1000).toFixed(1) + 'k' : 'N/A'}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Студентов</div>
            </GlassCard>
            <GlassCard className="text-center py-6">
              <div className="text-3xl font-bold text-white mb-1">{uni.founded_year}</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Основан</div>
            </GlassCard>
            <GlassCard className="text-center py-6">
              <div className="text-3xl font-bold text-neon-blue mb-1">{uni.employment_rate}%</div>
              <div className="text-xs text-slate-400 uppercase tracking-wider">Трудоустройство</div>
            </GlassCard>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">Специальности</h2>
            <div className="flex flex-wrap gap-3">
              {uni.programs?.map((prog) => (
                <div key={prog.id} className="group relative px-4 py-3 bg-white/5 hover:bg-neon-blue/20 border border-white/10 rounded-xl transition cursor-pointer flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-xs font-mono text-neon-blue">
                    {prog.code?.substring(0,3) || 'IT'}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white group-hover:text-neon-blue transition">
                      {prog.name_ru}
                    </div>
                    <div className="text-xs text-slate-500">Бакалавриат</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <GlassCard>
            <h3 className="font-bold text-white mb-4">Контакты</h3>
            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg"><Phone className="w-4 h-4 text-neon-blue"/></div>
                {uni.phone || '+7 (700) 000-00-00'}
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg"><MapPin className="w-4 h-4 text-neon-blue"/></div>
                {uni.address || uni.city}
              </div>
            </div>
          </GlassCard>

          {/* ISPFRAVLENO: bg-linear-to-br */}
          <GlassCard className="bg-linear-to-br from-neon-blue/20 to-purple-500/20 border-neon-blue/30">
            <h3 className="font-bold text-white mb-2">Поступление 2025</h3>
            <ul className="space-y-2 text-sm text-slate-200 mb-4">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-neon-blue"/> Прием документов: Июнь</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-neon-blue"/> Гранты доступны</li>
            </ul>
            <button className="w-full py-2 bg-white text-deep-blue-900 font-bold rounded-lg hover:scale-105 transition">
              Подать заявку
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default UniversityDetail;