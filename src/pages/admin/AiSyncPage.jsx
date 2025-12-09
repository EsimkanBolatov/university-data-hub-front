import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Database, RefreshCw, CheckCircle, AlertCircle, Download, Upload } from 'lucide-react';
import { Card } from '../../components/ui/Card';

const AiSyncPage = () => {
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncDetails, setSyncDetails] = useState(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncStatus('in_progress');
    setSyncProgress(0);

    // Mock симуляция синхронизации
    const steps = [
      { name: 'Загрузка данных из PostgreSQL', time: 1000 },
      { name: 'Обработка текста', time: 1500 },
      { name: 'Генерация эмбеддингов через OpenAI', time: 2000 },
      { name: 'Сохранение в ChromaDB', time: 1000 },
      { name: 'Создание индексов', time: 500 },
    ];

    const details = {
      universities: 127,
      programs: 1840,
      cities: 25,
      documents: 2150,
      vectorsGenerated: 2150,
      databaseSize: '4.7 MB',
      timestamp: null,
    };

    for (let i = 0; i < steps.length; i++) {
      setSyncProgress(((i + 1) / steps.length) * 100);
      setSyncDetails({
        ...details,
        currentStep: steps[i].name,
        step: i + 1,
        totalSteps: steps.length,
      });
      
      await new Promise(resolve => setTimeout(resolve, steps[i].time));
    }

    setSyncProgress(100);
    setSyncStatus('completed');
    setSyncDetails({
      ...details,
      timestamp: new Date().toLocaleString(),
      currentStep: 'Синхронизация завершена',
    });
    
    setIsSyncing(false);
  };

  const stats = [
    { label: 'Всего ВУЗов', value: '127', icon: <Database className="h-5 w-5" /> },
    { label: 'Образовательных программ', value: '1,840', icon: <Bot className="h-5 w-5" /> },
    { label: 'Векторов в базе', value: '2,150', icon: <Upload className="h-5 w-5" /> },
    { label: 'Размер базы', value: '4.7 MB', icon: <Download className="h-5 w-5" /> },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Синхронизация AI</h1>
          <p className="text-slate-500 mt-1">
            Обновление векторной базы знаний для AI ассистента
          </p>
        </div>
        <button
          onClick={() => navigate('/admin')}
          className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
        >
          ← Назад к панели
        </button>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-100">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
            <Bot className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Как работает синхронизация?
            </h3>
            <p className="text-slate-600 mb-3">
              Система автоматически загружает все данные о ВУЗах из PostgreSQL, 
              преобразует их в текстовые описания, генерирует векторные эмбеддинги 
              через OpenAI API и сохраняет в ChromaDB для семантического поиска.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>PostgreSQL → Текст</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span>OpenAI Embeddings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span>ChromaDB Vector Store</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span>AI Чат готов к работе</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Sync Control */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Запуск синхронизации</h3>
                <p className="text-slate-500 text-sm mt-1">
                  Обновление данных для AI ассистента
                </p>
              </div>
              <div className="flex items-center gap-2">
                {syncStatus === 'completed' && (
                  <div className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="text-sm font-medium">Синхронизировано</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Progress Bar */}
              {isSyncing && (
                <div>
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>{syncDetails?.currentStep || 'Запуск...'}</span>
                    <span>{Math.round(syncProgress)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
                      style={{ width: `${syncProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Sync Button */}
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className={`
                  w-full py-4 rounded-xl font-medium text-lg transition-all duration-300
                  flex items-center justify-center gap-3
                  ${isSyncing 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl'
                  }
                `}
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Синхронизация...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-5 w-5" />
                    Запустить синхронизацию
                  </>
                )}
              </button>

              {/* Warning */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 mb-1">Внимание</h4>
                    <p className="text-amber-700 text-sm">
                      Синхронизация может занять несколько минут. 
                      Во время процесса AI чат может работать медленнее.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Sync Details */}
          {syncDetails && (
            <Card className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Детали синхронизации</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="text-sm text-slate-500">Обработано ВУЗов</div>
                    <div className="text-2xl font-bold text-slate-900">{syncDetails.universities}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="text-sm text-slate-500">Программ</div>
                    <div className="text-2xl font-bold text-slate-900">{syncDetails.programs}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="text-sm text-slate-500">Сгенерировано векторов</div>
                    <div className="text-2xl font-bold text-slate-900">{syncDetails.vectorsGenerated}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50">
                    <div className="text-sm text-slate-500">Размер базы</div>
                    <div className="text-2xl font-bold text-slate-900">{syncDetails.databaseSize}</div>
                  </div>
                </div>

                {syncDetails.timestamp && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-emerald-800">Последняя синхронизация</div>
                        <div className="text-emerald-600 text-sm">{syncDetails.timestamp}</div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    </div>
                  </div>
                )}

                {/* Steps */}
                <div className="space-y-3">
                  <h4 className="font-medium text-slate-700">Шаги выполнения:</h4>
                  {[
                    'Загрузка данных из PostgreSQL',
                    'Обработка и очистка текста',
                    'Генерация векторных эмбеддингов',
                    'Сохранение в векторную базу',
                    'Создание поисковых индексов'
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                        ${syncDetails.step && syncDetails.step > index 
                          ? 'bg-emerald-100 text-emerald-600' 
                          : 'bg-slate-100 text-slate-400'
                        }
                      `}>
                        {index + 1}
                      </div>
                      <span className={`
                        ${syncDetails.step && syncDetails.step > index 
                          ? 'text-emerald-700 font-medium' 
                          : 'text-slate-600'
                        }
                      `}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - Stats */}
        <div className="space-y-6">
          {/* Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Статистика базы</h3>
            <div className="space-y-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                      {stat.icon}
                    </div>
                    <span className="text-slate-700">{stat.label}</span>
                  </div>
                  <span className="font-bold text-slate-900">{stat.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* API Endpoints */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">API Эндпоинты</h3>
            <div className="space-y-3">
              {[
                { method: 'POST', endpoint: '/api/ai/sync', desc: 'Запуск синхронизации' },
                { method: 'POST', endpoint: '/api/ai/chat', desc: 'AI чат с контекстом' },
                { method: 'POST', endpoint: '/api/ai/recommend', desc: 'Персональные рекомендации' },
                { method: 'GET', endpoint: '/api/ai/status', desc: 'Статус AI системы' },
              ].map((api, index) => (
                <div key={index} className="p-3 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`
                      px-2 py-0.5 rounded text-xs font-medium
                      ${api.method === 'POST' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}
                    `}>
                      {api.method}
                    </span>
                    <code className="text-sm font-mono text-slate-700">{api.endpoint}</code>
                  </div>
                  <div className="text-xs text-slate-500">{api.desc}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <h3 className="text-lg font-bold mb-4">Быстрые действия</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/ai-chat')}
                className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-3"
              >
                <Bot className="h-5 w-5" />
                <div>
                  <div className="font-medium">Протестировать AI</div>
                  <div className="text-sm text-slate-300">Открыть чат для проверки</div>
                </div>
              </button>
              <button
                onClick={() => navigate('/catalog')}
                className="w-full text-left p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-3"
              >
                <Database className="h-5 w-5" />
                <div>
                  <div className="font-medium">Посмотреть данные</div>
                  <div className="text-sm text-slate-300">Каталог ВУЗов</div>
                </div>
              </button>
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="w-full text-left p-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 transition-colors flex items-center gap-3"
              >
                <RefreshCw className={`h-5 w-5 ${isSyncing ? 'animate-spin' : ''}`} />
                <div>
                  <div className="font-medium">Обновить сейчас</div>
                  <div className="text-sm text-slate-300">Запустить синхронизацию</div>
                </div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AiSyncPage;