import React, { useState, useEffect, useCallback } from 'react';
import { Search, Info, Filter, RotateCcw } from 'lucide-react';
import companionPlantsDataRaw from '../data/kardes_bitkiler.json';

// JSON dosyasındaki tipleri tanımla
export type PlantRelations = {
  favorable: string[];
  unfavorable: string[];
  complex: string[];
};

// JSON dosyasını tipli olarak kullan
const companionPlantsData: Record<string, PlantRelations> = companionPlantsDataRaw as Record<string, PlantRelations>;

const CompanionPlantsGraph = () => {
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [hoveredPlant, setHoveredPlant] = useState<string | null>(null);
  // Seçili bitkinin ilişkilerini hesapla
  const getPlantRelations = useCallback((plantName: string | number): PlantRelations => {
    if (!plantName || !companionPlantsData[String(plantName)]) return { favorable: [], unfavorable: [], complex: [] };
    return companionPlantsData[String(plantName)];
  }, []);

  // Renk belirleme fonksiyonu
  const getPlantColor = useCallback((plantName: string) => {
    if (!selectedPlant) return '#94a3b8';
    if (plantName === selectedPlant) return '#3b82f6';

    const relations = getPlantRelations(selectedPlant);
    if (relations.favorable.includes(plantName)) return '#10b981';
    if (relations.unfavorable.includes(plantName)) return '#ef4444';
    if (relations.complex.includes(plantName)) return '#f59e0b';

    return '#94a3b8';
  }, [selectedPlant, getPlantRelations]);

  // İstatistikleri hesapla
  const getStats = useCallback(() => {
    if (!selectedPlant) return { favorable: 0, unfavorable: 0, complex: 0 };
    const relations = getPlantRelations(selectedPlant);
    return {
      favorable: relations.favorable.length,
      unfavorable: relations.unfavorable.length,
      complex: relations.complex.length
    };
  }, [selectedPlant, getPlantRelations]);

  const stats = getStats();

  // Bitki isimlerini filtrele
  const filteredPlants = Object.keys(companionPlantsData).filter((plant) =>
    plant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Panel - Kontroller */}
        <div className="lg:col-span-1 space-y-4">
          {/* Arama */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Bitki ara..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              onClick={() => { setSelectedPlant(null); setSearchTerm(''); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Temizle
            </button>
          </div>

          {/* İstatistikler */}
          {selectedPlant && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Info className="h-5 w-5" />
                {selectedPlant} İstatistikleri
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-green-700 font-medium">Uyumlu</span>
                  <span className="text-green-800 font-bold text-lg">{stats.favorable}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-red-700 font-medium">Uyumsuz</span>
                  <span className="text-red-800 font-bold text-lg">{stats.unfavorable}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <span className="text-amber-700 font-medium">Karmaşık</span>
                  <span className="text-amber-800 font-bold text-lg">{stats.complex}</span>
                </div>
              </div>
            </div>
          )}

          {/* Renk Açıklaması */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Renk Açıklaması</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Seçili Bitki</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Uyumlu Bitkiler</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Uyumsuz Bitkiler</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Çelişkili sonuçlar</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Nötr/İlişkisiz</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Panel - Grafik */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Bitki İlişkileri Haritası
            </h2>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {filteredPlants.map((plant) => {
                const color = getPlantColor(plant);
                const isSelected = plant === selectedPlant;
                const isHovered = plant === hoveredPlant;

                return (
                  <div
                    key={plant}
                    className={`
                        relative p-2 rounded-lg cursor-pointer transition-all duration-200 border-2
                        ${isSelected ? 'border-blue-500 scale-110 z-10' : 'border-transparent'}
                        ${isHovered ? 'scale-105 z-5' : ''}
                        hover:shadow-lg
                      `}
                    style={{ backgroundColor: color + '20', borderColor: isSelected ? color : 'transparent' }}
                    onClick={() => setSelectedPlant(plant === selectedPlant ? null : plant)}
                    onMouseEnter={() => setHoveredPlant(plant)}
                    onMouseLeave={() => setHoveredPlant(null)}
                    title={plant}
                  >
                    <div
                      className="w-full h-8 rounded-md flex items-center justify-center text-white text-xs font-medium shadow-sm"
                      style={{ backgroundColor: color }}
                    >
                      {plant.length > 8 ? plant.substring(0, 6) + '...' : plant}
                    </div>

                    {/* Tooltip */}
                    {isHovered && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg z-20 whitespace-nowrap">
                        {plant}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredPlants.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Arama kriterinize uygun bitki bulunamadı.</p>
              </div>
            )}

            {!selectedPlant && filteredPlants.length > 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-lg">Bir bitki seçin ve ilişkilerini görün</p>
                <p className="text-sm mt-2">Bitkiler üzerine tıklayarak başlayın</p>
              </div>
            )}
          </div>

          {/* Seçili Bitki Detayları */}
          {selectedPlant && (
            <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {selectedPlant} - Detaylı İlişkiler
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Uyumlu Bitkiler */}
                <div>
                  <h4 className="text-lg font-medium text-green-700 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Uyumlu Bitkiler ({stats.favorable})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {getPlantRelations(selectedPlant).favorable.map((plant) => (
                      <div
                        key={plant}
                        className="p-2 bg-green-50 rounded cursor-pointer hover:bg-green-100 transition-colors"
                        onClick={() => setSelectedPlant(plant)}
                      >
                        <span className="text-sm text-green-800">{plant}</span>
                      </div>
                    ))}
                    {stats.favorable === 0 && (
                      <p className="text-sm text-gray-500 italic">Uyumlu bitki bulunmuyor</p>
                    )}
                  </div>
                </div>

                {/* Uyumsuz Bitkiler */}
                <div>
                  <h4 className="text-lg font-medium text-red-700 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    Uyumsuz Bitkiler ({stats.unfavorable})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {getPlantRelations(selectedPlant).unfavorable.map((plant) => (
                      <div
                        key={plant}
                        className="p-2 bg-red-50 rounded cursor-pointer hover:bg-red-100 transition-colors"
                        onClick={() => setSelectedPlant(plant)}
                      >
                        <span className="text-sm text-red-800">{plant}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Çelişkili SOnuçlar */}
                <div>
                  <h4 className="text-lg font-medium text-amber-700 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    Çelişkili Sonuçlar ({stats.complex})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {getPlantRelations(selectedPlant).complex.map((plant) => (
                      <div
                        key={plant}
                        className="p-2 bg-amber-50 rounded cursor-pointer hover:bg-amber-100 transition-colors"
                        onClick={() => setSelectedPlant(plant)}
                      >
                        <span className="text-sm text-amber-800">{plant}</span>
                      </div>
                    ))}
                    {stats.complex === 0 && (
                      <p className="text-sm text-gray-500 italic">Karmaşık ilişki bulunmuyor</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompanionPlantsGraph;