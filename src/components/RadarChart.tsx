import { competencies } from '@/data/competencies';
import { theme } from '@/styles/theme';

const getMockValue = (index: number) => [74, 66, 82, 63, 78, 72, 69][index] ?? 70;

export function RadarChart() {
  const size = 260;
  const center = size / 2;
  const radius = 84;
  const rings = [0.2, 0.4, 0.6, 0.8, 1];

  const dataPolygon = competencies
    .map((competency, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / competencies.length;
      const value = getMockValue(index);
      const x = center + Math.cos(angle) * radius * (value / 100);
      const y = center + Math.sin(angle) * radius * (value / 100);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute inset-6 rounded-full border border-sky-100/80" />
      <div className="absolute inset-10 rounded-full border border-indigo-100/80" />
      <svg viewBox={`0 0 ${size} ${size}`} className="h-full max-h-[320px] w-full max-w-[320px] drop-shadow-[0_12px_24px_rgba(91,141,239,0.12)]">
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(91,141,239,0.32)" />
            <stop offset="100%" stopColor="rgba(139,92,246,0.18)" />
          </linearGradient>
        </defs>

        {rings.map((ring) => {
          const points = competencies
            .map((_, index) => {
              const angle = -Math.PI / 2 + (Math.PI * 2 * index) / competencies.length;
              const x = center + Math.cos(angle) * radius * ring;
              const y = center + Math.sin(angle) * radius * ring;
              return `${x},${y}`;
            })
            .join(' ');
          return <polygon key={ring} points={points} fill="none" stroke="rgba(148,163,184,0.24)" strokeWidth="1" />;
        })}

        {competencies.map((competency, index) => {
          const angle = -Math.PI / 2 + (Math.PI * 2 * index) / competencies.length;
          const lineX = center + Math.cos(angle) * radius;
          const lineY = center + Math.sin(angle) * radius;
          const labelX = center + Math.cos(angle) * (radius + 20);
          const labelY = center + Math.sin(angle) * (radius + 20);
          const color = theme.colors.competency[competency.color];
          return (
            <g key={competency.color}>
              <line x1={center} y1={center} x2={lineX} y2={lineY} stroke="rgba(148,163,184,0.24)" strokeWidth="1" />
              <circle cx={lineX} cy={lineY} r="4" fill={color} />
              <text
                x={labelX}
                y={labelY}
                fill={theme.colors.textSecondary}
                fontSize="10"
                fontWeight="600"
                textAnchor={index === 0 ? 'middle' : labelX < center ? 'end' : 'start'}
                dominantBaseline="middle"
              >
                {competency.name}
              </text>
            </g>
          );
        })}

        <polygon points={dataPolygon} fill="url(#radarGradient)" stroke="rgba(91,141,239,0.7)" strokeWidth="2.5" />
        {competencies.map((competency, index) => {
          const angle = -Math.PI / 2 + (Math.PI * 2 * index) / competencies.length;
          const value = getMockValue(index);
          const pointX = center + Math.cos(angle) * radius * (value / 100);
          const pointY = center + Math.sin(angle) * radius * (value / 100);
          return <circle key={`point-${competency.color}`} cx={pointX} cy={pointY} r="4.5" fill={theme.colors.competency[competency.color]} />;
        })}
      </svg>
    </div>
  );
}
