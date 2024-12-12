// app/lib/useHorizontalSliderSnap.ts
import { useEffect, useRef } from 'react';

const observeScrollDirection = (scrollContainer: HTMLDivElement, lastScrollPositionRef: React.MutableRefObject<number>) => {
    const scrollPosition = scrollContainer.scrollLeft;
    const scrollDirection = scrollPosition > lastScrollPositionRef.current ? 'right' : 'left';
    const scrollDelta = Math.abs(scrollPosition - lastScrollPositionRef.current);

    lastScrollPositionRef.current = scrollPosition; // Update the last scroll position

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

    return inViewHorizontally && inViewVertically; // Return true if the element is at least partially visible
};

const detectSectionsInView = (
    scrollContainer: HTMLDivElement,
    sectionRefs: React.RefObject<(HTMLDivElement | null)[]>,
    buffer: number,
    activeSectionId: number | null // Change to handle thumbnail ID
): number | null => {
    let differentSection: number | null = null;

    sectionRefs.current?.forEach((ref) => {
        if (ref && isElementInViewport(ref, scrollContainer, buffer)) {
            // console.log(ref.id)
            if (ref.id !== String(activeSectionId)) {
                differentSection = parseInt(ref.id); // Found a section that is different from the active section
                // console.log(`Different section ${ref.id} is in view.`); // Log sections coming into view

                return; // Exit the loop once we find the first different section
            }
        }
    });

    return differentSection; // Return the first section different from the active section, or null if none found
};

const detectActiveSection = (
    scrollContainer: HTMLDivElement,
    sectionRefs: React.RefObject<(HTMLDivElement | null)[]>,
    buffer: number
): number | null => {
    let activeSectionId: number | null = null;

    sectionRefs.current?.forEach((ref) => {
        // console.log(ref,"ref")
        if (ref && isElementInViewport(ref, scrollContainer, buffer)) {
            activeSectionId = parseInt(ref.id); // Set the active section ID
        }
    });

    return activeSectionId;
};

const snapToSection = (
    scrollContainer: HTMLDivElement,
    sectionRefs: React.RefObject<(HTMLDivElement | null)[]>,
    activeSectionId: number,
    buffer: number
) => {
    const activeSection = sectionRefs.current?.find(ref => ref?.id === String(activeSectionId));

    if (activeSection) {
        let scrollOffset = activeSection.offsetLeft;

        if (scrollOffset < buffer) scrollOffset = 0;

        // Smooth scroll to the active section
        scrollContainer.scrollTo({
            left: scrollOffset,
            behavior: 'smooth',
        });
    }
};

const handleInfiniteScroll = (
    scrollContainer: HTMLDivElement,
    sectionRefs: React.RefObject<(HTMLDivElement | null)[]>,
    activeSectionId: number | null,
    buffer: number,
    lastScrollPositionRef: React.MutableRefObject<number>
) => {
    const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    const threshold = 1;
    const currentScrollLeft = scrollContainer.scrollLeft;
    const activeSection = sectionRefs.current?.find(ref => ref?.id === String(activeSectionId));
    const { scrollDirection, scrollPosition } = observeScrollDirection(scrollContainer, lastScrollPositionRef);

    lastScrollPositionRef.current = currentScrollLeft;

    const lastSection = sectionRefs.current?.[sectionRefs.current.length - 1];
    const firstSection = sectionRefs.current?.[0];

    // If scrolling to the left (to the first section)
    if (scrollDirection === 'left') {
        if (currentScrollLeft <= threshold) {
            if (activeSection === firstSection) {
                if (scrollPosition < 0) {
                    if (lastSection) {
                        snapToSection(scrollContainer, sectionRefs, parseInt(lastSection.id), buffer);
                    }
                } else {
                    scrollContainer.scrollLeft = 0;
                }
            } else {
                if (firstSection) {
                    snapToSection(scrollContainer, sectionRefs, parseInt(firstSection.id), buffer);
                }
            }
        }
    }
    // If scrolling to the right (to the last section)
    else if (scrollDirection === 'right') {
        if (currentScrollLeft >= maxScrollLeft - threshold) {
            if (activeSection === lastSection) {
                if (scrollPosition > maxScrollLeft) {
                    if (firstSection) {
                        snapToSection(scrollContainer, sectionRefs, parseInt(firstSection.id), buffer);
                    }
                } else {
                    scrollContainer.scrollLeft = maxScrollLeft;
                }
            } else {
                if (lastSection) {
                    snapToSection(scrollContainer, sectionRefs, parseInt(lastSection.id), buffer);
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
// const snapToClosestSection = (scrollContainer: HTMLDivElement, sectionRefs: React.RefObject<(HTMLDivElement | null)[]>) => {
//     const sections = sectionRefs.current;
//     if (!sections) return;

//     const scrollLeft = scrollContainer.scrollLeft;
//     const closestSection = sections.reduce((closest, section) => {
//         const offsetLeft = section?.offsetLeft || 0;
//         return Math.abs(offsetLeft - scrollLeft) < Math.abs((closest?.offsetLeft || 0) - scrollLeft) ? section : closest;
//     }, sections[0] || null);

//     if (closestSection) {
//         scrollContainer.scrollTo({
//             left: closestSection.offsetLeft,
//             behavior: 'smooth'
//         });
//     }
// };


const useHorizontalSliderSnap = (
    scrollContainerRef: React.RefObject<(HTMLDivElement | null)>,
    sectionRefs: React.RefObject<(HTMLDivElement | null)[]>,
    setSelectedThumbnail: (id: number | null) => void, // Change to handle thumbnail ID
) => {
    const lastScrollPositionRef = useRef(0);
    const buffer = 10;
    const lastActiveSectionIdRef = useRef<number | null>(null); // Use ref for the last active section ID

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;

        const handleWheel = (event: WheelEvent) => {
            if (scrollContainer) {
                // event.preventDefault();
                scrollContainer.scrollLeft += event.deltaY;
                // console.log(event.deltaY, scrollContainer.scrollLeft);
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

            const activeSectionId = detectActiveSection(scrollContainer, sectionRefs, buffer);
            const differentSectionInView = detectSectionsInView(scrollContainer, sectionRefs, buffer, activeSectionId);
            handleInfiniteScroll(scrollContainer, sectionRefs, activeSectionId, buffer, lastScrollPositionRef);

            if (differentSectionInView) {
                setSelectedThumbnail(differentSectionInView); // Set the selected thumbnail
                // snapToSection(scrollContainer, sectionRefs, differentSectionInView, buffer);
                // snapToClosestSection(scrollContainer, sectionRefs);
            }
            
            if (activeSectionId && activeSectionId !== lastActiveSectionIdRef.current) {
                lastActiveSectionIdRef.current = activeSectionId; // Update the ref
                // snapToClosestSection(scrollContainer, sectionRefs);
                setSelectedThumbnail(activeSectionId); // Set the selected thumbnail
                // snapToSection(scrollContainer, sectionRefs, activeSectionId, buffer);
            }
        }, 100); // Adjust the debounce delay as necessary

        const scrollContainer = scrollContainerRef.current;

        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", handleScroll);
            }
        };
    }, [scrollContainerRef, sectionRefs, setSelectedThumbnail]);

    return { lastActiveSectionId: lastActiveSectionIdRef.current }; // Return the last active section ID if needed
};

export default useHorizontalSliderSnap;