import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone } from 'lucide-react';
import { UserOutlined } from '@ant-design/icons';
import styles from './Header.module.css';
import { jwtDecode } from "jwt-decode";

function Header() {
    const [isSticky, setIsSticky] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setIsSticky(window.scrollY > 0);
        window.addEventListener('scroll', handleScroll);
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser(decoded);
                setIsLogin(true);
            } catch (error) {
                console.error("Invalid token:", error);
                setIsLogin(false);
            }
        }
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`${styles.header} ${isSticky ? styles.headerSticky : styles.headerNormal}`}>
            <div className={styles.headerContainer}>
                <div className={styles.headerContent}>
                    <div className={styles.logoContainer}>
                        <span className={`${styles.logo} ${isSticky ? styles.logoSticky : styles.logoNormal}`} onClick={() => navigate('/home')}>Gentle Care Dental</span>
                    </div>
                    <nav className={styles.nav}>
                        <a href={'/about'} className={`${styles.navItem} ${isSticky ? styles.navItemSticky : styles.navItemNormal}`}>About</a>
                        <a href={'/service'} className={`${styles.navItem} ${isSticky ? styles.navItemSticky : styles.navItemNormal}`}>Service</a>
                        <a href={'/pricelist'} className={`${styles.navItem} ${isSticky ? styles.navItemSticky : styles.navItemNormal}`}>Price list</a>
                        <a href={'/doctors'} className={`${styles.navItem} ${isSticky ? styles.navItemSticky : styles.navItemNormal}`}>Doctors</a>
                    </nav>
                    <div className={styles.headerActions}>
                        <div className={`${styles.phoneInfo} ${isSticky ? styles.phoneInfoSticky : styles.phoneInfoNormal}`}>
                            <Phone size={18} /> 0909 999 999
                        </div>
                        <button className={`${styles.ctaButton} ${isSticky ? styles.ctaButtonSticky : styles.ctaButtonNormal}`}>Book Now</button>
                        {isLogin ? (
                            <div className={styles.userInfo} onClick={() => navigate('/profile')}>
                                <span className={styles.userGreeting}>Hello, {user.fullName}</span>
                                <UserOutlined className={styles.userIcon} />
                            </div>
                        ) : (
                            <button onClick={() => navigate('/')} className={`${styles.ctaButton} ${isSticky ? styles.ctaButtonSticky : styles.ctaButtonNormal}`}>Login</button>
                        )}
                    </div>
                    <button className={`${styles.mobileMenuButton} ${isSticky ? styles.mobileMenuButtonSticky : styles.mobileMenuButtonNormal}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>
            {isMenuOpen && (
                <div className={styles.mobileMenu}>
                    <div className={styles.mobileMenuContent}>
                        {['Home', 'About', 'Services', 'Doctors', 'Testimonials', 'Contact'].map((item) => (
                            <a key={item} href={`#${item.toLowerCase()}`} className={styles.mobileNavItem}>{item}</a>
                        ))}
                        <div className={styles.mobileMenuFooter}>
                            <div className={styles.mobilePhoneInfo}><Phone size={18} /> 0909 999 999</div>
                            <button className={styles.mobileCtaButton}>Book Now</button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;