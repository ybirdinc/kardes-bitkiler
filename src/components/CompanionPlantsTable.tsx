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
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-4">
      <input
        type="text"
        placeholder="Tabloda ara..."
        value={globalFilter ?? ""}
        onChange={e => setGlobalFilter(e.target.value)}
        className="mb-4 px-3 py-2 border rounded w-full max-w-xs"
      />
      <table className="min-w-full border">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-2 py-2 bg-gray-100 text-xs text-gray-700 border cursor-pointer select-none"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: " ▲",
                    desc: " ▼",
                  }[header.column.getIsSorted() as string] ?? ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-2 py-2 text-center border">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
          <span className="inline-block w-6 h-6 bg-gray-100 text-gray-800 text-center rounded">−</span>
          <span className="text-sm text-gray-600">İlişki Yok</span>
        </div>
      </div>
    </div>
  );
}