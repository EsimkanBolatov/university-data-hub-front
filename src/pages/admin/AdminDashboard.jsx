import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, Database, Settings, BarChart, Bot, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const adminCards = [
    {
      title: 'AI Синхронизация',
      description: 'Обновление векторной базы для AI ассистента',
      icon: Bot,
      color: 'from-blue-500 to-cyan-500',
      path: '/admin/ai-sync',
    },
    {
      title: 'Управление ВУЗами',
      description: 'Добавление и редактирование университетов',
      icon: Database,
      color: 'from-emerald-500 to-green-500',
      path: '/admin/universities',
    },
    {
      title: 'Статистика',
      description: 'Аналитика и метрики системы',
      icon: BarChart,
      color: 'from-purple-500 to-pink-500',
      path: '/admin/stats',
    },
    {
      title: 'Пользователи',
      description: 'Управление пользователями и правами',
      icon: Users,
      color: 'from-amber-500 to-orange-500',
      path: '/admin/users',
    },
    {
      title: 'Настройки',
      description: 'Конфигурация системы',
      icon: Settings,
      color: 'from-slate-500 to-slate-600',
      path: '/admin/settings',
    },
  ];

  const recentActivities = [
    { id: 1, user: 'Администратор', action: 'Обновил данные КазНУ', time: '10 мин назад' },
    { id: 2, user: 'AI Система', action: 'Выполнена синхронизация', time: '2 часа назад' },
    { id: 3, user: 'Модератор', action: 'Добавил новый ВУЗ', time: '5 часов назад' },
    { id: 4, user: 'Система', action: 'Резервное копирование', time: 'Вчера' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Панель управления</h1>
          <p className="text-slate-500 mt-1">
            Управление системой и административные функции
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700">
          <ShieldCheck className="h-5 w-5" />
          <span className="font-medium">Администратор</span>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">ВУЗов в системе</div>
              <div className="text-2xl font-bold text-slate-900">127</div>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <Database className="h-6 w-6" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Пользователей</div>
              <div className="text-2xl font-bold text-slate-900">2,458</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">AI запросов</div>
              <div className="text-2xl font-bold text-slate-900">12,456</div>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <Bot className="h-6 w-6" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Активность</div>
              <div className="text-2xl font-bold text-slate-900">98.5%</div>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
              <BarChart className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Admin Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card, index) => (
          <Card 
            key={index} 
            className="hover:shadow-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            onClick={() => navigate(card.path)}
          >
            <div className="p-6">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white w-fit mb-4`}>
                <card.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{card.title}</h3>
              <p className="text-slate-500 text-sm mb-4">{card.description}</p>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Перейти →
              </button>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Недавняя активность</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <Users className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">{activity.user}</div>
                    <div className="text-sm text-slate-500">{activity.action}</div>
                  </div>
                </div>
                <span className="text-sm text-slate-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* System Alerts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Системные уведомления</h3>
            <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
              2 новых
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <div className="font-medium text-amber-800 mb-1">AI Синхронизация</div>
                  <div className="text-amber-700 text-sm">
                    Последняя синхронизация выполнена 2 дня назад. Рекомендуется обновить данные.
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
              <div className="flex items-start gap-3">
                <Bot className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-800 mb-1">AI Ассистент</div>
                  <div className="text-blue-700 text-sm">
                    За последние 24 часа обработано 1,234 запроса к AI ассистенту.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;