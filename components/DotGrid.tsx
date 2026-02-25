import React from 'react';
import styles from './DotGrid.module.css';

interface DotGridProps {
    variant?: 'standard' | 'subtle' | 'extra-subtle';
    children?: React.ReactNode;
}

export const DotGrid: React.FC<DotGridProps> = ({
    variant = 'subtle',
    children
}) => {
    return (
        <div className={styles[variant]}>
            {children}
        </div>
    );
};
