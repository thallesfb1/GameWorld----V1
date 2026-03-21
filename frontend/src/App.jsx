import { useState, useEffect, useCallback, useMemo } from 'react';
import Globe from './components/Globe.jsx';
import Sidebar from './components/Sidebar.jsx';
import SuggestionModal from './components/SuggestionModal.jsx';
import {
    fetchGames, fetchStats, fetchAnalytics,
    markGamePlayed, unmarkGamePlayed, fetchUserStats,
} from './services/api.js';

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
    useEffect(() => {
        const fn = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
    }, []);
    return isMobile;
}

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

    // Data
    const [games, setGames] = useState([]);
    const [stats, setStats] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [userStats, setUserStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // UI state
    const [selectedGame, setSelectedGame] = useState(null);
    const [theme, setTheme] = useState(() => localStorage.getItem('gw_theme') || 'dark');
    const [mapStyle, setMapStyle] = useState(() => localStorage.getItem('gw_map_style') || 'texture');
    const [showSuggestionModal, setShowSuggestionModal] = useState(false);

    // Sidebar state
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarTab, setSidebarTab] = useState('insights');

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

    // Theme
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

    // Load data
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

    // When a game is clicked, open the sidebar to the Game tab
    const handleGameClick = useCallback((game) => {
        setSelectedGame(game);
        setSidebarTab('game');
        setSidebarOpen(true);
    }, []);

    const handleSidebarClose = useCallback(() => {
        setSidebarOpen(prev => !prev);
    }, []);

    return (
        <div className="app">
            {/* ── Top Nav ──────────────────────────────────────────── */}
            <header className="app-nav">
                {/* Left: sidebar toggle + brand */}
                <div className="nav-left">
                    <button
                        className={`nav-sidebar-toggle ${sidebarOpen ? 'nav-sidebar-toggle--active' : ''}`}
                        onClick={() => setSidebarOpen(o => !o)}
                        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                        title="Toggle sidebar"
                    >
                        <span className="nav-sidebar-toggle-bar" />
                        <span className="nav-sidebar-toggle-bar" />
                        <span className="nav-sidebar-toggle-bar" />
                    </button>
                    <div className="nav-brand">
                        <span className="nav-logo">🌐</span>
                        <span className="nav-title">GameWorld</span>
                    </div>
                    {stats && !isMobile && (
                        <span className="nav-badge">
                            {stats.total_games} games · {stats.countries_count} countries
                        </span>
                    )}
                </div>

                {/* Right: icon actions */}
                <div className="nav-actions">
                    <button
                        className={`nav-icon-btn ${mapStyle === 'lines' ? 'nav-icon-btn--active' : ''}`}
                        onClick={toggleMapStyle}
                        title={mapStyle === 'texture' ? 'Switch to Lines Only' : 'Switch to Texture'}
                        aria-label="Toggle map style"
                    >
                        🗺️
                    </button>
                    <button
                        className="nav-icon-btn"
                        onClick={() => setShowSuggestionModal(true)}
                        title="Suggest a missing game"
                        aria-label="Suggest a game"
                    >
                        💡
                    </button>
                    <button
                        className="nav-icon-btn"
                        onClick={() => {
                            setSidebarTab('insights');
                            setSidebarOpen(true);
                        }}
                        title="My Stats"
                        aria-label="My Stats"
                    >
                        🧑‍🚀
                    </button>
                    <button
                        className="nav-icon-btn"
                        onClick={toggleTheme}
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                </div>
            </header>

            {/* ── Globe ────────────────────────────────────────────── */}
            {loading ? (
                <div className="loading-screen">
                    <div className="spinner" />
                    <p>Loading GameWorld…</p>
                </div>
            ) : error ? (
                <div className="error-screen">
                    <h2>⚠️ Failed to load</h2>
                    <p>{error}</p>
                    <p className="error-hint">
                        Make sure the backend is running: <code>uvicorn app.main:app --reload</code>
                    </p>
                </div>
            ) : (
                <Globe
                    games={filteredGames}
                    selectedGame={selectedGame}
                    onGameClick={handleGameClick}
                    playedGameIds={playedIds}
                    theme={theme}
                    focusGame={focusGame}
                    mapStyle={mapStyle}
                />
            )}

            {/* ── Sidebar ───────────────────────────────────────────── */}
            <Sidebar
                open={sidebarOpen}
                onClose={handleSidebarClose}
                activeTab={sidebarTab}
                onTabChange={tab => { setSidebarTab(tab); setSidebarOpen(true); }}
                // Insights
                analytics={analytics}
                stats={stats}
                userStats={userStats}
                // Filters
                games={games}
                query={searchQuery}
                filters={filters}
                onQueryChange={setSearchQuery}
                onFilterChange={handleFilterChange}
                onClear={handleClearFilters}
                filteredCount={filteredGames.length}
                onSearch={handleSearch}
                // Game detail
                selectedGame={selectedGame}
                isPlayed={selectedGame ? playedIds.includes(selectedGame.id) : false}
                onTogglePlayed={handleTogglePlayed}
                // Analytics filter
                activeFilter={filters}
                onFilter={handleFilterChange}
            />

            {/* ── Suggestion Modal ──────────────────────────────────── */}
            {showSuggestionModal && (
                <SuggestionModal onClose={() => setShowSuggestionModal(false)} />
            )}

            {/* ── Bottom hints ──────────────────────────────────────── */}
            {!loading && !error && (
                <>
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
                </>
            )}
        </div>
    );
}
