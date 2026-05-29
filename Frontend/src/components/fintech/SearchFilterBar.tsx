import Input from "../form/input/InputField";
import Select from "../form/Select";

interface SearchFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  statusFilter?: string;
  onStatusChange?: (value: string) => void;
  statusOptions?: { value: string; label: string }[];
  actions?: React.ReactNode;
}

export default function SearchFilterBar({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  statusFilter,
  onStatusChange,
  statusOptions,
  actions,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col flex-1 gap-3 sm:flex-row sm:items-center">
        <div className="flex-1 max-w-md">
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        {statusOptions && onStatusChange && (
          <div className="w-full sm:w-48">
            <Select
              options={statusOptions}
              placeholder="All Statuses"
              onChange={onStatusChange}
              defaultValue={statusFilter || ""}
            />
          </div>
        )}
      </div>
      {actions}
    </div>
  );
}
