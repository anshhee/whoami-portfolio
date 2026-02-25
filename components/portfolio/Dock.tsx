'use client';

import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    AnimatePresence,
    MotionValue,
} from 'framer-motion';
import {
    Children,
    cloneElement,
    useEffect,
    useMemo,
    useRef,
    useState,
    ReactElement,
    ReactNode,
} from 'react';
import styles from './Dock.module.css';

/* ── Types ───────────────────────────────────────────────── */

interface DockItemConfig {
    icon: ReactNode;
    label: string;
    onClick?: () => void;
    href?: string;
    className?: string;
}

interface DockItemProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    href?: string;
    mouseX: MotionValue<number>;
    spring: { mass: number; stiffness: number; damping: number };
    distance: number;
    magnification: number;
    baseItemSize: number;
    index: number;
    totalItems: number;
}

interface DockChildExtra {
    isHovered?: MotionValue<number>;
}

interface DockLabelProps extends DockChildExtra {
    children: ReactNode;
    className?: string;
}

interface DockIconProps {
    children: ReactNode;
    className?: string;
}

interface DockProps {
    items: DockItemConfig[];
    className?: string;
    spring?: { mass: number; stiffness: number; damping: number };
    magnification?: number;
    distance?: number;
    panelHeight?: number;
    dockHeight?: number;
    baseItemSize?: number;
}

/* ── DockItem ────────────────────────────────────────────── */

function DockItem({
    children,
    className = '',
    onClick,
    href,
    mouseX,
    spring,
    distance,
    magnification,
    baseItemSize,
    index,
    totalItems,
}: DockItemProps) {
    const isHovered = useMotionValue(0);

    // GAP must match Dock.module.css (.dockPanel gap: 10px)
    const GAP = 10;

    // Mathematically calculate the center of the item relative to the panel center
    // This is constant and does not change when the item grows
    const itemCenter = useMemo(() => {
        const totalWidth = totalItems * baseItemSize + (totalItems - 1) * GAP;
        return (index * (baseItemSize + GAP)) + (baseItemSize / 2) - (totalWidth / 2);
    }, [index, baseItemSize, GAP, totalItems]);

    const mouseDistance = useTransform(mouseX, (val) => {
        // val is now mouse offset from the dock center
        return val - itemCenter;
    });

    const targetSize = useTransform(
        mouseDistance,
        [-distance, 0, distance],
        [baseItemSize, magnification, baseItemSize]
    );

    const size = useSpring(targetSize, spring);

    const handleClick = () => {
        if (href) {
            window.open(href, '_blank', 'noopener,noreferrer');
        }
        onClick?.();
    };

    return (
        <motion.div
            style={{ width: size, height: size }}
            onHoverStart={() => isHovered.set(1)}
            onHoverEnd={() => isHovered.set(0)}
            onFocus={() => isHovered.set(1)}
            onBlur={() => isHovered.set(0)}
            onClick={handleClick}
            className={`${styles.dockItem} ${className}`}
            tabIndex={0}
            role="button"
        >
            {Children.map(children, (child) =>
                cloneElement(child as ReactElement<DockChildExtra>, { isHovered })
            )}
        </motion.div>
    );
}

/* ── DockLabel ───────────────────────────────────────────── */

function DockLabel({ children, className = '', isHovered }: DockLabelProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!isHovered) return;
        return isHovered.on('change', (latest) => {
            setIsVisible(latest === 1);
        });
    }, [isHovered]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 0, x: '-50%' }}
                    animate={{ opacity: 1, y: -10, x: '-50%' }}
                    exit={{ opacity: 0, y: 0, x: '-50%' }}
                    transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                    className={`${styles.dockLabel} ${className}`}
                    role="tooltip"
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ── DockIcon ────────────────────────────────────────────── */

function DockIcon({ children, className = '' }: DockIconProps) {
    return <div className={`${styles.dockIcon} ${className}`}>{children}</div>;
}

/* ── Dock ────────────────────────────────────────────────── */

export default function Dock({
    items,
    className = '',
    spring = { mass: 0.1, stiffness: 150, damping: 20 },
    magnification = 72,
    distance = 180,
    panelHeight = 64,
    dockHeight = 200,
    baseItemSize = 48,
}: DockProps) {
    const mouseX = useMotionValue(Infinity);
    const isHovered = useMotionValue(0);
    const outerRef = useRef<HTMLDivElement>(null);
    const dockCenterRef = useRef<number>(0);

    const updateDockCenter = () => {
        if (outerRef.current) {
            const rect = outerRef.current.getBoundingClientRect();
            dockCenterRef.current = rect.left + rect.width / 2;
        }
    };

    useEffect(() => {
        window.addEventListener('resize', updateDockCenter);
        return () => window.removeEventListener('resize', updateDockCenter);
    }, []);

    const maxHeight = useMemo(
        () => Math.max(dockHeight, magnification + magnification / 2 + 4),
        [magnification, dockHeight]
    );

    const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
    const height = useSpring(heightRow, spring);

    return (
        <motion.div
            ref={outerRef}
            style={{ height: maxHeight, scrollbarWidth: 'none' }}
            className={styles.dockOuter}
            onPointerMove={({ clientX, clientY }) => {
                if (dockCenterRef.current === 0) updateDockCenter();

                // Check vertical distance from bottom to restrict hit area
                if (outerRef.current) {
                    const rect = outerRef.current.getBoundingClientRect();
                    const distFromBottom = rect.bottom - clientY;
                    // magnification is 72, labels are above that. 
                    // 140px covers icons + labels + a small buffer.
                    if (distFromBottom > 140) {
                        isHovered.set(0);
                        mouseX.set(Infinity);
                        return;
                    }
                }

                isHovered.set(1);
                mouseX.set(clientX - dockCenterRef.current);
            }}
            onPointerEnter={() => {
                updateDockCenter();
            }}
            onPointerLeave={() => {
                isHovered.set(0);
                mouseX.set(Infinity);
            }}
        >
            <motion.div
                className={`${styles.dockPanel} ${className}`}
                style={{ height: panelHeight }}
                role="toolbar"
                aria-label="Contact links dock"
            >
                {items.map((item, index) => (
                    <DockItem
                        key={index}
                        index={index}
                        onClick={item.onClick}
                        href={item.href}
                        className={item.className ?? ''}
                        mouseX={mouseX}
                        spring={spring}
                        distance={distance}
                        magnification={magnification}
                        baseItemSize={baseItemSize}
                        totalItems={items.length}
                    >
                        <DockIcon>{item.icon}</DockIcon>
                        <DockLabel>{item.label}</DockLabel>
                    </DockItem>
                ))}
            </motion.div>
        </motion.div>
    );
}
