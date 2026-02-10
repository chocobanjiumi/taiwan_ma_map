#!/usr/bin/env node
/**
 * Fetch medical aesthetics clinics from Google Places API (New)
 *
 * Usage:
 *   GOOGLE_PLACES_API_KEY=xxx node scripts/fetch-google-places.mjs
 *
 * Searches for 醫美診所/整形外科/皮膚科 across Taipei & New Taipei districts.
 * Outputs: scripts/data/google-places-raw.json
 */

import { writeFileSync, existsSync, readFileSync } from 'fs';

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
if (!API_KEY) {
  console.error('Error: Set GOOGLE_PLACES_API_KEY environment variable');
  console.error('  Get one at: https://console.cloud.google.com/apis/credentials');
  console.error('  Enable "Places API (New)" in your project');
  process.exit(1);
}

const OUTPUT_FILE = new URL('./data/google-places-raw.json', import.meta.url).pathname;

// Search queries targeting medical aesthetics clinics
const SEARCH_QUERIES = [
  '醫美診所',
  '整形外科診所',
  '醫學美容診所',
  '皮膚科醫美',
];

// Center points for different areas to maximize coverage
// Google Places returns max 20 results per search, so we search multiple areas
const SEARCH_AREAS = [
  { name: '大安區', lat: 25.0268, lng: 121.5437 },
  { name: '中山區', lat: 25.0640, lng: 121.5256 },
  { name: '信義區', lat: 25.0330, lng: 121.5654 },
  { name: '中正區', lat: 25.0320, lng: 121.5180 },
  { name: '松山區', lat: 25.0497, lng: 121.5578 },
  { name: '內湖區', lat: 25.0830, lng: 121.5880 },
  { name: '士林區', lat: 25.0930, lng: 121.5250 },
  { name: '萬華區', lat: 25.0290, lng: 121.4990 },
  { name: '文山區', lat: 24.9890, lng: 121.5700 },
  { name: '北投區', lat: 25.1320, lng: 121.5010 },
  { name: '南港區', lat: 25.0550, lng: 121.6130 },
  { name: '大同區', lat: 25.0630, lng: 121.5130 },
  // 新北市
  { name: '板橋區', lat: 25.0145, lng: 121.4593 },
  { name: '中和區', lat: 24.9990, lng: 121.4930 },
  { name: '永和區', lat: 25.0080, lng: 121.5150 },
  { name: '新店區', lat: 24.9680, lng: 121.5410 },
  { name: '三重區', lat: 25.0620, lng: 121.4870 },
  { name: '蘆洲區', lat: 25.0850, lng: 121.4730 },
  { name: '新莊區', lat: 25.0360, lng: 121.4500 },
  { name: '土城區', lat: 24.9720, lng: 121.4440 },
  { name: '汐止區', lat: 25.0630, lng: 121.6400 },
  { name: '林口區', lat: 25.0770, lng: 121.3910 },
];

const FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.location',
  'places.nationalPhoneNumber',
  'places.internationalPhoneNumber',
  'places.websiteUri',
  'places.rating',
  'places.userRatingCount',
  'places.regularOpeningHours',
  'places.types',
  'places.businessStatus',
].join(',');

