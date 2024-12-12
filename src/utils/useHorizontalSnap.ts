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

    // Check if the element is within the visible bounds of the container
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
    activeSectionSlug: string | null
): string | null => {
    let differentSection: string | null = null;

    sectionRefs.current?.forEach((ref) => {
        if (ref && isElementInViewport(ref, scrollContainer, buffer)) {
            if (ref.id !== activeSectionSlug) {
                differentSection = ref.id; // Found a section that is different from the active section
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
) => {
    let activeSectionSlug: string | null = null;

    sectionRefs.current?.forEach((ref) => {
        if (ref && isElementInViewport(ref, scrollContainer, buffer)) {
            activeSectionSlug = ref.id; // Set the active section slug
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

        // Ensure snapping even for small scroll positions (close to 0)
        if (scrollOffset < buffer) scrollOffset = 0;

        // Smooth scroll to the active section
        scrollContainer.scrollTo({
            left: scrollOffset,
            behavior: 'smooth',
        });
    }
};
// Helper function to handle infinite scroll
const handleInfiniteScroll = (
    scrollContainer: HTMLDivElement,
    sectionRefs: React.RefObject<(HTMLDivElement | null)[]>,
    activeSectionSlug: string | null,
    buffer: number,
    lastScrollPositionRef: React.MutableRefObject<number>
) => {
    const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    const threshold = 1; // Threshold to trigger repositioning
    const currentScrollLeft = scrollContainer.scrollLeft;
    const activeSection = sectionRefs.current?.find(ref => ref?.id === activeSectionSlug);
    const { scrollDirection, scrollPosition } = observeScrollDirection(scrollContainer, lastScrollPositionRef);

    lastScrollPositionRef.current = currentScrollLeft; // Update the last scroll position

    const lastSection = sectionRefs.current?.[sectionRefs.current.length - 1];
    const firstSection = sectionRefs.current?.[0];

    // If scrolling to the left (to the first section)
    if (scrollDirection === 'left') {
        if (currentScrollLeft <= threshold) {
            // Check if already at the first section
            if (activeSection === firstSection) {
                // Stay on the first section until further left scrolling
                if (scrollPosition < 0) {
                    // console.log("Snapping to the last section:", lastSection);
                    if (lastSection) {
                        snapToSection(scrollContainer, sectionRefs, lastSection.id, buffer);
                    }
                } else {
                    // Stay at the first section
                    scrollContainer.scrollLeft = 0;
                }
            } else {
                // Normal snapping to the first section if not already there
                // console.log("Snapping to the first section:", firstSection);
                if (firstSection) {
                    snapToSection(scrollContainer, sectionRefs, firstSection.id, buffer);
                }
            }
        }
    }

    // If scrolling to the right (to the last section)
    else if (scrollDirection === 'right') {
        if (currentScrollLeft >= maxScrollLeft - threshold) {
            // Check if already at the last section
            if (activeSection === lastSection) {
                // Stay on the last section until further right scrolling
                if (scrollPosition > maxScrollLeft) {
                    // console.log("Snapping to the first section:", firstSection);
                    if (firstSection) {
                        snapToSection(scrollContainer, sectionRefs, firstSection.id, buffer);
                    }
                } else {
                    // Stay at the last section
                    scrollContainer.scrollLeft = maxScrollLeft;
                }
            } else {
                // Normal snapping to the last section if not already there
                // console.log("Snapping to the last section:", lastSection);
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
    const lastScrollPositionRef = useRef(0); // Store the last scroll position
    const buffer = 10; // Buffer for in-view detection
    // let lastActiveSectionSlug: string | null = null; // Store the last active section slug
    const lastActiveSectionSlugRef = useRef<string | null>(null);




  
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
    
        const handleWheel = (event: WheelEvent) => {
            if (scrollContainer) {
                scrollContainer.scrollLeft += event.deltaY; // Translate vertical scroll to horizontal
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
    }, [scrollContainerRef]); // Added scrollContainerRef to dependency array
    
  
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
                lastActiveSectionSlugRef.current = activeSectionSlug; // Update the ref instead of a local variable
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



































// import { useEffect, useRef } from 'react';

// // Debounce function to limit the rate at which a function can fire
// const debounce = (func: Function, delay: number) => {
//     let timeoutId: NodeJS.Timeout;
//     return (...args: any[]) => {
//         clearTimeout(timeoutId);
//         timeoutId = setTimeout(() => {
//             func(...args);
//         }, delay);
//     };
// };

// const useHorizontalScrollSnap = (
//     scrollContainerRef: React.RefObject<HTMLDivElement>,
//     sectionRefs: React.RefObject<(HTMLDivElement | null)[]>,
//     setSelectedTab: (slug: string) => void,
// ) => {
//     const lastScrollPositionRef = useRef(0); // Store the last scroll position
//     const snappingVelocityRef = useRef(0); // Store the velocity of the scroll

//     useEffect(() => {
//         const buffer = 10; // Buffer for in-view detection
//         const snappingThreshold = 5; // Threshold to trigger a snap
//         let lastActiveSectionSlug: string | null = null; // Store the last active section slug

//         const handleScroll = debounce(() => {
//             const scrollContainer = scrollContainerRef.current;
//             if (!scrollContainer) return;

//             const scrollPosition = scrollContainer.scrollLeft;
//             const scrollDirection = scrollPosition > lastScrollPositionRef.current ? 'right' : 'left';
//             const scrollDelta = Math.abs(scrollPosition - lastScrollPositionRef.current); // Detect the delta
//             lastScrollPositionRef.current = scrollPosition; // Update the last scroll position

//             console.log(`Current Scroll Position: ${scrollPosition}, Scroll Direction: ${scrollDirection}`);
//             console.log(`Current scrollDelta: ${scrollDelta}, Scroll lastScrollPositionRef: ${lastScrollPositionRef.current}`);

//             // Find the active section
//             let activeSectionSlug: string | null = null;

//             sectionRefs.current?.forEach((ref) => {
//                 if (ref) {
//                     const { left, right } = ref.getBoundingClientRect();
//                     const containerLeft = scrollContainer.getBoundingClientRect().left;
//                     const containerRight = containerLeft + scrollContainer.clientWidth;

//                     const inView = right > (containerLeft - buffer) && left < (containerRight + buffer);

//                     if (inView) {
//                         activeSectionSlug = ref.id; // Set the active section slug
//                     }
//                 }
//             });

//             // Only snap when scroll delta exceeds a threshold
//             if (scrollDelta > snappingThreshold && activeSectionSlug && activeSectionSlug !== lastActiveSectionSlug) {
//                 // console.log(`Snapping to section: ${activeSectionSlug}, Direction: ${scrollDirection}`);
//                 lastActiveSectionSlug = activeSectionSlug; // Update last active section
//                 setSelectedTab(activeSectionSlug); // Set the selected tab

//                 const activeSection = sectionRefs.current?.find(ref => ref?.id === activeSectionSlug);
//                 if (activeSection) {
//                     let scrollOffset = activeSection.offsetLeft;

//                     if (scrollOffset < buffer) scrollOffset = 0;

//                     console.log(`Scrolling to offset: ${scrollOffset}`);
//                     scrollContainer.scrollTo({
//                         left: scrollOffset,
//                         behavior: 'smooth',
//                     });
//                 }
//             }
//         }, 100); // Lower debounce delay to make the scroll detection more responsive

//         const scrollContainer = scrollContainerRef.current;
//         if (scrollContainer) {
//             scrollContainer.addEventListener('scroll', handleScroll);
//         }

//         return () => {
//             if (scrollContainer) {
//                 scrollContainer.removeEventListener('scroll', handleScroll);
//             }
//         };
//     }, [scrollContainerRef, sectionRefs, setSelectedTab]);
// };


// export default useHorizontalScrollSnap;





















// import { useEffect } from 'react';

// const useHorizontalScrollSnap = (
//     scrollContainerRef: React.RefObject<HTMLDivElement>,
//     sectionRefs: React.RefObject<(HTMLDivElement | null)[]>,
//     setSelectedTab: (slug: string) => void,
// ) => {
//     useEffect(() => {
//         const handleScroll = () => {
//             const scrollContainer = scrollContainerRef.current;
//             if (!scrollContainer) return;

//             const scrollPosition = scrollContainer.scrollLeft;

//             sectionRefs.current?.forEach((ref, index) => {
//                 if (ref) {
//                     const { left, right } = ref.getBoundingClientRect();
//                     const containerLeft = scrollContainer.getBoundingClientRect().left;
//                     const containerRight = containerLeft + scrollContainer.clientWidth;

//                     const inView = right > containerLeft && left < containerRight;

//                     if (inView) {
//                         const slug = ref.id; // Use the section id as the slug
//                         setSelectedTab(slug);
//                     }
//                 }
//             });
//         };

//         const scrollContainer = scrollContainerRef.current;
//         if (scrollContainer) {
//             scrollContainer.addEventListener('scroll', handleScroll);
//         }

//         return () => {
//             if (scrollContainer) {
//                 scrollContainer.removeEventListener('scroll', handleScroll);
//             }
//         };
//     }, [scrollContainerRef, sectionRefs, setSelectedTab]);
// };

// export default useHorizontalScrollSnap;
