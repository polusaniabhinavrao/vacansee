import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './StaticPages.module.css';

export default function ContactPage() {
  const { language } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="page-wrapper">
      <div className={`container ${styles.staticContainer}`}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            {language === 'te' ? 'మమ్మల్ని సంప్రదించండి' : 'Contact Vacansee'}
          </h1>
          <p className={styles.pageSubtitle}>
            {language === 'te'
              ? 'వ్యాపార భాగస్వామ్యాలు, ప్రశ్నలు లేదా సహాయం కోసం మా బృందానికి సందేశం పంపండి.'
              : 'Have questions, employer partnership requests, or feedback? Reach out to our community team.'}
          </p>
        </div>

        <div className="grid-2" style={{ alignItems: 'start', marginBottom: '2rem' }}>
          {/* Contact Details */}
          <div className={styles.contentBlock} style={{ marginBottom: 0 }}>
            <h2>Information</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <MapPin size={18} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Headquarters:</strong>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    HITEC City, Hyderabad, Telangana 500081
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Mail size={18} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Support Desk:</strong>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    support@vacansee.demo
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <Phone size={18} color="var(--accent-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Helpline:</strong>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    +91 98480 12345 (Mon - Sat, 9 AM - 6 PM)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Message Form */}
          <div className={styles.contactFormCard}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle2 size={44} color="var(--accent-secondary)" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  Thank you for your message
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  Our team will follow up within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Send a Message</h3>
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    rows={4}
                    required
                    className="form-textarea"
                    placeholder="Tell us about your requirement or question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Send size={14} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
