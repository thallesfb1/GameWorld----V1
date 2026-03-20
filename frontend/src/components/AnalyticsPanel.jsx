import { useState } from 'react';
import ContinentsChart from './charts/ContinentsChart.jsx';
import EraChart from './charts/EraChart.jsx';
import CountryChart from './charts/CountryChart.jsx';
import TimelineChart from './charts/TimelineChart.jsx';

const TABS = [
    { id: 'continents', label: '🌍 Continents' },
    { id: 'eras',       label: '🏛️ Eras' },
    { id: 'countries',  label: '📍 Countries' },
    { id: 'timeline',   label: '⏳ Timeline' },
];

export default function AnalyticsPanel({ analytics, open, onClose, activeFilter, onFilter }) {
    const [activeTab, setActiveTab] = useState('continents');

    const hasFilter = activeFilter && (activeFilter.continent || activeFilter.era);
    const filterLabel = activeFilter?.continent
        ? `Continent: ${activeFilter.continent}`
        : activeFilter?.era
            ? `Era: ${activeFilter.era}`
            : null;

    function handleClearFilter() {
        onFilter('continent', '');
        onFilter('era', '');
    }

    return (
        <>
            {/* Toggle button */}
            <button
                className={`analytics-toggle ${open ? 'analytics-toggle--active' : ''}`}
                onClick={onClose}
                title="Analytics Dashboard"
                aria-label="Toggle analytics panel"
            >
                <span className="analytics-toggle-icon">📈</span>
                <span className="analytics-toggle-label">Analytics</span>
            </button>

            {/* Slide-in panel */}
            <div className={`analytics-panel ${open ? 'analytics-panel--open' : ''}`} role="complementary" aria-label="Analytics Dashboard">
                {/* Header */}
                <div className="analytics-header">
                    <div className="analytics-header-left">
                        <h3>📈 Analytics</h3>
                        {hasFilter && (
                            <span className="active-filter-badge">
                                {filterLabel}
                                <button className="active-filter-clear" onClick={handleClearFilter} title="Clear filter">✕</button>
                            </span>
                        )}
                    </div>
                    <button className="analytics-close" onClick={onClose} aria-label="Close analytics">✕</button>
                </div>

                {/* Tabs */}
                <div className="analytics-tabs" role="tablist">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            className={`analytics-tab ${activeTab === tab.id ? 'analytics-tab--active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Chart area */}
                <div className="analytics-content">
                    {!analytics ? (
                        <div className="chart-empty">Loading…</div>
                    ) : (
                        <>
                            {activeTab === 'continents' && (
                                <ContinentsChart
                                    data={analytics.continent_distribution}
                                    activeFilter={activeFilter?.continent || ''}
                                    onFilter={(key, val) => onFilter(key, val)}
                                />
                            )}
                            {activeTab === 'eras' && (
                                <EraChart
                                    data={analytics.era_distribution}
                                    activeFilter={activeFilter?.era || ''}
                                    onFilter={(key, val) => onFilter(key, val)}
                                />
                            )}
                            {activeTab === 'countries' && (
                                <CountryChart data={analytics.country_distribution} />
                            )}
                            {activeTab === 'timeline' && (
                                <TimelineChart data={analytics.timeline} />
                            )}
                        </>
                    )}
                </div>

                {/* Footer hint */}
                {(activeTab === 'continents' || activeTab === 'eras') && (
                    <p className="analytics-hint">
                        💡 Click a segment to filter the globe
                    </p>
                )}
            </div>
        </>
    );
}
