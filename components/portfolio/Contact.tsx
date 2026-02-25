/**
 * Contact Section
 */

'use client';

import styles from './Contact.module.css';
import RevealOnScroll from '@/components/RevealOnScroll';
import Dock from './Dock';

/* ── SVG Icons ─────────────────────────────────────────── */

const ResumeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
    </svg>
);

const GmailIcon = () => (
    <svg viewBox="0 0 24 24" fill="none">
        <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z" stroke="currentColor" strokeWidth={1.5} />
        <path d="M2 7l10 7L22 7" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
);

const GitHubIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.185 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.203 22 16.447 22 12.021 22 6.484 17.522 2 12 2z" />
    </svg>
);

const TwitterXIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

const DiscordIcon = () => (
    <svg viewBox="0 -28.5 256 256" fill="currentColor">
        <path d="M216.856 16.597C200.285 8.92 182.712 3.321 164.212 0c-2.27 4.04-4.793 9.244-6.59 13.526-19.746-2.957-39.31-2.957-58.644 0-1.797-4.282-4.407-9.486-6.685-13.526-18.504 3.321-36.077 8.919-52.65 16.597C6.012 70.505-1.073 123.13.256 174.908c21.973 16.208 43.258 26.046 64.12 32.508 5.216-7.126 9.873-14.852 13.84-23.014-7.53-2.829-14.735-6.438-21.5-10.74 1.797-1.315 3.535-2.705 5.217-4.133 41.59 19.18 86.41 19.18 127.42 0 1.682 1.428 3.42 2.818 5.216 4.133-6.765 4.302-13.97 7.911-21.5 10.74 3.967 8.162 8.624 15.888 13.84 23.014 20.862-6.462 42.147-16.3 64.12-32.508 1.55-59.591-2.583-111.458-29.176-158.311zM85.474 149.121c-12.684 0-23.097-11.636-23.097-25.86 0-14.223 10.154-25.859 23.097-25.859 13.06 0 23.36 11.751 23.097 25.86-.113 14.224-10.154 25.86-23.097 25.86zm85.051 0c-12.684 0-23.097-11.636-23.097-25.86 0-14.223 10.154-25.859 23.097-25.859 13.06 0 23.36 11.751 23.097 25.86-.113 14.224-10.154 25.86-23.097 25.86z" />
    </svg>
);

/* ── Dock items config ─────────────────────────────────── */

const dockItems = [
    {
        icon: <ResumeIcon />,
        label: 'Resume',
        href: '/resume.pdf',
    },
    {
        icon: <GmailIcon />,
        label: 'Gmail',
        href: 'mailto:jaiswalanshv2@gmail.com',
    },
    {
        icon: <GitHubIcon />,
        label: 'GitHub',
        href: 'https://github.com/anshhee',
    },
    {
        icon: <DiscordIcon />,
        label: 'Discord',
        href: 'https://discord.com/channels/487185087654264832',
    },
    {
        icon: <TwitterXIcon />,
        label: 'Twitter / X',
        href: 'https://x.com/dantesilviox',
    },
];

/* ── Component ─────────────────────────────────────────── */

export default function Contact() {
    return (
        <section className={styles.contact} id="contact">
            <RevealOnScroll delay={0}>
                <h2 className={styles.heading}>Let&apos;s Connect</h2>
            </RevealOnScroll>
            <RevealOnScroll delay={150}>
                <p className={styles.text}>
                    Got something in mind, or just want to say hey? <a href="mailto:jaiswalanshv2@gmail.com" className={styles.link}>Drop me a message</a> - I&apos;m always open to a good conversation.
                </p>
            </RevealOnScroll>
            <RevealOnScroll delay={300}>
                <div className={styles.dockWrapper}>
                    <Dock
                        items={dockItems}
                        magnification={72}
                        baseItemSize={48}
                        distance={160}
                        panelHeight={64}
                    />
                </div>
            </RevealOnScroll>
        </section>
    );
}
