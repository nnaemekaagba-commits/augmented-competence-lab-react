export function AcMark({ size = 24 }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="27" fill="none" stroke="#1e3a8a" strokeWidth="2.5" opacity="0.15" />
      <path d="M14 42 L24 16 L34 42 M18 33 H30" stroke="#1e3a8a" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M34 42 C34 30 44 30 44 20 C44 14 40 12 37 14" stroke="#3d63e0" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <circle cx="37" cy="14" r="2.6" fill="#3d63e0" />
    </svg>
  );
}

export function ReasoningNode({ size = 30, color = '#1e3a8a' }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="30" r="3.2" fill={color} />
      <circle cx="20" cy="12" r="3.2" fill={color} />
      <circle cx="32" cy="20" r="3.2" fill={color} />
      <circle cx="20" cy="30" r="2.2" fill={color} opacity="0.5" />
      <path d="M10 30 L20 12 L32 20 M20 12 L20 30" stroke={color} strokeWidth="1.6" opacity="0.55" fill="none" />
    </svg>
  );
}

export function HeroTrace() {
  const points = [[80,60],[220,140],[380,50],[520,160],[680,70],[840,150],[980,60],[1120,130]];
  const paths = [];
  for (let i = 0; i < points.length - 1; i++) {
    paths.push(
      <path
        key={'p' + i}
        d={`M${points[i][0]},${points[i][1]} L${points[i + 1][0]},${points[i + 1][1]}`}
        stroke="#1e3a8a"
        strokeWidth="1.4"
        opacity="0.28"
      />
    );
  }
  const nodes = points.map((p, i) => (
    <circle key={'n' + i} cx={p[0]} cy={p[1]} r={i % 3 === 0 ? 4.5 : 3} fill="#1e3a8a" opacity={i % 2 === 0 ? 0.35 : 0.2} />
  ));
  return (
    <svg viewBox="0 0 1200 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      {paths}
      {nodes}
    </svg>
  );
}

export function BurgerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7H20M4 12H20M4 17H20" stroke="#10241c" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function LockIcon({ size = 14 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="11" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
