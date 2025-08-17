import React, { useState, useEffect, useCallback } from 'react';
import { Phone, Mail, MapPin, Star, Award, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import styles from './HomePage.module.css';
import Header from '../components/Header';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.jpg';
import banner3 from '../assets/banner3.jpg';
import banner4 from '../assets/banner4.jpg';
import banner5 from '../assets/banner5.png';
import banner6 from '../assets/banner6.png';
import about from '../assets/about.png';
import Messenger from '../components/Messenger';
import ChatBot from '../components/ChatBot';

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [openWidget, setOpenWidget] = useState(null);

  const slides = [banner1, banner2, banner3, banner4, banner5, banner6];
  const nextSlide = useCallback(() => setCurrentSlide((prev) => (prev + 1) % slides.length), [slides.length]);
  const prevSlide = useCallback(() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className={styles.container}>
      <Header />
      <Messenger
        isOpen={openWidget === 'messenger'}
        onToggle={() => setOpenWidget(prev => prev === 'messenger' ? null : 'messenger')}
        isOtherOpen={openWidget === 'chatbot'} />
      <ChatBot
        isOpen={openWidget === 'chatbot'}
        onToggle={() => setOpenWidget(prev => prev === 'chatbot' ? null : 'chatbot')}
        isOtherOpen={openWidget === 'messenger'} />
      <section className={styles.bannerSection}>
        {slides.map((src, index) => (
          <div key={index} className={`${styles.bannerSlide} ${index === currentSlide ? styles.bannerSlideActive : index < currentSlide ? styles.bannerSlidePrev : styles.bannerSlideNext}`}>
            <div className={styles.bannerImage} style={{ backgroundImage: `url(${src})` }}>
              <div className={styles.bannerOverlay}></div>
            </div>
          </div>
        ))}
        <button className={`${styles.bannerNavButton} ${styles.bannerNavPrev}`} onClick={prevSlide}><ChevronLeft /></button>
        <button className={`${styles.bannerNavButton} ${styles.bannerNavNext}`} onClick={nextSlide}><ChevronRight /></button>
        <div className={styles.bannerDots}>
          {slides.map((_, i) => (
            <span
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`${styles.bannerDot} ${i === currentSlide ? styles.bannerDotActive : styles.bannerDotInactive}`}
            ></span>
          ))}
        </div>
      </section>

      <section className={styles.aboutSection} id="about">
        <div className={styles.aboutContainer}>
          <div className={styles.aboutGrid}>
            <div>
              <h2 className={styles.aboutTitle}>Why Choose <span className={styles.aboutTitleHighlight}>Gentle Care Dental</span></h2>
              <p className={styles.aboutDescription}>Our dental clinic is equipped with modern facilities and experienced professionals to give you the best oral health care.</p>
              <div className={styles.aboutStats}>
                <div className={styles.aboutStatCard}>
                  <div className={styles.aboutStatNumber}>15+</div>
                  <div className={styles.aboutStatLabel}>Years Experience</div>
                </div>
                <div className={styles.aboutStatCard}>
                  <div className={styles.aboutStatNumber}>5K+</div>
                  <div className={styles.aboutStatLabel}>Happy Patients</div>
                </div>
              </div>
              <div className={styles.aboutFeatures}>
                {['Modern Tools', 'Certified Dentists', 'Flexible Hours'].map((feat) => (
                  <div key={feat} className={styles.aboutFeature}><CheckCircle size={18} /> {feat}</div>
                ))}
              </div>
            </div>
            <div className={styles.aboutImageContainer}>
              <img src={about} alt="About" className={styles.aboutImage} />
              <div className={styles.aboutBadge}>
                <div className={styles.aboutBadgeNumber}>100%</div>
                <div className={styles.aboutBadgeText}>Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.servicesSection} id="services">
        <div className={styles.servicesContainer}>
          <div className={styles.servicesHeader}>
            <h2 className={styles.servicesTitle}>Our <span className={styles.servicesTitleHighlight}>Services</span></h2>
            <p className={styles.servicesDescription}>Comprehensive dental services for all ages, from preventive to cosmetic care.</p>
          </div>
          <div className={styles.servicesGrid}>
            {['Cleaning', 'Whitening', 'Braces', 'Implants'].map((service, i) => (
              <div key={i} className={styles.serviceCard}>
                <Award className={styles.serviceIcon} />
                <h3 className={styles.serviceTitle}>{service}</h3>
                <p className={styles.serviceDescription}>Top-notch {service.toLowerCase()} service with care and precision.</p>
                <a href="/linhtinh" className={styles.serviceLink}>Learn More</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.doctorsSection} id="doctors">
        <div className={styles.doctorsContainer}>
          <div className={styles.doctorsHeader}>
            <h2 className={styles.doctorsTitle}>Meet Our <span className={styles.doctorsTitleHighlight}>Experts</span></h2>
            <p className={styles.doctorsDescription}>Experienced dentists ready to take care of your smile.</p>
          </div>
          <div className={styles.doctorsGrid}>
            {['Dr. Smith', 'Dr. Tran', 'Dr. Lee'].map((doc, i) => (
              <div key={i} className={styles.doctorCard}>
                <div className={styles.doctorImageContainer}>
                  <img src={`/doctor${i + 1}.jpg`} alt={doc} className={styles.doctorImage} />
                  <div className={styles.doctorImageOverlay}></div>
                </div>
                <div className={styles.doctorInfo}>
                  <h3 className={styles.doctorName}>{doc}</h3>
                  <div className={styles.doctorSpecialty}>Orthodontist</div>
                  <div className={styles.doctorExperience}>10+ years experience</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.testimonialsSection} id="testimonials">
        <div className={styles.testimonialsContainer}>
          <div className={styles.testimonialsHeader}>
            <h2 className={styles.testimonialsTitle}>What Our <span className={styles.testimonialsTitleHighlight}>Patients Say</span></h2>
            <p className={styles.testimonialsDescription}>Real stories from happy smiles.</p>
          </div>
          <div className={styles.testimonialsGrid}>
            {['Very professional', 'Painless process', 'Super clean'].map((comment, i) => (
              <div key={i} className={styles.testimonialCard}>
                <div className={styles.testimonialRating}>{Array(5).fill(0).map((_, j) => <Star key={j} size={16} />)}</div>
                <p className={styles.testimonialComment}>&quot;{comment}&quot;</p>
                <div className={styles.testimonialFooter}>
                  <div className={styles.testimonialName}>Patient {i + 1}</div>
                  <div className={styles.testimonialTreatment}>Teeth Cleaning</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Ready for a Brighter Smile?</h2>
          <p className={styles.ctaDescription}>Book your appointment now and experience top-quality dental care.</p>
          <div className={styles.ctaButtons}>
            <button className={styles.ctaButtonPrimary}>Book appointment</button>
            <button className={styles.ctaButtonSecondary}>Learn more</button>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.footerGrid}>
            <div>
              <div className={styles.footerBrand}>Gentle Care Dental</div>
              <p className={styles.footerDescription}>Your trusted dental clinic for a healthy smile.</p>
              <div className={styles.footerSocial}>
                {['fb', 'tw', 'ig'].map((net, i) => (
                  <div key={i} className={styles.footerSocialIcon}>{net.toUpperCase()}</div>
                ))}
              </div>
            </div>
            <div>
              <div className={styles.footerSectionTitle}>Quick Links</div>
              <div className={styles.footerList}>
                {['About', 'Services', 'Doctors', 'Testimonials'].map((item) => (
                  <a key={item} className={styles.footerListItem} href={`#${item.toLowerCase()}`}>{item}</a>
                ))}
              </div>
            </div>
            <div>
              <div className={styles.footerSectionTitle}>Contact</div>
              <div className={styles.footerContactList}>
                <div className={styles.footerContactItem}><Phone size={18} /> 0909 999 999</div>
                <div className={styles.footerContactItem}><Mail size={18} /> hello@GentleCareDental.com</div>
                <div className={styles.footerContactItem}><MapPin size={18} /> 123 Smile Ave, Hanoi</div>
              </div>
            </div>
            <div>
              <div className={styles.footerSectionTitle}>Newsletter</div>
              <p className={styles.footerNewsletter}>Get updates about new services and offers.</p>
              <div className={styles.footerNewsletterForm}>
                <input type="email" className={styles.footerNewsletterInput} placeholder="Your email" />
                <button className={styles.footerNewsletterButton}>Subscribe</button>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>© 2025 Gentle Care Dental. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
