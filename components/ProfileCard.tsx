'use client';

import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import styles from './ProfileCard.module.css';

const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)';

const ANIMATION_CONFIG = {
    INITIAL_DURATION: 1200,
    INITIAL_X_OFFSET: 70,
    INITIAL_Y_OFFSET: 60,
    DEVICE_BETA_OFFSET: 20,
    ENTER_TRANSITION_MS: 180
};

const clamp = (v: number, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v: number, precision = 3) => parseFloat(v.toFixed(precision));
const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number) =>
    round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

interface ProfileCardProps {
    avatarUrl?: string;
    iconUrl?: string;
    grainUrl?: string;
    innerGradient?: string;
    behindGlowEnabled?: boolean;
    behindGlowColor?: string;
    behindGlowSize?: string;
    className?: string;
    enableTilt?: boolean;
    enableMobileTilt?: boolean;
    mobileTiltSensitivity?: number;
    miniAvatarUrl?: string;
    name?: string;
    title?: string;
    handle?: string;
    status?: string;
    contactText?: string;
    showUserInfo?: boolean;
    onContactClick?: () => void;
}

const ProfileCardComponent: React.FC<ProfileCardProps> = ({
    avatarUrl = '',
    iconUrl = '',
    grainUrl = '',
    innerGradient,
    behindGlowEnabled = true,
    behindGlowColor,
    behindGlowSize,
    className = '',
    enableTilt = true,
    enableMobileTilt = false,
    mobileTiltSensitivity = 5,
    miniAvatarUrl,
    name = 'Ansh Jaiswal',
    title = 'Just a good designer and developer :)',
    handle = 'anshjaiswal',
    status = 'Available',
    contactText = 'Contact',
    showUserInfo = true,
    onContactClick
}) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const shellRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLElement>(null);
    const enterTimerRef = useRef<number | null>(null);
    const leaveRafRef = useRef<number | null>(null);

    const tiltEngine = useMemo(() => {
        if (!enableTilt) return null;

        let rafId: number | null = null;
        let running = false;
        let lastTs = 0;
        let currentX = 0;
        let currentY = 0;
        let targetX = 0;
        let targetY = 0;

        const DEFAULT_TAU = 0.14;
        const INITIAL_TAU = 0.6;
        let initialUntil = 0;

        const setVarsFromXY = (x: number, y: number) => {
            const card = cardRef.current;
            const wrap = wrapRef.current;
            if (!card || !wrap) return;

            const width = card.clientWidth || 1;
            const height = card.clientHeight || 1;

            const percentX = clamp((100 / width) * x);
            const percentY = clamp((100 / height) * y);
            const centerX = percentX - 50;
            const centerY = percentY - 50;

            const properties: Record<string, string> = {
                '--pointer-x': `${percentX}%`,
                '--pointer-y': `${percentY}%`,
                '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
                '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
                '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
                '--pointer-from-top': `${percentY / 100}`,
                '--pointer-from-left': `${percentX / 100}`,
                '--rotate-x': `${round(-(centerX / 5))}deg`,
                '--rotate-y': `${round(centerY / 4)}deg`
            };

            for (const [k, v] of Object.entries(properties)) wrap.style.setProperty(k, v);
        };

        const step = (ts: number) => {
            if (!running) return;
            if (lastTs === 0) lastTs = ts;
            const dt = (ts - lastTs) / 1000;
            lastTs = ts;

            const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
            const k = 1 - Math.exp(-dt / tau);

            currentX += (targetX - currentX) * k;
            currentY += (targetY - currentY) * k;

            setVarsFromXY(currentX, currentY);

            const stillFar = Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;

            if (stillFar || document.hasFocus()) {
                rafId = requestAnimationFrame(step);
            } else {
                running = false;
                lastTs = 0;
                if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
            }
        };

        const start = () => {
            if (running) return;
            running = true;
            lastTs = 0;
            rafId = requestAnimationFrame(step);
        };

        return {
            setImmediate(x: number, y: number) {
                currentX = x; currentY = y;
                setVarsFromXY(currentX, currentY);
            },
            setTarget(x: number, y: number) {
                targetX = x; targetY = y;
                start();
            },
            toCenter() {
                const shell = shellRef.current;
                if (!shell) return;
                this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
            },
            beginInitial(durationMs: number) {
                initialUntil = performance.now() + durationMs;
                start();
            },
            getCurrent() {
                return { x: currentX, y: currentY, tx: targetX, ty: targetY };
            },
            cancel() {
                if (rafId) cancelAnimationFrame(rafId);
                rafId = null; running = false; lastTs = 0;
            }
        };
    }, [enableTilt]);

    const getOffsets = (evt: PointerEvent, el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
    };

    const handlePointerMove = useCallback(
        (event: PointerEvent) => {
            const card = cardRef.current;
            if (!card || !tiltEngine) return;
            const { x, y } = getOffsets(event, card);
            tiltEngine.setTarget(x, y);
        },
        [tiltEngine]
    );

    const handlePointerEnter = useCallback(
        (event: PointerEvent) => {
            const card = cardRef.current;
            const shell = shellRef.current;
            if (!card || !shell || !tiltEngine) return;
            card.classList.add('active');
            shell.classList.add('entering');
            if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
            enterTimerRef.current = window.setTimeout(() => {
                shell.classList.remove('entering');
            }, ANIMATION_CONFIG.ENTER_TRANSITION_MS);
            const { x, y } = getOffsets(event, card);
            tiltEngine.setTarget(x, y);
        },
        [tiltEngine]
    );

    const handlePointerLeave = useCallback(() => {
        const card = cardRef.current;
        if (!card || !tiltEngine) return;
        tiltEngine.toCenter();
        const checkSettle = () => {
            const { x, y, tx, ty } = tiltEngine.getCurrent();
            if (Math.hypot(tx - x, ty - y) < 0.6) {
                card.classList.remove('active');
                leaveRafRef.current = null;
            } else {
                leaveRafRef.current = requestAnimationFrame(checkSettle);
            }
        };
        if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
        leaveRafRef.current = requestAnimationFrame(checkSettle);
    }, [tiltEngine]);

    const handleDeviceOrientation = useCallback(
        (event: DeviceOrientationEvent) => {
            const shell = shellRef.current;
            if (!shell || !tiltEngine) return;
            const { beta, gamma } = event;
            if (beta == null || gamma == null) return;
            const centerX = shell.clientWidth / 2;
            const centerY = shell.clientHeight / 2;
            const x = clamp(centerX + gamma * mobileTiltSensitivity, 0, shell.clientWidth);
            const y = clamp(
                centerY + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
                0,
                shell.clientHeight
            );
            tiltEngine.setTarget(x, y);
        },
        [tiltEngine, mobileTiltSensitivity]
    );

    useEffect(() => {
        if (!enableTilt || !tiltEngine) return;
        const card = cardRef.current;
        const shell = shellRef.current;
        if (!card || !shell) return;

        card.addEventListener('pointerenter', handlePointerEnter as EventListener);
        card.addEventListener('pointermove', handlePointerMove as EventListener);
        card.addEventListener('pointerleave', handlePointerLeave as EventListener);

        const handleClick = () => {
            if (!enableMobileTilt || location.protocol !== 'https:') return;
            const anyMotion = window.DeviceMotionEvent as any;
            if (anyMotion && typeof anyMotion.requestPermission === 'function') {
                anyMotion.requestPermission()
                    .then((state: string) => {
                        if (state === 'granted') window.addEventListener('deviceorientation', handleDeviceOrientation as EventListener);
                    })
                    .catch(console.error);
            } else {
                window.addEventListener('deviceorientation', handleDeviceOrientation as EventListener);
            }
        };
        card.addEventListener('click', handleClick);

        const initialX = (card.clientWidth || 0) - ANIMATION_CONFIG.INITIAL_X_OFFSET;
        const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
        tiltEngine.setImmediate(initialX, initialY);
        tiltEngine.toCenter();
        tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

        return () => {
            card.removeEventListener('pointerenter', handlePointerEnter as EventListener);
            card.removeEventListener('pointermove', handlePointerMove as EventListener);
            card.removeEventListener('pointerleave', handlePointerLeave as EventListener);
            card.removeEventListener('click', handleClick);
            window.removeEventListener('deviceorientation', handleDeviceOrientation as EventListener);
            if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
            if (leaveRafRef.current) cancelAnimationFrame(leaveRafRef.current);
            tiltEngine.cancel();
            card.classList.remove('active');
            shell.classList.remove('entering');
        };
    }, [enableTilt, enableMobileTilt, tiltEngine, handlePointerMove, handlePointerEnter, handlePointerLeave, handleDeviceOrientation]);

    const cardStyle = useMemo(
        () => ({
            '--icon': iconUrl ? `url(${iconUrl})` : 'none',
            '--grain': grainUrl ? `url(${grainUrl})` : 'none',
            '--inner-gradient': innerGradient ?? DEFAULT_INNER_GRADIENT,
            '--behind-glow-color': behindGlowColor ?? 'rgba(147, 51, 234, 0.55)',
            '--behind-glow-size': behindGlowSize ?? '55%'
        } as React.CSSProperties),
        [iconUrl, grainUrl, innerGradient, behindGlowColor, behindGlowSize]
    );

    const handleContactClick = useCallback(() => {
        onContactClick?.();
    }, [onContactClick]);

    return (
        <div ref={wrapRef} className={`${styles.pcCardWrapper} no-particle-interact ${className}`.trim()} style={cardStyle}>
            {behindGlowEnabled && <div className={styles.pcBehind} />}
            <div ref={shellRef} className={styles.pcCardShell}>
                <section ref={cardRef} className={styles.pcCard}>
                    {/* Holographic base layer */}
                    <div className={styles.pcInside} />

                    {/* Holographic shine */}
                    <div className={styles.pcShine} />

                    {/* Glare overlay */}
                    <div className={styles.pcGlare} />

                    {/* 👾 diagonal emoji holographic pattern */}
                    <div className={styles.pcEmojiPattern} />

                    {/* Avatar */}
                    <div className={styles.pcAvatarContent}>
                        {avatarUrl ? (
                            <img
                                className={styles.avatar}
                                src={avatarUrl}
                                alt={`${name || 'User'} avatar`}
                                loading="lazy"
                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                <span>{name?.charAt(0) ?? 'A'}</span>
                            </div>
                        )}
                    </div>

                    {/* Name + title */}
                    <div className={styles.pcContent}>
                        <div className={styles.pcDetails}>
                            <h3>{name}</h3>
                            <p>{title}</p>
                        </div>
                    </div>

                    {/* Bottom user info bar */}
                    {showUserInfo && (
                        <div className={styles.pcUserInfo}>
                            <div className={styles.pcUserDetails}>
                                {(miniAvatarUrl || avatarUrl) && (
                                    <div className={styles.pcMiniAvatar}>
                                        <img
                                            src={miniAvatarUrl || avatarUrl}
                                            alt={handle}
                                            loading="lazy"
                                        />
                                    </div>
                                )}
                                <div className={styles.pcUserText}>
                                    <span className={styles.pcHandle}>@{handle}</span>
                                    <span className={styles.pcStatus}>{status}</span>
                                </div>
                            </div>
                            <button className={styles.pcContactBtn} onClick={handleContactClick}>
                                {contactText}
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
