import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { universitiesAPI } from '../api/axios';
import { X, Check, Minus, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';

const Compare = () => {
  // В реальности ID должны браться из LocalStorage или Context
  const [compareIds, setCompareIds] = useState([1, 2]);

  const { data: comparisonData, isLoading } = useQuery({
    queryKey: ['compare', compareIds],
    queryFn: () => universitiesAPI.compare(compareIds).then(res => res.data),
    enabled: compareIds.length > 0,
  });

  const removeId = (id) => {
    setCompareIds(prev => prev.filter(i => i !== id));
  };

  if (compareIds.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Список сравнения пуст</h2>
        <p className="text-slate-500 mb-6">Добавьте университеты из каталога для сравнения</p>
        <Link to="/catalog" className="bg-primary-600 text-white px-6 py-2.5 rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-500/20 font-medium">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Сравнение университетов</h1>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-16 bg-white rounded-xl shadow-sm animate-pulse w-full"></div>
          <div className="h-96 bg-white rounded-xl shadow-sm animate-pulse w-full"></div>
        </div>
      ) : (
        <Card padding="p-0" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="p-6 bg-slate-50 text-left w-64 border-b border-slate-200 font-semibold text-slate-500 uppercase tracking-wider text-xs">Параметры</th>
                  {comparisonData?.map(uni => (
                    <th key={uni.id} className="p-6 border-b border-slate-200 min-w-[280px] relative bg-white align-top">
                      <button 
                        onClick={() => removeId(uni.id)}
                        className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition"
                      >
                        <X className="h-5 w-5" />
                      </button>
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-white border border-slate-100 rounded-xl mb-4 flex items-center justify-center p-2 shadow-sm">
                           {uni.logo_url ? <img src={uni.logo_url} className="w-full h-full object-contain"/> : '🎓'}
                        </div>
                        <Link to={`/university/${uni.id}`} className="text-base font-bold text-slate-900 hover:text-primary-600 transition mb-1">
                          {uni.name_ru}
                        </Link>
                        <span className="text-slate-400 text-xs">{uni.city}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <TableRow label="Рейтинг">
                  {comparisonData?.map(uni => (
                    <td key={uni.id} className="p-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        ⭐ {uni.rating}
                      </span>
                    </td>
                  ))}
                </TableRow>
                
                <TableRow label="Стоимость (мин.)">
                  {comparisonData?.map(uni => (
                    <td key={uni.id} className="p-4 text-center text-slate-900 font-semibold">
                      {uni.min_price ? `${uni.min_price.toLocaleString()} ₸` : '—'}
                    </td>
                  ))}
                </TableRow>

                <TableRow label="Общежитие">
                  {comparisonData?.map(uni => (
                    <td key={uni.id} className="p-4 text-center">
                      {uni.has_dormitory ? (
                        <div className="flex justify-center"><Check className="h-5 w-5 text-emerald-500" /></div>
                      ) : (
                        <div className="flex justify-center"><Minus className="h-5 w-5 text-slate-300" /></div>
                      )}
                    </td>
                  ))}
                </TableRow>

                <TableRow label="Кол-во программ">
                  {comparisonData?.map(uni => (
                    <td key={uni.id} className="p-4 text-center text-slate-600">
                      {uni.programs_count || 0}
                    </td>
                  ))}
                </TableRow>

                <TableRow label="Трудоустройство">
                  {comparisonData?.map(uni => (
                    <td key={uni.id} className="p-4 text-center font-medium text-primary-600">
                      {uni.employment_rate ? `${uni.employment_rate}%` : '—'}
                    </td>
                  ))}
                </TableRow>
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

const TableRow = ({ label, children }) => (
    <tr className="hover:bg-slate-50/50 transition-colors">
        <td className="p-4 pl-6 font-medium text-slate-500 bg-slate-50/30 border-r border-slate-100">{label}</td>
        {children}
    </tr>
);

export default Compare;