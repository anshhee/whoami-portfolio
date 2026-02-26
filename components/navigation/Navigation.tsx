/**
 * Navigation Component
 * Hamburger trigger → slide-in drawer panel
 */

'use client';

import { useState, useEffect } from 'react';
import styles from './Navigation.module.css';

const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'My Stack' },
    { id: 'contact', label: 'Contact' },
];

export default function Navigation() {
    const [activeSection, setActiveSection] = useState('hero');
    const [isOpen, setIsOpen] = useState(false);

    // Active section tracking
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0,
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, []);

    // Escape key to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) setIsOpen(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const handleNavClick = (id: string) => {
        setIsOpen(false);
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 350); // wait for panel to close
    };

    return (
        <>
            {/* Hamburger trigger */}
            <button
                className={`${styles.hamburger} ${isOpen ? styles.open : ''}`}
                onClick={() => setIsOpen((o) => !o)}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
            >
                <span className={styles.bar} />
                <span className={styles.bar} />
                <span className={styles.bar} />
            </button>

            {/* Backdrop — inline pointerEvents so Particles' `.content > *` can't override it */}
            <div
                className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ''}`}
                style={{
                    pointerEvents: isOpen ? 'all' : 'none',
                    display: isOpen ? 'block' : 'none'
                }}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            />

            {/* Slide-in panel */}
            <nav
                className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
                aria-label="Site navigation"
            >
                <ul className={styles.list}>
                    {sections.map(({ id, label }, index) => (
                        <li
                            key={id}
                            className={styles.item}
                            style={{ '--i': index } as React.CSSProperties}
                        >
                            <button
                                className={`${styles.link} ${activeSection === id ? styles.active : ''}`}
                                onClick={() => handleNavClick(id)}
                            >
                                <span className={styles.linkIndex}>0{index + 1}</span>
                                <span className={styles.linkLabel}>{label}</span>
                            </button>
                        </li>
                    ))}
                </ul>

                <footer className={styles.panelFooter}>
                    <span>Ansh&apos;s Portfolio</span>
                    <span>© 2025</span>
                </footer>
            </nav>
        </>
    );
}
