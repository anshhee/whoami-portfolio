'use client';

import React, { useRef, useEffect } from 'react';
import styles from './VideoBackground.module.css';

interface VideoBackgroundProps {
    children?: React.ReactNode;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({ children }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const lastTimeRef = useRef<number>(0);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        let rafId: number;

        // Monitor playback with RAF
        const checkPlayback = () => {
            if (!video) return;

            const currentTime = video.currentTime;

            // If video is "playing" but time hasn't changed, it's stuck
            if (!video.paused && currentTime === lastTimeRef.current) {
                console.log('Video stuck, restarting');
                video.currentTime = 0;
                video.play().catch(e => console.error('Restart failed:', e));
            }

            // If near end, loop manually
            if (video.duration && currentTime >= video.duration - 0.1) {
                console.log('Near end, looping');
                video.currentTime = 0;
            }

            lastTimeRef.current = currentTime;
            rafId = requestAnimationFrame(checkPlayback);
        };

        // Initial play
        video.play().then(() => {
            console.log('Video started');
            rafId = requestAnimationFrame(checkPlayback);
        }).catch(e => console.error('Initial play failed:', e));

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div className={styles.container}>
            <video
                ref={videoRef}
                className={styles.video}
                loop
                muted
                playsInline
                preload="auto"
            >
                <source src="/assets/sitebg.mp4?v=2" type="video/mp4" />
            </video>
            <div className={styles.vignette} />
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};
