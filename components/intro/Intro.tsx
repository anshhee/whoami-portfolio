/**
 * Intro Screen - Presentational Component
 * Pure UI component with no state or animation logic
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './Intro.module.css';
import ClockDisplay from './ClockDisplay';

interface IntroProps {
    onStartIntent: () => void;
    isExiting: boolean;
}

export default function Intro({ onStartIntent, isExiting }: IntroProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);
    const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const ctaRef = useRef<HTMLButtonElement>(null);



    // Cleanup hover timeout on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    // Magnetic interaction effect
    useEffect(() => {
        // Only on desktop (min-width: 1024px)
        if (typeof window === 'undefined' || window.innerWidth < 1024) return;
        if (hasTriggered) return; // Disabled after transition starts

        const ACTIVATION_RADIUS = 160; // px — zone in which magnet activates
        const MAX_PULL = 28;           // px — max displacement at cursor center

        const handleMouseMove = (e: MouseEvent) => {
            if (!ctaRef.current) return;

            const rect = ctaRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance < ACTIVATION_RADIUS && distance > 0) {
                // Non-linear pull: stronger as cursor gets closer
                const strength = (1 - distance / ACTIVATION_RADIUS) ** 1.5;
                const offsetX = (deltaX / distance) * strength * MAX_PULL;
                const offsetY = (deltaY / distance) * strength * MAX_PULL;
                setMagneticOffset({ x: offsetX, y: offsetY });
            } else {
                setMagneticOffset({ x: 0, y: 0 });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [hasTriggered]);

    // Single trigger handler
    const triggerIntent = () => {
        if (hasTriggered) return;

        setHasTriggered(true);
        onStartIntent();
    };

    const handleMouseEnter = () => {
        if (hasTriggered) return;

        setIsHovered(true);

        // Clear any existing timeout
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        // Trigger after 250ms hover
        hoverTimeoutRef.current = setTimeout(() => {
            triggerIntent();
        }, 250);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);

        // Cancel hover trigger if user moves away
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
    };

    const handleClick = () => {
        // Clear hover timeout if exists
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        // Immediate trigger on click
        triggerIntent();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerIntent();
        }
    };

    return (
        <div className={`${styles.intro} ${isExiting ? styles.exiting : ''}`}>
            <div className={styles.content}>
                <h1 className={styles.name}>Hi, I'm Ansh</h1>
                <p className={styles.role}>Just a good designer and developer :)</p>



                <button
                    ref={ctaRef}
                    className={styles.cta}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleClick}
                    onKeyDown={handleKeyDown}
                    disabled={hasTriggered}
                    aria-label="Start exploring portfolio"
                    style={{
                        transform: `translate(${magneticOffset.x}px, ${magneticOffset.y}px)`
                    }}
                >
                    {isHovered ? 'CLICK TO START' : 'HOVER TO START'}
                </button>
            </div>
            <div className={`${styles.clockAnchor} no-particle-interact`}>
                <div className={styles.clockGlow} />
                <ClockDisplay />
            </div>
        </div>
    );
}
