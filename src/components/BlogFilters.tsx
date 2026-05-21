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
        <div className="bf-posts-grid">
          {filtered.map(post => (
            <PostCardReact key={post.id} post={post} />
          ))}
        </div>
      )}

    </div>
  );
}
