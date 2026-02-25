import { useEffect, useState, useRef } from 'react';

interface CursorPosition {
    x: number;
    y: number;
}

interface ProximityConfig {
    radius?: number;
    throttleMs?: number;
}

export const useCursorProximity = (config: ProximityConfig = {}) => {
    const { radius = 100, throttleMs = 16 } = config;
    const [cursorPos, setCursorPos] = useState<CursorPosition | null>(null);
    const lastUpdateRef = useRef<number>(0);
    const rafRef = useRef<number>();

    useEffect(() => {
        // Desktop only - check for touch support
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        // Respect user's motion preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const handleMouseMove = (e: MouseEvent) => {
            const now = Date.now();

            // Throttle updates
            if (now - lastUpdateRef.current < throttleMs) return;

            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }

            rafRef.current = requestAnimationFrame(() => {
                setCursorPos({ x: e.clientX, y: e.clientY });
                lastUpdateRef.current = now;
            });
        };

        const handleMouseLeave = () => {
            setCursorPos(null);
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [throttleMs]);

    // Calculate if a point is within proximity radius
    const isWithinProximity = (x: number, y: number): boolean => {
        if (!cursorPos) return false;
        const dx = x - cursorPos.x;
        const dy = y - cursorPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= radius;
    };

    // Get proximity factor (0-1, where 1 is at cursor, 0 is at edge of radius)
    const getProximityFactor = (x: number, y: number): number => {
        if (!cursorPos) return 0;
        const dx = x - cursorPos.x;
        const dy = y - cursorPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > radius) return 0;
        return 1 - (distance / radius);
    };

    return {
        cursorPos,
        isWithinProximity,
        getProximityFactor,
        radius
    };
};
