/**
 * Audio Generator Utility
 * Generates subtle bass-heavy hover sound using Web Audio API
 */

let audioContext: AudioContext | null = null;
let hoverSoundBuffer: AudioBuffer | null = null;

// Initialize audio context
function getAudioContext(): AudioContext {
    if (!audioContext && typeof window !== 'undefined') {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext!;
}

// Generate smooth whoosh/swoosh sound
export function generateHoverSound(): AudioBuffer {
    if (hoverSoundBuffer) return hoverSoundBuffer;

    const context = getAudioContext();
    const sampleRate = context.sampleRate;
    const duration = 0.2; // 200ms - smooth whoosh
    const length = sampleRate * duration;
    const buffer = context.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate a smooth whoosh using filtered white noise
    for (let i = 0; i < length; i++) {
        const t = i / sampleRate;

        // White noise for airy texture
        const noise = (Math.random() - 0.5) * 2;

        // Envelope: quick rise, smooth fall (whoosh shape)
        const attack = Math.min(t * 20, 1); // Quick attack
        const decay = Math.exp(-t * 12); // Smooth decay
        const envelope = attack * decay;

        // Frequency sweep for movement (high to low)
        const sweepFreq = 3000 - (t / duration) * 2000; // 3000Hz -> 1000Hz
        const sweep = Math.sin(2 * Math.PI * sweepFreq * t) * 0.3;

        // Combine noise and sweep with envelope
        data[i] = (noise * 0.7 + sweep * 0.3) * envelope * 0.4;
    }

    hoverSoundBuffer = buffer;
    return buffer;
}

// Play the hover sound
export function playHoverSound(volume: number = 0.3) {
    if (typeof window === 'undefined') return;

    try {
        const context = getAudioContext();
        const buffer = generateHoverSound();

        const source = context.createBufferSource();
        const gainNode = context.createGain();

        source.buffer = buffer;
        gainNode.gain.value = volume;

        source.connect(gainNode);
        gainNode.connect(context.destination);

        source.start(0);
    } catch (error) {
        console.debug('Audio playback failed:', error);
    }
}

// Resume audio context (needed for autoplay policies)
export function resumeAudioContext() {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
}
