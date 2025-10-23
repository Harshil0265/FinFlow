export interface AvatarOption {
    id: string;
    name: string;
    gender: 'male' | 'female' | 'neutral';
    style: 'professional' | 'casual' | 'creative' | 'modern';
    svg: string;
}

export const digitalAvatars: AvatarOption[] = [
    // Professional Male Avatars
    {
        id: 'prof-male-1',
        name: 'Professional Alex',
        gender: 'male',
        style: 'professional',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#bg1)"/>
      <circle cx="50" cy="35" r="15" fill="#fdbcb4"/>
      <circle cx="50" cy="65" r="25" fill="#4a5568"/>
      <circle cx="50" cy="70" r="20" fill="#fdbcb4"/>
      <rect x="35" y="25" width="30" height="20" rx="15" fill="#2d3748"/>
      <circle cx="45" cy="32" r="2" fill="#2d3748"/>
      <circle cx="55" cy="32" r="2" fill="#2d3748"/>
      <path d="M45 38 Q50 42 55 38" stroke="#2d3748" stroke-width="1.5" fill="none"/>
      <rect x="40" y="55" width="20" height="15" fill="#3182ce"/>
      <rect x="38" y="52" width="24" height="3" fill="#2b6cb0"/>
    </svg>`
    },
    {
        id: 'prof-male-2',
        name: 'Business Marcus',
        gender: 'male',
        style: 'professional',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4facfe;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#00f2fe;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#bg2)"/>
      <circle cx="50" cy="35" r="15" fill="#d69e2e"/>
      <circle cx="50" cy="65" r="25" fill="#2d3748"/>
      <circle cx="50" cy="70" r="20" fill="#d69e2e"/>
      <rect x="38" y="22" width="24" height="18" rx="12" fill="#744210"/>
      <circle cx="46" cy="32" r="2" fill="#2d3748"/>
      <circle cx="54" cy="32" r="2" fill="#2d3748"/>
      <path d="M46 38 Q50 42 54 38" stroke="#2d3748" stroke-width="1.5" fill="none"/>
      <rect x="40" y="55" width="20" height="15" fill="#1a202c"/>
      <rect x="42" y="52" width="16" height="3" fill="#e53e3e"/>
    </svg>`
    },

    // Professional Female Avatars
    {
        id: 'prof-female-1',
        name: 'Executive Sarah',
        gender: 'female',
        style: 'professional',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#fa709a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fee140;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#bg3)"/>
      <circle cx="50" cy="35" r="15" fill="#fbb6ce"/>
      <circle cx="50" cy="65" r="25" fill="#2d3748"/>
      <circle cx="50" cy="70" r="20" fill="#fbb6ce"/>
      <path d="M30 25 Q50 15 70 25 Q65 35 50 30 Q35 35 30 25" fill="#744210"/>
      <circle cx="45" cy="32" r="2" fill="#2d3748"/>
      <circle cx="55" cy="32" r="2" fill="#2d3748"/>
      <path d="M45 38 Q50 41 55 38" stroke="#e53e3e" stroke-width="2" fill="none"/>
      <rect x="40" y="55" width="20" height="15" fill="#553c9a"/>
      <circle cx="47" cy="30" r="1" fill="#e53e3e"/>
      <circle cx="53" cy="30" r="1" fill="#e53e3e"/>
    </svg>`
    },
    {
        id: 'prof-female-2',
        name: 'Manager Lisa',
        gender: 'female',
        style: 'professional',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg4" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#a8edea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fed6e3;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#bg4)"/>
      <circle cx="50" cy="35" r="15" fill="#fed7d7"/>
      <circle cx="50" cy="65" r="25" fill="#2d3748"/>
      <circle cx="50" cy="70" r="20" fill="#fed7d7"/>
      <rect x="35" y="20" width="30" height="25" rx="15" fill="#2d3748"/>
      <circle cx="45" cy="32" r="2" fill="#2d3748"/>
      <circle cx="55" cy="32" r="2" fill="#2d3748"/>
      <path d="M45 38 Q50 41 55 38" stroke="#e53e3e" stroke-width="2" fill="none"/>
      <rect x="40" y="55" width="20" height="15" fill="#805ad5"/>
      <rect x="38" y="52" width="24" height="3" fill="#ffffff"/>
    </svg>`
    },

    // Casual Male Avatars
    {
        id: 'casual-male-1',
        name: 'Cool Jake',
        gender: 'male',
        style: 'casual',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg5" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ff9a9e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fecfef;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#bg5)"/>
      <circle cx="50" cy="35" r="15" fill="#fbb6ce"/>
      <circle cx="50" cy="65" r="25" fill="#38a169"/>
      <circle cx="50" cy="70" r="20" fill="#fbb6ce"/>
      <path d="M32 22 Q50 12 68 22 Q60 32 50 28 Q40 32 32 22" fill="#e53e3e"/>
      <circle cx="45" cy="32" r="2" fill="#2d3748"/>
      <circle cx="55" cy="32" r="2" fill="#2d3748"/>
      <path d="M45 38 Q50 42 55 38" stroke="#2d3748" stroke-width="1.5" fill="none"/>
      <rect x="40" y="55" width="20" height="15" fill="#38a169"/>
      <circle cx="50" cy="62" r="3" fill="#ffffff"/>
    </svg>`
    },
    {
        id: 'casual-male-2',
        name: 'Trendy Mike',
        gender: 'male',
        style: 'casual',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg6" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffecd2;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fcb69f;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#bg6)"/>
      <circle cx="50" cy="35" r="15" fill="#fed7d7"/>
      <circle cx="50" cy="65" r="25" fill="#e53e3e"/>
      <circle cx="50" cy="70" r="20" fill="#fed7d7"/>
      <path d="M35 25 Q50 18 65 25 Q58 30 50 28 Q42 30 35 25" fill="#2d3748"/>
      <rect x="42" y="28" width="16" height="6" rx="3" fill="#2d3748"/>
      <circle cx="45" cy="32" r="1.5" fill="#ffffff"/>
      <circle cx="55" cy="32" r="1.5" fill="#ffffff"/>
      <path d="M45 38 Q50 42 55 38" stroke="#2d3748" stroke-width="1.5" fill="none"/>
      <rect x="40" y="55" width="20" height="15" fill="#e53e3e"/>
    </svg>`
    },

    // Casual Female Avatars
    {
        id: 'casual-female-1',
        name: 'Artistic Emma',
        gender: 'female',
        style: 'casual',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg7" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#a18cd1;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fbc2eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#bg7)"/>
      <circle cx="50" cy="35" r="15" fill="#fbb6ce"/>
      <circle cx="50" cy="65" r="25" fill="#805ad5"/>
      <circle cx="50" cy="70" r="20" fill="#fbb6ce"/>
      <path d="M28 20 Q35 15 42 20 Q50 12 58 20 Q65 15 72 20 Q68 35 50 30 Q32 35 28 20" fill="#805ad5"/>
      <circle cx="45" cy="32" r="2" fill="#2d3748"/>
      <circle cx="55" cy="32" r="2" fill="#2d3748"/>
      <path d="M45 38 Q50 41 55 38" stroke="#e53e3e" stroke-width="2" fill="none"/>
      <rect x="40" y="55" width="20" height="15" fill="#805ad5"/>
      <circle cx="42" cy="25" r="2" fill="#f56565"/>
      <circle cx="58" cy="25" r="2" fill="#f56565"/>
    </svg>`
    },
    {
        id: 'casual-female-2',
        name: 'Sporty Zoe',
        gender: 'female',
        style: 'casual',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg8" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffeaa7;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fab1a0;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#bg8)"/>
      <circle cx="50" cy="35" r="15" fill="#fed7d7"/>
      <circle cx="50" cy="65" r="25" fill="#38a169"/>
      <circle cx="50" cy="70" r="20" fill="#fed7d7"/>
      <path d="M35 22 Q50 18 65 22 Q60 28 50 26 Q40 28 35 22" fill="#d69e2e"/>
      <rect x="45" y="20" width="10" height="8" fill="#ffffff"/>
      <circle cx="45" cy="32" r="2" fill="#2d3748"/>
      <circle cx="55" cy="32" r="2" fill="#2d3748"/>
      <path d="M45 38 Q50 41 55 38" stroke="#2d3748" stroke-width="1.5" fill="none"/>
      <rect x="40" y="55" width="20" height="15" fill="#38a169"/>
      <rect x="42" y="57" width="16" height="2" fill="#ffffff"/>
    </svg>`
    },

    // Creative Avatars
    {
        id: 'creative-male-1',
        name: 'Designer Leo',
        gender: 'male',
        style: 'creative',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg9" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#bg9)"/>
      <circle cx="50" cy="35" r="15" fill="#fbb6ce"/>
      <circle cx="50" cy="65" r="25" fill="#2d3748"/>
      <circle cx="50" cy="70" r="20" fill="#fbb6ce"/>
      <path d="M30 18 Q40 12 50 18 Q60 12 70 18 Q65 30 50 25 Q35 30 30 18" fill="#e53e3e"/>
      <rect x="42" y="28" width="16" height="6" rx="3" fill="#2d3748"/>
      <circle cx="45" cy="32" r="1.5" fill="#4299e1"/>
      <circle cx="55" cy="32" r="1.5" fill="#4299e1"/>
      <path d="M45 38 Q50 42 55 38" stroke="#2d3748" stroke-width="1.5" fill="none"/>
      <rect x="40" y="55" width="20" height="15" fill="#2d3748"/>
      <rect x="42" y="57" width="4" height="4" fill="#f56565"/>
      <rect x="48" y="57" width="4" height="4" fill="#48bb78"/>
      <rect x="54" y="57" width="4" height="4" fill="#4299e1"/>
    </svg>`
    },
    {
        id: 'creative-female-1',
        name: 'Artist Maya',
        gender: 'female',
        style: 'creative',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg10" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ff9a9e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fad0c4;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#bg10)"/>
      <circle cx="50" cy="35" r="15" fill="#fbb6ce"/>
      <circle cx="50" cy="65" r="25" fill="#805ad5"/>
      <circle cx="50" cy="70" r="20" fill="#fbb6ce"/>
      <path d="M25 15 Q35 8 45 15 Q50 10 55 15 Q65 8 75 15 Q70 32 50 28 Q30 32 25 15" fill="#9f7aea"/>
      <circle cx="45" cy="32" r="2" fill="#2d3748"/>
      <circle cx="55" cy="32" r="2" fill="#2d3748"/>
      <path d="M45 38 Q50 41 55 38" stroke="#e53e3e" stroke-width="2" fill="none"/>
      <rect x="40" y="55" width="20" height="15" fill="#805ad5"/>
      <circle cx="35" cy="22" r="3" fill="#f56565"/>
      <circle cx="42" cy="18" r="2" fill="#48bb78"/>
      <circle cx="58" cy="18" r="2" fill="#4299e1"/>
      <circle cx="65" cy="22" r="3" fill="#ed8936"/>
    </svg>`
    },

    // Modern Neutral Avatars
    {
        id: 'modern-neutral-1',
        name: 'Tech Sam',
        gender: 'neutral',
        style: 'modern',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg11" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4facfe;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#00f2fe;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#bg11)"/>
      <circle cx="50" cy="35" r="15" fill="#fed7d7"/>
      <circle cx="50" cy="65" r="25" fill="#2d3748"/>
      <circle cx="50" cy="70" r="20" fill="#fed7d7"/>
      <rect x="38" y="22" width="24" height="20" rx="12" fill="#4a5568"/>
      <circle cx="45" cy="32" r="2" fill="#4299e1"/>
      <circle cx="55" cy="32" r="2" fill="#4299e1"/>
      <path d="M45 38 Q50 41 55 38" stroke="#2d3748" stroke-width="1.5" fill="none"/>
      <rect x="40" y="55" width="20" height="15" fill="#2d3748"/>
      <rect x="42" y="57" width="16" height="2" fill="#4299e1"/>
      <rect x="42" y="60" width="16" height="2" fill="#4299e1"/>
      <rect x="42" y="63" width="16" height="2" fill="#4299e1"/>
    </svg>`
    },
    {
        id: 'modern-neutral-2',
        name: 'Future Alex',
        gender: 'neutral',
        style: 'modern',
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg12" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#a8edea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fed6e3;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill="url(#bg12)"/>
      <circle cx="50" cy="35" r="15" fill="#fbb6ce"/>
      <circle cx="50" cy="65" r="25" fill="#553c9a"/>
      <circle cx="50" cy="70" r="20" fill="#fbb6ce"/>
      <rect x="35" y="20" width="30" height="22" rx="15" fill="#553c9a"/>
      <rect x="40" y="28" width="20" height="8" rx="4" fill="#9f7aea"/>
      <circle cx="45" cy="32" r="1.5" fill="#ffffff"/>
      <circle cx="55" cy="32" r="1.5" fill="#ffffff"/>
      <path d="M45 38 Q50 41 55 38" stroke="#2d3748" stroke-width="1.5" fill="none"/>
      <rect x="40" y="55" width="20" height="15" fill="#553c9a"/>
      <circle cx="50" cy="62" r="4" fill="#9f7aea"/>
    </svg>`
    }
];

export const getAvatarsByGender = (gender?: 'male' | 'female' | 'neutral') => {
    if (!gender) return digitalAvatars;
    return digitalAvatars.filter(avatar => avatar.gender === gender);
};

export const getAvatarsByStyle = (style?: 'professional' | 'casual' | 'creative' | 'modern') => {
    if (!style) return digitalAvatars;
    return digitalAvatars.filter(avatar => avatar.style === style);
};

export const getAvatarById = (id: string) => {
    return digitalAvatars.find(avatar => avatar.id === id);
};