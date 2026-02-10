import type { Treatment } from '@/types/clinic';
import { formatPriceRange } from '@/lib/utils';

interface TreatmentTableProps {
  treatments: Treatment[];
}

export default function TreatmentTable({ treatments }: TreatmentTableProps) {
  // Group by category
  const grouped = treatments.reduce<Record<string, Treatment[]>>((acc, t) => {
    const catName = t.category?.name || '其他';
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {category}
          </h3>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500">
                  <th className="text-left px-4 py-2 font-medium">療程名稱</th>
                  <th className="text-right px-4 py-2 font-medium">價格</th>
                </tr>
              </thead>
              <tbody>
                {items.map((treatment) => (
                  <tr key={treatment.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{treatment.name}</span>
                        {treatment.is_popular && (
                          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                            熱門
                          </span>
                        )}
                      </div>
                      {treatment.description && (
                        <p className="text-xs text-gray-400 mt-1">{treatment.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium text-emerald-600">
                        {formatPriceRange(treatment.price_min, treatment.price_max, treatment.price_unit)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
