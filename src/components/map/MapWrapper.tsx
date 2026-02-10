import dynamic from 'next/dynamic';
import type { ClinicSummary } from '@/types/clinic';

const Map = dynamic(() => import('./Map'), {
  loading: () => (
    <div className="h-full w-full animate-pulse bg-gray-100 flex items-center justify-center">
      <p className="text-gray-400">載入地圖中...</p>
    </div>
  ),
  ssr: false,
});

interface MapWrapperProps {
  clinics: ClinicSummary[];
  selectedClinicId?: string | null;
  onSelectClinic?: (clinic: ClinicSummary) => void;
  onBoundsChange?: (center: [number, number]) => void;
  center?: [number, number];
  zoom?: number;
}

export default function MapWrapper(props: MapWrapperProps) {
  return <Map {...props} />;
}
