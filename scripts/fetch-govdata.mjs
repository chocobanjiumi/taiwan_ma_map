#!/usr/bin/env node
/**
 * Fetch medical institution data from data.gov.tw
 *
 * Uses the 衛生福利部 medical institution open dataset to find
 * 整形外科 / 皮膚科 clinics in Taipei & New Taipei.
 *
 * Usage:
 *   node scripts/fetch-govdata.mjs
 *
 * Output: scripts/data/govdata-clinics.json
 */

import { writeFileSync } from 'fs';

const OUTPUT_FILE = new URL('./data/govdata-clinics.json', import.meta.url).pathname;

// data.gov.tw Medical Institutions dataset
// 衛生福利部醫事司 - 醫事機構基本資料
const DATASET_URL = 'https://data.nhi.gov.tw/resource/Opendata/醫療機構基本資料.csv';

// Alternative API endpoint (JSON format)
const API_URL = 'https://data.nhi.gov.tw/DataSets/DataSetResource.ashx?rId=A21030000I-E30001-002';

// Fallback: Use the simpler hospital/clinic search API
const SEARCH_API = 'https://ma.mohw.gov.tw/api/SearchHospital';

// Taipei districts
const TAIPEI_DISTRICTS = [
  '中正區', '大同區', '中山區', '松山區', '大安區', '萬華區',
  '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區',
];

const NEW_TAIPEI_DISTRICTS = [
  '板橋區', '三重區', '中和區', '永和區', '新莊區', '新店區',
  '蘆洲區', '土城區', '汐止區', '林口區', '淡水區', '樹林區',
];

// Keywords for aesthetic/cosmetic clinics
const AESTHETIC_KEYWORDS = [
  '整形', '醫美', '美容', '美醫', '皮膚', '時尚',
  '雅美', '光澤', '晶華', '星采', '悅美', '膚適美',
];

// Relevant specialties (科別)
const RELEVANT_SPECIALTIES = [
  '整形外科', '皮膚科', '美容外科', '醫學美容',
];

async function fetchFromNHI() {
  console.log('Fetching from NHI open data...');

  try {
    const res = await fetch(API_URL, {
      headers: { 'Accept': 'application/json' },
    });

    if (!res.ok) {
      console.log(`  NHI API returned ${res.status}, trying CSV...`);
      return fetchCSV();
    }

    const data = await res.json();
    console.log(`  Got ${Array.isArray(data) ? data.length : '?'} records`);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.log(`  NHI API error: ${err.message}`);
    return [];
  }
}

async function fetchCSV() {
  try {
    const res = await fetch(DATASET_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const text = await res.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

    const records = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const record = {};
      headers.forEach((h, idx) => {
        record[h] = values[idx] || '';
      });
      records.push(record);
    }

    console.log(`  Parsed ${records.length} CSV records`);
    return records;
  } catch (err) {
    console.log(`  CSV fetch error: ${err.message}`);
    return [];
  }
}

async function fetchFromMOHW() {
  console.log('Fetching from MOHW hospital search API...');

  const allClinics = [];
  const cities = [
    { name: '臺北市', code: '01' },
    { name: '新北市', code: '02' },
  ];

  for (const city of cities) {
    try {
      // Search for clinics (診所)
      const params = new URLSearchParams({
        city: city.code,
        type: '2', // 2 = clinics (診所)
        subject: '整形外科',
      });

      const res = await fetch(`${SEARCH_API}?${params}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          allClinics.push(...data);
          console.log(`  ${city.name} 整形外科: ${data.length} results`);
        }
      }

      // Also search for skin clinics
      const params2 = new URLSearchParams({
        city: city.code,
        type: '2',
        subject: '皮膚科',
      });

      const res2 = await fetch(`${SEARCH_API}?${params2}`);
      if (res2.ok) {
        const data2 = await res2.json();
        if (Array.isArray(data2)) {
          allClinics.push(...data2);
          console.log(`  ${city.name} 皮膚科: ${data2.length} results`);
        }
      }
    } catch (err) {
      console.log(`  Error for ${city.name}: ${err.message}`);
    }
  }

  return allClinics;
}

function isAestheticClinic(record) {
  const name = record.name || record['醫事機構名稱'] || record.HospName || '';
  const dept = record.subject || record['診療科別'] || record.SubjectName || '';

  // Check name for aesthetic keywords
  const nameMatch = AESTHETIC_KEYWORDS.some(kw => name.includes(kw));

  // Check specialty
  const deptMatch = RELEVANT_SPECIALTIES.some(sp => dept.includes(sp));

  return nameMatch || deptMatch;
}

function normalizeRecord(record) {
  return {
    name: record.name || record['醫事機構名稱'] || record.HospName || '',
    address: record.address || record['地址'] || record.HospAddr || '',
    phone: record.phone || record['電話'] || record.HospTel || '',
    district: extractDistrict(record.address || record['地址'] || record.HospAddr || ''),
    city: extractCity(record.address || record['地址'] || record.HospAddr || ''),
    specialty: record.subject || record['診療科別'] || record.SubjectName || '',
    source: 'data.gov.tw',
  };
}

function extractDistrict(address) {
  const match = address.match(/([\u4e00-\u9fff]+區)/);
  return match ? match[1] : '';
}

function extractCity(address) {
  if (address.includes('新北') || address.includes('新北市')) return '新北市';
  if (address.includes('台北') || address.includes('臺北') || address.includes('台北市') || address.includes('臺北市')) return '台北市';
  return '';
}

async function main() {
  console.log('=== data.gov.tw Medical Institution Fetcher ===\n');

  // Try multiple data sources
  let records = [];

  // Source 1: NHI Open Data
  const nhiRecords = await fetchFromNHI();
  records.push(...nhiRecords);

  // Source 2: MOHW Search API
  const mohwRecords = await fetchFromMOHW();
  records.push(...mohwRecords);

  console.log(`\nTotal raw records: ${records.length}`);

  // Filter for aesthetic/cosmetic clinics in Taipei/New Taipei
  const allDistricts = [...TAIPEI_DISTRICTS, ...NEW_TAIPEI_DISTRICTS];

  const filtered = records
    .filter(isAestheticClinic)
    .map(normalizeRecord)
    .filter(r => r.city === '台北市' || r.city === '新北市')
    .filter(r => r.name.length > 0);

  // Deduplicate by name
  const seen = new Set();
  const unique = filtered.filter(r => {
    if (seen.has(r.name)) return false;
    seen.add(r.name);
    return true;
  });

  console.log(`Filtered aesthetic clinics: ${unique.length}`);

  writeFileSync(OUTPUT_FILE, JSON.stringify(unique, null, 2), 'utf-8');
  console.log(`\nOutput: ${OUTPUT_FILE}`);

  // Summary
  const byCity = {};
  for (const clinic of unique) {
    const key = `${clinic.city} ${clinic.district}`;
    byCity[key] = (byCity[key] || 0) + 1;
  }
  console.log('\nDistribution:');
  for (const [key, count] of Object.entries(byCity).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${key}: ${count}`);
  }
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
