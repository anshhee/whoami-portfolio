/**
 * Scroll Indicator Component
 * Shows a mouse icon with scroll animation that fades out when user scrolls
 */

'use client';

import { useEffect, useState } from 'react';
import styles from './ScrollIndicator.module.css';

export default function ScrollIndicator() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            // Hide indicator when user scrolls down more than 50px
            if (window.scrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={`${styles.scrollIndicator} ${!isVisible ? styles.hidden : ''}`}>
            <div className={styles.mouse}>
                <div className={styles.wheel}></div>
            </div>
            <div className={styles.arrow}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
}
