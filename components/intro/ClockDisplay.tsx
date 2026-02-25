'use client';

import { useState, useEffect, useRef, memo } from 'react';
import styles from './ClockDisplay.module.css';

// ─── Single flipping digit card ───────────────────────────────────────────────
const FlipDigit = memo(function FlipDigit({ value }: { value: string }) {
    const [curr, setCurr] = useState(value);
    const [prev, setPrev] = useState(value);
    const [animKey, setAnimKey] = useState(0);

    useEffect(() => {
        if (value === curr) return;
        setPrev(curr);
        setCurr(value);
        setAnimKey(k => k + 1);
    }, [value, curr]);

    return (
        <div className={styles.card}>
            {/* Static resting state: top half */}
            <div className={`${styles.half} ${styles.topHalf}`}>
                <span className={styles.num}>{curr}</span>
            </div>
            {/* Static resting state: bottom half */}
            <div className={`${styles.half} ${styles.bottomHalf}`}>
                <span className={styles.num}>{curr}</span>
            </div>

            {/* Center fold line */}
            <div className={styles.foldLine} />

            {/* Animated flaps — remounted on digit change to restart animation */}
            {animKey > 0 && (
                <>
                    {/* Upper flap: shows PREV digit, rotates from 0° → -90° */}
                    <div
                        key={`u-${animKey}`}
                        className={`${styles.half} ${styles.topHalf} ${styles.flap} ${styles.flipDown}`}
                    >
                        <span className={styles.num}>{prev}</span>
                    </div>
                    {/* Lower flap: shows CURR digit, rotates from 90° → 0° (delayed) */}
                    <div
                        key={`l-${animKey}`}
                        className={`${styles.half} ${styles.bottomHalf} ${styles.flap} ${styles.flipUp}`}
                    >
                        <span className={styles.num}>{curr}</span>
                    </div>
                </>
            )}
        </div>
    );
});

// ─── Two-digit unit with label ────────────────────────────────────────────────
function FlipUnit({ value }: { value: string; label: string }) {
    const digits = value.split('');
    return (
        <div className={styles.unit}>
            <div className={styles.cardRow}>
                {digits.map((d, i) => (
                    <FlipDigit key={i} value={d} />
                ))}
            </div>
        </div>
    );
}

// ─── Blinking dot separator ───────────────────────────────────────────────────
function Separator() {
    return (
        <div className={styles.sep}>
            <span />
            <span />
        </div>
    );
}

// ─── Main clock export ────────────────────────────────────────────────────────
export default function ClockDisplay() {
    const [now, setNow] = useState<Date | null>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const rafRef = useRef<number>();
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setNow(new Date());
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            const rect = wrapperRef.current?.getBoundingClientRect();
            if (!rect) return;
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const nx = (e.clientX - cx) / (rect.width / 2);
            const ny = (e.clientY - cy) / (rect.height / 2);
            const MAX_TILT = 8;
            setTilt({ x: -ny * MAX_TILT, y: nx * MAX_TILT });
        });
    };

    const handleMouseLeave = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        setTilt({ x: 0, y: 0 });
    };

    if (!now) return null;

    const pad = (n: number) => String(n).padStart(2, '0');
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());
    const ss = pad(now.getSeconds());

    const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const dayName = DAYS[now.getDay()];
    const dateStr = `${pad(now.getDate())} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

    return (
        <div
            ref={wrapperRef}
            className={styles.wrapper}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div className={styles.dateRow}>
                <span className={styles.dayName}>{dayName}</span>
                <span className={styles.dateDivider}>·</span>
                <span className={styles.dateStr}>{dateStr}</span>
            </div>
            <div
                className={styles.face}
                style={{
                    transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transition: tilt.x === 0 && tilt.y === 0
                        ? 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
                        : 'transform 0.1s ease-out',
                }}
            >
                <FlipUnit value={hh} label="HRS" />
                <Separator />
                <FlipUnit value={mm} label="MIN" />
                <Separator />
                <FlipUnit value={ss} label="SEC" />
            </div>
        </div>
    );
}
