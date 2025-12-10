// src/pages/CareerGuide.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { 
  Compass, Brain, ArrowRight, Sparkles, 
  Briefcase, GraduationCap, CheckCircle, Send, AlertCircle
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { careerAPI } from '../api/axios';
import { cn } from '../utils/cn';

const CareerGuide = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('intro'); // intro, quiz, loading, results
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [history, setHistory] = useState([]);
  const [results, setResults] = useState(null);
  
  const textareaRef = useRef(null);

  // 1. Мутация для старта
  const startMutation = useMutation({
    mutationFn: (difficulty) => careerAPI.start({ difficulty, questions_count: 10 }),
    onSuccess: (response) => {
      const data = response.data;
      setSession(data);
      setCurrentQuestion(data.question);
      setGameState('quiz');
    },
    onError: (err) => {
      console.error(err);
      alert("Не удалось начать тест. Проверьте соединение.");
    }
  });

  // 2. Мутация для отправки ответа
  const answerMutation = useMutation({
    mutationFn: (data) => careerAPI.answer(data),
    onSuccess: (response) => {
      const data = response.data;
      
      // Сохраняем историю для UI
      setHistory(prev => [...prev, { q: currentQuestion, a: answerText }]);
      setAnswerText('');

      if (data.is_finished) {
        setResults(data);
        setGameState('results');
      } else {
        // Обновляем сессию и вопрос
        setSession(prev => ({ ...prev, ...data }));
        setCurrentQuestion(data.question);
      }
    },
    onError: (err) => {
      console.error(err);
      alert("Ошибка при отправке ответа.");
    }
  });

  const handleStart = () => {
    startMutation.mutate('medium');
  };

  const handleSendAnswer = () => {
    if (!answerText.trim()) return;
    
    answerMutation.mutate({
      session_id: session.session_id,
      answer_text: answerText
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendAnswer();
    }
  };

  // --- RENDER: INTRO ---
  if (gameState === 'intro') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-fade-in">
        <div className="text-center max-w-2xl space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-violet-500/30 mb-8">
            <Compass className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
            AI Профориентатор
          </h1>
          
          <p className="text-lg text-slate-600 leading-relaxed">
            Пройдите интерактивное интервью с искусственным интеллектом. 
            Мы проанализируем ваши интересы, навыки и характер, чтобы подобрать 
            идеальную профессию и подходящий университет.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left py-6">
            {[
              { icon: Brain, title: "Умный анализ", desc: "AI адаптирует вопросы под ваши ответы" },
              { icon: Briefcase, title: "Профессии", desc: "Актуальные специальности рынка" },
              { icon: GraduationCap, title: "Университеты", desc: "Подбор ВУЗов из базы" },
            ].map((item, i) => (
              <Card key={i} className="p-4 border border-slate-100 bg-white/50">
                <div className="bg-slate-100 w-10 h-10 rounded-lg flex items-center justify-center mb-3 text-slate-600">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </Card>
            ))}
          </div>

          <button
            onClick={handleStart}
            disabled={startMutation.isPending}
            className="px-10 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl text-lg font-bold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-3 mx-auto"
          >
            {startMutation.isPending ? (
              "Запуск..."
            ) : (
              <>
                Начать тестирование <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: QUIZ & LOADING ---
  if (gameState === 'quiz') {
    return (
      <div className="max-w-3xl mx-auto py-8 animate-fade-in">
        {/* Progress */}
        <div className="mb-8 flex items-center justify-between text-sm text-slate-500 font-medium">
          <span>Вопрос {session?.current_step || 1} из 10</span>
          <span>{Math.round(((session?.current_step || 1) / 10) * 100)}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2 rounded-full mb-8 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full transition-all duration-500 ease-out"
            style={{ width: `${((session?.current_step || 1) / 10) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-6 border-violet-100 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-24 h-24 text-violet-600" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 leading-tight">
              {currentQuestion}
            </h2>
            
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={answerMutation.isPending}
                placeholder="Напишите ваш ответ здесь..."
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl p-4 text-lg focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all min-h-[150px] resize-none"
                autoFocus
              />
              {answerMutation.isPending && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-violet-700 animate-pulse">
                      AI анализирует ответ...
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-4">
              <p className="text-xs text-slate-400">
                Shift + Enter для переноса строки
              </p>
              <button
                onClick={handleSendAnswer}
                disabled={!answerText.trim() || answerMutation.isPending}
                className={cn(
                  "px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all",
                  !answerText.trim() || answerMutation.isPending
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-violet-600 text-white hover:bg-violet-700 hover:shadow-lg hover:-translate-y-0.5"
                )}
              >
                Ответить <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>

        {/* History Preview (Optional) */}
        {history.length > 0 && (
          <div className="space-y-4 opacity-60 hover:opacity-100 transition-opacity">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider pl-2">История ответов</h3>
            {history.slice().reverse().map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100">
                <div className="text-sm font-medium text-slate-700 mb-1">Q: {item.q}</div>
                <div className="text-sm text-slate-500 italic">A: {item.a}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- RENDER: RESULTS ---
  if (gameState === 'results' && results) {
    return (
      <div className="max-w-5xl mx-auto py-8 animate-fade-in space-y-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-bold text-sm mb-4">
            <CheckCircle className="w-4 h-4" /> Тест завершен
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Ваша персональная стратегия</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            На основе ваших ответов AI подобрал оптимальные направления и учебные заведения.
          </p>
        </div>

        {/* Analysis Block */}
        <Card className="p-8 bg-gradient-to-br from-violet-50 to-indigo-50 border-violet-100">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Brain className="w-6 h-6 text-violet-600" />
            Анализ профиля
          </h3>
          <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {results.analysis}
          </p>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Professions - ИСПРАВЛЕННАЯ СЕКЦИЯ */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-500" />
              Рекомендуемые профессии
            </h3>
            <div className="space-y-3">
              {results.suggested_professions?.map((prof, idx) => (
                <Card key={idx} className="p-4 flex items-center justify-between group hover:border-blue-300 transition-colors cursor-default">
                  <div className="flex flex-col">
                    {/* Используем поля объекта, а не сам объект */}
                    <span className="font-medium text-slate-800">{prof.name}</span>
                    {/* Если есть описание/причина - выводим */}
                    {prof.reason && (
                      <span className="text-xs text-slate-500 mt-1">{prof.reason}</span>
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 ml-3">
                    {idx + 1}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Universities */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-500" />
              Подходящие ВУЗы
            </h3>
            <div className="space-y-4">
              {results.recommended_universities?.map((uni, idx) => (
                <Card 
                  key={uni.id || idx} 
                  className="p-0 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => navigate(`/university/${uni.id}`)}
                >
                  <div className="p-4">
                    <h4 className="font-bold text-slate-900 mb-1">{uni.name_ru || uni.name}</h4>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <span>{uni.city}</span>
                      {uni.rating && (
                        <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-1.5 rounded">
                          ★ {uni.rating}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
                    <span className="text-sm font-medium text-emerald-600">Подходит на 9{9 - idx}%</span>
                  </div>
                </Card>
              ))}
              {(!results.recommended_universities || results.recommended_universities.length === 0) && (
                <div className="p-6 bg-slate-50 rounded-xl text-center text-slate-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  ВУЗы не найдены или список формируется
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button
            onClick={() => setGameState('intro')}
            className="text-slate-500 hover:text-slate-800 font-medium underline"
          >
            Пройти тест заново
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default CareerGuide;