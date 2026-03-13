export default function MobileMenu({
    open,
    onClose,
    stats,
    theme,
    mapStyle,
    toggleTheme,
    toggleMapStyle,
    onShowStats,
}) {
    return (
        <>
            {/* Backdrop */}
            <div
                className={`mobile-menu-backdrop ${open ? 'mobile-menu-backdrop--open' : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Slide-down panel */}
            <div className={`mobile-menu ${open ? 'mobile-menu--open' : ''}`} role="dialog" aria-modal="true">

                {/* Stats badge */}
                {stats && (
                    <div className="mobile-menu-stats">
                        <span className="mobile-menu-stat">
                            <span className="mobile-menu-stat-value">{stats.total_games}</span>
                            <span className="mobile-menu-stat-label">Games</span>
                        </span>
                        <span className="mobile-menu-stat-divider" />
                        <span className="mobile-menu-stat">
                            <span className="mobile-menu-stat-value">{stats.countries_count}</span>
                            <span className="mobile-menu-stat-label">Countries</span>
                        </span>
                        <span className="mobile-menu-stat-divider" />
                        <span className="mobile-menu-stat">
                            <span className="mobile-menu-stat-value">{stats.eras_count}</span>
                            <span className="mobile-menu-stat-label">Eras</span>
                        </span>
                    </div>
                )}

                <div className="mobile-menu-divider" />

                {/* Actions */}
                <button
                    className="mobile-menu-item"
                    onClick={() => { toggleTheme(); onClose(); }}
                >
                    <span className="mobile-menu-item-icon">
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </span>
                    <span className="mobile-menu-item-label">
                        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                    <span className="mobile-menu-item-arrow">›</span>
                </button>

                <button
                    className={`mobile-menu-item ${mapStyle === 'lines' ? 'mobile-menu-item--active' : ''}`}
                    onClick={() => { toggleMapStyle(); onClose(); }}
                >
                    <span className="mobile-menu-item-icon">🗺️</span>
                    <span className="mobile-menu-item-label">
                        Map Texture: <strong>{mapStyle === 'texture' ? 'ON' : 'OFF'}</strong>
                    </span>
                    <span className={`mobile-menu-item-pill ${mapStyle === 'texture' ? 'mobile-menu-item-pill--on' : 'mobile-menu-item-pill--off'}`}>
                        {mapStyle === 'texture' ? 'ON' : 'OFF'}
                    </span>
                </button>

                <button
                    className="mobile-menu-item"
                    onClick={() => { onShowStats(); onClose(); }}
                >
                    <span className="mobile-menu-item-icon">🧑‍🚀</span>
                    <span className="mobile-menu-item-label">My Stats</span>
                    <span className="mobile-menu-item-arrow">›</span>
                </button>
            </div>
        </>
    );
}
