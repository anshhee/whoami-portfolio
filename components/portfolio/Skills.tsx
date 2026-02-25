/**
 * Skills Section - Categorized with Tilted Card Effect
 */

'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import styles from './Skills.module.css';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import ShinyText from './ShinyText';

const springValues = {
    damping: 30,
    stiffness: 100,
    mass: 2
};

const skillCategories = [
    {
        domain: 'Languages',
        technologies: ['JavaScript', 'TypeScript', 'Python', 'Rust', 'Solidity', 'SQL']
    },
    {
        domain: 'Frontend',
        technologies: ['React', 'Next.js', 'Three.js', 'HTML/CSS', 'Tailwind', 'Framer Motion']
    },
    {
        domain: 'Backend',
        technologies: ['Node.js', 'Express', 'Django', 'REST APIs', 'Prisma', 'Supabase', 'Firebase']
    },
    {
        domain: 'DevOps',
        technologies: ['Docker', 'Git', 'GitHub Actions', 'CI/CD', 'AWS', 'Vercel']
    },
    {
        domain: 'Database',
        technologies: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis']
    },
    {
        domain: 'Tools',
        technologies: ['Figma', 'Vite', 'After Effects', 'Photoshop', 'Blender', 'Canva']
    },
    {
        domain: 'AI/ML',
        technologies: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'Pandas']
    }
];

function CategoryCard({ domain, technologies, index }: { domain: string; technologies: string[]; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [hoveredTech, setHoveredTech] = useState<number | null>(null);

    const rotateX = useSpring(useMotionValue(0), springValues);
    const rotateY = useSpring(useMotionValue(0), springValues);
    const scale = useSpring(1, springValues);

    const { ref: revealRef, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

    function handleMouse(e: React.MouseEvent<HTMLDivElement>) {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left - rect.width / 2;
        const offsetY = e.clientY - rect.top - rect.height / 2;

        const rotationX = (offsetY / (rect.height / 2)) * -14;
        const rotationY = (offsetX / (rect.width / 2)) * 14;

        rotateX.set(rotationX);
        rotateY.set(rotationY);
    }

    function handleMouseEnter() {
        scale.set(1.05);
    }

    function handleMouseLeave() {
        scale.set(1);
        rotateX.set(0);
        rotateY.set(0);
    }

    return (
        <motion.div
            ref={(el) => {
                (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
                (revealRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
            }}
            className={`${styles.categoryCard} no-particle-interact`}
            onMouseMove={handleMouse}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                scale,
            }}
            initial={{ opacity: 0, y: 32 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
            transition={{
                duration: 0.55,
                delay: index * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
        >
            <h3 className={styles.categoryTitle}>{domain}</h3>
            <div className={styles.technologiesList}>
                {technologies.map((tech, techIndex) => (
                    <span
                        key={tech}
                        className={styles.technologyItem}
                        onMouseEnter={() => setHoveredTech(techIndex)}
                        onMouseLeave={() => setHoveredTech(null)}
                        style={{
                            opacity: hoveredTech === null ? 0.8 : hoveredTech === techIndex ? 1 : 0.4,
                            transition: 'opacity 0.3s ease'
                        }}
                    >
                        <ShinyText
                            text={tech}
                            disabled={hoveredTech !== techIndex}
                            speed={1.2}
                            color="#ffffff"
                            shineColor="#d8b4fe"
                            spread={120}
                        />
                    </span>
                ))}
            </div>
        </motion.div>
    );
}

export default function Skills() {
    const { ref: headingRef, isVisible: headingVisible } = useScrollReveal<HTMLHeadingElement>({ threshold: 0.3 });

    return (
        <section className={styles.skills} id="skills">
            <motion.h2
                ref={headingRef}
                className={styles.heading}
                initial={{ opacity: 0, y: 24 }}
                animate={headingVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
                My Stack
            </motion.h2>
            <div className={styles.grid}>
                {skillCategories.map((category, index) => (
                    <CategoryCard
                        key={category.domain}
                        domain={category.domain}
                        technologies={category.technologies}
                        index={index}
                    />
                ))}
            </div>
        </section>
    );
}
