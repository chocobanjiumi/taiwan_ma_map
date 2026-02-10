import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { ClinicSummary } from '@/types/clinic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const lat = parseFloat(searchParams.get('lat') || '25.033');
  const lng = parseFloat(searchParams.get('lng') || '121.5654');
  const radius = parseFloat(searchParams.get('radius') || '10000');
  const categoriesParam = searchParams.get('categories');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const city = searchParams.get('city') || null;

  const categorySlugs = categoriesParam
    ? categoriesParam.split(',').filter(Boolean)
    : null;

  try {
    const data = await query<ClinicSummary>(
      'SELECT * FROM search_clinics($1, $2, $3, $4, $5, $6, $7)',
      [
        lat,
        lng,
        radius,
        categorySlugs,
        minPrice ? parseInt(minPrice, 10) : null,
        maxPrice ? parseInt(maxPrice, 10) : null,
        city,
      ]
    );

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
