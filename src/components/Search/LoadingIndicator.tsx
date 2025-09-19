"use client";
import { useTranslations } from "next-intl";

interface LoadingIndicatorProps {
  loading: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ loading }) => {
  const t = useTranslations("Search");

  return (
    <div className={`relative bottom-0 ${loading ? "opacity-100" : "opacity-0"}`}>
      {t("searching")}
    </div>
  );
};

export default LoadingIndicator;
