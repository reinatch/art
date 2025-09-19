"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";

const EntulhoSection: React.FC = () => {
  const t = useTranslations("Sitemap");

  return (
    <a
      target="_blank"
      href={"https://noentulho.com/pt"}
      rel="noopener noreferrer"
    >
      <div className="flex flex-col-reverse items-start md:flex-col justify-between gap-0 text-rodape">
        <div className="flex flex-col text-start w-full md:w-full items-start">
          <Image
            src="/images/entulho.png"
            loading="lazy"
            alt="Logo"
            width={100}
            height={100}
            className="pb-4 w-10 h-auto md:w-auto"
          />
        </div>
        <div className="flex flex-col text-start w-full md:w-full">
          <p>NO ENTULHO</p>
          <p>{t("residencias")}</p>
        </div>
      </div>
    </a>
  );
};

export default EntulhoSection;
