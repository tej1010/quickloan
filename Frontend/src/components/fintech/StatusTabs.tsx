interface Tab {
  value: string;
  label: string;
  count?: number;
}

interface StatusTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (value: string) => void;
}

export default function StatusTabs({ tabs, activeTab, onChange }: StatusTabsProps) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-gray-800 dark:bg-gray-900/50">
      {tabs.map((tab) => {
        const active = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`shrink-0 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-white text-brand-600 shadow-sm dark:bg-gray-800 dark:text-brand-400"
                : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`ml-1.5 text-xs ${active ? "text-brand-500" : "text-gray-400"}`}>
                ({tab.count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
