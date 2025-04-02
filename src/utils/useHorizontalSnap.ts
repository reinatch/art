import { useEffect, useRef } from 'react';
const observeScrollDirection = (scrollContainer: HTMLDivElement, lastScrollPositionRef: React.MutableRefObject<number>) => {
    const scrollPosition = scrollContainer.scrollLeft;
    const scrollDirection = scrollPosition > lastScrollPositionRef.current ? 'right' : 'left';
    const scrollDelta = Math.abs(scrollPosition - lastScrollPositionRef.current);
    lastScrollPositionRef.current = scrollPosition; 
    return { scrollDirection, scrollPosition, scrollDelta };
};
const isElementInViewport = (
    element: HTMLElement,
    container: HTMLElement,
    buffer: number
): boolean => {
    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const inViewHorizontally = (
        elementRect.right > containerRect.left + buffer &&
        elementRect.left < containerRect.right - buffer
    );
    const inViewVertically = (
        elementRect.bottom > containerRect.top + buffer &&
        elementRect.top < containerRect.bottom - buffer
    );
    return inViewHorizontally && inViewVertically; 
};
const detectSectionsInView = (
    scrollContainer: HTMLDivElement,
    sectionRefs: React.RefObject<(HTMLDivElement | null)[]>,
    buffer: number,
    activeSectionSlug: string | null
): string | null => {
    let differentSection: string | null = null;
    sectionRefs.current?.forEach((ref) => {
        if (ref && isElementInViewport(ref, scrollContainer, buffer)) {
            if (ref.id !== activeSectionSlug) {
                differentSection = ref.id; 
                return; 
            }
        }
    });
    return differentSection; 
};
const detectActiveSection = (
    scrollContainer: HTMLDivElement,
    sectionRefs: React.RefObject<(HTMLDivElement | null)[]>,
    buffer: number
) => {
    let activeSectionSlug: string | null = null;
    sectionRefs.current?.forEach((ref) => {
        if (ref && isElementInViewport(ref, scrollContainer, buffer)) {
            activeSectionSlug = ref.id; 
        }
    });
    return activeSectionSlug;
};
const snapToSection = (
    scrollContainer: HTMLDivElement,
    sectionRefs: React.RefObject<(HTMLDivElement | null)[]>,
    activeSectionSlug: string,
    buffer: number
) => {
    const activeSection = sectionRefs.current?.find(ref => ref?.id === activeSectionSlug);
    if (activeSection) {
        let scrollOffset = activeSection.offsetLeft;
        if (scrollOffset < buffer) scrollOffset = 0;
        scrollContainer.scrollTo({
            left: scrollOffset,
            behavior: 'smooth',
        });
    }
};
const handleInfiniteScroll = (
    scrollContainer: HTMLDivElement,
    sectionRefs: React.RefObject<(HTMLDivElement | null)[]>,
    activeSectionSlug: string | null,
    buffer: number,
    lastScrollPositionRef: React.MutableRefObject<number>
) => {
    const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    const threshold = 1; 
    const currentScrollLeft = scrollContainer.scrollLeft;
    const activeSection = sectionRefs.current?.find(ref => ref?.id === activeSectionSlug);
    const { scrollDirection, scrollPosition } = observeScrollDirection(scrollContainer, lastScrollPositionRef);
    lastScrollPositionRef.current = currentScrollLeft; 
    const lastSection = sectionRefs.current?.[sectionRefs.current.length - 1];
    const firstSection = sectionRefs.current?.[0];
    if (scrollDirection === 'left') {
        if (currentScrollLeft <= threshold) {
            if (activeSection === firstSection) {
                if (scrollPosition < 0) {
                    if (lastSection) {
                        snapToSection(scrollContainer, sectionRefs, lastSection.id, buffer);
                    }
                } else {
                    scrollContainer.scrollLeft = 0;
                }
            } else {
                if (firstSection) {
                    snapToSection(scrollContainer, sectionRefs, firstSection.id, buffer);
                }
            }
        }
    }
    else if (scrollDirection === 'right') {
        if (currentScrollLeft >= maxScrollLeft - threshold) {
            if (activeSection === lastSection) {
                if (scrollPosition > maxScrollLeft) {
                    if (firstSection) {
                        snapToSection(scrollContainer, sectionRefs, firstSection.id, buffer);
                    }
                } else {
                    scrollContainer.scrollLeft = maxScrollLeft;
                }
            } else {
                if (lastSection) {
                    snapToSection(scrollContainer, sectionRefs, lastSection.id, buffer);
                }
            }
        }
    }
};
const debounce = (func: (...args: unknown[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: unknown[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};
const useHorizontalScrollSnap = (
    scrollContainerRef: React.RefObject<HTMLDivElement | null>,
    sectionRefs: React.RefObject<(HTMLDivElement | null)[]>,
    setSelectedTab: (slug: string) => void,
) => {
    const lastScrollPositionRef = useRef(0); 
    const buffer = 10; 
    const lastActiveSectionSlugRef = useRef<string | null>(null);
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        const handleWheel = (event: WheelEvent) => {
            if (scrollContainer) {
                scrollContainer.scrollLeft += event.deltaY; 
            }
        };
        if (scrollContainer) {
            scrollContainer.addEventListener("wheel", handleWheel);
        }
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("wheel", handleWheel);
            }
        };
    }, [scrollContainerRef]); 
    useEffect(() => {
        const handleScroll = debounce(() => {
            const scrollContainer = scrollContainerRef.current;
            if (!scrollContainer) return;
            const activeSectionSlug = detectActiveSection(scrollContainer, sectionRefs, buffer);
            const differentSectionInView = detectSectionsInView(scrollContainer, sectionRefs, buffer, activeSectionSlug);
            handleInfiniteScroll(scrollContainer, sectionRefs, activeSectionSlug, buffer, lastScrollPositionRef);
            if (differentSectionInView) {
                setSelectedTab(differentSectionInView);
                snapToSection(scrollContainer, sectionRefs, differentSectionInView, buffer);
            }
            if (activeSectionSlug && activeSectionSlug !== lastActiveSectionSlugRef.current) {
                lastActiveSectionSlugRef.current = activeSectionSlug; 
                setSelectedTab(activeSectionSlug);
                snapToSection(scrollContainer, sectionRefs, activeSectionSlug, buffer);
            }
        }, 50);
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [scrollContainerRef, sectionRefs, setSelectedTab]);
};
export default useHorizontalScrollSnap;
