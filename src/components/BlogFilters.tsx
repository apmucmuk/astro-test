import { useState, useMemo } from 'react';
import {
  categoryLabels,
  typeLabels,
  audienceLabels,
} from '../lib/labels';

interface Post {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  category: string;
  type: string;
  audience: string;
  stage: string;
  author: string;
}

interface Props {
  posts: Post[];
}

type FilterKey = 'category' | 'type' | 'audience';

const filterGroups: { key: FilterKey; label: string; options: Record<string, string> }[] = [
  { key: 'category', label: 'Kategoria', options: categoryLabels },
  { key: 'type',     label: 'Typ',       options: typeLabels },
  { key: 'audience', label: 'Odbiorca',  options: audienceLabels },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function BadgeInline({ label, cls }: { label: string; cls: string }) {
  return <span className={`badge ${cls}`}>{label}</span>;
}

function PostCardReact({ post }: { post: Post }) {
  return (
    <article className="post-card">
      <div className="card-badges">
        <BadgeInline label={categoryLabels[post.category] ?? post.category} cls="badge--category" />
        <BadgeInline label={typeLabels[post.type] ?? post.type} cls="badge--type" />
        <BadgeInline label={audienceLabels[post.audience] ?? post.audience} cls="badge--audience" />
      </div>
      <h2 className="card-title">
        <a href={`/blog/${post.id}`}>{post.title}</a>
      </h2>
      <p className="card-desc">{post.description}</p>
      <footer className="card-footer">
        <time dateTime={post.pubDate} className="card-date">
          {formatDate(post.pubDate)}
        </time>
        <a href={`/blog/${post.id}`} className="card-link">
          Czytaj artykuł →
        </a>
      </footer>
    </article>
  );
}

export default function BlogFilters({ posts }: Props) {
  const [active, setActive] = useState<Record<FilterKey, string>>({
    category: '',
    type: '',
    audience: '',
  });

  const filtered = useMemo(() => {
    return posts.filter(p =>
      (!active.category || p.category === active.category) &&
      (!active.type     || p.type     === active.type)     &&
      (!active.audience || p.audience === active.audience)
    );
  }, [posts, active]);

  function toggle(key: FilterKey, value: string) {
    setActive(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }));
  }

  function reset() {
    setActive({ category: '', type: '', audience: '' });
  }

  const hasActive = Object.values(active).some(Boolean);

  return (
    <div className="filters-root">
      <div className="filters-bar">
        {filterGroups.map(group => (
          <div key={group.key} className="filter-group">
            <span className="filter-group-label">{group.label}:</span>
            <div className="filter-btns">
              {Object.entries(group.options).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => toggle(group.key, val)}
                  className={`filter-btn filter-btn--${group.key} ${active[group.key] === val ? 'is-active' : ''}`}
                  aria-pressed={active[group.key] === val}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ))}

        {hasActive && (
          <button onClick={reset} className="filter-reset" aria-label="Wyczyść filtry">
            ✕ Wyczyść
          </button>
        )}
      </div>

      <p className="filter-count">
        {filtered.length === posts.length
          ? `Wszystkie artykuły (${posts.length})`
          : `${filtered.length} z ${posts.length} artykułów`}
      </p>

      {filtered.length === 0 ? (
        <div className="filter-empty">
          <p>Brak artykułów dla wybranych filtrów.</p>
          <button onClick={reset} className="filter-reset-inline">Wyczyść filtry</button>
        </div>
      ) : (
        <div className="posts-grid">
          {filtered.map(post => (
            <PostCardReact key={post.id} post={post} />
          ))}
        </div>
      )}

      <style>{`
        .filters-root { display: flex; flex-direction: column; gap: 1.5rem; }

        .filters-bar {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          padding: 1.25rem;
          background: var(--clr-bg-alt);
          border: 1px solid var(--clr-border);
          border-radius: 0.75rem;
        }

        .filter-group { display: flex; align-items: flex-start; gap: 0.75rem; flex-wrap: wrap; }

        .filter-group-label {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--clr-text-muted);
          padding-top: 0.35rem;
          white-space: nowrap;
          min-width: 5rem;
        }

        .filter-btns { display: flex; flex-wrap: wrap; gap: 0.5rem; }

        .filter-btn {
          padding: 0.25em 0.75em;
          border-radius: 0.25rem;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          border: 1.5px solid transparent;
          transition: all 0.15s;
          background: white;
        }

        .filter-btn--category { border-color: #93c5fd; color: #1d4ed8; }
        .filter-btn--category.is-active { background: #dbeafe; border-color: #1d4ed8; }

        .filter-btn--type { border-color: #86efac; color: #15803d; }
        .filter-btn--type.is-active { background: #dcfce7; border-color: #15803d; }

        .filter-btn--audience { border-color: #fde68a; color: #92400e; }
        .filter-btn--audience.is-active { background: #fef9c3; border-color: #92400e; }

        .filter-btn:hover { opacity: 0.85; }

        .filter-reset {
          align-self: flex-start;
          background: none;
          border: none;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--clr-text-muted);
          cursor: pointer;
          padding: 0.2em 0.5em;
          border-radius: 0.25rem;
        }
        .filter-reset:hover { color: var(--clr-text); background: var(--clr-border); }

        .filter-count {
          font-size: 0.875rem;
          color: var(--clr-text-muted);
          font-weight: 500;
        }

        .posts-grid {
          display: grid;
          gap: 1.25rem;
          grid-template-columns: 1fr;
        }

        @media (min-width: 640px) {
          .posts-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (min-width: 1024px) {
          .posts-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .filter-empty {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--clr-text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .filter-reset-inline {
          background: var(--clr-primary);
          color: white;
          border: none;
          padding: 0.5rem 1.25rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
