// src/pages/AiChatPage.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  User, Send, Sparkles, ArrowLeft, Mic, Volume2, VolumeX, StopCircle, AlertCircle
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { cn } from '../utils/cn';
import EveBot from '../components/ui/EveBot';
import { aiAPI } from '../api/axios'; // Импортируем наше API

const AiChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialMessage = location.state?.initialMessage || '';

  // Состояния
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [botState, setBotState] = useState('idle');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [supportError, setSupportError] = useState(null);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);

  // Инициализация Web Speech API
  useEffect(() => {
    // Проверка поддержки браузером
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupportError("Ваш браузер не поддерживает голосовой ввод. Используйте Chrome или Safari.");
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();

      // ИЗМЕНЕНИЕ 1: Непрерывное распознавание для записи длинных сообщений
      recognitionRef.current.continuous = true;
      // ИЗМЕНЕНИЕ 2: Промежуточные результаты, чтобы видеть текст в процессе речи
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ru-RU';

      recognitionRef.current.onstart = () => {
        console.log("Микрофон включен");
        setIsListening(true);
        setBotState('listening');
      };

      recognitionRef.current.onend = () => {
        console.log("Микрофон выключен");
        setIsListening(false);
        // Возвращаем в idle только если бот не начал сразу отвечать
        setBotState((prev) => (prev === 'speaking' ? 'speaking' : 'idle'));
      };

      // ИЗМЕНЕНИЕ 3: Новая логика обработки результатов для длинного текста
      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }

        // Мы берем весь накопленный текст из сессии
        const fullTranscript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');

        console.log("Распознано:", fullTranscript);
        setInput(fullTranscript);
        // В continuous режиме мы НЕ отправляем сообщение автоматически,
        // пользователь должен нажать стоп или отправить сам, когда закончит мысль.
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Ошибка SpeechRecognition:", event.error);
        // Не выключаем сразу при мелких ошибках (no-speech), только при критических
        if (event.error === 'not-allowed' || event.error === 'audio-capture') {
           setIsListening(false);
           setBotState('idle');
        }

        if (event.error === 'not-allowed') {
          alert("⚠️ Доступ к микрофону запрещен. Разрешите его в настройках браузера.");
        }
      };
    }

    // Приветствие
    const welcomeMsg = {
      id: 1,
      role: 'assistant',
      content: 'Привет! Я ваш AI-помощник. Нажмите на микрофон, чтобы поговорить со мной.',
      timestamp: new Date(),
    };
    setMessages([welcomeMsg]);

    if (initialMessage) {
      handleSendMessage(initialMessage);
    }

    return () => {
      if (synthesisRef.current) synthesisRef.current.cancel();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch { /* ignore */ }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Автоскролл к новому сообщению
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakText = (text) => {
    if (!voiceEnabled || !text || !synthesisRef.current) return;

    synthesisRef.current.cancel();

    // Очистка текста от Markdown символов для корректного чтения
    const cleanText = text.replace(/[*#]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ru-RU';

    // ИЗМЕНЕНИЕ 4: Настройки голоса (громкость и четкость)
    utterance.volume = 1.0; // Максимальная громкость (0.0 - 1.0)
    utterance.rate = 1.1;   // Немного ускоренный темп
    utterance.pitch = 1.0;  // Нормальная высота голоса

    utterance.onstart = () => {
      setIsSpeaking(true);
      setBotState('speaking');
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setBotState('idle');
    };

    utterance.onerror = (e) => {
      console.error("Ошибка синтеза речи:", e);
      setIsSpeaking(false);
      setBotState('idle');
    };

    synthesisRef.current.speak(utterance);
  };

  const toggleListening = async () => {
    if (!recognitionRef.current) {
      alert(supportError || "Голосовой ввод недоступен");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      return;
    }

    if (isSpeaking) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      recognitionRef.current.start();
    } catch (err) {
      console.error("Ошибка доступа к микрофону:", err);
      alert("⚠️ Не удалось получить доступ к микрофону. Проверьте настройки системы.");
    }
  };

  const handleSendMessage = async (message = input) => {
    if (!message.trim() || isLoading) return;

    // Если идет запись, останавливаем её перед отправкой
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setBotState('processing');

    try {
      const response = await aiAPI.chat(message);
      const aiResponseText = response.data.answer || "Извините, я не нашел информации по вашему запросу.";

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
      speakText(aiResponseText);

    } catch (error) {
      console.error('API Error:', error);
      const errorMessage = "Извините, произошла ошибка соединения с сервером. Попробуйте позже.";

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
      }]);
      speakText(errorMessage);

      setBotState('idle');
    } finally {
      setIsLoading(false);
      if (!voiceEnabled) setBotState('idle');
    }
  };

  return (
    // ИЗМЕНЕНИЕ 5: Исправление высоты контейнера для работы скролла
    // h-[calc(100vh-6rem)] учитывает padding родительского Layout (p-8 = 2rem * 2 = 4rem + header/margins)
    <div className="h-[calc(100vh-6rem)] flex flex-col animate-fade-in relative overflow-hidden">

      {/* Фон */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 shadow-sm border border-slate-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Ассистент</h1>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className={`w-2 h-2 rounded-full ${isSpeaking || isListening ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
              {isListening ? 'Слушаю...' : isSpeaking ? 'Говорю...' : isLoading ? 'Думаю...' : 'Онлайн'}
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            const newState = !voiceEnabled;
            setVoiceEnabled(newState);
            if (!newState) synthesisRef.current.cancel();
          }}
          className={`p-3 rounded-xl transition-all ${voiceEnabled ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}
          title={voiceEnabled ? "Выключить звук" : "Включить звук"}
        >
          {voiceEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </button>
      </div>

      {/* ИЗМЕНЕНИЕ 6: min-h-0 критически важен для работы flex-скролла */}
      <div className="flex-1 grid lg:grid-cols-2 gap-6 min-h-0">

        {/* Бот (Анимация) */}
        <div className="hidden lg:flex flex-col items-center justify-center relative">
          <div className="relative z-10 scale-125 transform transition-all duration-500">
            <EveBot state={botState} />
          </div>

          <div className="mt-8 text-center max-w-md">
            {supportError ? (
              <div className="text-red-500 flex items-center justify-center gap-2">
                <AlertCircle className="h-5 w-5" />
                {supportError}
              </div>
            ) : (
              <>
                <h3 className="text-xl font-medium text-slate-800 mb-2">
                  {botState === 'listening' && "Я вас внимательно слушаю..."}
                  {botState === 'processing' && "Анализирую ваш вопрос..."}
                  {botState === 'speaking' && "Отвечаю..."}
                  {botState === 'idle' && "Чем могу помочь?"}
                </h3>
                <p className="text-sm text-slate-500">
                  {voiceEnabled ? "Голосовой ответ включен" : "Звук выключен"}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Чат - Контейнер */}
        {/* ИЗМЕНЕНИЕ 7: min-h-0 на Card позволяет скроллить внутренний контент */}
        <div className="flex flex-col h-full min-h-0">
          <Card className="flex-1 flex flex-col overflow-hidden bg-white/80 backdrop-blur-md shadow-xl border-slate-200">

            {/* Сообщения - Область прокрутки */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-4 animate-slide-up",
                    msg.role === 'user' ? 'flex-row-reverse' : ''
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md",
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                      : 'bg-white text-blue-500 border border-blue-100'
                  )}>
                    {msg.role === 'user' ? <User className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                  </div>

                  <div className={cn(
                    "max-w-[85%] rounded-2xl p-4 shadow-sm text-sm md:text-base whitespace-pre-wrap",
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-100 rounded-tl-none text-slate-700'
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white text-blue-500 border border-blue-100 flex items-center justify-center shadow-md">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 shadow-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Ввод */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              <div className="flex items-end gap-3">

                {/* Кнопка записи */}
                <button
                  onClick={toggleListening}
                  className={cn(
                    "p-4 rounded-2xl transition-all duration-300 shadow-md flex-shrink-0 relative",
                    isListening
                      ? "bg-red-500 text-white shadow-red-200"
                      : "bg-gradient-to-br from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:scale-105",
                    supportError && "opacity-50 cursor-not-allowed grayscale"
                  )}
                  title={isListening ? "Остановить запись" : "Нажать и говорить (до 5 минут)"}
                  disabled={!!supportError}
                >
                  {isListening && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping"></span>
                  )}
                  {isListening ? <StopCircle className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                </button>

                {/* Поле ввода */}
                <div className="flex-1 relative bg-slate-50 rounded-2xl border border-slate-200 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                    placeholder={isListening ? "Слушаю... (говорите дольше)" : "Напишите сообщение..."}
                    className="w-full px-4 py-3 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[50px]"
                    rows="1"
                    disabled={isLoading}
                  />
                </div>

                {/* Кнопка отправки */}
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "p-4 rounded-2xl transition-all duration-300 shadow-md flex-shrink-0",
                    input.trim() && !isLoading
                      ? "bg-slate-800 text-white hover:bg-slate-900 hover:scale-105"
                      : "bg-slate-100 text-slate-300 cursor-not-allowed"
                  )}
                >
                  <Send className="h-6 w-6" />
                </button>
              </div>
              <div className="text-center mt-2">
                <p className="text-xs text-slate-400">
                  {supportError
                    ? "Голосовой ввод недоступен в этом браузере"
                    : "Нажмите на микрофон для записи. Для отправки нажмите Стоп или Enter."}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AiChatPage;