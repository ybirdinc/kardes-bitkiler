"use client";
import CompanionPlantsGraph from '@/components/CompanionPlantsGraph';
import CompanionPlantsTable from '@/components/CompanionPlantsTable';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <CompanionPlantsGraph />
        <CompanionPlantsTable />
      </div>
    </div>
  );
}
