// Format price in NTD
export function formatPrice(price: number): string {
  return `NT$ ${price.toLocaleString('zh-TW')}`;
}

// Format price range
export function formatPriceRange(min: number, max: number | null, unit: string): string {
  if (max && max !== min) {
    return `${formatPrice(min)} ~ ${formatPrice(max)} / ${unit}`;
  }
  return `${formatPrice(min)} / ${unit}`;
}

// Format distance
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}
