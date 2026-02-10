'use client';

import type { ClinicSummary } from '@/types/clinic';
import ClinicCard from '@/components/clinic/ClinicCard';

interface ClinicListProps {
  clinics: ClinicSummary[];
  loading?: boolean;
  selectedClinicId?: string | null;
  onSelectClinic?: (clinic: ClinicSummary) => void;
}

export default function ClinicList({
  clinics,
  loading,
  selectedClinicId,
  onSelectClinic,
}: ClinicListProps) {
  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 border-b border-gray-100 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="flex gap-1 mb-2">
              <div className="h-5 bg-gray-200 rounded-full w-16" />
              <div className="h-5 bg-gray-200 rounded-full w-16" />
            </div>
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (clinics.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-gray-500 text-sm">找不到符合條件的診所</p>
          <p className="text-gray-400 text-xs mt-1">請嘗試調整篩選條件</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
        <p className="text-xs text-gray-500">找到 {clinics.length} 間診所</p>
      </div>
      {clinics.map((clinic) => (
        <ClinicCard
          key={clinic.id}
          clinic={clinic}
          isSelected={clinic.id === selectedClinicId}
          onSelect={onSelectClinic}
        />
      ))}
    </div>
  );
}
