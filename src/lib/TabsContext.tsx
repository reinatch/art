// lib/ThemeContext.tsx
"use client";
// lib/TabsContext.tsx
import React, { createContext, useContext, useState, useRef, RefObject } from "react";
import ScrollSmoother from "gsap/ScrollSmoother";

interface TabsContextType {
    tabs: { content: unknown; slug: string; label: string }[];
    setTabs: (tabs: { content: unknown; slug: string; label: string }[]) => void;
    selectedTab: string;
    setSelectedTab: (tabId: string) => void;
    tabTitle: string;
    setTabTitle: (tabId: string) => void;
    scrollSmootherInstanceRef: RefObject<ScrollSmoother | null>;
    sectionRefs: RefObject<(HTMLDivElement | null)[]>;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const TabsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tabs, setTabs] = useState<{ content: unknown; slug: string; label: string }[]>([]);
    const [selectedTab, setSelectedTab] = useState<string>("");
    const [tabTitle, setTabTitle] = useState<string>("");
    const scrollSmootherInstanceRef = useRef<ScrollSmoother | null>(null);
    const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

    return (
        <TabsContext.Provider value={{ tabs, setTabs, selectedTab, setSelectedTab, tabTitle, setTabTitle, scrollSmootherInstanceRef, sectionRefs }}>
            {children}
        </TabsContext.Provider>
    );
};

export const useTabsContext = () => {
    const context = useContext(TabsContext);
    if (!context) {
        throw new Error("useTabsContext must be used within a TabsProvider");
    }
    return context;
};
