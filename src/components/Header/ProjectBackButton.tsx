"use client";
import { Link as TransitionLink } from "next-transition-router";
import { useTranslations } from "next-intl";

export default function ProjectBackButton() {
  const p = useTranslations("ProjectDetailPage");

  return (
    <div className="flex items-start md:items-start h-full projectoBack ">
      <TransitionLink href="/projects/">
        <div className="self-start hidden font-mono md:flex text-rodape">
          <span className="pr-2 font-intl">← </span>
          {p("goBack")}
        </div>
      </TransitionLink>
    </div>
  );
}
