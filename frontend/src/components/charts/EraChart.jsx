import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell,
} from 'recharts';

const ERA_COLORS = [
    '#6C5CE7', '#00CEC9', '#E17055', '#0984E3', '#FDCB6E',
    '#FD79A8', '#a29bfe', '#55EFC4', '#fab1a0', '#74b9ff', '#ffeaa7', '#fd79a8',
];

function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        const d = payload[0].payload;
        return (
            <div className="chart-tooltip">
                <p className="chart-tooltip-label">{d.era_label}</p>
                <p className="chart-tooltip-value">{d.count} games · {d.percentage}%</p>
            </div>
        );
    }
    return null;
}

export default function EraChart({ data, activeFilter, onFilter }) {
    if (!data || data.length === 0) return <div className="chart-empty">No data available</div>;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 16, right: 8, left: -20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis
                    dataKey="era_label"
                    tick={{ fill: '#aaa', fontSize: 10 }}
                    angle={-40}
                    textAnchor="end"
                    interval={0}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    tick={{ fill: '#aaa', fontSize: 10 }}
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar
                    dataKey="count"
                    radius={[6, 6, 0, 0]}
                    onClick={(entry) => onFilter('era', entry.era_label === activeFilter ? '' : entry.era_label)}
                    style={{ cursor: 'pointer' }}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={entry.era_label}
                            fill={ERA_COLORS[index % ERA_COLORS.length]}
                            opacity={!activeFilter || activeFilter === entry.era_label ? 1 : 0.3}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}

