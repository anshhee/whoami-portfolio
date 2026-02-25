/**
 * Transition Controller Hook
 * Manages intro → main portfolio transition state machine
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// Animation timing constants (must match CSS)
const TIMING = {
    INTRO_EXIT_DURATION: 500,      // Intro fade-out animation
    MAIN_ENTER_DELAY: 250,          // Delay before main starts fading in
    MAIN_ENTER_DURATION: 600,       // Main fade-in animation
    INTRO_CLEANUP_DELAY: 150,       // Buffer before unmounting intro
} as const;

// State machine states
type TransitionState =
    | 'intro_idle'
    | 'intro_exiting'
    | 'main_entering'
    | 'main_idle';

interface TransitionController {
    // Current state
    state: TransitionState;

    // Component visibility
    shouldShowIntro: boolean;
    shouldMountIntro: boolean;
    shouldShowMain: boolean;
    shouldShowNavigation: boolean;

    // Interaction handlers
    triggerTransition: () => void;
}

export function useTransition(): TransitionController {
    const [state, setState] = useState<TransitionState>('intro_idle');
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup timeouts on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Trigger intro → main transition
    const triggerTransition = useCallback(() => {
        // Guard: Only trigger from intro_idle state
        if (state !== 'intro_idle') return;

        // State 1 → 2: intro_idle → intro_exiting
        setState('intro_exiting');

        // After intro exit animation completes
        timeoutRef.current = setTimeout(() => {
            // State 2 → 3: intro_exiting → main_entering
            setState('main_entering');

            // After main enter animation completes
            timeoutRef.current = setTimeout(() => {
                // State 3 → 4: main_entering → main_idle
                setState('main_idle');
            }, TIMING.MAIN_ENTER_DURATION);
        }, TIMING.INTRO_EXIT_DURATION);
    }, [state]);

    // Derived visibility states
    const shouldShowIntro = state === 'intro_idle' || state === 'intro_exiting';
    const shouldMountIntro = state !== 'main_entering' && state !== 'main_idle';
    const shouldShowMain = state === 'main_entering' || state === 'main_idle';
    const shouldShowNavigation = state === 'main_entering' || state === 'main_idle';

    return {
        state,
        shouldShowIntro,
        shouldMountIntro,
        shouldShowMain,
        shouldShowNavigation,
        triggerTransition,
    };
}

// Export timing constants for CSS synchronization
export { TIMING };
