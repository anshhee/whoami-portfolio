/**
 * Main Portfolio Container
 * Mounts after intro exit, with fade-in animation
 */

'use client';

import styles from './MainContainer.module.css';

interface MainContainerProps {
    children: React.ReactNode;
    isEntering: boolean;
}

export default function MainContainer({ children, isEntering }: MainContainerProps) {
    return (
        <main className={`${styles.main} ${isEntering ? styles.entering : styles.visible}`}>
            {children}
        </main>
    );
}
