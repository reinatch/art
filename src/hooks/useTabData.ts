import { useEffect } from "react";
import { AboutTabData, ContentItem } from "@/utils/types";

export const useTabData = (
  tabData: AboutTabData[],
  setTabs: (tabs: { slug: string; label: string; content: ContentItem }[]) => void,
  setTabTitle: (title: string) => void,
  setSelectedTab: (tab: string) => void
) => {
  useEffect(() => {
    if (tabData && tabData.length > 0 && tabData[0]?.acf) {
      const tabs = Object.entries(tabData[0].acf).map(([key, value]) => {
        const content = value as ContentItem;
        return {
          slug: key,
          label: content.title || key.charAt(0).toUpperCase() + key.slice(1),
          content: content,
        };
      });

      setTabs(tabs);
      setTabTitle(tabData[0].title.rendered);
      setSelectedTab(tabs[0].slug);
    }
  }, [tabData, setTabs, setTabTitle, setSelectedTab]);
};