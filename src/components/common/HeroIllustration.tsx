import React from 'react';

export const HeroIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full aspect-[4/3] max-w-xl mx-auto flex items-center justify-center p-4 ${className}`}>
      <svg
        viewBox="0 0 600 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
        aria-label="Illustration of job seeker discovering local opportunities in Hubli-Dharwad"
      >
        {/* Sky / subtle circular backdrop glow */}
        <circle cx="340" cy="240" r="190" fill="#E8F7F0" fillOpacity="0.7" />
        <circle cx="340" cy="240" r="140" fill="#D3F2E3" fillOpacity="0.5" />

        {/* Distant Hubli-Dharwad city skyline silhouette */}
        <path
          d="M100 380 L140 340 L160 340 L180 360 L240 320 L270 320 L300 350 L380 300 L420 300 L450 340 L520 380 Z"
          fill="#E2E8F0"
          opacity="0.8"
        />
        {/* Soft green hills and trees */}
        <path
          d="M60 410 C140 380 240 390 320 395 C400 400 500 375 580 410 L580 460 L60 460 Z"
          fill="#A7F3D0"
          opacity="0.6"
        />
        {/* Main winding local road */}
        <path
          d="M180 460 C260 420 340 430 460 460"
          stroke="#CBD5E1"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d="M180 460 C260 420 340 430 460 460"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeDasharray="10 10"
        />

        {/* Dashed connector lines from central pin to local businesses */}
        <path
          d="M340 210 L250 145"
          stroke="#0BAA70"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          strokeLinecap="round"
        />
        <path
          d="M340 210 L440 120"
          stroke="#0BAA70"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          strokeLinecap="round"
        />
        <path
          d="M340 240 L490 220"
          stroke="#0BAA70"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          strokeLinecap="round"
        />
        <path
          d="M340 270 L240 310"
          stroke="#0BAA70"
          strokeWidth="2.5"
          strokeDasharray="6 6"
          strokeLinecap="round"
        />

        {/* 1. NODE: Local Retail Shop */}
        <g transform="translate(210, 110)">
          <circle cx="36" cy="36" r="34" fill="#FFFFFF" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
          <circle cx="36" cy="36" r="30" fill="#E8F7F0" />
          {/* Shop Front */}
          <rect x="20" y="28" width="32" height="24" rx="2" fill="#102B4E" />
          <rect x="25" y="36" width="12" height="16" fill="#38BDF8" rx="1" />
          <path d="M16 28 L36 18 L56 28 Z" fill="#0BAA70" />
          <rect x="22" y="24" width="28" height="4" fill="#098557" />
          <text x="36" y="27" fontSize="5" fontWeight="bold" fill="#FFFFFF" textAnchor="middle">SHOP</text>
        </g>

        {/* 2. NODE: Local Restaurant / Cafe */}
        <g transform="translate(410, 80)">
          <circle cx="36" cy="36" r="34" fill="#FFFFFF" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
          <circle cx="36" cy="36" r="30" fill="#FEF3C7" />
          {/* Cafe awning */}
          <path d="M18 30 C22 24 50 24 54 30 L52 36 L20 36 Z" fill="#0BAA70" />
          <path d="M22 30 L26 36 M30 30 L34 36 M38 30 L42 36 M46 30 L50 36" stroke="#FFFFFF" strokeWidth="2" />
          <rect x="22" y="36" width="28" height="18" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
          <rect x="30" y="40" width="12" height="14" fill="#64748B" rx="1" />
          {/* Cutlery icon badge */}
          <circle cx="36" cy="18" r="8" fill="#102B4E" />
          <path d="M33 15 L33 21 M39 15 L39 21 M33 17 L39 17" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* 3. NODE: Corporate & Tech Office Building */}
        <g transform="translate(460, 180)">
          <circle cx="36" cy="36" r="34" fill="#FFFFFF" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
          <circle cx="36" cy="36" r="30" fill="#E0F2FE" />
          {/* Office Building */}
          <rect x="22" y="22" width="28" height="34" rx="2" fill="#0284C7" />
          {/* Windows */}
          <rect x="26" y="28" width="5" height="5" fill="#BAE6FD" />
          <rect x="34" y="28" width="5" height="5" fill="#BAE6FD" />
          <rect x="42" y="28" width="5" height="5" fill="#BAE6FD" />
          <rect x="26" y="36" width="5" height="5" fill="#BAE6FD" />
          <rect x="34" y="36" width="5" height="5" fill="#BAE6FD" />
          <rect x="42" y="36" width="5" height="5" fill="#BAE6FD" />
          <rect x="33" y="46" width="7" height="10" fill="#102B4E" />
          <text x="36" y="19" fontSize="6" fontWeight="bold" fill="#0369A1" textAnchor="middle">JOBS</text>
        </g>

        {/* 4. NODE: Industrial & Manufacturing Works */}
        <g transform="translate(190, 270)">
          <circle cx="36" cy="36" r="34" fill="#FFFFFF" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.06))" />
          <circle cx="36" cy="36" r="30" fill="#E2E8F0" />
          {/* Factory sawtooth */}
          <path d="M20 46 L20 32 L30 38 L30 32 L40 38 L40 26 L52 26 L52 46 Z" fill="#0BAA70" />
          <rect x="25" y="40" width="6" height="6" fill="#FFFFFF" />
          <rect x="35" y="40" width="6" height="6" fill="#FFFFFF" />
          {/* Factory chimney smoke */}
          <circle cx="44" cy="20" r="3" fill="#94A3B8" opacity="0.6" />
          <circle cx="48" cy="14" r="4" fill="#94A3B8" opacity="0.4" />
        </g>

        {/* CENTRAL HERO PIN (Samparka Emerald Green Pin) */}
        <g transform="translate(305, 170)">
          {/* Pulsing ring */}
          <ellipse cx="35" cy="98" rx="28" ry="8" fill="#102B4E" opacity="0.15" />
          <path
            d="M35 15 C17 15 3 29 3 47 C3 68 35 102 35 102 C35 102 67 68 67 47 C67 29 53 15 35 15 Z"
            fill="#0BAA70"
          />
          <circle cx="35" cy="45" r="18" fill="#102B4E" />
          {/* Briefcase inside pin */}
          <rect x="26" y="40" width="18" height="12" rx="2" fill="#FFFFFF" />
          <path d="M31 40 V37 C31 36 32 35 33 35 H37 C38 35 39 36 39 37 V40" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <line x1="26" y1="45" x2="44" y2="45" stroke="#0BAA70" strokeWidth="1.5" />
        </g>

        {/* STUDENT / JOB SEEKER CHARACTER (Looking up enthusiastically) */}
        <g transform="translate(390, 270)">
          {/* Body / Hoodie (Dark Emerald Green) */}
          <path
            d="M55 125 C45 100 70 85 85 85 C100 85 125 100 115 125 L125 190 L45 190 Z"
            fill="#084E34"
          />
          {/* Backpack Strap */}
          <path d="M68 95 C62 115 62 145 68 165" stroke="#102B4E" strokeWidth="10" strokeLinecap="round" />
          <path d="M102 95 C108 115 108 145 102 165" stroke="#102B4E" strokeWidth="10" strokeLinecap="round" />

          {/* Neck */}
          <path d="M78 72 L92 72 L92 88 L78 88 Z" fill="#E2A176" />
          {/* Head looking up-left at pin */}
          <circle cx="85" cy="62" r="18" fill="#F0B58D" />
          {/* Hair */}
          <path
            d="M68 62 C68 45 78 40 92 42 C104 44 105 52 102 60 C98 56 90 54 84 56 C78 58 72 65 68 62 Z"
            fill="#1E293B"
          />
          {/* Ear */}
          <circle cx="96" cy="64" r="3.5" fill="#E2A176" />
          {/* Eye looking up */}
          <ellipse cx="78" cy="58" rx="2.5" ry="2" fill="#1E293B" />
          {/* Confident Smile */}
          <path d="M74 67 C78 70 84 70 88 67" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />

          {/* Hand holding smartphone */}
          <rect x="36" y="130" width="18" height="32" rx="4" fill="#102B4E" transform="rotate(-15 36 130)" />
          <rect x="38" y="133" width="14" height="26" rx="2" fill="#38BDF8" transform="rotate(-15 38 133)" />
          {/* Fingers wrapping phone */}
          <circle cx="48" cy="148" r="4" fill="#F0B58D" />
          <circle cx="46" cy="154" r="4" fill="#F0B58D" />
        </g>
      </svg>
    </div>
  );
};
