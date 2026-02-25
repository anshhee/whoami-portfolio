'use client';

import { useTransition } from '@/hooks/useTransition';
import Intro from '@/components/intro/Intro';
import MainContainer from '@/components/main/MainContainer';
import Navigation from '@/components/navigation/Navigation';
import Hero from '@/components/portfolio/Hero';
import About from '@/components/portfolio/About';
import Skills from '@/components/portfolio/Skills';
import Contact from '@/components/portfolio/Contact';
import Particles from '@/components/Particles';
// import Dither from '@/components/Dither'; // Dithered wave background - uncomment to switch back
// import { VideoBackground } from '@/components/VideoBackground'; // Original video background - uncomment to switch back

export default function Home() {
    const {
        state,
        shouldMountIntro,
        shouldShowMain,
        shouldShowNavigation,
        triggerTransition,
    } = useTransition();

    return (
        <Particles
            particleCount={300}
            particleSpread={12}
            speed={0.08}
            particleColors={['#9333ea', '#a855f7', '#c084fc']}
            alphaParticles={true}
            particleBaseSize={120}
            sizeRandomness={0.8}
            cameraDistance={18}
            disableRotation={false}
            pixelRatio={1}
            moveParticlesOnHover={true}
            particleHoverFactor={0.6}
        >
            {shouldMountIntro && (
                <Intro
                    onStartIntent={triggerTransition}
                    isExiting={state === 'intro_exiting'}
                />
            )}

            {shouldShowMain && (
                <>
                    {shouldShowNavigation && <Navigation />}
                    <MainContainer isEntering={state === 'main_entering'}>
                        <Hero />
                        <About />
                        <Skills />
                        <Contact />
                    </MainContainer>
                </>
            )}
        </Particles>
    );
}
