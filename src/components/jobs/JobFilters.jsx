import React from 'react';
import { Filter, RotateCcw, Search, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import styles from './JobFilters.module.css';

export default function JobFilters({ filters, setFilters, onReset }) {
  const { t } = useLanguage();

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <aside className={styles.filterPanel}>
      <div className={styles.headerRow}>
        <div className={styles.title}>
          <Filter size={15} color="var(--accent-primary)" />
          <span>{t.jobs.filters}</span>
        </div>
        <button type="button" onClick={onReset} className={styles.clearBtn}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <RotateCcw size={11} /> {t.jobs.clearFilters}
          </span>
        </button>
      </div>

      {/* Keywords */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>{t.jobs.searchKeywords}</label>
        <div style={{ position: 'relative' }}>
          <Search
            size={14}
            style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.1rem', fontSize: '0.85rem' }}
            placeholder={t.hero.searchPlaceholder}
            value={filters.search}
            onChange={(e) => handleInputChange('search', e.target.value)}
          />
        </div>
      </div>

      {/* Location */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>{t.jobs.locationLabel}</label>
        <div style={{ position: 'relative' }}>
          <MapPin
            size={14}
            style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.1rem', fontSize: '0.85rem' }}
            placeholder={t.hero.locationPlaceholder}
            value={filters.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
        </div>
      </div>

      {/* Category */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>{t.jobs.categoryLabel}</label>
        <select
          className="form-select"
          style={{ fontSize: '0.85rem' }}
          value={filters.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
        >
          <option value="all">{t.categories.all}</option>
          <option value="software">{t.categories.software}</option>
          <option value="hospitality">{t.categories.hospitality}</option>
          <option value="retail">{t.categories.retail}</option>
          <option value="education">{t.categories.education}</option>
          <option value="salon">{t.categories.salon}</option>
          <option value="customerSupport">{t.categories.customerSupport}</option>
          <option value="healthcare">{t.categories.healthcare}</option>
          <option value="logistics">{t.categories.logistics}</option>
        </select>
      </div>

      {/* Employment Type */}
      <div className={styles.section}>
        <label className={styles.sectionLabel}>{t.jobs.typeLabel}</label>
        <select
          className="form-select"
          style={{ fontSize: '0.85rem' }}
          value={filters.employmentType}
          onChange={(e) => handleInputChange('employmentType', e.target.value)}
        >
          <option value="all">{t.employmentTypes.all}</option>
          <option value="full_time">{t.employmentTypes.full_time}</option>
          <option value="part_time">{t.employmentTypes.part_time}</option>
          <option value="weekend">{t.employmentTypes.weekend}</option>
          <option value="internship">{t.employmentTypes.internship}</option>
          <option value="contract">{t.employmentTypes.contract}</option>
        </select>
      </div>

      {/* Toggles */}
      <div className={styles.section}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={filters.localBusinessOnly}
            onChange={(e) => handleInputChange('localBusinessOnly', e.target.checked)}
          />
          <span>{t.jobs.localBusinessOnly}</span>
        </label>

        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={filters.remoteOnly}
            onChange={(e) => handleInputChange('remoteOnly', e.target.checked)}
          />
          <span>{t.jobs.remoteOnly}</span>
        </label>
      </div>
    </aside>
  );
}