async function searchPlaces(query, center, radius = 3000) {
  const url = 'https://places.googleapis.com/v1/places:searchText';

  const body = {
    textQuery: query,
    locationBias: {
      circle: {
        center: { latitude: center.lat, longitude: center.lng },
        radius: radius,
      },
    },
    languageCode: 'zh-TW',
    maxResultCount: 20,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Places API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data.places || [];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isClinicRelevant(place) {
  const name = place.displayName?.text || '';
  const types = place.types || [];

  // Must be operational
  if (place.businessStatus && place.businessStatus !== 'OPERATIONAL') {
    return false;
  }

  // Relevance keywords in name
  const keywords = ['醫美', '整形', '美容', '皮膚', '美醫', '醫學美容', '時尚', '晶華', '診所'];
  const hasKeyword = keywords.some(kw => name.includes(kw));

  // Must be a clinic/doctor/health type
  const medicalTypes = ['doctor', 'health', 'hospital', 'physiotherapist', 'dentist'];
  const hasMedicalType = types.some(t => medicalTypes.includes(t));

  // If it has 診所 in the name, it's very likely relevant
  if (name.includes('診所') && hasKeyword) return true;

  // If it has medical type + aesthetic keyword
  if (hasMedicalType && hasKeyword) return true;

  return false;
}

function extractAddress(formattedAddress) {
  // Google returns addresses like "100台北市中正區館前路12號3樓"
  // or "Taiwan, Taipei City, Zhongzheng District, ..."
  // We want the Chinese address
  let addr = formattedAddress || '';

  // Remove country prefix
  addr = addr.replace(/^(台灣|臺灣|Taiwan,?\s*)/i, '').trim();

  // Remove postal code prefix
  addr = addr.replace(/^\d{3,5}\s*/, '');

  return addr;
}

function extractDistrict(address) {
  const match = address.match(/([\u4e00-\u9fff]+區)/);
  return match ? match[1] : '';
}

function extractCity(address) {
  if (address.includes('新北市') || address.includes('新北')) return '新北市';
  if (address.includes('台北市') || address.includes('臺北市') || address.includes('台北')) return '台北市';
  // Check by district
  const newTaipeiDistricts = ['板橋區', '中和區', '永和區', '新店區', '三重區', '蘆洲區',
    '新莊區', '土城區', '汐止區', '林口區', '淡水區', '樹林區', '鶯歌區', '泰山區',
    '五股區', '瑞芳區', '深坑區', '石碇區', '坪林區', '烏來區', '八里區', '三芝區',
    '石門區', '金山區', '萬里區', '貢寮區', '雙溪區', '平溪區'];
  const district = extractDistrict(address);
  if (newTaipeiDistricts.includes(district)) return '新北市';
  return '台北市';
}

async function main() {
  console.log('=== Google Places API Clinic Fetcher ===\n');

  // Load existing data if resuming
  let allPlaces = new Map();
  if (existsSync(OUTPUT_FILE)) {
    try {
      const existing = JSON.parse(readFileSync(OUTPUT_FILE, 'utf-8'));
      for (const place of existing) {
        allPlaces.set(place.googlePlaceId, place);
      }
      console.log(`Loaded ${allPlaces.size} existing places from cache\n`);
    } catch { /* ignore parse errors */ }
  }

  let apiCalls = 0;

  for (const area of SEARCH_AREAS) {
    for (const query of SEARCH_QUERIES) {
      const searchKey = `${query} @ ${area.name}`;
      console.log(`Searching: ${searchKey}...`);

      try {
        const places = await searchPlaces(query, area);
        apiCalls++;

        let newCount = 0;
        for (const place of places) {
          const id = place.id || place.name;
          if (allPlaces.has(id)) continue;

          if (!isClinicRelevant(place)) {
            continue;
          }

          const address = extractAddress(place.formattedAddress);

          allPlaces.set(id, {
            googlePlaceId: id,
            name: place.displayName?.text || '',
            address: address,
            district: extractDistrict(address),
            city: extractCity(address),
            lat: place.location?.latitude,
            lng: place.location?.longitude,
            phone: place.nationalPhoneNumber || place.internationalPhoneNumber || null,
            website: place.websiteUri || null,
            rating: place.rating || 0,
            reviewCount: place.userRatingCount || 0,
            types: place.types || [],
            openingHours: place.regularOpeningHours?.weekdayDescriptions || null,
          });
          newCount++;
        }

        console.log(`  Found ${places.length} results, ${newCount} new clinics`);

        // Rate limit: ~5 requests per second is safe
        await sleep(250);

      } catch (err) {
        console.error(`  Error: ${err.message}`);
        await sleep(1000);
      }
    }

    // Save progress after each area
    const results = Array.from(allPlaces.values());
    writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf-8');
  }

  const results = Array.from(allPlaces.values());
  writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf-8');

  console.log(`\n=== Complete ===`);
  console.log(`Total API calls: ${apiCalls}`);
  console.log(`Total unique clinics: ${results.length}`);
  console.log(`Output: ${OUTPUT_FILE}`);

  // Summary by city/district
  const byDistrict = {};
  for (const clinic of results) {
    const key = `${clinic.city} ${clinic.district}`;
    byDistrict[key] = (byDistrict[key] || 0) + 1;
  }
  console.log('\nDistribution:');
  for (const [key, count] of Object.entries(byDistrict).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${key}: ${count}`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
