import { query } from '@/lib/db';
import Header from '@/components/layout/Header';
import HomeContent from '@/components/HomeContent';
import type { ClinicSummary, TreatmentCategory } from '@/types/clinic';

export default async function Home() {
  const [clinics, categories] = await Promise.all([
    query<ClinicSummary>(
      'SELECT * FROM search_clinics($1, $2, $3)',
      [25.033, 121.5654, 10000]
    ),
    query<TreatmentCategory>(
      'SELECT * FROM treatment_categories ORDER BY name'
    ),
  ]);

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <HomeContent initialClinics={clinics} categories={categories} />
    </div>
  );
}
