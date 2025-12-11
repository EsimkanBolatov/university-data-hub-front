// src/pages/CareerValidator.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { 
  Upload, FileText, Sparkles, Clock, Send, 
  AlertCircle, CheckCircle, TrendingUp, Award,
  BookOpen, Target, Briefcase, ArrowRight,
  Brain, Zap, Star, Download, History,
  Loader2, X, RefreshCw, FileCheck, Calendar,
  BarChart3, TrendingDown
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { cn } from '../utils/cn';
import { careerValidatorAPI } from '../api/axios';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

// PDF.js Worker setup
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const CareerValidator = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // State management
  const [step, setStep] = useState('upload');
  const [resumeText, setResumeText] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [difficulty, setDifficulty] = useState('middle');
  const [sessionData, setSessionData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [parsedResume, setParsedResume] = useState(null);
  const [verdict, setVerdict] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [timeTaken, setTimeTaken] = useState(0);

  // Профессии
  const professions = [
    { id: 'Python Backend Developer', name: 'Python Backend Developer', icon: <Brain />, color: 'from-blue-500 to-cyan-500' },
    { id: 'Frontend Developer', name: 'Frontend Developer', icon: <Zap />, color: 'from-purple-500 to-pink-500' },
    { id: 'Data Analyst', name: 'Data Analyst', icon: <Target />, color: 'from-emerald-500 to-green-500' },
  ];

  // История прохождений
  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ['validator-history'],
    queryFn: () => careerValidatorAPI.getHistory().then(res => res.data),
    enabled: step === 'history',
  });

  // Мутация для начала интервью
  const startMutation = useMutation({
    mutationFn: (data) => careerValidatorAPI.start(data),
    onSuccess: (response) => {
      const data = response.data;
      setSessionData(data);
      setParsedResume(data.parsed_resume);
      setCurrentQuestion(data.parsed_resume.suspicious_areas?.length > 0 
        ? { 
            question_id: 1,
            question_text: `Мы заметили в вашем резюме: "${data.parsed_resume.suspicious_areas[0]}". Можете это пояснить?`,
            time_limit_seconds: 60,
            category: 'clarification'
          }
        : null
      );
      setQuestionNumber(1);
      setTimeLeft(60);
      setStep('interview');
    },
    onError: (error) => {
      console.error('Start error:', error);
      alert('Ошибка при запуске интервью: ' + (error.response?.data?.detail || error.message));
    }
  });

  // Мутация для отправки ответа
  const answerMutation = useMutation({
    mutationFn: (data) => careerValidatorAPI.answer(data),
    onSuccess: (response) => {
      const data = response.data;
      
      if (data.is_interview_complete) {
        setVerdict(data);
        setStep('results');
      } else {
        setCurrentQuestion(data.next_question);
        setQuestionNumber(prev => prev + 1);
        setAnswer('');
        setTimeLeft(data.next_question.time_limit_seconds);
        setTimeTaken(0);
      }
    },
    onError: (error) => {
      console.error('Answer error:', error);
      alert('Ошибка при отправке ответа: ' + (error.response?.data?.detail || error.message));
    }
  });

  // Мутация для экспорта PDF
  const exportMutation = useMutation({
    mutationFn: () => careerValidatorAPI.exportPDF(sessionData.session_id),
    onSuccess: (response) => {
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `career-validation-${sessionData.session_id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    },
  });

  // PDF парсинг
  const extractTextFromPDF = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error('Не удалось распарсить PDF. Попробуйте другой файл или вставьте текст вручную.');
    }
  };

  // Обработка файла резюме
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    
    try {
      let text = '';
      
      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file);
      } else if (file.type === 'text/plain') {
        text = await file.text();
      } else {
        throw new Error('Поддерживаются только PDF и TXT файлы');
      }
      
      if (text.length < 100) {
        throw new Error('Резюме слишком короткое. Минимум 100 символов.');
      }
      
      setResumeText(text);
      setStep('profession');
    } catch (error) {
      setUploadError(error.message);
    }
  };

  // Начать интервью
  const handleStartInterview = async () => {
    if (!selectedProfession || !resumeText) {
      alert('Выберите профессию и загрузите резюме');
      return;
    }

    startMutation.mutate({
      target_profession: selectedProfession,
      difficulty: difficulty,
      resume_text: resumeText
    });
  };

  // Таймер
  useEffect(() => {
    if (step !== 'interview' || !currentQuestion) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitAnswer(true);
          return 0;
        }
        return prev - 1;
      });
      setTimeTaken(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [step, currentQuestion]);

  // Отправить ответ
  // Отправить ответ
  const handleSubmitAnswer = async (autoSubmit = false) => {
    // Проверка на пустой ответ (если не авто-отправка)
    if (!autoSubmit && !answer.trim()) {
      console.warn("Попытка отправить пустой ответ");
      return;
    } 
    
    // ЛОГИРОВАНИЕ ДЛЯ ОТЛАДКИ
    console.group("DEBUG: handleSubmitAnswer");
    console.log("Session Data:", sessionData);
    console.log("Current Question:", currentQuestion);
    console.log("Session ID:", sessionData?.session_id);
    console.log("Question ID:", currentQuestion?.question_id);
    console.groupEnd();

    // Защита от undefined
    if (!sessionData?.session_id) {
      alert("Ошибка: ID сессии не найден. Попробуйте перезагрузить страницу.");
      return;
    }
    if (!currentQuestion?.question_id) {
      alert("Ошибка: ID вопроса не найден.");
      return;
    }

    const payload = {
      session_id: sessionData.session_id,
      question_id: currentQuestion.question_id,
      answer_text: answer || 'Не успел ответить',
      time_taken_seconds: timeTaken
    };

    console.log("Отправляем PAYLOAD:", payload); // <-- Смотрите сюда в консоли

    answerMutation.mutate(payload);
  };

  // === RENDER SECTIONS ===

  const renderUploadStep = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 mb-4">
          <Brain className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900">AI Career Validator</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Интеллектуальная проверка навыков через AI-интервью
        </p>
        
        <div className="flex gap-3 justify-center pt-4">
          <button
            onClick={() => setStep('history')}
            className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium flex items-center gap-2"
          >
            <History className="h-5 w-5" />
            История прохождений
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: <Sparkles />, title: 'AI Анализ', desc: 'Глубокий парсинг резюме' },
          { icon: <Clock />, title: 'Стресс-интервью', desc: 'Вопросы с таймером' },
          { icon: <TrendingUp />, title: 'Roadmap', desc: 'План развития' },
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

      <Card className="p-12 text-center border-2 border-dashed border-slate-300 hover:border-blue-400 transition-all">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="inline-flex p-4 rounded-full bg-slate-100">
            <Upload className="h-8 w-8 text-slate-400" />
          </div>
          <div>
            <p className="text-slate-900 font-medium mb-2">Загрузите ваше резюме</p>
            <p className="text-sm text-slate-500">PDF или TXT до 5 МБ</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all font-medium shadow-lg"
          >
            Выбрать файл
          </button>
          
          {uploadError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {uploadError}
            </div>
          )}
          
          <div className="pt-4 border-t border-slate-200 mt-4">
            <p className="text-sm text-slate-500 mb-3">Или вставьте текст:</p>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Текст резюме..."
              className="w-full h-32 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
            />
            {resumeText && (
              <button
                onClick={() => setStep('profession')}
                className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all"
              >
                Продолжить
              </button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderProfessionStep = () => (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Выберите профессию</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {professions.map((prof) => (
          <Card
            key={prof.id}
            className={cn(
              "p-6 cursor-pointer transition-all border-2",
              selectedProfession === prof.id ? "border-blue-500 shadow-lg" : "border-transparent hover:border-slate-300"
            )}
            onClick={() => setSelectedProfession(prof.id)}
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className={cn("p-3 rounded-xl bg-gradient-to-br text-white", prof.color)}>
                {prof.icon}
              </div>
              <h3 className="font-bold text-slate-900">{prof.name}</h3>
              {selectedProfession === prof.id && <CheckCircle className="h-6 w-6 text-blue-600" />}
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

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setStep('upload')}
          className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-medium"
        >
          Назад
        </button>
        <button
          onClick={handleStartInterview}
          disabled={!selectedProfession || startMutation.isPending}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all font-bold shadow-lg disabled:opacity-50 flex items-center gap-3"
        >
          {startMutation.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Подготовка...
            </>
          ) : (
            <>
              Начать интервью
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderInterviewStep = () => (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-600">
          Вопрос {questionNumber} из 10
        </span>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-400" />
          <span className={cn("font-bold text-lg", timeLeft <= 10 ? "text-red-600 animate-pulse" : "text-slate-900")}>
            {timeLeft}с
          </span>
        </div>
      </div>

      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
          style={{ width: `${(questionNumber / 10) * 100}%` }}
        />
      </div>

      <Card className="p-8 border-l-4 border-blue-500">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 shrink-0">
            <Brain className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 leading-relaxed">
              {currentQuestion?.question_text}
            </h3>
          </div>
        </div>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Ваш ответ (минимум 50 символов)..."
          disabled={answerMutation.isPending}
          className="w-full h-48 p-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 resize-none disabled:bg-slate-50"
        />

        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-slate-500">{answer.length} / 50 символов</p>
          <button
            onClick={() => handleSubmitAnswer()}
            disabled={answer.length < 50 || answerMutation.isPending}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all font-medium shadow-lg disabled:opacity-50 flex items-center gap-2"
          >
            {answerMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Обработка...
              </>
            ) : (
              <>
                Отправить
                <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </Card>

      {parsedResume && (
        <Card className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            Подозрительные области
          </h4>
          <ul className="space-y-2">
            {parsedResume.suspicious_areas?.map((area, i) => (
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
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg mb-4">
          <CheckCircle className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900">Результаты верификации</h1>
      </div>

      <Card className="p-8 text-center bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <h3 className="text-sm font-medium text-slate-600 mb-2">Индекс готовности</h3>
        <div className="text-6xl font-bold text-blue-600 mb-4">{verdict?.readiness_score}%</div>
        <p className="text-slate-700">{verdict?.overall_assessment}</p>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            Подтверждено
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
          </div>
        </Card>
      </div>

      <Card className="p-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Target className="h-6 w-6 text-blue-600" />
          Дорожная карта
        </h3>
        <div className="space-y-6">
          {verdict?.roadmap.map((step, i) => (
            <div key={i} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                  {step.step}
                </div>
                {i < verdict.roadmap.length - 1 && <div className="w-0.5 h-full bg-slate-200 mt-2"></div>}
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

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => exportMutation.mutate()}
          disabled={exportMutation.isPending}
          className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all font-bold shadow-lg flex items-center justify-center gap-2"
        >
          {exportMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Download className="h-5 w-5" />}
          Скачать PDF
        </button>
        <button
          onClick={() => navigate('/catalog')}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all font-bold shadow-lg"
        >
          Найти ВУЗ
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-bold flex items-center gap-2"
        >
          <RefreshCw className="h-5 w-5" />
          Заново
        </button>
      </div>
    </div>
  );

  const renderHistoryStep = () => (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">История прохождений</h1>
          <p className="text-slate-600">Ваши предыдущие результаты</p>
        </div>
        <button
          onClick={() => setStep('upload')}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all font-medium flex items-center gap-2"
        >
          <ArrowRight className="h-5 w-5 rotate-180" />
          Новый тест
        </button>
      </div>

      {historyLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        </div>
      ) : !history || history.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="inline-flex p-4 rounded-full bg-slate-100 mb-4">
            <History className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">История пуста</h3>
          <p className="text-slate-600 mb-6">Пройдите первый тест, чтобы увидеть результаты</p>
          <button
            onClick={() => setStep('upload')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all font-medium"
          >
            Начать тест
          </button>
        </Card>
      ) : (
        <>
          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <FileCheck className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold text-slate-900">{history.length}</span>
              </div>
              <div className="text-sm text-slate-600">Пройдено тестов</div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="h-5 w-5 text-emerald-500" />
                <span className="text-2xl font-bold text-slate-900">
                  {Math.round(history.reduce((acc, h) => acc + h.readiness_score, 0) / history.length)}%
                </span>
              </div>
              <div className="text-sm text-slate-600">Средний балл</div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-5 w-5 text-amber-500" />
                <span className="text-2xl font-bold text-slate-900">
                  {history.length > 1 
                    ? `${history[0].readiness_score > history[history.length - 1].readiness_score ? '+' : ''}${history[0].readiness_score - history[history.length - 1].readiness_score}%`
                    : '—'
                  }
                </span>
              </div>
              <div className="text-sm text-slate-600">Прогресс</div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="h-5 w-5 text-purple-500" />
                <span className="text-2xl font-bold text-slate-900">
                  {new Date(history[0]?.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                </span>
              </div>
              <div className="text-sm text-slate-600">Последний тест</div>
            </Card>
          </div>

          {/* График прогресса */}
          {history.length > 1 && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                График прогресса
              </h3>
              <div className="h-64 flex items-end gap-2">
                {history.slice().reverse().map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full bg-slate-100 rounded-t-lg relative" style={{ height: '200px' }}>
                      <div 
                        className={cn(
                          "w-full rounded-t-lg absolute bottom-0 transition-all duration-500",
                          item.readiness_score >= 70 ? "bg-gradient-to-t from-emerald-500 to-green-400" :
                          item.readiness_score >= 50 ? "bg-gradient-to-t from-amber-500 to-yellow-400" :
                          "bg-gradient-to-t from-red-500 to-rose-400"
                        )}
                        style={{ height: `${item.readiness_score}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-slate-900">
                          {item.readiness_score}%
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500">
                      {new Date(item.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Список прохождений */}
          <div className="space-y-4">
            {history.map((item, index) => (
              <Card key={item.session_id} className="p-6 hover:shadow-lg transition-all cursor-pointer">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0",
                      item.readiness_score >= 70 ? "bg-gradient-to-br from-emerald-500 to-green-600" :
                      item.readiness_score >= 50 ? "bg-gradient-to-br from-amber-500 to-orange-600" :
                      "bg-gradient-to-br from-red-500 to-rose-600"
                    )}>
                      {index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-slate-900">{item.target_profession}</h3>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                          {item.difficulty}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(item.created_at).toLocaleDateString('ru-RU', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          {item.verified_skills?.filter(s => s.is_confirmed).length || 0} подтверждено
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                          {item.verified_skills?.filter(s => !s.is_confirmed).length || 0} требуют работы
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-3xl font-bold text-slate-900">{item.readiness_score}%</div>
                      <div className="text-sm text-slate-500">готовности</div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setVerdict(item);
                          setSessionData({ session_id: item.session_id });
                          setStep('results');
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all font-medium text-sm"
                      >
                        Просмотр
                      </button>
                      <button
                        onClick={() => careerValidatorAPI.exportPDF(item.session_id)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-all"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen py-12 animate-fade-in">
      {step === 'upload' && renderUploadStep()}
      {step === 'profession' && renderProfessionStep()}
      {step === 'interview' && renderInterviewStep()}
      {step === 'results' && renderResultsStep()}
      {step === 'history' && renderHistoryStep()}
    </div>
  );
};

export default CareerValidator;