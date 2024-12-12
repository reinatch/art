
import { useEffect, useRef } from 'react';
import { useWindowSize } from '@custom-react-hooks/use-window-size';

// const observeScrollDirection = (
//     scrollContainer: HTMLElement,
//     lastScrollPositionRef: React.MutableRefObject<number>
// ): { scrollDirection: 'up' | 'down'; scrollPosition: number; scrollDelta: number } => {
//     const scrollPosition = scrollContainer.scrollTop;
//     const scrollDirection = scrollPosition > lastScrollPositionRef.current ? 'down' : 'up';
//     const scrollDelta = Math.abs(scrollPosition - lastScrollPositionRef.current);
//     lastScrollPositionRef.current = scrollPosition;

//     return { scrollDirection, scrollPosition, scrollDelta };
// };


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

    console.log(`Element ${element.id} in viewport: ${inViewVertically}`); // Debugging output
    return inViewVertically; // Return true if the element is vertically visible
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
                differentSection = ref.id; // Found a section that is different from the active section
                console.log(`Different section in view: ${differentSection}`); // Debugging output
                return; // Exit the loop once we find the first different section
            }
        }
    });

    return differentSection; // Return the first section different from the active section, or null if none found
};

const detectActiveSection = (
    scrollContainer: HTMLElement,
    sectionRefs: React.RefObject<(HTMLDivElement | null)[]>,
    buffer: number
) => {
    let activeSectionSlug: string | null = null;

    sectionRefs.current?.forEach((ref) => {
        if (ref && isElementInViewport(ref, scrollContainer, buffer)) {
            activeSectionSlug = ref.id; // Set the active section slug
            console.log(`Active section detected: ${activeSectionSlug}`); // Debugging output
        }
    });

    return activeSectionSlug;
};

// const snapToSection = (
//     scrollContainer: HTMLElement,
//     sectionRefs: React.RefObject<(HTMLDivElement | null)[]>,
//     activeSectionSlug: string | null,
//     windowSize: number, // Add scrollDirection
//     buffer: number
// ) => {
//     const activeSectionIndex = sectionRefs.current?.findIndex(ref => ref?.id === activeSectionSlug);
    
//     console.warn(activeSectionIndex)


//     if (activeSectionIndex !== undefined && activeSectionIndex !== -1) {
//         const screenHeight = windowSize;
//         let scrollOffset = screenHeight * activeSectionIndex;

//         if (scrollOffset < buffer) scrollOffset = 0;

//         scrollContainer.scrollTo({
//             top: scrollOffset,
//             behavior: 'smooth',
//         });
//     } else {
//         console.warn(`No active section found for slug: ${activeSectionSlug }`);
//     }
// };


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
    // const lastScrollPositionRef = useRef(0); // Store the last scroll position
    const buffer = 10; // Buffer for in-view detection
    const windowSize = useWindowSize();
    const lastActiveSectionSlugRef = useRef<string | null>(null);

    useEffect(() => {
        sectionRefs.current?.forEach(ref => {
            if (ref) {
                console.log(ref.id, ref.offsetTop); // Check offset after rendering
            }
        });
    }, [sectionRefs]);
    
    // useEffect(() => {
    //     const scrollContainer = document.documentElement;

    //     const handleWheel = (event: WheelEvent) => {
    //         if (scrollContainer) {
    //             scrollContainer.scrollTop += event.deltaY; // Translate vertical scroll to itself
    //         }
    //     };

    //     if (scrollContainer) {
    //         scrollContainer.addEventListener("wheel", handleWheel);
    //     }

    //     return () => {
    //         if (scrollContainer) {
    //             scrollContainer.removeEventListener("wheel", handleWheel);
    //         }
    //     };
    // }, [scrollContainerRef]);

    const scrollContainer = document.documentElement;
    const top = scrollContainer.scrollTop
    useEffect(() => {
        

        console.log("Scroll container scrollTop:", top);

        const handleScroll = debounce(() => {
            if (!scrollContainer) return;
    
            // const { scrollDirection} = observeScrollDirection(scrollContainer, lastScrollPositionRef) as { scrollDirection: 'up' | 'down', scrollPosition: number, scrollDelta: number };
    
            const activeSectionSlug: string | null = detectActiveSection(scrollContainer, sectionRefs, buffer);
            const differentSectionInView: string | null  = detectSectionsInView(scrollContainer, sectionRefs, buffer, activeSectionSlug);
            console.log("activeSectionSlug",activeSectionSlug, "differentSectionInView",differentSectionInView )
            // if (activeSectionSlug && activeSectionSlug !== differentSectionInView) {
            //     if (scrollDirection === "down") {
            //         if (differentSectionInView) {
            //             setSelectedTab(differentSectionInView);
            //         }

            //         snapToSection(scrollContainer, sectionRefs, activeSectionSlug, windowSize.height ?? 0, buffer); // Pass scrollDirection
            //     }else if (scrollDirection === "up") {

            //         snapToSection(scrollContainer, sectionRefs, differentSectionInView, windowSize.height ?? 0, buffer); // Pass scrollDirection
                    
            //     }
            // }
            if (differentSectionInView) {
                setSelectedTab(differentSectionInView);
                // snapToSection(scrollContainer, sectionRefs, differentSectionInView, buffer);
            }
            if (activeSectionSlug && activeSectionSlug !== lastActiveSectionSlugRef.current) {
                lastActiveSectionSlugRef.current = activeSectionSlug; // Update the ref instead of a local variable
                setSelectedTab(activeSectionSlug);
                // snapToSection(scrollContainer, sectionRefs, activeSectionSlug, buffer);
            }
        }, 1000);
    
        scrollContainer.addEventListener('scroll', handleScroll);

        return () => {
            scrollContainer.removeEventListener('scroll', handleScroll);
        };
    }, [scrollContainer, sectionRefs, setSelectedTab, top, windowSize.height]);
    
};

export default useVerticalScrollSnap;
