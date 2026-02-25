/**
 * RevealOnScroll
 * Wraps children in a Framer Motion div that fades + slides in
 * when the element enters the viewport.
 */

'use client';

import { motion } from 'framer-motion';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface RevealOnScrollProps {
    children: React.ReactNode;
    delay?: number;           // ms
    duration?: number;        // ms
    direction?: 'up' | 'down' | 'left';
    className?: string;
    style?: React.CSSProperties;
}

const directionOffset = {
    up: { x: 0, y: 28 },
    down: { x: 0, y: -28 },
    left: { x: 28, y: 0 },
};

export default function RevealOnScroll({
    children,
    delay = 0,
    duration = 600,
    direction = 'up',
    className,
    style,
}: RevealOnScrollProps) {
    const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.15 });
    const offset = directionOffset[direction];

    return (
        <motion.div
            ref={ref}
            className={className}
            style={style}
            initial={{ opacity: 0, x: offset.x, y: offset.y }}
            animate={
                isVisible
                    ? { opacity: 1, x: 0, y: 0 }
                    : { opacity: 0, x: offset.x, y: offset.y }
            }
            transition={{
                duration: duration / 1000,
                delay: delay / 1000,
                ease: [0.25, 0.46, 0.45, 0.94], // --motion-ease
            }}
        >
            {children}
        </motion.div>
    );
}
