/**
 * useScrollReveal
 * Returns a ref and isVisible boolean.
 * Triggers once when the element enters the viewport.
 */

import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
    threshold?: number;
    triggerOnce?: boolean;
}

export function useScrollReveal<T extends Element>({
    threshold = 0.2,
    triggerOnce = true,
}: UseScrollRevealOptions = {}) {
    const ref = useRef<T>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (triggerOnce) observer.unobserve(el);
                } else if (!triggerOnce) {
                    setIsVisible(false);
                }
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, triggerOnce]);

    return { ref, isVisible };
}
