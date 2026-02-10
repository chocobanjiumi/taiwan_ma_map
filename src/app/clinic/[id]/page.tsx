import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query, queryOne } from '@/lib/db';
import Header from '@/components/layout/Header';
import ClinicDetail from '@/components/clinic/ClinicDetail';
import type { Clinic, Treatment } from '@/types/clinic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ClinicPage({ params }: PageProps) {
  const { id } = await params;

  const [clinic, treatments] = await Promise.all([
    queryOne<Clinic>(
      `SELECT id, name, slug, address, district, city, phone, website,
              facebook_url, instagram_url, line_url,
              description, rating, review_count, opening_hours, image_url,
              is_active, created_at, updated_at
       FROM clinics WHERE id = $1 AND is_active = true`,
      [id]
    ),
    query<Treatment>(
      `SELECT t.id, t.clinic_id, t.category_id, t.name, t.description,
              t.price_min, t.price_max, t.price_unit, t.duration_minutes, t.is_popular,
              jsonb_build_object(
                'id', tc.id, 'name', tc.name, 'name_en', tc.name_en,
                'slug', tc.slug, 'icon', tc.icon
              ) AS category
       FROM treatments t
       LEFT JOIN treatment_categories tc ON tc.id = t.category_id
       WHERE t.clinic_id = $1
       ORDER BY t.is_popular DESC`,
      [id]
    ),
  ]);

  if (!clinic) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            回到地圖
          </Link>
        </div>
        <ClinicDetail clinic={clinic} treatments={treatments} />
      </main>
    </div>
  );
}
