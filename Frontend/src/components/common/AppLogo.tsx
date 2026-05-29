import { APP_NAME } from "../../config/brand";

interface AppLogoProps {
  showText?: boolean;
  textClassName?: string;
}

export default function AppLogo({ showText = true, textClassName = "" }: AppLogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <img
        src="/images/logo/logo-icon.svg"
        alt={APP_NAME}
        width={32}
        height={32}
        className="shrink-0"
      />
      {showText && (
        <span
          className={`text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap ${textClassName}`}
        >
          {APP_NAME}
        </span>
      )}
    </div>
  );
}
