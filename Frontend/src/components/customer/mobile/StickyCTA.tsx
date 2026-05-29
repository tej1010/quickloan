interface StickyCTAProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit";
}

export default function StickyCTA({ label, onClick, disabled, loading, type = "button" }: StickyCTAProps) {
  return (
    <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 p-4 bg-gradient-to-t from-[#f5f6fa] via-[#f5f6fa] to-transparent safe-bottom lg:max-w-lg">
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className="w-full py-4 text-base font-semibold text-white rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 shadow-lg shadow-brand-500/30 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:active:scale-100"
      >
        {loading ? "Processing..." : label}
      </button>
    </div>
  );
}
