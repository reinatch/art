///app/lib/useThumbnailsContext.tsx

"use client";
import React, { createContext, useContext, useState, useRef } from "react";
import { Projecto } from "../utils/types";

interface Thumbnail {
    id: number; // or whatever unique identifier you use
    url: string;
}

interface ThumbnailsContextType {
    thumbnails: Thumbnail[];
    setThumbnails: (thumbnails: Thumbnail[]) => void;
    selectedThumbnail: number | null;
    setSelectedThumbnail: (thumbnailId: number | null) => void;
    prevProject: Projecto | null;
    nextProject: Projecto | null;
    setPrevProject: (project: Projecto | null) => void;
    setNextProject: (project: Projecto | null) => void;
    thumbRefs: React.RefObject<(HTMLDivElement | null)[]>;
}

const ThumbnailsContext = createContext<ThumbnailsContextType | undefined>(undefined);

export const ThumbnailsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
    const [selectedThumbnail, setSelectedThumbnail] = useState<number | null>(null);
    const [prevProject, setPrevProject] = useState<Projecto | null>(null);
    const [nextProject, setNextProject] = useState<Projecto | null>(null);
    const thumbRefs = useRef<(HTMLDivElement | null)[]>([]);
    return (
        <ThumbnailsContext.Provider value={{ thumbnails, prevProject, nextProject, setPrevProject, setNextProject, setThumbnails, selectedThumbnail, setSelectedThumbnail, thumbRefs }}>
            {children}
        </ThumbnailsContext.Provider>
    );
};

export const useThumbnailsContext = () => {
    const context = useContext(ThumbnailsContext);
    if (!context) {
        throw new Error("useThumbnailsContext must be used within a ThumbnailsProvider");
    }
    return context;
};
