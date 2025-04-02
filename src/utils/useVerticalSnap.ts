import { useEffect, useRef } from 'react';
import { useWindowSize } from '@custom-react-hooks/use-window-size';
const isElementInViewport = (
    element: HTMLElement,
    container: HTMLElement,
    buffer: number
): boolean => {
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const inViewVertically = (
        elementRect.bottom > containerRect.top + buffer &&
        elementRect.top < containerRect.bottom - buffer
    );
    console.log(`Element ${element.id} in viewport: ${inViewVertically}`); 
    return inViewVertically; 
};
const detectSectionsInView = (
    scrollContainer: HTMLElement,
    sectionRefs: React.RefObject<(HTMLDivElement | null)[]>,
    buffer: number,
    activeSectionSlug: string | null
): string | null => {
    let differentSection: string | null = null;
    sectionRefs.current?.forEach((ref) => {
        if (ref && isElementInViewport(ref, scrollContainer, buffer)) {
            if (ref.id !== activeSectionSlug) {
                differentSection = ref.id; 
                console.log(`Different section in view: ${differentSection}`); 
                return; 
            }
        }
    });
    return differentSection; 
};
const detectActiveSection = (
    scrollContainer: HTMLElement,
    sectionRefs: React.RefObject<(HTMLDivElement | null)[]>,
    buffer: number
) => {
    let activeSectionSlug: string | null = null;
    sectionRefs.current?.forEach((ref) => {
        if (ref && isElementInViewport(ref, scrollContainer, buffer)) {
            activeSectionSlug = ref.id; 
            console.log(`Active section detected: ${activeSectionSlug}`); 
        }
    });
    return activeSectionSlug;
};
const debounce = <T extends (...args: unknown[]) => void>(func: T, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};
const useVerticalScrollSnap = (
    sectionRefs: React.RefObject<(HTMLDivElement | null)[]>,
    setSelectedTab: (slug: string) => void,
) => {
    const buffer = 10; 
    const windowSize = useWindowSize();
    const lastActiveSectionSlugRef = useRef<string | null>(null);
    useEffect(() => {
        sectionRefs.current?.forEach(ref => {
            if (ref) {
                console.log(ref.id, ref.offsetTop); 
            }
        });
    }, [sectionRefs]);
    const scrollContainer = document.documentElement;
    const top = scrollContainer.scrollTop
    useEffect(() => {
        console.log("Scroll container scrollTop:", top);
        const handleScroll = debounce(() => {
            if (!scrollContainer) return;
            const activeSectionSlug: string | null = detectActiveSection(scrollContainer, sectionRefs, buffer);
            const differentSectionInView: string | null  = detectSectionsInView(scrollContainer, sectionRefs, buffer, activeSectionSlug);
            console.log("activeSectionSlug",activeSectionSlug, "differentSectionInView",differentSectionInView )
            if (differentSectionInView) {
                setSelectedTab(differentSectionInView);
            }
            if (activeSectionSlug && activeSectionSlug !== lastActiveSectionSlugRef.current) {
                lastActiveSectionSlugRef.current = activeSectionSlug; 
                setSelectedTab(activeSectionSlug);
            }
        }, 1000);
        scrollContainer.addEventListener('scroll', handleScroll);
        return () => {
            scrollContainer.removeEventListener('scroll', handleScroll);
        };
    }, [scrollContainer, sectionRefs, setSelectedTab, top, windowSize.height]);
};
export default useVerticalScrollSnap;
