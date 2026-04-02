import { competencies } from '@/data/competencies';
import { theme } from '@/styles/theme';

const mockValues = [82, 74, 76, 68, 88, 79, 72];
const size = 320;
const center = size / 2;
const radius = 112;
const levels = 5;

const getMockValue = (index: number) => mockValues[index] ?? 0;

const createPolygonPoints = (scale: number) =>
  competencies
    .map((_, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / competencies.length;
      const x = center + Math.cos(angle) * radius * scale;
      const y = center + Math.sin(angle) * radius * scale;
      return `${x},${y}`;
    })
    .join(' ');

const dataPolygon = competencies
  .map((_, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / competencies.length;
    const value = getMockValue(index);
    const x = center + Math.cos(angle) * radius * (value / 100);
    const y = center + Math.sin(angle) * radius * (value / 100);
    return `${x},${y}`;
  })
  .join(' ');

export function RadarChart() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[22px] p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_55%),radial-gradient(circle_at_top,rgba(129,140,248,0.12),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(240,160,48,0.08),transparent_28%)]" />
      <div className="absolute inset-[12%] rounded-full border border-[rgba(201,168,76,0.10)]" />
      <div className="absolute inset-[18%] rounded-full border border-[rgba(201,168,76,0.06)]" />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-3">
        <div className="text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-galgame-gold">Competency Radar</p>
          <h3 className="mt-2 font-title text-xl font-bold text-galgame-gold-light">七维素养魔法阵</h3>
          <p className="mt-1 text-sm text-text-secondary">静态假数据预览，用于强化棋盘中心的科技感与命运感。</p>
        </div>

        <svg viewBox={`0 0 ${size} ${size}`} className="h-[320px] w-[320px] drop-shadow-[0_0_16px_rgba(232,212,139,0.08)]">
          <defs>
            <radialGradient id="radarGlowFill" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="rgba(232,212,139,0.25)" />
              <stop offset="100%" stopColor="rgba(99,102,241,0.04)" />
            </radialGradient>
            <linearGradient id="radarDataStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={theme.colors.goldLight} />
              <stop offset="100%" stopColor={theme.colors.brandOrange} />
            </linearGradient>
            <filter id="outerGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx={center} cy={center} r={radius + 10} fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth="1" />
          <circle cx={center} cy={center} r={radius + 18} fill="none" stroke="rgba(201,168,76,0.06)" strokeWidth="1" />

          {Array.from({ length: levels }, (_, levelIndex) => {
            const scale = (levelIndex + 1) / levels;
            return (
              <polygon
                key={`grid-${scale}`}
                points={createPolygonPoints(scale)}
                fill={levelIndex === levels - 1 ? 'url(#radarGlowFill)' : 'none'}
                stroke="rgba(201,168,76,0.18)"
                strokeWidth="1"
              />
            );
          })}

          {competencies.map((competency, index) => {
            const angle = -Math.PI / 2 + (Math.PI * 2 * index) / competencies.length;
            const lineX = center + Math.cos(angle) * radius;
            const lineY = center + Math.sin(angle) * radius;
            const labelX = center + Math.cos(angle) * (radius + 24);
            const labelY = center + Math.sin(angle) * (radius + 24);
            const color = theme.colors.competency[competency.color];
            return (
              <g key={competency.color}>
                <line
                  x1={center}
                  y1={center}
                  x2={lineX}
                  y2={lineY}
                  stroke="rgba(201,168,76,0.16)"
                  strokeWidth="1"
                />
                <circle cx={lineX} cy={lineY} r="4" fill={color} filter="url(#outerGlow)" />
                <text
                  x={labelX}
                  y={labelY}
                  fill={theme.colors.textPrimary}
                  fontSize="11"
                  fontWeight="600"
                  textAnchor={index === 0 ? 'middle' : labelX < center ? 'end' : 'start'}
                  dominantBaseline="middle"
                >
                  {competency.name}
                </text>
              </g>
            );
          })}

          <polygon
            points={dataPolygon}
            fill="rgba(240,160,48,0.14)"
            stroke="url(#radarDataStroke)"
            strokeWidth="2.5"
            filter="url(#outerGlow)"
          />

          {competencies.map((competency, index) => {
            const angle = -Math.PI / 2 + (Math.PI * 2 * index) / competencies.length;
            const value = getMockValue(index);
            const pointX = center + Math.cos(angle) * radius * (value / 100);
            const pointY = center + Math.sin(angle) * radius * (value / 100);
            const color = theme.colors.competency[competency.color];
            return <circle key={`data-${competency.color}`} cx={pointX} cy={pointY} r="4.5" fill={color} filter="url(#outerGlow)" />;
          })}
        </svg>
      </div>
    </div>
  );
}
