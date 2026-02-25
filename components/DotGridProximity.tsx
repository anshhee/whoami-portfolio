import React, { useRef, useEffect } from 'react';
import { useCursorProximity } from '../hooks/useCursorProximity';
import styles from './DotGridProximity.module.css';

interface DotGridProximityProps {
    dotSize?: number;
    dotSpacing?: number;
    baseOpacity?: number;
    hoverOpacity?: number;
    proximityRadius?: number;
    children?: React.ReactNode;
}

export const DotGridProximity: React.FC<DotGridProximityProps> = ({
    dotSize = 1.5,
    dotSpacing = 50,
    baseOpacity = 0.05,
    hoverOpacity = 0.2,
    proximityRadius = 100,
    children
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dimensionsRef = useRef({ width: 0, height: 0 });
    const resizeTimeoutRef = useRef<number>();

    const { cursorPos, getProximityFactor } = useCursorProximity({
        radius: proximityRadius,
        throttleMs: 16
    });

    // Check for reduced motion preference
    const prefersReducedMotion = typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        // Set canvas size
        const updateCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            ctx.scale(dpr, dpr);
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;

            // Cache dimensions to prevent layout thrashing
            dimensionsRef.current = { width: rect.width, height: rect.height };
        };

        // Debounced resize handler with RAF
        const handleResize = () => {
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
            resizeTimeoutRef.current = window.setTimeout(() => {
                requestAnimationFrame(updateCanvasSize);
            }, 150);
        };

        updateCanvasSize();
        window.addEventListener('resize', handleResize, { passive: true });

        return () => {
            window.removeEventListener('resize', handleResize);
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        // Use cached dimensions to prevent layout thrashing
        const { width, height } = dimensionsRef.current;
        if (width === 0 || height === 0) return;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Draw dots with proximity-based opacity and scale
        for (let x = 0; x < width; x += dotSpacing) {
            for (let y = 0; y < height; y += dotSpacing) {
                let opacity = baseOpacity;
                let scaledDotSize = dotSize;

                // Skip proximity effects if reduced motion is preferred
                if (!prefersReducedMotion && cursorPos) {
                    const proximityFactor = getProximityFactor(x, y);

                    // Smooth easing for natural fade
                    const easedFactor = proximityFactor * proximityFactor * (3 - 2 * proximityFactor);

                    // Opacity: subtle increase from base to hover
                    opacity = baseOpacity + (easedFactor * (hoverOpacity - baseOpacity));

                    // Scale: very subtle increase (1.0 → 1.1)
                    const scale = 1 + (easedFactor * 0.1);
                    scaledDotSize = dotSize * scale;
                }

                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.beginPath();
                ctx.arc(x, y, scaledDotSize, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }, [cursorPos, dotSize, dotSpacing, baseOpacity, hoverOpacity, getProximityFactor, prefersReducedMotion]);

    return (
        <div className={styles.container}>
            <canvas ref={canvasRef} className={styles.canvas} />
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};
