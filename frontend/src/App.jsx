import { useState, useEffect, useCallback, useMemo } from 'react';
import Globe from './components/Globe.jsx';
import GameModal from './components/GameModal.jsx';
import InsightsPanel from './components/InsightsPanel.jsx';
import UserStats from './components/UserStats.jsx';
import SearchFilter from './components/SearchFilter.jsx';
import MobileMenu from './components/MobileMenu.jsx';
import MobileFilterDrawer from './components/MobileFilterDrawer.jsx';
import {
    fetchGames, fetchStats, fetchAnalytics,
    markGamePlayed, unmarkGamePlayed, fetchUserStats,
} from './services/api.js';

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);
    useEffect(() => {
        const fn = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
    }, []);
    return isMobile;
}

// Persistent anonymous user ID
function getUserId() {
    let id = localStorage.getItem('gw_user_id');
    if (!id) {
        id = 'user_' + Math.random().toString(36).slice(2, 10);
        localStorage.setItem('gw_user_id', id);
    }
    return id;
}
const USER_ID = getUserId();

export default function App() {
    const isMobile = useIsMobile();
    const [games, setGames] = useState([]);
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [selectedGame, setSelectedGame] = useState(null);
    const [userStats, setUserStats] = useState(null);
    const [showUserStats, setShowUserStats] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState(() => localStorage.getItem('gw_theme') || 'dark');
    const [mapStyle, setMapStyle] = useState(() => localStorage.getItem('gw_map_style') || 'texture');

    // Mobile UI state
    const [menuOpen, setMenuOpen] = useState(false);
    const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

    // Search & filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({ era: '', continent: '', genre: '', platform: '' });

    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleClearFilters = useCallback(() => {
        setSearchQuery('');
        setFilters({ era: '', continent: '', genre: '', platform: '' });
    }, []);

    const filteredGames = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        return games.filter(g => {
            if (q && !g.title.toLowerCase().includes(q)) return false;
            if (filters.continent && g.continent !== filters.continent) return false;
            if (filters.era && g.era_label !== filters.era) return false;
            if (filters.genre && !g.genres.includes(filters.genre)) return false;
            if (filters.platform && !g.platforms.includes(filters.platform)) return false;
            return true;
        });
    }, [games, searchQuery, filters]);

    const [focusGame, setFocusGame] = useState(null);
    const handleSearch = useCallback(() => {
        if (filteredGames.length === 1) {
            setFocusGame({ ...filteredGames[0], _ts: Date.now() });
        }
    }, [filteredGames]);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('gw_theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
    const toggleMapStyle = () => setMapStyle(s => {
        const next = s === 'texture' ? 'lines' : 'texture';
        localStorage.setItem('gw_map_style', next);
        return next;
    });

    useEffect(() => {
        Promise.all([fetchGames(), fetchStats(), fetchAnalytics()])
            .then(([g, s, a]) => { setGames(g); setStats(s); setAnalytics(a); setLoading(false); })
            .catch(err => { setError(err.message); setLoading(false); });
    }, []);

    const refreshUserStats = useCallback(() => {
        fetchUserStats(USER_ID).then(setUserStats).catch(console.error);
    }, []);

    useEffect(() => { refreshUserStats(); }, [refreshUserStats]);

    const playedIds = userStats?.played_game_ids || [];

    const handleTogglePlayed = useCallback(async (gameId) => {
        try {
            if (playedIds.includes(gameId)) await unmarkGamePlayed(USER_ID, gameId);
            else await markGamePlayed(USER_ID, gameId);
            refreshUserStats();
        } catch (e) { console.error(e); }
    }, [playedIds, refreshUserStats]);

    // Close menu when switching to desktop
    useEffect(() => {
        if (!isMobile) { setMenuOpen(false); setFilterDrawerOpen(false); }
    }, [isMobile]);

    const hasActiveFilter = searchQuery || filters.era || filters.continent || filters.genre || filters.platform;

    return (
        <div className="app">
            <header className="app-header">
                <div className="header-brand">
                    <span className="header-logo">🌐</span>
                    <span className="header-title">GameWorld</span>
                </div>

                {/* Desktop-only elements */}
                {!isMobile && (
                    <>
                        <p className="header-subtitle">Explore video games mapped across history &amp; geography</p>
                        <div className="header-actions">
                            {stats && (
                                <span className="header-badge">
                                    {stats.total_games} games · {stats.countries_count} countries · {stats.eras_count} eras
                                </span>
                            )}
                            <button
                                className="btn-theme"
                                onClick={toggleTheme}
                                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? '☀️' : '🌙'}
                            </button>
                            <button
                                className={`btn-map-style ${mapStyle === 'lines' ? 'btn-map-style--lines' : ''}`}
                                onClick={toggleMapStyle}
                                title={mapStyle === 'texture' ? 'Switch to Lines Only' : 'Switch to Texture'}
                                aria-label="Toggle map style"
                            >
                                🗺️ <span>Texture: {mapStyle === 'texture' ? 'ON' : 'OFF'}</span>
                            </button>
                            <button className="btn-user" onClick={() => setShowUserStats(s => !s)} title="My Stats">
                                🧑‍🚀 My Stats
                            </button>
                        </div>
                    </>
                )}

                {/* Mobile-only: hamburger button */}
                {isMobile && (
                    <button
                        id="hamburger-btn"
                        className={`hamburger-btn ${menuOpen ? 'hamburger-btn--open' : ''}`}
                        onClick={() => setMenuOpen(o => !o)}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={menuOpen}
                    >
                        <span className="hamburger-bar" />
                        <span className="hamburger-bar" />
                        <span className="hamburger-bar" />
                    </button>
                )}
            </header>

            {/* Mobile dropdown menu */}
            {isMobile && (
                <MobileMenu
                    open={menuOpen}
                    onClose={() => setMenuOpen(false)}
                    stats={stats}
                    theme={theme}
                    mapStyle={mapStyle}
                    toggleTheme={toggleTheme}
                    toggleMapStyle={toggleMapStyle}
                    onShowStats={() => setShowUserStats(s => !s)}
                />
            )}

            {/* Desktop search/filter bar */}
            {!isMobile && !loading && !error && (
                <SearchFilter
                    games={games}
                    query={searchQuery}
                    filters={filters}
                    onQueryChange={setSearchQuery}
                    onFilterChange={handleFilterChange}
                    onClear={handleClearFilters}
                    filteredCount={filteredGames.length}
                    onSearch={handleSearch}
                />
            )}

            {loading ? (
                <div className="loading-screen"><div className="spinner" /><p>Loading GameWorld…</p></div>
            ) : error ? (
                <div className="error-screen">
                    <h2>⚠️ Failed to load</h2><p>{error}</p>
                    <p className="error-hint">Make sure the backend is running: <code>uvicorn app.main:app --reload</code></p>
                </div>
            ) : (
                <Globe
                    games={filteredGames}
                    selectedGame={selectedGame}
                    onGameClick={setSelectedGame}
                    playedGameIds={playedIds}
                    theme={theme}
                    focusGame={focusGame}
                    mapStyle={mapStyle}
                />
            )}

            {selectedGame && (
                <GameModal
                    game={selectedGame}
                    onClose={() => setSelectedGame(null)}
                    isPlayed={playedIds.includes(selectedGame.id)}
                    onTogglePlayed={handleTogglePlayed}
                />
            )}

            <InsightsPanel analytics={analytics} stats={stats} theme={theme} />

            {showUserStats && (
                <div className="panel-backdrop" onClick={() => setShowUserStats(false)}>
                    <div onClick={e => e.stopPropagation()}>
                        <UserStats userStats={userStats} onClose={() => setShowUserStats(false)} />
                    </div>
                </div>
            )}

            <div className="controls-hint">
                {isMobile ? (
                    <>
                        <span>👆 <kbd>Drag</kbd> Rotate</span>
                        <span>🤏 <kbd>Pinch</kbd> Zoom</span>
                        <span><kbd>Tap pin</kbd> Open game</span>
                    </>
                ) : (
                    <>
                        <span>🖱 <kbd>Drag</kbd> Rotate</span>
                        <span><kbd>Right-Drag</kbd> Pan</span>
                        <span><kbd>Scroll</kbd> Zoom</span>
                        <span><kbd>Click pin</kbd> Open game</span>
                    </>
                )}
            </div>

            <div className="legend">
                <span className="legend-dot" style={{ background: '#00FF88' }} />
                <span>Played</span>
                <span className="legend-dot legend-dot--era" />
                <span>Era Color</span>
            </div>

            {/* Mobile bottom navigation bar */}
            {isMobile && !loading && !error && (
                <nav className="mobile-bottom-bar" aria-label="Mobile navigation">
                    <button
                        id="mobile-search-btn"
                        className={`mobile-bottom-btn ${filterDrawerOpen ? 'mobile-bottom-btn--active' : ''} ${hasActiveFilter ? 'mobile-bottom-btn--filtered' : ''}`}
                        onClick={() => setFilterDrawerOpen(o => !o)}
                        aria-label="Search and filter games"
                    >
                        <span className="mobile-bottom-btn-icon">🔍</span>
                        <span className="mobile-bottom-btn-label">
                            Search
                            {hasActiveFilter && <span className="mobile-bottom-btn-dot" />}
                        </span>
                    </button>

                    <button
                        id="mobile-insights-btn"
                        className="mobile-bottom-btn"
                        onClick={() => {
                            // Trigger the InsightsPanel toggle via a custom event
                            window.dispatchEvent(new CustomEvent('gw:toggle-insights'));
                        }}
                        aria-label="Open insights panel"
                    >
                        <span className="mobile-bottom-btn-icon">📊</span>
                        <span className="mobile-bottom-btn-label">Insights</span>
                    </button>
                </nav>
            )}

            {/* Mobile filter drawer */}
            {isMobile && !loading && !error && (
                <MobileFilterDrawer
                    open={filterDrawerOpen}
                    onClose={() => setFilterDrawerOpen(false)}
                    games={games}
                    query={searchQuery}
                    filters={filters}
                    onQueryChange={setSearchQuery}
                    onFilterChange={handleFilterChange}
                    onClear={handleClearFilters}
                    filteredCount={filteredGames.length}
                    onSearch={handleSearch}
                />
            )}
        </div>
    );
}
