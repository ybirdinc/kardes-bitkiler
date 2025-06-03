import React from 'react';
import companionPlantsDataRaw from '../data/kardes_bitkiler.json';

type PlantRelations = {
  favorable: string[];
  unfavorable: string[];
  complex: string[];
};

const CompanionPlantsTable = () => {
  const data: Record<string, PlantRelations> = companionPlantsDataRaw as Record<string, PlantRelations>;
  const plants = Object.keys(data).sort();

  // İki bitki arasındaki ilişkiyi belirle
  const getRelationType = (plant1: string, plant2: string): 'favorable' | 'unfavorable' | 'complex' | 'none' => {
    if (data[plant1].favorable.includes(plant2)) return 'favorable';
    if (data[plant1].unfavorable.includes(plant2)) return 'unfavorable';
    if (data[plant1].complex.includes(plant2)) return 'complex';
    return 'none';
  };

  // İlişki tipine göre hücre rengi ve içeriği belirle
  const getCellStyle = (relationType: 'favorable' | 'unfavorable' | 'complex' | 'none') => {
    switch (relationType) {
      case 'favorable':
        return 'bg-green-100 text-green-800';
      case 'unfavorable':
        return 'bg-red-100 text-red-800';
      case 'complex':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-50 text-gray-400';
    }
  };

  const getCellContent = (relationType: 'favorable' | 'unfavorable' | 'complex' | 'none') => {
    switch (relationType) {
      case 'favorable':
        return '✅';
      case 'unfavorable':
        return '❌';
      case 'complex':
        return '⚠️';
      default:
        return '−';
    }
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Çapraz Referans Tablosu</h2>
      </div>
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="sticky left-0 z-10 bg-gray-50 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    Bitkiler
                  </th>
                  {plants.map((plant: string) => (
                    <th
                      key={plant}
                      scope="col"
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px] whitespace-normal"
                    >
                      {plant}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {plants.map((plant1: string) => (
                  <tr key={plant1} className="hover:bg-gray-50">
                    <td className="sticky left-0 z-10 bg-white px-3 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {plant1}
                    </td>
                    {plants.map((plant2: string) => {
                      const relationType = getRelationType(plant1, plant2);
                      return (                        <td
                          key={plant2}
                          className={`px-3 py-4 text-sm text-center ${getCellStyle(relationType)}`}
                          title={`${plant1} -> ${plant2}: ${relationType}`}
                        >
                          {plant1 === plant2 ? '⬛' : getCellContent(relationType)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Lejant */}
      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-block w-6 h-6 bg-green-100 text-green-800 text-center rounded">✅</span>
          <span className="text-sm text-gray-600">Uyumlu</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-6 h-6 bg-red-100 text-red-800 text-center rounded">❌</span>
          <span className="text-sm text-gray-600">Uyumsuz</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-6 h-6 bg-amber-100 text-amber-800 text-center rounded">⚠️</span>
          <span className="text-sm text-gray-600">Karmaşık</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-6 h-6 bg-gray-50 text-gray-400 text-center rounded">−</span>
          <span className="text-sm text-gray-600">İlişkisiz</span>
        </div>
      </div>
    </div>
  );
};

export default CompanionPlantsTable;
