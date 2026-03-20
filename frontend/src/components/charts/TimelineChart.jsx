import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, ReferenceLine,
} from 'recharts';

function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        const d = payload[0].payload;
        return (
            <div className="chart-tooltip">
                <p className="chart-tooltip-label">{d.era_label}</p>
                <p className="chart-tooltip-value">{d.count} game{d.count !== 1 ? 's' : ''}</p>
                {d.era_start < 0
                    ? <p className="chart-tooltip-sub">{Math.abs(d.era_start)} BCE</p>
                    : d.era_start < 1800
                        ? <p className="chart-tooltip-sub">~{d.era_start} CE</p>
                        : null}
            </div>
        );
    }
    return null;
}

export default function TimelineChart({ data }) {
    if (!data || data.length === 0) return <div className="chart-empty">No data available</div>;

    return (
        <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data} margin={{ top: 12, right: 8, left: -20, bottom: 60 }}>
                <defs>
                    <linearGradient id="timelineGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0.02} />
                    </linearGradient>
                </defs>
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
                    allowDecimals={false}
                    tick={{ fill: '#aaa', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(108,92,231,0.4)', strokeWidth: 1 }} />
                <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#6C5CE7"
                    strokeWidth={2.5}
                    fill="url(#timelineGrad)"
                    dot={{ r: 4, fill: '#6C5CE7', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#a29bfe', strokeWidth: 0 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
