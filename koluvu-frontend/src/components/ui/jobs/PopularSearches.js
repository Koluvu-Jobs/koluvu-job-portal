import styles from '@koluvu/styles/home/home.module.css';

export default function PopularSearches({ searches, onSearchClick }) {
  return (
    <div className={styles.popularSearches}>
      <h3>Popular Searches:</h3>
      <div className={styles.tagsContainer}>
        {searches.map((search, index) => (
          <button
            key={index}
            className={styles.tag}
            onClick={() => onSearchClick(search)}
            type="button"
            aria-label={`Search for ${search}`}
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );
}
