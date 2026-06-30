// --- KILO: realna baza produktów (Open Food Facts, bez klucza API) ---
// Wyszukiwanie po nazwie + odczyt po kodzie kreskowym. Wartości na 100 g.

export interface FoodResult {
  name: string;
  kcal: number;
  p: number;
  c: number;
  f: number;
  code?: string;
}

interface OFFProduct {
  product_name?: string;
  code?: string;
  nutriments?: Record<string, unknown>;
}

const OFF = 'https://world.openfoodfacts.org';
const num = (v: unknown) => Math.round(Number(v) || 0);

const mapProduct = (prod: OFFProduct): FoodResult | null => {
  const n = prod.nutriments || {};
  const name = prod.product_name?.trim();
  if (!name) return null;
  return {
    name,
    kcal: num(n['energy-kcal_100g']),
    p: num(n['proteins_100g']),
    c: num(n['carbohydrates_100g']),
    f: num(n['fat_100g']),
    code: prod.code,
  };
};

export const searchFood = async (query: string): Promise<FoodResult[]> => {
  if (!query.trim()) return [];
  try {
    const url = `${OFF}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=20&fields=product_name,nutriments,code`;
    const res = await fetch(url);
    const data = (await res.json()) as { products?: OFFProduct[] };
    return (data.products || [])
      .map(mapProduct)
      .filter((x): x is FoodResult => !!x && x.kcal > 0)
      .slice(0, 20);
  } catch (e) {
    console.warn('searchFood:', e);
    return [];
  }
};

export const lookupBarcode = async (code: string): Promise<FoodResult | null> => {
  try {
    const res = await fetch(`${OFF}/api/v2/product/${encodeURIComponent(code)}.json?fields=product_name,nutriments,code`);
    const data = (await res.json()) as { status?: number; product?: OFFProduct };
    return data.status === 1 && data.product ? mapProduct(data.product) : null;
  } catch (e) {
    console.warn('lookupBarcode:', e);
    return null;
  }
};
