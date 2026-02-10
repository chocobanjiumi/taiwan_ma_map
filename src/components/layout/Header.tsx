import Link from 'next/link';

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 shrink-0 z-10">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <h1 className="text-lg font-bold text-gray-900">台灣醫美地圖</h1>
      </Link>
      <span className="ml-3 text-xs text-gray-400 hidden sm:inline">
        全台灣醫美診所
      </span>
    </header>
  );
}
