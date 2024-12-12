import { useRef, useEffect } from "react";

export function useHorizontalScroll<T extends HTMLDivElement | null>() {
    const elRef = useRef<T>(null);

    useEffect(() => {
        const el = elRef.current;

        if (el) {
            const onWheel = (e: WheelEvent) => {
                // Check if scrolling should be horizontal
                if (e.deltaY !== 0 && el.scrollWidth > el.clientWidth) {
                    el.scrollLeft += e.deltaY;
                }
            };

            el.addEventListener('wheel', onWheel);
            return () => el.removeEventListener('wheel', onWheel);
        }
    }, []);

    return elRef;
}
