import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Cell,
} from 'recharts';

const BAR_COLORS = [
    '#6C5CE7', '#00CEC9', '#FDCB6E', '#E17055', '#0984E3',
    '#55EFC4', '#FD79A8', '#a29bfe', '#81ecec', '#ffeaa7', '#fab1a0', '#74b9ff',
];

function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        const d = payload[0].payload;
        return (
            <div className="chart-tooltip">
                <p className="chart-tooltip-label">{d.name}</p>
                <p className="chart-tooltip-value">{d.count} games</p>
            </div>
        );
    }
    return null;
}

export default function CountryChart({ data }) {
    if (!data || data.length === 0) return <div className="chart-empty">No data available</div>;

    const sorted = [...data].sort((a, b) => b.count - a.count);

    return (
        <ResponsiveContainer width="100%" height={320}>
            <BarChart
                data={sorted}
                layout="vertical"
                margin={{ top: 4, right: 32, left: 8, bottom: 4 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fill: '#aaa', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    type="category"
                    dataKey="name"
                    width={72}
                    tick={{ fill: '#ddd', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {sorted.map((entry, index) => (
                        <Cell key={entry.name} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
