"use client";
import SubscribeForm from "./SubscribeForm";
import { useTranslations } from "next-intl";

interface NewsletterSectionProps {
  onFormClick: (e: React.MouseEvent) => void;
}

const NewsletterSection: React.FC<NewsletterSectionProps> = ({ onFormClick }) => {
  const t = useTranslations("Sitemap");

  return (
    <footer 
      className="text-rodape w-full justify-between md:w-1/2 flex flex-col gap-4 md:gap-10"
      onClick={onFormClick}
    >
      <SubscribeForm />
      <div>
        <p className="font-mono text-[0.5rem] md:text-rodape">
          {" "}
          {t("right")}
        </p>
        <p className="font-mono text-[0.5rem] md:text-rodape">
          {" "}
          {t("credits")}{" "}
          <a
            className="underline"
            href="https://reinatch.website/"
            target="_blank"
          >
            reinatch
          </a>
        </p>
      </div>
    </footer>
  );
};

export default NewsletterSection;
