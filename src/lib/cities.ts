export interface CityInfo {
  name: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
}

export const TAIWAN_CITIES: CityInfo[] = [
  // 六都
  { name: '台北市', center: [25.033, 121.5654], zoom: 13 },
  { name: '新北市', center: [25.012, 121.465], zoom: 12 },
  { name: '桃園市', center: [24.994, 121.301], zoom: 12 },
  { name: '台中市', center: [24.148, 120.674], zoom: 12 },
  { name: '台南市', center: [22.999, 120.227], zoom: 12 },
  { name: '高雄市', center: [22.627, 120.301], zoom: 12 },
  // 其他縣市
  { name: '基隆市', center: [25.128, 121.739], zoom: 13 },
  { name: '新竹市', center: [24.804, 120.969], zoom: 13 },
  { name: '新竹縣', center: [24.839, 121.004], zoom: 12 },
  { name: '苗栗縣', center: [24.560, 120.821], zoom: 12 },
  { name: '彰化縣', center: [24.052, 120.516], zoom: 12 },
  { name: '南投縣', center: [23.961, 120.685], zoom: 11 },
  { name: '雲林縣', center: [23.709, 120.431], zoom: 12 },
  { name: '嘉義市', center: [23.480, 120.449], zoom: 13 },
  { name: '嘉義縣', center: [23.452, 120.255], zoom: 12 },
  { name: '屏東縣', center: [22.552, 120.549], zoom: 11 },
  { name: '宜蘭縣', center: [24.757, 121.753], zoom: 12 },
  { name: '花蓮縣', center: [23.992, 121.601], zoom: 11 },
  { name: '台東縣', center: [22.756, 121.145], zoom: 11 },
  { name: '澎湖縣', center: [23.571, 119.579], zoom: 12 },
  { name: '金門縣', center: [24.449, 118.377], zoom: 12 },
  { name: '連江縣', center: [26.161, 119.950], zoom: 12 },
];

export function getCityByName(name: string): CityInfo | undefined {
  return TAIWAN_CITIES.find((c) => c.name === name);
}
