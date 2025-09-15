
import React from 'react';
import { Phone, Mail, MapPin, Clock, Award, Users, Heart, Shield } from 'lucide-react';
import heroImage from '../assets/banner6.png';
import styles from './About.module.css';

const About = () => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <div className={styles.heroGrid}>
            <div className={styles.heroText}>
              <div className={styles.heroTextContent}>
                <div className={styles.badge}>
                  Reputable Dental Clinic
                </div>
                <h1 className={styles.heroTitle}>
                  Gental Care
                  <span className={styles.heroTitleGradient}>
                    Dental
                  </span>
                </h1>
                <p className={styles.heroDescription}>
                  Bring confident smiles and perfect oral health to every family member with modern technology and a team of professional doctors.
                </p>
              </div>
              
              <div className={styles.heroButtons}>
                <button className={styles.primaryButton}>
                  Make an Appointment
                </button>
              </div>

              <div className={styles.heroStats}>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>10+</div>
                  <div className={styles.statLabel}>Years of Experience</div>
                </div>
                <div className={styles.stat}>
                  <div className={styles.statNumber}>5000+</div>
                  <div className={styles.statLabel}>Trusted Customer</div>
                </div>
              </div>
            </div>

            <div className={styles.heroImageContainer}>
              <div className={styles.heroImageOverlay}></div>
              <img 
                src={heroImage} 
                alt="Gental Care Dental"
                className={styles.heroImage}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className={styles.about}>
        <div className={styles.aboutContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              About Gental Care Dental
            </h2>
            <p className={styles.sectionDescription}>
              We are committed to providing high quality dental services with dedicated care and the most advanced technology.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {[
              {
                icon: <Heart className={styles.featureIcon} />,
                title: "Dedicated Care",
                description: "Putting patient comfort and safety first"
              },
              {
                icon: <Award className={styles.featureIcon} />,
                title: "Professional",
                description: "Experienced and well-trained team of doctors"
              },
              {
                icon: <Shield className={styles.featureIcon} />,
                title: "Absolute Safety",
                description: "Strict adherence to hygiene and safety standards"
              },
              {
                icon: <Users className={styles.featureIcon} />,
                title: "Family Service",
                description: "Dental care for all ages"
              }
            ].map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureContent}>
                  <div className={styles.featureIconContainer}>
                    {feature.icon}
                  </div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDescription}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.services}>
        <div className={styles.servicesContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Dental care for all ages
            </h2>
            <p className={styles.sectionDescription}>
              A variety of modern and professional dental services
            </p>
          </div>

          <div className={styles.servicesGrid}>
            {[
              {
                title: "General Examination",
                description: "Regular dental check-ups and care advice",
                price: "From 200.000đ"
              },
              {
                title: "Teeth Whitening",
                description: "Safe, effective and long lasting whitening technology",
                price: "From 1.500.000đ"
              },
              {
                title: "Brace",
                description: "Cosmetic orthodontics with modern technology",
                price: "From 15.000.000đ"
              },
              {
                title: "Dental Implants",
                description: "High quality dental implants from Europe",
                price: "From 12.000.000đ"
              },
              {
                title: "Porcelain Veneers",
                description: "High-end cosmetic porcelain dental restoration",
                price: "From 2.500.000đ"
              },
              {
                title: "Root Canal Treatment",
                description: "Intensive and effective endodontic treatment",
                price: "From 800.000đ"
              }
            ].map((service, index) => (
              <div key={index} className={styles.serviceCard}>
                <div className={styles.serviceContent}>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceDescription}>{service.description}</p>
                  <div className={styles.serviceFooter}>
                    <span className={styles.servicePrice}>{service.price}</span>
                    <button className={styles.consultButton}>
                      Advise
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className={styles.contact}>
        <div className={styles.contactContent}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Contact Us
            </h2>
            <p className={styles.sectionDescription}>
              Book an appointment or free consultation today
            </p>
          </div>

          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <MapPin className={styles.icon} />
                </div>
                <div>
                  <h3 className={styles.contactTitle}>Address</h3>
                  <p className={styles.contactText}>123 ABC Street, District 1, HCMC</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <Phone className={styles.icon} />
                </div>
                <div>
                  <h3 className={styles.contactTitle}>Phone</h3>
                  <p className={styles.contactText}>(028) 1234 5678</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <Mail className={styles.icon} />
                </div>
                <div>
                  <h3 className={styles.contactTitle}>Email</h3>
                  <p className={styles.contactText}>info@gentalcaredental.com</p>
                </div>
              </div>

              <div className={styles.contactItem}>
                <div className={styles.contactIcon}>
                  <Clock className={styles.icon} />
                </div>
                <div>
                  <h3 className={styles.contactTitle}>Working Hours</h3>
                  <div className={styles.workingHours}>
                    <p className={styles.contactText}>Monday - Friday: 8:00 - 20:00</p>
                    <p className={styles.contactText}>Saturday: 8:00 - 17:00</p>
                    <p className={styles.contactText}>Sunday: 9:00 - 16:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.appointmentForm}>
              <div className={styles.formContainer}>
                <h3 className={styles.formTitle}>Make an Appointment</h3>
                <form className={styles.form}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Full Name</label>
                    <input 
                      type="text" 
                      className={styles.formInput}
                      placeholder="Enter your first and last name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Phone number</label>
                    <input 
                      type="tel" 
                      className={styles.formInput}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Caring Service</label>
                    <select className={styles.formSelect}>
                      <option>Select service</option>
                      <option>General examination</option>
                      <option>Teeth whitening</option>
                      <option>Brace</option>
                      <option>Dental Implant</option>
                      <option>Porcelain crowns</option>
                    </select>
                  </div>
                  <button type="submit" className={styles.submitButton}>
                    Book Now
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;