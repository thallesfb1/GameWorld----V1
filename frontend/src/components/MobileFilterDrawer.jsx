import { useMemo } from 'react';

export default function MobileFilterDrawer({
    open,
    onClose,
    games,
    query,
    filters,
    onQueryChange,
    onFilterChange,
    onClear,
    filteredCount,
    onSearch,
}) {
    const options = useMemo(() => {
        const eras = [...new Set(games.map(g => g.era_label))].sort();
        const continents = [...new Set(games.map(g => g.continent))].sort();
        const genres = [...new Set(games.flatMap(g => g.genres))].sort();
        const platforms = [...new Set(games.flatMap(g => g.platforms))].sort();
        return { eras, continents, genres, platforms };
    }, [games]);

    const hasActiveFilter = query || filters.era || filters.continent || filters.genre || filters.platform;
    const canSearch = filteredCount === 1 && query.trim().length > 0;

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && canSearch) { onSearch(); onClose(); }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`mobile-drawer-backdrop ${open ? 'mobile-drawer-backdrop--open' : ''}`}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Slide-up bottom sheet */}
            <div
                className={`mobile-filter-drawer ${open ? 'mobile-filter-drawer--open' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label="Search and filters"
            >
                {/* Drag handle */}
                <div className="mobile-drawer-handle" />

                <div className="mobile-drawer-header">
                    <span className="mobile-drawer-title">Filter Games</span>
                    <button className="mobile-drawer-close" onClick={onClose} aria-label="Close">✕</button>
                </div>

                {/* Search */}
                <div className="mobile-drawer-search">
                    <span className="mobile-drawer-search-icon">🔍</span>
                    <input
                        id="mobile-game-search"
                        className="mobile-drawer-search-input"
                        type="text"
                        placeholder="Search games…"
                        value={query}
                        onChange={e => onQueryChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoComplete="off"
                        spellCheck={false}
                    />
                    {query && (
                        <button
                            className="mobile-drawer-search-clear"
                            onClick={() => onQueryChange('')}
                            aria-label="Clear search"
                        >✕</button>
                    )}
                </div>

                {/* Fly-to button */}
                {canSearch && (
                    <button
                        className="mobile-drawer-fly-btn"
                        onClick={() => { onSearch(); onClose(); }}
                    >
                        🎯 Fly to "{query}"
                    </button>
                )}

                {/* Filter grid */}
                <div className="mobile-drawer-filters">
                    <select
                        id="mobile-filter-continent"
                        className={`mobile-filter-select ${filters.continent ? 'mobile-filter-select--active' : ''}`}
                        value={filters.continent}
                        onChange={e => onFilterChange('continent', e.target.value)}
                    >
                        <option value="">🌍 Continent</option>
                        {options.continents.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <select
                        id="mobile-filter-era"
                        className={`mobile-filter-select ${filters.era ? 'mobile-filter-select--active' : ''}`}
                        value={filters.era}
                        onChange={e => onFilterChange('era', e.target.value)}
                    >
                        <option value="">⏳ Era</option>
                        {options.eras.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>

                    <select
                        id="mobile-filter-genre"
                        className={`mobile-filter-select ${filters.genre ? 'mobile-filter-select--active' : ''}`}
                        value={filters.genre}
                        onChange={e => onFilterChange('genre', e.target.value)}
                    >
                        <option value="">🎮 Genre</option>
                        {options.genres.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>

                    <select
                        id="mobile-filter-platform"
                        className={`mobile-filter-select ${filters.platform ? 'mobile-filter-select--active' : ''}`}
                        value={filters.platform}
                        onChange={e => onFilterChange('platform', e.target.value)}
                    >
                        <option value="">🖥 Platform</option>
                        {options.platforms.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>

                {/* Footer: count + clear */}
                <div className="mobile-drawer-footer">
                    <span className="mobile-drawer-count">
                        <span className={
                            filteredCount === 0 ? 'filter-count--zero'
                            : filteredCount < games.length ? 'filter-count--filtered'
                            : ''
                        }>
                            {filteredCount}
                        </span>
                        {' '}/ {games.length} games
                    </span>

                    {hasActiveFilter && (
                        <button className="mobile-drawer-clear" onClick={onClear}>
                            Clear all ✕
                        </button>
                    )}

                    <button className="mobile-drawer-done" onClick={onClose}>
                        Done
                    </button>
                </div>
            </div>
        </>
    );
}
