/**
 * useSound Hook
 * Provides simple sound effect playback functionality
 */

'use client';

import { useCallback, useRef } from 'react';

interface UseSoundOptions {
    volume?: number;
    playbackRate?: number;
}

export function useSound(soundPath: string, options: UseSoundOptions = {}) {
    const { volume = 0.5, playbackRate = 1 } = options;
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Initialize audio element
    if (typeof window !== 'undefined' && !audioRef.current) {
        audioRef.current = new Audio(soundPath);
        audioRef.current.volume = volume;
        audioRef.current.playbackRate = playbackRate;
    }

    const play = useCallback(() => {
        if (audioRef.current) {
            // Reset to start and play
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((error) => {
                // Silently handle autoplay restrictions
                console.debug('Audio playback failed:', error);
            });
        }
    }, []);

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, []);

    const setVolume = useCallback((newVolume: number) => {
        if (audioRef.current) {
            audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
        }
    }, []);

    return { play, stop, setVolume };
}
