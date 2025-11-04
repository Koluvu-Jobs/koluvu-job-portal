import styles from '@koluvu/styles/home/home.module.css';

export default function JobCard({ job, highlighted = false }) {
  return (
    <div className={`${styles.jobCard} ${highlighted ? styles.highlighted : ''}`}>
      {job.badge && <span className={styles.jobBadge}>{job.badge}</span>}
      <div className={styles.companyLogo}>
        {/* Company logo image */}
      </div>
      <div className={styles.jobDetails}>
        <h4>{job.title}</h4>
        <p className={styles.company}>{job.company}</p>
        <div className={styles.jobMeta}>
          <span><i className="fas fa-map-marker-alt"></i> {job.location}</span>
          <span><i className="fas fa-clock"></i> {job.type}</span>
          <span><i className="fas fa-money-bill-wave"></i> {job.salary}</span>
        </div>
      </div>
      <button className={styles.applyButton}>Apply Now</button>
    </div>
  );
}
