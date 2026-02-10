import type { Clinic, Treatment } from '@/types/clinic';
import TreatmentTable from './TreatmentTable';

interface ClinicDetailProps {
  clinic: Clinic;
  treatments: Treatment[];
}

export default function ClinicDetail({ clinic, treatments }: ClinicDetailProps) {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Header section */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{clinic.name}</h1>
          <div className="flex items-center gap-1 shrink-0 ml-4">
            <span className="text-yellow-500 text-lg">★</span>
            <span className="text-lg font-semibold">{clinic.rating}</span>
            <span className="text-sm text-gray-400">({clinic.review_count})</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-1">{clinic.address}</p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3">
          {clinic.phone && (
            <a href={`tel:${clinic.phone}`} className="flex items-center gap-1 hover:text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {clinic.phone}
            </a>
          )}
          {clinic.website && (
            <a href={clinic.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              官方網站
            </a>
          )}
          {clinic.facebook_url && (
            <a href={clinic.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>
          )}
          {clinic.instagram_url && (
            <a href={clinic.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#E4405F]">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              Instagram
            </a>
          )}
          {clinic.line_url && (
            <a href={clinic.line_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#06C755]">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              LINE
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      {clinic.description && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">診所介紹</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{clinic.description}</p>
        </div>
      )}

      {/* Opening hours */}
      {clinic.opening_hours && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">營業時間</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(clinic.opening_hours).map(([day, hours]) => (
              <div key={day} className="text-sm">
                <span className="text-gray-500">{day}：</span>
                <span className="text-gray-900">{hours}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Treatments */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          療程項目
          <span className="text-sm font-normal text-gray-400 ml-2">
            共 {treatments.length} 項
          </span>
        </h2>
        {treatments.length > 0 ? (
          <TreatmentTable treatments={treatments} />
        ) : (
          <p className="text-gray-400 text-sm">尚無療程資料</p>
        )}
      </div>
    </div>
  );
}
