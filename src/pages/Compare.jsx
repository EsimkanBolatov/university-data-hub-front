import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { universitiesAPI } from '../api/axios';
import { X, Check, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Compare = () => {
  // В реальности ID должны браться из LocalStorage или Context
  const [compareIds, setCompareIds] = useState([1, 2]); // Пример ID для сравнения

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
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Список сравнения пуст</h2>
        <p className="text-gray-600 mb-6">Добавьте университеты из каталога для сравнения</p>
        <Link to="/catalog" className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Сравнение университетов</h1>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded w-full"></div>
          <div className="h-64 bg-gray-200 rounded w-full"></div>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <table className="w-full min-w-[800px] border-collapse bg-white shadow-sm rounded-xl overflow-hidden">
            <thead>
              <tr>
                <th className="p-4 bg-gray-50 text-left w-48 border-b">Параметры</th>
                {comparisonData?.map(uni => (
                  <th key={uni.id} className="p-4 border-b min-w-[250px] relative">
                    <button 
                      onClick={() => removeId(uni.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full mb-3 flex items-center justify-center overflow-hidden">
                         {uni.logo_url ? <img src={uni.logo_url} className="w-full h-full object-cover"/> : '🎓'}
                      </div>
                      <Link to={`/university/${uni.id}`} className="text-lg font-bold hover:text-blue-600 text-center">
                        {uni.name_ru}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-4 font-medium text-gray-600 bg-gray-50">Город</td>
                {comparisonData?.map(uni => (
                  <td key={uni.id} className="p-4 text-center font-medium">{uni.city}</td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-gray-600 bg-gray-50">Рейтинг</td>
                {comparisonData?.map(uni => (
                  <td key={uni.id} className="p-4 text-center">
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                      ⭐ {uni.rating}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-gray-600 bg-gray-50">Стоимость (мин.)</td>
                {comparisonData?.map(uni => (
                  <td key={uni.id} className="p-4 text-center text-blue-600 font-bold">
                    {uni.min_price ? `${uni.min_price.toLocaleString()} ₸` : '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-gray-600 bg-gray-50">Общежитие</td>
                {comparisonData?.map(uni => (
                  <td key={uni.id} className="p-4 text-center">
                    {uni.has_dormitory ? (
                      <Check className="h-6 w-6 text-green-500 mx-auto" />
                    ) : (
                      <Minus className="h-6 w-6 text-gray-300 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-gray-600 bg-gray-50">Программы</td>
                {comparisonData?.map(uni => (
                  <td key={uni.id} className="p-4 text-center">
                    {uni.programs_count || 0} направлений
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Compare;