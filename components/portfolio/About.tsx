/**
 * About Section
 */

'use client';

import styles from './About.module.css';
import RevealOnScroll from '@/components/RevealOnScroll';

export default function About() {
    return (
        <section className={styles.about} id="about">
            <RevealOnScroll delay={0}>
                <h2 className={styles.heading}>About</h2>
            </RevealOnScroll>
            <RevealOnScroll delay={150}>
                <p className={styles.text}>
                    Hello there, I’m Ansh - an undergrad designer and developer obsessed with performance and minimalism.
                    I build experiences that are robust, accessible, and engineered to scale.
                </p>
            </RevealOnScroll>
        </section>
    );
}
