import { useState, useEffect, useMemo } from 'react';
import UserStats from './UserStats.jsx';
import ContinentsChart from './charts/ContinentsChart.jsx';
import EraChart from './charts/EraChart.jsx';
import CountryChart from './charts/CountryChart.jsx';
import TimelineChart from './charts/TimelineChart.jsx';

const CONTINENT_EMOJI = {
    Europe: '🇪🇺', Asia: '🌏', Americas: '🌎', Africa: '🌍', Oceania: '🌊',
};

const ERA_COLORS = {
    'Ancient World': '#D4A017',
    'Medieval': '#8B4513',
    'Renaissance': '#9B59B6',
    'Early Modern': '#2980B9',
    'Industrial': '#27AE60',
    'Modern': '#E74C3C',
    'Contemporary': '#6C5CE7',
    'Future': '#00CEC9',
};

function BarItem({ label, percentage, max }) {
    return (
        <div className="sb-bar-row">
            <span className="sb-bar-label">{label}</span>
            <div className="sb-bar-track">
                <div className="sb-bar-fill" style={{ width: `${(percentage / max) * 100}%` }} />
            </div>
            <span className="sb-bar-value">{percentage}%</span>
        </div>
    );
}

// ── INSIGHTS TAB ──────────────────────────────────────────────
function InsightsTab({ analytics, stats, userStats }) {
    const [subTab, setSubTab] = useState('continents');
    return (
        <div className="sb-section">
            {stats && (
                <div className="sb-stats-grid">
                    <div className="sb-stat-card">
                        <span className="sb-stat-value">{stats.total_games}</span>
                        <span className="sb-stat-label">Games</span>
                    </div>
                    <div className="sb-stat-card">
                        <span className="sb-stat-value">{stats.countries_count}</span>
                        <span className="sb-stat-label">Countries</span>
                    </div>
                    <div className="sb-stat-card">
                        <span className="sb-stat-value">{stats.eras_count}</span>
                        <span className="sb-stat-label">Eras</span>
                    </div>
                    <div className="sb-stat-card">
                        <span className="sb-stat-value sb-stat-value--sm">{stats.top_genre}</span>
                        <span className="sb-stat-label">Top Genre</span>
                    </div>
                </div>
            )}

            {analytics && (
                <>
                    <div className="sb-sub-tabs">
                        {['continents', 'eras', 'rankings'].map(t => (
                            <button
                                key={t}
                                className={`sb-sub-tab ${subTab === t ? 'sb-sub-tab--active' : ''}`}
                                onClick={() => setSubTab(t)}
                            >
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                    <div className="sb-sub-content">
                        {subTab === 'continents' && (() => {
                            const max = Math.max(...analytics.continent_distribution.map(d => d.percentage));
                            return analytics.continent_distribution.map(item => (
                                <BarItem key={item.continent} label={item.continent} percentage={item.percentage} max={max} />
                            ));
                        })()}
                        {subTab === 'eras' && (() => {
                            const max = Math.max(...analytics.era_distribution.map(d => d.percentage));
                            return analytics.era_distribution.map(item => (
                                <BarItem key={item.era_label} label={item.era_label} percentage={item.percentage} max={max} />
                            ));
                        })()}
                        {subTab === 'rankings' && (
                            <div className="sb-rankings">
                                {[
                                    { icon: '🏆', label: 'Top Country', value: analytics.top_country },
                                    { icon: '⏳', label: 'Top Era', value: analytics.top_era },
                                    { icon: '🎮', label: 'Top Genre', value: analytics.top_genre },
                                    { icon: '💻', label: 'Top Platform', value: analytics.top_platform },
                                ].map(item => (
                                    <div key={item.label} className="sb-ranking-item">
                                        <span className="sb-ranking-icon">{item.icon}</span>
                                        <div>
                                            <span className="sb-ranking-label">{item.label}</span>
                                            <span className="sb-ranking-value">{item.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {userStats && (
                <div className="sb-my-stats">
                    <div className="sb-section-title">My Stats</div>
                    <div className="sb-user-row">
                        <div className="sb-progress-mini">
                            <svg viewBox="0 0 80 80" className="sb-progress-ring">
                                <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                                <circle
                                    cx="40" cy="40" r="32"
                                    fill="none"
                                    stroke="url(#pg2)"
                                    strokeWidth="8"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 32}`}
                                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - userStats.world_explored_pct / 100)}`}
                                    transform="rotate(-90 40 40)"
                                />
                                <defs>
                                    <linearGradient id="pg2" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#6C5CE7" />
                                        <stop offset="100%" stopColor="#00CEC9" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="sb-progress-label">
                                <span className="sb-progress-pct">{userStats.world_explored_pct}%</span>
                                <span className="sb-progress-sub">explored</span>
                            </div>
                        </div>
                        <div className="sb-user-fav-list">
                            {userStats.total_played > 0 && (
                                <div className="sb-fav-item">
                                    <span className="sb-fav-label">Games Played</span>
                                    <span className="sb-fav-value">{userStats.total_played}</span>
                                </div>
                            )}
                            {userStats.favorite_continent && (
                                <div className="sb-fav-item">
                                    <span className="sb-fav-label">Fav. Continent</span>
                                    <span className="sb-fav-value">{userStats.favorite_continent}</span>
                                </div>
                            )}
                            {userStats.favorite_genre && (
                                <div className="sb-fav-item">
                                    <span className="sb-fav-label">Fav. Genre</span>
                                    <span className="sb-fav-value">{userStats.favorite_genre}</span>
                                </div>
                            )}
                            {userStats.total_played === 0 && (
                                <p className="sb-empty-hint">Mark games as played to see your stats</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── ANALYTICS TAB ─────────────────────────────────────────────
const ANALYTICS_TABS = [
    { id: 'continents', label: 'Continents' },
    { id: 'eras', label: 'Eras' },
    { id: 'countries', label: 'Countries' },
    { id: 'timeline', label: 'Timeline' },
];

function AnalyticsTab({ analytics, activeFilter, onFilter }) {
    const [chartTab, setChartTab] = useState('continents');
    const hasFilter = activeFilter && (activeFilter.continent || activeFilter.era);
    const filterLabel = activeFilter?.continent
        ? `Continent: ${activeFilter.continent}`
        : activeFilter?.era ? `Era: ${activeFilter.era}` : null;

    function handleClearFilter() {
        onFilter('continent', '');
        onFilter('era', '');
    }

    return (
        <div className="sb-section">
            {hasFilter && (
                <div className="sb-active-filter">
                    <span>🎯 {filterLabel}</span>
                    <button className="sb-filter-clear-btn" onClick={handleClearFilter}>✕ Clear</button>
                </div>
            )}
            <div className="sb-chart-tabs">
                {ANALYTICS_TABS.map(t => (
                    <button
                        key={t.id}
                        className={`sb-chart-tab ${chartTab === t.id ? 'sb-chart-tab--active' : ''}`}
                        onClick={() => setChartTab(t.id)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>
            <div className="sb-chart-area">
                {!analytics ? (
                    <div className="sb-chart-empty">Loading…</div>
                ) : (
                    <>
                        {chartTab === 'continents' && (
                            <ContinentsChart
                                data={analytics.continent_distribution}
                                activeFilter={activeFilter?.continent || ''}
                                onFilter={(key, val) => onFilter(key, val)}
                            />
                        )}
                        {chartTab === 'eras' && (
                            <EraChart
                                data={analytics.era_distribution}
                                activeFilter={activeFilter?.era || ''}
                                onFilter={(key, val) => onFilter(key, val)}
                            />
                        )}
                        {chartTab === 'countries' && (
                            <CountryChart data={analytics.country_distribution} />
                        )}
                        {chartTab === 'timeline' && (
                            <TimelineChart data={analytics.timeline} />
                        )}
                    </>
                )}
            </div>
            {(chartTab === 'continents' || chartTab === 'eras') && (
                <p className="sb-chart-hint">💡 Click a segment to filter the globe</p>
            )}
        </div>
    );
}

// ── FILTERS TAB ───────────────────────────────────────────────
function FiltersTab({ games, query, filters, onQueryChange, onFilterChange, onClear, filteredCount, onSearch }) {
    const options = useMemo(() => {
        const eras = [...new Set(games.map(g => g.era_label))].sort();
        const continents = [...new Set(games.map(g => g.continent))].sort();
        const genres = [...new Set(games.flatMap(g => g.genres))].sort();
        const platforms = [...new Set(games.flatMap(g => g.platforms))].sort();
        return { eras, continents, genres, platforms };
    }, [games]);

    const hasActiveFilter = query || filters.era || filters.continent || filters.genre || filters.platform;
    const canSearch = filteredCount === 1 && query.trim().length > 0;

    return (
        <div className="sb-section">
            <div className="sb-search-wrap">
                <span className="sb-search-icon">🔍</span>
                <input
                    id="game-search-input"
                    className="sb-search-input"
                    type="text"
                    placeholder="Search games…"
                    value={query}
                    onChange={e => onQueryChange(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && canSearch && onSearch()}
                    autoComplete="off"
                    spellCheck={false}
                />
                {query && (
                    <button className="sb-search-clear" onClick={() => onQueryChange('')} aria-label="Clear search">✕</button>
                )}
            </div>

            {canSearch && (
                <button id="search-fly-btn" className="sb-fly-btn" onClick={onSearch}>
                    🎯 Fly to Game
                </button>
            )}

            <div className="sb-filters-grid">
                {[
                    { id: 'filter-continent', key: 'continent', label: '🌍 Continent', items: options.continents },
                    { id: 'filter-era', key: 'era', label: '⏳ Era', items: options.eras },
                    { id: 'filter-genre', key: 'genre', label: '🎮 Genre', items: options.genres },
                    { id: 'filter-platform', key: 'platform', label: '🖥 Platform', items: options.platforms },
                ].map(({ id, key, label, items }) => (
                    <select
                        key={key}
                        id={id}
                        className={`sb-filter-select ${filters[key] ? 'sb-filter-select--active' : ''}`}
                        value={filters[key]}
                        onChange={e => onFilterChange(key, e.target.value)}
                    >
                        <option value="">{label}</option>
                        {items.map(item => <option key={item} value={item}>{item}</option>)}
                    </select>
                ))}
            </div>

            <div className="sb-filter-meta">
                <span className={`sb-filter-count ${filteredCount === 0 ? 'sb-filter-count--zero' : filteredCount < games.length ? 'sb-filter-count--filtered' : ''}`}>
                    {filteredCount} / {games.length} games
                </span>
                {hasActiveFilter && (
                    <button id="filter-clear-btn" className="sb-filter-clear" onClick={onClear}>Clear all ✕</button>
                )}
            </div>
        </div>
    );
}

// ── GAME DETAIL TAB ───────────────────────────────────────────
function GameDetailTab({ game, isPlayed, onTogglePlayed }) {
    if (!game) {
        return (
            <div className="sb-section sb-game-empty">
                <div className="sb-game-empty-icon">🌐</div>
                <p>Click any pin on the globe to explore a game</p>
            </div>
        );
    }

    const eraYear = game.era_start < 0
        ? `${Math.abs(game.era_start)} BCE`
        : `${game.era_start} CE`;

    return (
        <div className="sb-game-detail">
            <div className="sb-game-cover-wrap">
                <img
                    src={game.cover_url}
                    alt={game.title}
                    className="sb-game-cover"
                    onError={e => { e.target.src = `https://placehold.co/360x240/1a1a2e/6C5CE7?text=${encodeURIComponent(game.title)}`; }}
                />
                <div className="sb-game-cover-overlay" />
                {game.fictional && <span className="sb-badge sb-badge--fictional">Fictional World</span>}
                {isPlayed && <span className="sb-badge sb-badge--played">✓ Played</span>}
            </div>

            <div className="sb-game-body">
                <h2 className="sb-game-title">{game.title}</h2>

                <div className="sb-game-meta">
                    <div className="sb-meta-item">
                        <span className="sb-meta-icon">📍</span>
                        <div>
                            <span className="sb-meta-label">Location</span>
                            <span className="sb-meta-value">{game.location_name}</span>
                        </div>
                    </div>
                    <div className="sb-meta-item">
                        <span className="sb-meta-icon">{CONTINENT_EMOJI[game.continent] || '🌐'}</span>
                        <div>
                            <span className="sb-meta-label">Country</span>
                            <span className="sb-meta-value">{game.country}</span>
                        </div>
                    </div>
                    <div className="sb-meta-item">
                        <span className="sb-meta-icon">⏳</span>
                        <div>
                            <span className="sb-meta-label">Era</span>
                            <span className="sb-meta-value">{game.era_label} <em className="sb-era-year">({eraYear})</em></span>
                        </div>
                    </div>
                </div>

                {game.description && (
                    <p className="sb-game-description">{game.description}</p>
                )}

                {game.steam_url && (
                    <a href={game.steam_url} target="_blank" rel="noopener noreferrer" className="sb-steam-link">
                        🎮 View on Steam
                    </a>
                )}

                <div className="sb-game-tags">
                    <div className="sb-tags-row">
                        <span className="sb-tags-label">Genres</span>
                        <div className="sb-tags">
                            {game.genres.map(g => <span key={g} className="sb-tag sb-tag--genre">{g}</span>)}
                        </div>
                    </div>
                    <div className="sb-tags-row">
                        <span className="sb-tags-label">Platforms</span>
                        <div className="sb-tags">
                            {game.platforms.map(p => <span key={p} className="sb-tag sb-tag--platform">{p}</span>)}
                        </div>
                    </div>
                </div>

                <button
                    className={`sb-btn-played ${isPlayed ? 'sb-btn-played--active' : ''}`}
                    onClick={() => onTogglePlayed(game.id)}
                >
                    {isPlayed ? '✓ Marked as Played' : '+ Mark as Played'}
                </button>
            </div>
        </div>
    );
}

// ── MAIN SIDEBAR ──────────────────────────────────────────────
const TABS = [
    { id: 'game', label: 'Game', icon: '🎮' },
    { id: 'insights', label: 'Insights', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'filters', label: 'Filters', icon: '🔍' },
];

export default function Sidebar({
    open, onClose, activeTab, onTabChange,
    // Insights
    analytics, stats, userStats,
    // Filters
    games, query, filters, onQueryChange, onFilterChange, onClear, filteredCount, onSearch,
    // Game detail
    selectedGame, isPlayed, onTogglePlayed,
    // Active filter for analytics
    activeFilter, onFilter,
}) {
    return (
        <>
            {/* Backdrop (mobile only) */}
            {open && (
                <div className="sb-backdrop" onClick={onClose} aria-hidden="true" />
            )}

            {/* Toggle tab (left edge, visible when closed on desktop) */}
            {!open && (
                <button className="sb-edge-toggle" onClick={onClose} aria-label="Open sidebar">
                    <span>›</span>
                </button>
            )}

            <aside className={`sidebar ${open ? 'sidebar--open' : ''}`} aria-label="Sidebar">
                {/* Sidebar header */}
                <div className="sb-header">
                    <div className="sb-header-title">
                        <span className="sb-header-icon">
                            {TABS.find(t => t.id === activeTab)?.icon}
                        </span>
                        <span>{TABS.find(t => t.id === activeTab)?.label}</span>
                    </div>
                    <button className="sb-close-btn" onClick={onClose} aria-label="Close sidebar">✕</button>
                </div>

                {/* Tab navigation */}
                <div className="sb-tabs" role="tablist">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            className={`sb-tab ${activeTab === tab.id ? 'sb-tab--active' : ''}`}
                            onClick={() => onTabChange(tab.id)}
                            title={tab.label}
                        >
                            <span className="sb-tab-icon">{tab.icon}</span>
                            <span className="sb-tab-label">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className="sb-content" role="tabpanel">
                    {activeTab === 'insights' && (
                        <InsightsTab analytics={analytics} stats={stats} userStats={userStats} />
                    )}
                    {activeTab === 'analytics' && (
                        <AnalyticsTab analytics={analytics} activeFilter={activeFilter} onFilter={onFilter} />
                    )}
                    {activeTab === 'filters' && (
                        <FiltersTab
                            games={games}
                            query={query}
                            filters={filters}
                            onQueryChange={onQueryChange}
                            onFilterChange={onFilterChange}
                            onClear={onClear}
                            filteredCount={filteredCount}
                            onSearch={onSearch}
                        />
                    )}
                    {activeTab === 'game' && (
                        <GameDetailTab
                            game={selectedGame}
                            isPlayed={isPlayed}
                            onTogglePlayed={onTogglePlayed}
                        />
                    )}
                </div>
            </aside>
        </>
    );
}
