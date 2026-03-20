import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#6C5CE7', '#00CEC9', '#FDCB6E', '#E17055', '#0984E3', '#55EFC4', '#FD79A8'];

const RADIAN = Math.PI / 180;
function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) {
    if (percentage < 6) return null;
    const r = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
            {`${percentage}%`}
        </text>
    );
}

function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        const { name, value, payload: p } = payload[0];
        return (
            <div className="chart-tooltip">
                <p className="chart-tooltip-label">{name}</p>
                <p className="chart-tooltip-value">{value} games · {p.percentage}%</p>
            </div>
        );
    }
    return null;
}

export default function ContinentsChart({ data, activeFilter, onFilter }) {
    if (!data || data.length === 0) return <div className="chart-empty">No data available</div>;

    const chartData = data.map((d) => ({
        name: d.continent,
        value: d.count,
        percentage: d.percentage,
    }));

    return (
        <ResponsiveContainer width="100%" height={280}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={45}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={CustomLabel}
                    onClick={(entry) => onFilter('continent', entry.name === activeFilter ? '' : entry.name)}
                    style={{ cursor: 'pointer' }}
                >
                    {chartData.map((entry, index) => (
                        <Cell
                            key={entry.name}
                            fill={COLORS[index % COLORS.length]}
                            opacity={!activeFilter || activeFilter === entry.name ? 1 : 0.35}
                            stroke={activeFilter === entry.name ? '#fff' : 'transparent'}
                            strokeWidth={2}
                        />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    formatter={(value) => <span style={{ color: '#ccc', fontSize: 12 }}>{value}</span>}
                    iconSize={10}
                    iconType="circle"
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
