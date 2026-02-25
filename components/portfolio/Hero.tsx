/**
 * Hero Section
 * Opening section with profile card
 */

'use client';

import styles from './Hero.module.css';
import ProfileCard from '../ProfileCard';

export default function Hero() {
    return (
        <section className={styles.hero} id="hero">
            <div style={{ transform: 'translateY(20px)' }}>
                <ProfileCard
                    avatarUrl="/memoji.png"
                    miniAvatarUrl="/memoji.png"
                    name="Ansh Jaiswal"
                    title="Just a good designer and developer :)"
                    handle="anshjaiswal"
                    status="Available"
                    contactText="Contact"
                    showUserInfo={true}
                    onContactClick={() => {
                        const contactSection = document.getElementById('contact');
                        contactSection?.scrollIntoView({ behavior: 'smooth' });
                    }}
                />
            </div>
        </section>
    );
}
