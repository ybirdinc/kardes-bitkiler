"use client";
import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  SortingState,
} from "@tanstack/react-table";
import companionPlantsDataRaw from "../data/kardes_bitkiler.json";

type PlantRelations = {
  favorable: string[];
  unfavorable: string[];
  complex: string[];
};

const data: Record<string, PlantRelations> = companionPlantsDataRaw as Record<string, PlantRelations>;
const plants = Object.keys(data).sort();

const columns = [
  {
    header: "Bitki",
    accessorKey: "plant",
    cell: (info: any) => info.getValue(),
    enableSorting: true,
    enableColumnFilter: true,
  },
  ...plants.map((plant2) => ({
    header: plant2,
    accessorKey: plant2,
    cell: (info: any) => info.getValue(),
    enableSorting: true,
    enableColumnFilter: false,
  })),
];

const tableData = plants.map((plant1) => {
  const row: Record<string, string> = { plant: plant1 };
  plants.forEach((plant2) => {
    if (plant1 === plant2) {
      row[plant2] = "⬛";
    } else if (data[plant1].favorable.includes(plant2)) {
      row[plant2] = "✅";
    } else if (data[plant1].unfavorable.includes(plant2)) {
      row[plant2] = "❌";
    } else if (data[plant1].complex.includes(plant2)) {
      row[plant2] = "⚠️";
    } else {
      row[plant2] = "−";
    }
  });
  return row;
});

export default function CompanionPlantsDataTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Tabloda ara..."
          value={globalFilter ?? ""}
          onChange={e => setGlobalFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-colors"
        />
        {globalFilter && (
          <button
            onClick={() => setGlobalFilter("")}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors"
            aria-label="Aramayı temizle"
            type="button"
          >
            Temizle
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse table-auto rounded-xl overflow-hidden">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, i) => (
                  <th
                    key={header.id}
                    className={
                      `px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider border-b border-gray-200 ` +
                      (i === 0 ? "sticky left-0 z-10 bg-gray-50" : "") +
                      " cursor-pointer select-none text-gray-700"
                    }
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{ asc: " ▲", desc: " ▼" }[header.column.getIsSorted() as string] ?? ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-green-50 transition-colors">
                {row.getVisibleCells().map((cell, i) => {
                  // Renkli hücreler için
                  const value = cell.getValue();
                  let cellClass = "px-4 py-3 text-center border-b border-gray-100 ";
                  if (value === "✅") cellClass += "bg-green-50 text-green-800 font-bold";
                  else if (value === "❌") cellClass += "bg-red-50 text-red-800 font-bold";
                  else if (value === "⚠️") cellClass += "bg-amber-50 text-amber-800 font-bold";
                  else if (value === "⬛") cellClass += "bg-blue-50 text-blue-800 font-bold";
                  else cellClass += "text-gray-400";
                  if (i === 0) cellClass += " sticky left-0 z-10 bg-white text-left font-medium text-gray-900 whitespace-nowrap";
                  return (
                    <td key={cell.id} className={cellClass} title={cell.column.id !== 'plant' ? `${row.original.plant} - ${cell.column.id}` : undefined}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
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
          <span className="text-sm text-gray-600">Çelişkili Sonuçlar</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-6 h-6 bg-blue-100 text-blue-800 text-center rounded">⬛</span>
          <span className="text-sm text-gray-600">Kendisi</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-6 h-6 bg-gray-50 text-gray-400 text-center rounded">−</span>
          <span className="text-sm text-gray-600">İlişkisiz</span>
        </div>
      </div>
    </div>
  );
}