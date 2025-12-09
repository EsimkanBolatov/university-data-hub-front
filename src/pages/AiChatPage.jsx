import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bot, User, Send, Sparkles, BookOpen, MapPin, GraduationCap, ArrowLeft, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { cn } from '../utils/cn';

const AiChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialMessage = location.state?.initialMessage || '';
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Привет! Я AI-ассистент по университетам Казахстана. Я могу помочь вам:\n\n• Найти ВУЗы по критериям (город, общежитие, специальность)\n• Дать рекомендации на основе ваших баллов\n• Сравнить университеты\n• Ответить на вопросы о программах и поступлении\n\nЧем могу помочь?',
      timestamp: new Date(),
    },
  ]);
  
  const [input, setInput] = useState(initialMessage);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  
  const sampleQuestions = [
    "Какие вузы есть в Алматы с общежитием?",
    "У меня 100 баллов, люблю физику. Что посоветуете?",
    "Лучшие IT университеты в Казахстане",
    "Стоимость обучения в КазНУ",
    "Какие есть медицинские программы?",
    "ВУЗы с общежитием в Астане",
  ];

  useEffect(() => {
    if (initialMessage) {
      setTimeout(() => {
        handleSendMessage(initialMessage);
      }, 500);
    }
  }, [initialMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message = input) => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Mock API call - replace with actual API
      const response = await mockAIResponse(message);
      
      const aiMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: messages.length + 2,
        role: 'assistant',
        content: 'Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const mockAIResponse = async (message) => {
    // Mock response based on question type
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('алматы') && lowerMessage.includes('общежити')) {
      return `В Алматы несколько университетов предоставляют общежития для студентов:\n\n🎓 **Satbayev University**\n• Местоположение: Алматы\n• Общежитие: Да, 5 студенческих общежитий\n• Стоимость: ~50,000 KZT/месяц\n• Контакты: +7 (727) 123-45-67\n\n🎓 **КазНУ им. аль-Фараби**\n• Местоположение: Алматы\n• Общежитие: Да, 10 корпусов\n• Стоимость: ~45,000 KZT/месяц\n• Вместимость: 5000 студентов\n\n🎓 **КазНПУ им. Абая**\n• Местоположение: Алматы\n• Общежитие: Да, 3 корпуса\n• Стоимость: ~40,000 KZT/месяц\n\nРекомендую уточнять наличие мест заранее, так как спрос высокий.`;
    }
    
    if (lowerMessage.includes('100 баллов') && lowerMessage.includes('физик')) {
      return `С 100 баллами ЕНТ и интересом к физике у вас отличные возможности! Вот мои рекомендации:\n\n🏆 **Топ-3 варианта:**\n\n1. **КазНУ им. аль-Фараби - Физико-технический факультет**\n• Проходной балл: 95-105\n• Гранты: Есть\n• Особенности: Сильная научная база, современные лаборатории\n• Рейтинг: 9.2/10\n\n2. **Satbayev University - Инженерная физика**\n• Проходной балл: 90-100\n• Гранты: Ограниченно\n• Особенности: Прикладная физика, связь с промышленностью\n• Рейтинг: 8.8/10\n\n3. **Евразийский национальный университет - Факультет физики**\n• Проходной балл: 85-95\n• Гранты: Есть\n• Особенности: Международные программы\n• Рейтинг: 8.5/10\n\nСоветую также рассмотреть специальности, связанные с ядерной физикой и астрофизикой.`;
    }
    
    if (lowerMessage.includes('it') || lowerMessage.includes('информатик')) {
      return `Лучшие IT университеты в Казахстане:\n\n💻 **Топ-5 IT ВУЗов:**\n\n1. **Satbayev University**\n• Факультет: Информационные технологии\n• Специальности: Компьютерные науки, Кибербезопасность\n• Рейтинг: 9.5/10\n\n2. **КазНУ им. аль-Фараби**\n• Факультет: Механика-математика\n• Специальности: Прикладная математика, Data Science\n• Рейтинг: 9.3/10\n\n3. **Назарбаев Университет**\n• Школа: Инженерии и цифровых наук\n• Специальности: Computer Science, Robotics\n• Рейтинг: 9.8/10\n\n4. **МУИТ**\n• Направление: Цифровые технологии\n• Специальности: Разработка ПО, AI\n• Рейтинг: 9.0/10\n\n5. **КБТУ**\n• Факультет: Информационных технологий\n• Специальности: Software Engineering\n• Рейтинг: 8.9/10\n\nСоветую обратить внимание на грантовые программы и стажировки в IT-компаниях.`;
    }
    
    return `Я проанализировал ваш вопрос: "${message}"\n\nНа основе данных о 120+ университетах Казахстана могу сказать:\n\n🔍 **Общие рекомендации:**\n1. Определите приоритеты: бюджет, город, специальность\n2. Проверьте наличие грантов и скидок\n3. Уточните требования к поступлению на текущий год\n4. Посетите дни открытых дверей\n\n📊 **Следующие шаги:**\n• Используйте фильтры в каталоге ВУЗов\n• Сравните интересующие университеты\n• Посмотрите отзывы студентов\n• Проверьте аккредитацию программ\n\nХотите уточнить какой-то конкретный аспект?`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">AI Ассистент</h1>
              <p className="text-slate-500">Помощь в выборе университета</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          Онлайн • База 120+ ВУЗов
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Chat Container */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col p-0 overflow-hidden">
            {/* Chat Header */}
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white shadow-sm">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Университетский помощник</h3>
                    <p className="text-sm text-slate-500">База данных обновлена сегодня</p>
                  </div>
                </div>
                <button
                  onClick={() => setMessages([messages[0]])}
                  className="text-sm text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-white transition-colors"
                >
                  Очистить чат
                </button>
              </div>
            </div>

            {/* Messages */}
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
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white' 
                      : 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                  )}>
                    {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  
                  <div className={cn(
                    "max-w-[80%] rounded-2xl p-5",
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-100'
                      : 'bg-slate-50 border border-slate-100'
                  )}>
                    <div className="prose prose-sm max-w-none">
                      {msg.content.split('\n').map((line, i) => (
                        <p key={i} className="mb-2 last:mb-0">{line}</p>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                      <span className="text-xs text-slate-500">
                        {formatTime(new Date(msg.timestamp))}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(msg.content)}
                          className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                          title="Копировать"
                        >
                          <Copy className="h-3.5 w-3.5 text-slate-500" />
                        </button>
                        {msg.role === 'assistant' && (
                          <>
                            <button className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
                              <ThumbsUp className="h-3.5 w-3.5 text-slate-500 hover:text-emerald-500" />
                            </button>
                            <button className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors">
                              <ThumbsDown className="h-3.5 w-3.5 text-slate-500 hover:text-rose-500" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t border-slate-100 bg-white">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Задайте вопрос о ВУЗах..."
                    className="w-full px-5 py-4 pr-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="2"
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!input.trim() || isLoading}
                    className={cn(
                      "absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all",
                      input.trim() && !isLoading
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:scale-105"
                        : "bg-slate-100 text-slate-400"
                    )}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs text-slate-500 self-center">Примеры:</span>
                {sampleQuestions.slice(0, 3).map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(question);
                      setTimeout(() => handleSendMessage(question), 100);
                    }}
                    disabled={isLoading}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              Возможности AI
            </h3>
            <ul className="space-y-3">
              {[
                "Поиск ВУЗов по критериям",
                "Рекомендации на основе баллов",
                "Сравнение университетов",
                "Информация о грантах",
                "Прогноз поступления",
                "Консультация по специальностям"
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span className="text-slate-700">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-500" />
              Популярные запросы
            </h3>
            <div className="space-y-3">
              {sampleQuestions.map((question, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(question);
                    setTimeout(() => handleSendMessage(question), 100);
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors text-sm text-slate-700 hover:text-slate-900 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="line-clamp-2">{question}</span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Send className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <h3 className="font-bold text-lg mb-3">База знаний</h3>
            <p className="text-slate-300 text-sm mb-4">
              Система использует данные о 120+ университетах Казахстана, обновленные в реальном времени.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">ВУЗов в базе</span>
                <span className="font-bold">127</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Образовательных программ</span>
                <span className="font-bold">1,840</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Городов</span>
                <span className="font-bold">25</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AiChatPage;