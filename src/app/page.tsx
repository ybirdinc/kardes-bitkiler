"use client";
import { useState } from 'react';
import CompanionPlantsGraph from '@/components/CompanionPlantsGraph';
import CompanionPlantsTable from '@/components/CompanionPlantsTable';
export default function Home() {
  const [graphShow, setGraphShow] = useState(true);
  const [tableShow, setTableShow] = useState(false);
  return (
    <>
      <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🌱 Kardeş Bitkiler İnteraktif Grafik
            </h1>
            <p className="text-gray-600 text-lg">
              Bitkilerinizin uyumlu ve uyumsuz komşularını keşfedin
            </p>
            <p className="text-gray-600 text-lg">
              <span className='underline cursor-pointer' onClick={() => { setGraphShow(true); setTableShow(false); }}>Bitki İlişkileri Haritası</span> | <span className='underline cursor-pointer' onClick={() => { setGraphShow(false); setTableShow(true); }}>Bitki İlişkileri Çapraz Tablo</span>
            </p>
          </div>
        </div>
      </div>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {graphShow && (
            <CompanionPlantsGraph />
          )}
          {tableShow && (
            <CompanionPlantsTable />
          )}
        </div>
      </div>
    </>

  );
}
