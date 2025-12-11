// src/pages/CareerValidator.jsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, FileText, Sparkles, Clock, Send, 
  AlertCircle, CheckCircle, TrendingUp, Award,
  BookOpen, Target, Briefcase, ArrowRight,
  Brain, Zap, Star, User, Mail, Phone,
  MapPin, GraduationCap, Code, Rocket
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { cn } from '../utils/cn';

const CareerValidator = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // State management
  const [step, setStep] = useState('upload'); // upload, profession, interview, results
  const [resumeText, setResumeText] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [difficulty, setDifficulty] = useState('middle');
  const [sessionData, setSessionData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsedResume, setParsedResume] = useState(null);
  const [verdict, setVerdict] = useState(null);

  // Профессии
  const professions = [
    { id: 'backend', name: 'Python Backend Developer', icon: <Code />, color: 'from-blue-500 to-cyan-500' },
    { id: 'frontend', name: 'Frontend Developer', icon: <Zap />, color: 'from-purple-500 to-pink-500' },
    { id: 'data', name: 'Data Analyst', icon: <Target />, color: 'from-emerald-500 to-green-500' },
    { id: 'mobile', name: 'Mobile Developer', icon: <Rocket />, color: 'from-amber-500 to-orange-500' },
  ];

  // Обработка файла резюме
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    
    // Симуляция парсинга файла
    setTimeout(() => {
      const mockResumeText = `
      Иванов Иван Иванович
      Email: ivan@example.com | Телефон: +7 700 123 45 67
      Город: Алматы
      
      ОБРАЗОВАНИЕ:
      2018-2022: Satbayev University, Информационные системы
      
      ОПЫТ РАБОТЫ:
      2022-2024: Junior Python Developer в Tech Company
      - Разработка REST API на FastAPI
      - Работа с PostgreSQL и Redis
      - Опыт с Docker и CI/CD
      
      НАВЫКИ:
      Python (2 года), FastAPI (1.5 года), PostgreSQL, Docker, Git
      
      ПРОЕКТЫ:
      - Разработал микросервисную архитектуру для e-commerce платформы
      - Оптимизировал запросы к БД, ускорив их на 40%
      `;
      
      setResumeText(mockResumeText);
      setIsProcessing(false);
      setStep('profession');
    }, 2000);
  };

  // Начать интервью
  const handleStartInterview = async () => {
    setIsProcessing(true);
    
    // Mock API call
    setTimeout(() => {
      const mockParsed = {
        skills: [
          { name: 'Python', claimed_level: 'middle', years: 2 },
          { name: 'FastAPI', claimed_level: 'junior', years: 1.5 },
          { name: 'PostgreSQL', claimed_level: 'junior', years: 1 },
        ],
        experience_years: 2,
        education: 'Satbayev University, Информационные системы',
        suspicious_areas: [
          'Указан опыт с Docker 2 года, но конкретных проектов нет',
          'Отсутствует упоминание о тестировании',
        ],
        estimated_level: 'junior-middle',
      };

      const mockQuestion = {
        question_id: 1,
        question_text: 'Объясните разницу между async/await и многопоточностью в Python. Когда использовать каждый подход?',
        time_limit_seconds: 60,
        category: 'technical',
      };

      setParsedResume(mockParsed);
      setCurrentQuestion(mockQuestion);
      setQuestionNumber(1);
      setSessionData({ session_id: Math.random() * 1000 });
      setTimeLeft(60);
      setStep('interview');
      setIsProcessing(false);
      
      // Start timer
      startTimer();
    }, 1500);
  };

  // Таймер
  const startTimer = () => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitAnswer(true); // auto-submit
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Отправить ответ
  const handleSubmitAnswer = async (autoSubmit = false) => {
    if (!autoSubmit && !answer.trim()) return;
    
    setIsProcessing(true);
    
    // Mock API call
    setTimeout(() => {
      if (questionNumber >= 5) {
        // Finish interview
        const mockVerdict = {
          readiness_score: 72,
          verified_skills: [
            {
              skill_name: 'Python',
              claimed_level: 'middle',
              verified_level: 'middle',
              is_confirmed: true,
              evidence: 'Правильно объяснил async/await и многопоточность',
            },
            {
              skill_name: 'FastAPI',
              claimed_level: 'junior',
              verified_level: 'junior',
              is_confirmed: true,
              evidence: 'Понимает основы роутинга',
            },
            {
              skill_name: 'Docker',
              claimed_level: 'middle',
              verified_level: 'junior',
              is_confirmed: false,
              evidence: 'Не смог объяснить multi-stage builds',
            },
          ],
          unverified_skills: ['Redis', 'Алгоритмы'],
          roadmap: [
            {
              step: 1,
              topic: 'Алгоритмы и структуры данных',
              resources: ['LeetCode Easy (50 задач)', 'Грокаем алгоритмы'],
              duration: '2 недели',
            },
            {
              step: 2,
              topic: 'Углубленный Docker',
              resources: ['Docker Deep Dive', 'Практика с docker-compose'],
              duration: '3 недели',
            },
          ],
          estimated_time_to_ready: '2-3 месяца',
          overall_assessment: 'Вы на правильном пути! Основы Python у вас крепкие, но нужно подтянуть алгоритмы.',
        };
        
        setVerdict(mockVerdict);
        setStep('results');
        setIsProcessing(false);
      } else {
        // Next question
        const nextQuestion = {
          question_id: questionNumber + 1,
          question_text: `Вопрос ${questionNumber + 1}: Как бы вы оптимизировали медленный SQL запрос?`,
          time_limit_seconds: 60,
          category: 'technical',
        };
        
        setCurrentQuestion(nextQuestion);
        setQuestionNumber((prev) => prev + 1);
        setAnswer('');
        setTimeLeft(60);
        setIsProcessing(false);
        startTimer();
      }
    }, 1000);
  };

  // === RENDER SECTIONS ===

  const renderUploadStep = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 mb-4">
          <Brain className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900">AI Career Validator</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Интеллектуальная проверка навыков через AI-интервью. 
          Загрузите резюме, пройдите стресс-тест и получите персональную roadmap.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: <Sparkles />, title: 'AI Анализ', desc: 'Глубокий парсинг резюме с выявлением несоответствий' },
          { icon: <Clock />, title: 'Стресс-интервью', desc: 'Вопросы с таймером 60 сек для проверки знаний' },
          { icon: <TrendingUp />, title: 'Персональный план', desc: 'Roadmap развития на основе ваших пробелов' },
        ].map((feature, i) => (
          <Card key={i} className="p-6 text-center hover:shadow-lg transition-all">
            <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 mb-4">
              {feature.icon}
            </div>
            <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
            <p className="text-sm text-slate-600">{feature.desc}</p>
          </Card>
        ))}
      </div>

      {/* Upload Zone */}
      <Card className="p-12 text-center border-2 border-dashed border-slate-300 hover:border-blue-400 transition-all">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        {isProcessing ? (
          <div className="space-y-4">
            <div className="inline-flex p-4 rounded-full bg-blue-100 animate-pulse">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-slate-600">Анализируем ваше резюме...</p>
            <div className="w-48 h-2 bg-slate-200 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse w-3/4"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="inline-flex p-4 rounded-full bg-slate-100">
              <Upload className="h-8 w-8 text-slate-400" />
            </div>
            <div>
              <p className="text-slate-900 font-medium mb-2">Загрузите ваше резюме</p>
              <p className="text-sm text-slate-500">PDF, DOC, DOCX или TXT до 5 МБ</p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all font-medium shadow-lg"
            >
              Выбрать файл
            </button>
            <div className="pt-4 border-t border-slate-200 mt-4">
              <p className="text-sm text-slate-500 mb-3">Или вставьте текст резюме:</p>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Вставьте текст вашего резюме здесь..."
                className="w-full h-32 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              {resumeText && (
                <button
                  onClick={() => setStep('profession')}
                  className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all"
                >
                  Продолжить с текстом
                </button>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  const renderProfessionStep = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Выберите целевую профессию</h2>
        <p className="text-slate-600">На какую позицию вы претендуете?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {professions.map((prof) => (
          <Card
            key={prof.id}
            className={cn(
              "p-6 cursor-pointer transition-all border-2",
              selectedProfession === prof.id
                ? "border-blue-500 shadow-lg"
                : "border-transparent hover:border-slate-300"
            )}
            onClick={() => setSelectedProfession(prof.id)}
          >
            <div className="flex items-center gap-4">
              <div className={cn("p-3 rounded-xl bg-gradient-to-br text-white", prof.color)}>
                {prof.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">{prof.name}</h3>
                <p className="text-sm text-slate-500">Проверка технических навыков</p>
              </div>
              {selectedProfession === prof.id && (
                <CheckCircle className="h-6 w-6 text-blue-600" />
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h3 className="font-bold text-slate-900 mb-4">Уровень сложности</h3>
        <div className="grid grid-cols-3 gap-4">
          {['junior', 'middle', 'senior'].map((level) => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={cn(
                "py-3 px-4 rounded-xl font-medium transition-all",
                difficulty === level
                  ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </Card>

      <div className="flex justify-center">
        <button
          onClick={handleStartInterview}
          disabled={!selectedProfession || isProcessing}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
        >
          {isProcessing ? 'Подготовка...' : 'Начать интервью'}
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  const renderInterviewStep = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-600">Вопрос {questionNumber} из 5</span>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-400" />
          <span className={cn(
            "font-bold text-lg",
            timeLeft <= 10 ? "text-red-600 animate-pulse" : "text-slate-900"
          )}>
            {timeLeft}с
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
          style={{ width: `${(questionNumber / 5) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <Card className="p-8 border-l-4 border-blue-500">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 shrink-0">
            <Brain className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                Технический вопрос
              </span>
              <span className="text-xs text-slate-500">#{currentQuestion?.question_id}</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 leading-relaxed">
              {currentQuestion?.question_text}
            </h3>
          </div>
        </div>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Введите ваш ответ здесь... (минимум 50 символов)"
          disabled={isProcessing}
          className="w-full h-48 p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none text-slate-900 disabled:bg-slate-50 disabled:cursor-not-allowed"
        />

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-slate-500">
            {answer.length} / 50 символов
          </p>
          <button
            onClick={() => handleSubmitAnswer()}
            disabled={answer.length < 50 || isProcessing}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? 'Обработка...' : 'Отправить ответ'}
            <Send className="h-4 w-4" />
          </button>
        </div>
      </Card>

      {/* Parsed Resume Preview */}
      {parsedResume && (
        <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            Обнаружены подозрительные области
          </h4>
          <ul className="space-y-2">
            {parsedResume.suspicious_areas.map((area, i) => (
              <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                {area}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );

  const renderResultsStep = () => (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg mb-4">
          <CheckCircle className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900">Результаты верификации</h1>
        <p className="text-lg text-slate-600">
          AI проанализировал ваши ответы и резюме
        </p>
      </div>

      {/* Readiness Score */}
      <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <h3 className="text-sm font-medium text-slate-600 mb-2">Индекс готовности</h3>
        <div className="text-6xl font-bold text-blue-600 mb-4">{verdict?.readiness_score}%</div>
        <p className="text-slate-700">{verdict?.overall_assessment}</p>
      </Card>

      {/* Skills Verification */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            Подтвержденные навыки
          </h3>
          <div className="space-y-4">
            {verdict?.verified_skills.filter(s => s.is_confirmed).map((skill, i) => (
              <div key={i} className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900">{skill.skill_name}</span>
                  <span className="px-3 py-1 bg-emerald-200 text-emerald-800 text-xs rounded-full font-medium">
                    {skill.verified_level}
                  </span>
                </div>
                <p className="text-sm text-emerald-700">{skill.evidence}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            Требуют доработки
          </h3>
          <div className="space-y-4">
            {verdict?.verified_skills.filter(s => !s.is_confirmed).map((skill, i) => (
              <div key={i} className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900">{skill.skill_name}</span>
                  <span className="px-3 py-1 bg-amber-200 text-amber-800 text-xs rounded-full font-medium">
                    {skill.claimed_level} → {skill.verified_level}
                  </span>
                </div>
                <p className="text-sm text-amber-700">{skill.evidence}</p>
              </div>
            ))}
            {verdict?.unverified_skills.map((skill, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900">{skill}</span>
                <p className="text-sm text-slate-600 mt-1">Не удалось подтвердить</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Roadmap */}
      <Card className="p-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Rocket className="h-6 w-6 text-blue-600" />
          Персональная дорожная карта
        </h3>
        <div className="space-y-6">
          {verdict?.roadmap.map((step, i) => (
            <div key={i} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                  {step.step}
                </div>
                {i < verdict.roadmap.length - 1 && (
                  <div className="w-0.5 h-full bg-slate-200 mt-2"></div>
                )}
              </div>
              <div className="flex-1 pb-8">
                <h4 className="text-lg font-bold text-slate-900 mb-2">{step.topic}</h4>
                <p className="text-sm text-slate-600 mb-3">Длительность: {step.duration}</p>
                <div className="flex flex-wrap gap-2">
                  {step.resources.map((resource, j) => (
                    <span key={j} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => navigate('/catalog')}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all font-bold shadow-lg"
        >
          Найти подходящий ВУЗ
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-bold"
        >
          Пройти заново
        </button>
      </div>
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen py-12 animate-fade-in">
      {step === 'upload' && renderUploadStep()}
      {step === 'profession' && renderProfessionStep()}
      {step === 'interview' && renderInterviewStep()}
      {step === 'results' && renderResultsStep()}
    </div>
  );
};

export default CareerValidator;