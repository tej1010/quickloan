import { useNavigate } from "react-router";

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  transparent?: boolean;
  rightAction?: React.ReactNode;
}

export default function MobileHeader({ title, showBack, transparent, rightAction }: MobileHeaderProps) {
  const navigate = useNavigate();

  return (
    <header
      className={`sticky top-0 z-40 flex items-center justify-between px-5 py-4 ${
        transparent ? "bg-transparent" : "bg-[#f5f6fa]/90 backdrop-blur-md"
      }`}
    >
      <div className="flex items-center gap-3 min-w-[40px]">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full bg-white shadow-sm ring-1 ring-gray-100"
            aria-label="Go back"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        )}
      </div>
      {title && <h1 className="text-base font-semibold text-gray-900">{title}</h1>}
      <div className="min-w-[40px] flex justify-end">{rightAction}</div>
    </header>
  );
}
