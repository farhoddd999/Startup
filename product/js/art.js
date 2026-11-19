// Hearth illustration system
// ---------------------------------------------------------------------------
// Picture-book scenes drawn as SVG from a small vocabulary of elements, so
// any story — including ones written on the fly by the story engine — gets
// warm, consistent illustrations without image generation. People are drawn
// to look like the family (skin tone & hair chosen in onboarding).

const W = 400, H = 260;

export const SKIN = ['#F7D7BC', '#EBB892', '#C98D62', '#8F5B3A', '#5E3A23'];
export const HAIR = ['#2A1C14', '#5B3A22', '#A65A2C', '#D9A55B', '#151515'];
export const HAIR_STYLES = ['puffs', 'short', 'long', 'curls', 'bun', 'braids'];

const C = {
  ink: '#22283A', ember: '#E8833A', emberDeep: '#C9622A', gold: '#F2C14E', cream: '#FFF6E9', paper: '#FFFBF4',
  sage: '#8DB596', leaf: '#5E9C6A', leafDeep: '#3F7A4E', sky: '#BFE3EE', sea: '#4F94A8', seaDeep: '#3A7488', rose: '#E89A9A',
  plum: '#7A5C8E', brown: '#8B5E3C', brownDeep: '#6A4329', sand: '#EDD3A2', grey: '#9AA3AF', white: '#FFFFFF', blush: '#F2A7A0',
  night: '#1E2A47', night2: '#2F3D66', teal: '#3E9C9C', red: '#D9564A', pink: '#F2A2B8', snow: '#F4F8FB', wood: '#B98454',
};

const SKY_ITEMS = new Set(['moon', 'sun', 'stars', 'cloud', 'heart', 'notes', 'sparkle', 'question', 'snowflakes', 'earth', 'wind', 'thought', 'window', 'motion']);

// ---- small helpers ---------------------------------------------------------
const eyes = (x1, x2, y, { closed = false, r = 2.6, mood } = {}) => {
  if (closed) return `<path d="M${x1 - 3} ${y} q3 3 6 0 M${x2 - 3} ${y} q3 3 6 0" stroke="${C.ink}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  let brows = '';
  if (mood === 'mad') brows = `<path d="M${x1 - 4} ${y - 6} l7 3 M${x2 + 4} ${y - 6} l-7 3" stroke="${C.ink}" stroke-width="1.6" stroke-linecap="round"/>`;
  if (mood === 'worried') brows = `<path d="M${x1 - 4} ${y - 4} l7 -3 M${x2 + 4} ${y - 4} l-7 -3" stroke="${C.ink}" stroke-width="1.4" stroke-linecap="round"/>`;
  return `${brows}<circle cx="${x1}" cy="${y}" r="${r}" fill="${C.ink}"/><circle cx="${x2}" cy="${y}" r="${r}" fill="${C.ink}"/><circle cx="${x1 + 0.9}" cy="${y - 0.9}" r="0.8" fill="#fff"/><circle cx="${x2 + 0.9}" cy="${y - 0.9}" r="0.8" fill="#fff"/>`;
};
const smile = (x, y, w = 6, mood) => mood === 'mad' || mood === 'worried'
  ? `<path d="M${x - w / 2} ${y + 2} q${w / 2} -3 ${w} 0" stroke="${C.ink}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`
  : `<path d="M${x - w / 2} ${y} q${w / 2} 4 ${w} 0" stroke="${C.ink}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
const cheeks = (x1, x2, y, r = 3) => `<circle cx="${x1}" cy="${y}" r="${r}" fill="${C.blush}" opacity=".7"/><circle cx="${x2}" cy="${y}" r="${r}" fill="${C.blush}" opacity=".7"/>`;
const zzz = (x, y) => `<g fill="${C.plum}" font-family="Atkinson Hyperlegible, sans-serif" font-weight="700" opacity=".75"><text x="${x}" y="${y}" font-size="10">z</text><text x="${x + 7}" y="${y - 8}" font-size="13">z</text><text x="${x + 16}" y="${y - 19}" font-size="16">Z</text></g>`;

// ---- people ---------------------------------------------------------------
function hair(style, color, cx, cy, r, adult) {
  const h = color;
  switch (style) {
    case 'puffs': return { back: `<circle cx="${cx - r}" cy="${cy - r * 0.7}" r="${r * 0.55}" fill="${h}"/><circle cx="${cx + r}" cy="${cy - r * 0.7}" r="${r * 0.55}" fill="${h}"/>`, front: `<path d="M${cx - r} ${cy - 2} a${r} ${r} 0 0 1 ${2 * r} 0 q-${r} -${r * 0.55} -${2 * r} 0z" fill="${h}"/>` };
    case 'long': return { back: `<path d="M${cx - r - 2} ${cy} q0 ${r * 1.6} ${r * 0.4} ${r * 1.9} h${r * 1.6 + 4} q${r * 0.4} -${r * 0.3} ${r * 0.4} -${r * 1.9}z" fill="${h}"/>`, front: `<path d="M${cx - r - 1} ${cy + 2} a${r + 1} ${r + 1} 0 0 1 ${2 * r + 2} 0 q-${r * 0.7} -${r * 0.75} -${r * 1.3} -${r * 0.2} q-${r * 0.4} ${r * 0.3} -${r * 0.7} ${r * 0.2}z" fill="${h}"/>` };
    case 'curls': return { back: '', front: Array.from({ length: 7 }, (_, i) => { const a = Math.PI + (i / 6) * Math.PI; return `<circle cx="${cx + Math.cos(a) * r * 0.95}" cy="${cy + Math.sin(a) * r * 0.95}" r="${r * 0.38}" fill="${h}"/>`; }).join('') + `<path d="M${cx - r} ${cy - 2} a${r} ${r} 0 0 1 ${2 * r} 0z" fill="${h}"/>` };
    case 'bun': return { back: `<circle cx="${cx}" cy="${cy - r * 1.05}" r="${r * 0.48}" fill="${h}"/>`, front: `<path d="M${cx - r} ${cy} a${r} ${r} 0 0 1 ${2 * r} 0 q-${r} -${r * 0.5} -${2 * r} 0z" fill="${h}"/>` };
    case 'braids': return { back: `<path d="M${cx - r * 0.95} ${cy} q-6 ${r} -2 ${r * 1.7}" stroke="${h}" stroke-width="${r * 0.42}" fill="none" stroke-linecap="round"/><path d="M${cx + r * 0.95} ${cy} q6 ${r} 2 ${r * 1.7}" stroke="${h}" stroke-width="${r * 0.42}" fill="none" stroke-linecap="round"/>`, front: `<path d="M${cx - r} ${cy} a${r} ${r} 0 0 1 ${2 * r} 0 q-${r} -${r * 0.45} -${2 * r} 0z" fill="${h}"/>` };
    default: return { back: '', front: `<path d="M${cx - r - 1} ${cy + (adult ? -1 : 1)} a${r + 1} ${r + 1} 0 0 1 ${2 * r + 2} 0 q-${r * 0.4} -${r * 0.55} -${r} -${r * 0.35} q-${r * 0.6} ${r * 0.2} -${r + 2} ${r * 0.35}z" fill="${h}"/>` };
  }
}

function person(o, look, adult) {
  const skin = SKIN[(adult ? look.grownupSkin : look.childSkin) ?? 2];
  const hairC = HAIR[(adult ? look.grownupHairColor : look.childHairColor) ?? 0];
  const style = (adult ? look.grownupHair : look.childHair) || (adult ? 'bun' : 'puffs');
  const shirt = o.coat ? C.red : adult ? (look.grownupShirt || C.teal) : (look.childShirt || C.ember);
  const pants = adult ? '#3E4A6B' : '#4C5C86';
  const tall = adult ? 150 : 110;
  const hr = adult ? 20 : 21;               // head radius
  const headY = -tall + hr + 2;
  const bodyTop = headY + hr - 2, bodyH = adult ? 62 : 44, bw = adult ? 46 : 40;
  const legTop = bodyTop + bodyH;
  const closed = o.pose === 'sleep';
  const h = hair(style, hairC, 0, headY, hr, adult);
  let arms;
  if (o.pose === 'wave') arms = `<path d="M${-bw / 2 + 2} ${bodyTop + 8} q-14 -10 -16 -28" stroke="${shirt}" stroke-width="10" stroke-linecap="round" fill="none"/><circle cx="${-bw / 2 - 14}" cy="${bodyTop - 22}" r="5.5" fill="${skin}"/><path d="M${bw / 2 - 2} ${bodyTop + 8} q14 -10 16 -28" stroke="${shirt}" stroke-width="10" stroke-linecap="round" fill="none"/><circle cx="${bw / 2 + 14}" cy="${bodyTop - 22}" r="5.5" fill="${skin}"/>`;
  else if (o.pose === 'hug') arms = `<path d="M${-bw / 2 + 2} ${bodyTop + 10} q18 10 ${bw - 6} 6" stroke="${shirt}" stroke-width="10" stroke-linecap="round" fill="none"/><path d="M${bw / 2 - 2} ${bodyTop + 10} q-18 14 -${bw - 6} 10" stroke="${shirt}" stroke-width="10" stroke-linecap="round" fill="none"/><circle cx="${bw / 2 - 6}" cy="${bodyTop + 16}" r="5" fill="${skin}"/>`;
  else arms = `<path d="M${-bw / 2 + 3} ${bodyTop + 8} q-8 14 -7 ${bodyH - 14}" stroke="${shirt}" stroke-width="10" stroke-linecap="round" fill="none"/><circle cx="${-bw / 2 - 4}" cy="${bodyTop + bodyH - 4}" r="5.2" fill="${skin}"/><path d="M${bw / 2 - 3} ${bodyTop + 8} q8 14 7 ${bodyH - 14}" stroke="${shirt}" stroke-width="10" stroke-linecap="round" fill="none"/><circle cx="${bw / 2 + 4}" cy="${bodyTop + bodyH - 4}" r="5.2" fill="${skin}"/>`;
  const legs = o.pose === 'jump'
    ? `<path d="M-8 ${legTop} q-8 10 -14 ${-legTop * 0.12}" stroke="${pants}" stroke-width="11" stroke-linecap="round" fill="none"/><path d="M8 ${legTop} q8 10 14 ${-legTop * 0.12}" stroke="${pants}" stroke-width="11" stroke-linecap="round" fill="none"/>`
    : `<rect x="-14" y="${legTop - 2}" width="11" height="${-legTop - 4}" rx="5" fill="${pants}"/><rect x="3" y="${legTop - 2}" width="11" height="${-legTop - 4}" rx="5" fill="${pants}"/><ellipse cx="-9" cy="-3" rx="9" ry="4.5" fill="${C.ink}"/><ellipse cx="9" cy="-3" rx="9" ry="4.5" fill="${C.ink}"/>`;
  const body = `<path d="M${-bw / 2} ${bodyTop + 10} q0 -10 10 -10 h${bw - 20} q10 0 10 10 v${bodyH - 10} h-${bw}z" fill="${shirt}"/>` + (o.coat ? `<path d="M0 ${bodyTop + 2} v${bodyH - 2}" stroke="${C.emberDeep}" stroke-width="2"/><circle cx="4" cy="${bodyTop + 14}" r="1.8" fill="${C.cream}"/><circle cx="4" cy="${bodyTop + 26}" r="1.8" fill="${C.cream}"/>` : '');
  const coatHat = o.coat ? `<path d="M${-hr} ${headY - 4} a${hr} ${hr} 0 0 1 ${2 * hr} 0z" fill="${C.teal}"/><rect x="${-hr - 2}" y="${headY - 6}" width="${2 * hr + 4}" height="7" rx="3.5" fill="${C.cream}"/><circle cx="0" cy="${headY - hr - 4}" r="5" fill="${C.cream}"/>` : '';
  const face = `${eyes(-7, 7, headY + 1, { closed })}${smile(0, headY + 9, 7)}${cheeks(-12, 12, headY + 7, 3.2)}`;
  const towel = o.towel ? `<path d="M${-bw / 2 - 6} ${bodyTop - 4} h${bw + 12} v${bodyH + 18} q-${(bw + 12) / 2} 8 -${bw + 12} 0z" fill="${C.sky}"/><path d="M${-bw / 2 - 6} ${bodyTop + 12} h${bw + 12}" stroke="#fff" stroke-width="3"/>` : '';
  if (o.peek) {
    return `<g>${h.back}<rect x="${-bw / 2}" y="${bodyTop}" width="${bw}" height="16" rx="8" fill="${shirt}"/><circle cx="0" cy="${headY}" r="${hr}" fill="${skin}"/>${h.front}${face}</g>`;
  }
  return `<g>${h.back}${legs}${body}${towel}${arms}<rect x="-5" y="${bodyTop - 4}" width="10" height="8" fill="${skin}"/><circle cx="0" cy="${headY}" r="${hr}" fill="${skin}"/>${o.coat ? '' : h.front}${coatHat}${face}${closed ? zzz(hr, headY - hr) : ''}</g>`;
}

// ---- animals --------------------------------------------------------------
function cat(o) {
  const f = '#8E97AC', d = '#6F7890';
  if (o.pose === 'sleep') return `<g><ellipse cx="0" cy="-14" rx="34" ry="14" fill="${f}"/><path d="M-30 -10 q-14 -2 -8 -14" stroke="${f}" stroke-width="7" fill="none" stroke-linecap="round"/><circle cx="24" cy="-20" r="13" fill="${f}"/><path d="M15 -29 l3 -10 l6 7z M27 -31 l6 -8 l2 10z" fill="${f}"/>${eyes(20, 29, -20, { closed: true })}${zzz(34, -36)}</g>`;
  const paw = o.pose === 'paw' ? `<path d="M14 -38 q14 -6 16 -20" stroke="${f}" stroke-width="9" fill="none" stroke-linecap="round"/>` : `<rect x="8" y="-22" width="9" height="22" rx="4.5" fill="${f}"/>`;
  return `<g><path d="M-22 -14 q-22 -4 -14 -30" stroke="${f}" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="-22" rx="22" ry="22" fill="${f}"/><path d="M-12 -36 q12 4 24 0" stroke="${d}" stroke-width="3" fill="none"/><path d="M-14 -26 q14 4 28 0" stroke="${d}" stroke-width="3" fill="none"/><rect x="-17" y="-22" width="9" height="22" rx="4.5" fill="${f}"/>${paw}<circle cx="0" cy="-52" r="17" fill="${f}"/><path d="M-15 -60 l2 -16 l11 9z M15 -60 l-2 -16 l-11 9z" fill="${f}"/><path d="M-12 -67 l1 -6 l5 4z M12 -67 l-1 -6 l-5 4z" fill="${C.pink}"/>${eyes(-6, 6, -53)}<path d="M-2 -46 h4 l-2 2.5z" fill="${C.pink}"/><path d="M-3 -43 q3 3 6 0" stroke="${C.ink}" stroke-width="1.2" fill="none"/><path d="M-9 -45 h-10 M-9 -43 l-9 3 M9 -45 h10 M9 -43 l9 3" stroke="${C.ink}" stroke-width=".8" opacity=".6"/></g>`;
}

function dog(o, { color = '#B67C4E', ear = '#7A4A2B', size = 1 } = {}) {
  const sleep = o.pose === 'sleep';
  if (sleep) return `<g transform="scale(${size})"><ellipse cx="0" cy="-15" rx="38" ry="15" fill="${color}"/><circle cx="-28" cy="-22" r="15" fill="${color}"/><ellipse cx="-36" cy="-20" rx="6" ry="11" fill="${ear}"/><ellipse cx="-40" cy="-18" rx="6" ry="4" fill="${C.ink}"/>${eyes(-30, -22, -24, { closed: true })}${zzz(-10, -36)}</g>`;
  const dig = o.pose === 'dig';
  const run = o.pose === 'run';
  const legs = run
    ? `<path d="M-22 -18 l-14 14 M-12 -18 l-8 16 M16 -18 l8 16 M24 -18 l14 12" stroke="${color}" stroke-width="9" stroke-linecap="round"/>`
    : `<rect x="-24" y="-22" width="10" height="22" rx="5" fill="${color}"/><rect x="-10" y="-22" width="10" height="22" rx="5" fill="${color}"/><rect x="12" y="-22" width="10" height="22" rx="5" fill="${color}"/><rect x="${dig ? 26 : 24}" y="${dig ? -26 : -22}" width="10" height="${dig ? 18 : 22}" rx="5" fill="${color}" ${dig ? 'transform="rotate(-35 30 -18)"' : ''}/>`;
  const muddy = o.muddy ? `<g fill="${C.brownDeep}" opacity=".85"><circle cx="-14" cy="-30" r="7"/><circle cx="8" cy="-24" r="5"/><circle cx="20" cy="-36" r="6"/><circle cx="28" cy="-62" r="4"/><circle cx="-26" cy="-12" r="4"/></g>` : '';
  const hat = o.hat ? `<g transform="translate(30 -84) rotate(12)"><rect x="-14" y="-24" width="28" height="24" rx="2" fill="${C.ink}"/><rect x="-20" y="-3" width="40" height="5" rx="2.5" fill="${C.ink}"/><rect x="-14" y="-9" width="28" height="5" fill="${C.red}"/></g>` : '';
  return `<g transform="scale(${size})">${legs}<path d="M-30 -36 q-16 -10 -12 -24" stroke="${color}" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="-34" rx="34" ry="18" fill="${color}"/><circle cx="30" cy="-58" r="18" fill="${color}"/><ellipse cx="44" cy="-52" rx="11" ry="9" fill="${color}"/><ellipse cx="52" cy="-55" rx="5" ry="4" fill="${C.ink}"/><ellipse cx="20" cy="-56" rx="7" ry="14" fill="${ear}" transform="rotate(18 20 -56)"/>${eyes(30, 39, -62)}<path d="M38 -46 q4 4 9 1" stroke="${C.ink}" stroke-width="1.4" fill="none"/>${o.pose === 'run' ? `<path d="M42 -44 q3 8 8 2" fill="${C.pink}"/>` : ''}${muddy}${hat}</g>`;
}

function hen(o) {
  const body = '#FFFDF8', shade = '#EAE2D6';
  const mood = o.mood;
  const closed = o.pose === 'sleep';
  const hat = o.hat ? `<g transform="translate(6 -84) rotate(-10)"><rect x="-13" y="-22" width="26" height="22" rx="2" fill="${C.ink}"/><rect x="-19" y="-3" width="38" height="5" rx="2.5" fill="${C.ink}"/><rect x="-13" y="-8" width="26" height="5" fill="${C.red}"/></g>` : '';
  return `<g><path d="M-6 -4 v-12 M8 -4 v-12" stroke="${C.gold}" stroke-width="3.5" stroke-linecap="round"/><path d="M-12 -4 h10 M2 -4 h12" stroke="${C.gold}" stroke-width="3" stroke-linecap="round"/><path d="M-30 -40 q-12 -14 -4 -26 q8 8 10 16z" fill="${shade}"/><ellipse cx="0" cy="-32" rx="28" ry="20" fill="${body}"/><path d="M-12 -34 q10 12 24 2" stroke="${shade}" stroke-width="4" fill="none"/><circle cx="14" cy="-58" r="14" fill="${body}"/><path d="M8 -72 q2 -8 6 -2 q3 -8 6 0 q4 -6 5 2z" fill="${C.red}"/><path d="M26 -58 l9 3 l-9 3z" fill="${C.gold}"/><path d="M24 -51 q3 6 0 9 q-3 -3 0 -9z" fill="${C.red}"/>${eyes(12, 20, -60, { closed, mood, r: 2.2 })}${closed ? zzz(28, -74) : ''}${hat}</g>`;
}

function fox(o) {
  const f = C.ember, d = '#3B2A20', w = '#FFF4E6';
  if (o.peek) return `<g><path d="M-14 -32 l-6 -20 l14 10z M14 -32 l6 -20 l-14 10z" fill="${f}"/><path d="M-12 -38 l-3 -9 l6 5z M12 -38 l3 -9 l-6 5z" fill="${d}"/><path d="M-20 -24 q0 -18 20 -18 q20 0 20 18 q-6 14 -20 18 q-14 -4 -20 -18z" fill="${f}"/><path d="M-12 -14 q12 12 24 0 q-6 10 -12 10 q-6 0 -12 -10z" fill="${w}"/>${eyes(-8, 8, -24, { closed: o.pose === 'sleep' })}<circle cx="0" cy="-12" r="3" fill="${d}"/>${o.pose === 'sleep' ? zzz(18, -40) : ''}</g>`;
  if (o.pose === 'sleep') return `<g><path d="M-40 -14 q-6 -20 18 -22 q24 0 40 6" fill="${f}"/><ellipse cx="0" cy="-14" rx="30" ry="14" fill="${f}"/><path d="M30 -10 q22 -2 22 -16 q-14 -6 -24 4z" fill="${f}"/><path d="M44 -14 q8 -2 8 -12 l-8 2z" fill="${w}"/><circle cx="-22" cy="-22" r="13" fill="${f}"/><path d="M-32 -30 l-2 -12 l10 6z M-16 -32 l4 -12 l4 10z" fill="${f}"/>${eyes(-27, -18, -22, { closed: true })}<circle cx="-34" cy="-18" r="2.5" fill="${d}"/>${zzz(-8, -36)}</g>`;
  const look = o.pose === 'look';
  const headY = look ? -64 : -58;
  const mood = o.mood === 'hopeful' ? '' : '';
  return `<g><path d="M-26 -26 q-30 -2 -34 -24 q16 -8 32 10z" fill="${f}"/><path d="M-50 -38 q-10 -2 -10 -12 q8 -2 12 4z" fill="${w}"/><rect x="-18" y="-22" width="8" height="22" rx="4" fill="${d}"/><rect x="10" y="-22" width="8" height="22" rx="4" fill="${d}"/><ellipse cx="0" cy="-30" rx="24" ry="16" fill="${f}"/><path d="M6 -40 q8 12 0 22 q-6 -10 0 -22z" fill="${w}"/><g transform="translate(10 ${headY}) ${look ? 'rotate(-14)' : ''}"><path d="M-14 -8 l-5 -20 l13 9z M14 -8 l5 -20 l-13 9z" fill="${f}"/><path d="M-12 -14 l-3 -9 l6 5z M12 -14 l3 -9 l-6 5z" fill="${d}"/><path d="M-18 0 q0 -16 18 -16 q18 0 18 16 q-6 12 -18 16 q-12 -4 -18 -16z" fill="${f}"/><path d="M-10 8 q10 10 20 0 q-4 8 -10 8 q-6 0 -10 -8z" fill="${w}"/>${eyes(-7, 7, -1)}<circle cx="0" cy="9" r="2.8" fill="${d}"/>${o.mood === 'hopeful' ? `<path d="M-4 13 q4 4 8 0" fill="${C.pink}"/>` : ''}</g>${mood}</g>`;
}

function duck(o) {
  return `<g><path d="M-4 -2 v-6 M6 -2 v-6" stroke="${C.ember}" stroke-width="3" stroke-linecap="round"/><path d="M-26 -22 q-8 -10 2 -14 q6 6 6 12z" fill="${C.gold}"/><ellipse cx="-2" cy="-18" rx="24" ry="14" fill="${C.gold}"/><path d="M-12 -20 q10 8 20 0" stroke="#E0A92E" stroke-width="3" fill="none"/><circle cx="14" cy="-38" r="12" fill="${C.gold}"/><path d="M24 -38 q12 -2 12 3 q-6 4 -12 2z" fill="${C.ember}"/>${eyes(12, 19, -41, { r: 2 })}</g>`;
}

function fish(o) {
  const body = '#F29B4B', fin = '#E07B2C';
  const sail = o.sail ? `<path d="M2 -28 v-40 l24 30z" fill="${C.paper}" stroke="${C.wood}" stroke-width="1"/><path d="M2 -28 v-44" stroke="${C.wood}" stroke-width="3"/>` : '';
  return `<g>${sail}<path d="M-30 -18 l-16 -12 v24z" fill="${fin}"/><ellipse cx="0" cy="-18" rx="30" ry="16" fill="${body}"/><path d="M-6 -32 q8 -10 16 0" fill="${fin}"/><path d="M-10 -26 q4 8 0 16 M-2 -28 q4 10 0 20" stroke="${fin}" stroke-width="2" fill="none"/>${eyes(14, 14, -22, { r: 3 }).replace(/<circle cx="14" cy="-22" r="3" fill="#22283A"\/><circle cx="14.9" cy="-22.9" r="0.8" fill="#fff"\/>$/, '')}<path d="M20 -14 q4 3 8 0" stroke="${C.ink}" stroke-width="1.4" fill="none"/></g>`;
}

function frog(o) {
  const g = '#6DBB6D', d = '#4E9A52', belly = '#CDEBB5';
  if (o.pose === 'swim') return `<g><path d="M-30 -8 q-14 -2 -18 8 M30 -8 q14 -2 18 8" stroke="${g}" stroke-width="7" stroke-linecap="round" fill="none"/><ellipse cx="0" cy="-10" rx="26" ry="12" fill="${g}"/><circle cx="-10" cy="-22" r="8" fill="${g}"/><circle cx="10" cy="-22" r="8" fill="${g}"/>${eyes(-10, 10, -23, { r: 3 })}<path d="M-8 -12 q8 6 16 0" stroke="${C.ink}" stroke-width="1.5" fill="none"/></g>`;
  const closed = o.pose === 'sleep';
  const jump = o.pose === 'jump';
  const sing = o.pose === 'sing';
  const legs = jump
    ? `<path d="M-14 -18 q-20 10 -30 28 M14 -18 q20 10 30 28" stroke="${g}" stroke-width="8" stroke-linecap="round" fill="none"/>`
    : `<path d="M-24 -4 q-10 -20 6 -22 M24 -4 q10 -20 -6 -22" fill="${d}"/><ellipse cx="-24" cy="-3" rx="10" ry="4" fill="${g}"/><ellipse cx="24" cy="-3" rx="10" ry="4" fill="${g}"/>`;
  const mouth = sing ? `<ellipse cx="0" cy="-18" rx="7" ry="5" fill="${C.ink}"/><ellipse cx="0" cy="-16" rx="4" ry="2" fill="${C.pink}"/>` : `<path d="M-12 -20 q12 8 24 0" stroke="${C.ink}" stroke-width="1.6" fill="none"/>`;
  return `<g>${legs}<ellipse cx="0" cy="-20" rx="26" ry="20" fill="${g}"/><ellipse cx="0" cy="-14" rx="17" ry="11" fill="${belly}"/><circle cx="-12" cy="-38" r="10" fill="${g}"/><circle cx="12" cy="-38" r="10" fill="${g}"/>${eyes(-12, 12, -39, { r: 3.6, closed })}${mouth}${cheeks(-17, 17, -26, 3)}${closed ? zzz(20, -50) : ''}</g>`;
}

function owl(o) {
  const little = o.little;
  const s = little ? 0.72 : 1;
  const body = little ? '#B9875F' : '#8C5D3E', face = '#F3E1C7', wing = little ? '#A27250' : '#74492F';
  const closed = o.pose === 'sleep';
  if (o.snuggle) {
    const little = `<g transform="translate(26 0) scale(.62)"><ellipse cx="0" cy="-34" rx="26" ry="32" fill="#B9875F"/><path d="M-22 -78 l6 14 l6 -8z M22 -78 l-6 14 l-6 -8z" fill="#B9875F"/><circle cx="0" cy="-58" r="22" fill="#B9875F"/><circle cx="-9" cy="-58" r="10" fill="${face}"/><circle cx="9" cy="-58" r="10" fill="${face}"/>${eyes(-9, 9, -58, { r: 4, closed })}<path d="M-3 -50 l3 6 l3 -6z" fill="${C.gold}"/></g>`;
    const wingOver = `<path d="M6 -60 Q52 -68 52 -26 Q52 -4 36 0 Q46 -20 42 -36 Q36 -54 6 -52 Z" fill="#74492F"/>`;
    return `<g><g transform="translate(-14 0)">${owl({ pose: o.pose })}</g>${little}${wingOver}${closed ? zzz(36, -70) : ''}</g>`;
  }
  return `<g transform="scale(${s})"><path d="M-10 -2 v-6 M10 -2 v-6" stroke="${C.gold}" stroke-width="3" stroke-linecap="round"/><ellipse cx="0" cy="-34" rx="26" ry="32" fill="${body}"/><path d="M-26 -40 q-8 18 6 34 q4 -18 -6 -34z M26 -40 q8 18 -6 34 q-4 -18 6 -34z" fill="${wing}"/><ellipse cx="0" cy="-24" rx="14" ry="16" fill="${face}" opacity=".55"/><path d="M-22 -78 l6 14 l6 -8z M22 -78 l-6 14 l-6 -8z" fill="${body}"/><circle cx="0" cy="-58" r="22" fill="${body}"/><circle cx="-9" cy="-58" r="10" fill="${face}"/><circle cx="9" cy="-58" r="10" fill="${face}"/>${eyes(-9, 9, -58, { r: 4, closed, mood: o.mood })}<path d="M-3 -50 l3 6 l3 -6z" fill="${C.gold}"/></g>`;
}

function seal() {
  const g = '#8E99AB';
  return `<g><path d="M-36 -6 q6 -30 30 -38 q24 -8 30 12 q4 18 -10 26z" fill="${g}"/><path d="M-38 -4 l-10 -12 l14 2z" fill="${g}"/><circle cx="18" cy="-46" r="16" fill="${g}"/>${eyes(14, 24, -50)}<circle cx="27" cy="-42" r="3" fill="${C.ink}"/><path d="M22 -38 h10 M22 -40 l10 -3" stroke="${C.ink}" stroke-width=".8" opacity=".5"/><path d="M-4 -14 q10 8 18 -2" stroke="#6F7A8C" stroke-width="5" stroke-linecap="round" fill="none"/></g>`;
}

// ---- things ---------------------------------------------------------------
const things = {
  moon: o => o.ground
    ? `<g><ellipse cx="0" cy="0" rx="120" ry="40" fill="#F6EBC8"/><ellipse cx="-40" cy="-6" rx="16" ry="5" fill="#E7D8AA"/><ellipse cx="30" cy="8" rx="20" ry="6" fill="#E7D8AA"/><ellipse cx="70" cy="-10" rx="10" ry="3" fill="#E7D8AA"/></g>`
    : `<g>${o.glow ? '<circle r="60" fill="#F7E7A8" opacity=".18"/><circle r="44" fill="#F7E7A8" opacity=".25"/>' : '<circle r="40" fill="#F7E7A8" opacity=".15"/>'}<circle r="28" fill="#F8EBC3"/><circle cx="-8" cy="-6" r="5" fill="#EADBA6"/><circle cx="9" cy="7" r="7" fill="#EADBA6"/><circle cx="10" cy="-11" r="3" fill="#EADBA6"/></g>`,
  sun: () => `<g>${Array.from({ length: 10 }, (_, i) => `<rect x="-3" y="-44" width="6" height="12" rx="3" fill="${C.gold}" transform="rotate(${i * 36})"/>`).join('')}<circle r="26" fill="${C.gold}"/><circle r="20" fill="#F7D36E"/></g>`,
  stars: () => [[-40, 0, 5], [-10, -18, 3.5], [24, 6, 4.5], [46, -14, 3], [0, 16, 2.6], [-58, -20, 2.4], [62, 14, 2.2]].map(([x, y, r]) => star(x, y, r)).join(''),
  cloud: () => `<g fill="#fff" opacity=".95"><ellipse cx="0" cy="0" rx="40" ry="14"/><circle cx="-14" cy="-10" r="16"/><circle cx="10" cy="-14" r="20"/><circle cx="28" cy="-4" r="12"/></g>`,
  heart: () => `<path d="M0 12 C-26 -6 -18 -26 0 -14 C18 -26 26 -6 0 12z" fill="${C.rose}"/>`,
  notes: () => `<g fill="${C.plum}"><path d="M-14 6 v-26 l14 -4 v24" stroke="${C.plum}" stroke-width="2.5" fill="none"/><ellipse cx="-17" cy="6" rx="5" ry="4"/><ellipse cx="-3" cy="2" rx="5" ry="4"/><path d="M18 -4 v-20" stroke="${C.plum}" stroke-width="2.5"/><ellipse cx="15" cy="-4" rx="5" ry="4"/></g>`,
  sparkle: () => `<g fill="${C.gold}"><path d="M0 -14 q2 12 14 14 q-12 2 -14 14 q-2 -12 -14 -14 q12 -2 14 -14z"/><path d="M20 -18 q1 6 7 7 q-6 1 -7 7 q-1 -6 -7 -7 q6 -1 7 -7z" opacity=".8"/></g>`,
  question: () => `<g><circle r="18" fill="#fff" opacity=".9"/><text y="9" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="700" font-size="26" fill="${C.ember}">?</text></g>`,
  snowflakes: () => Array.from({ length: 16 }, (_, i) => `<circle cx="${((i * 67) % 340) - 170}" cy="${((i * 41) % 90) - 30}" r="${2 + (i % 3)}" fill="#fff" opacity=".9"/>`).join(''),
  earth: () => `<g><circle r="22" fill="#5BA4CF"/><path d="M-12 -12 q8 -4 10 4 q-6 6 -2 12 q-8 2 -10 -6z M6 4 q8 -6 12 2 q-4 8 -10 8z" fill="#6DBB6D"/></g>`,
  wind: () => `<g stroke="#C9D6F2" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"><path d="M-80 0 q40 -20 80 0 t80 0"/><path d="M-60 18 q30 -14 60 0 t60 0" opacity=".7"/><path d="M-40 -18 q20 -10 40 0 t40 0" opacity=".6"/></g>`,
  thought: o => `<g><circle cx="-34" cy="30" r="4" fill="#fff"/><circle cx="-24" cy="18" r="6" fill="#fff"/><ellipse cx="0" cy="-6" rx="40" ry="28" fill="#fff"/><g transform="translate(0 14) scale(.55)">${things.ship({})}</g></g>`,
  motion: () => `<g stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round" opacity=".35"><path d="M-14 -10 h-18"/><path d="M-10 0 h-26"/><path d="M-14 10 h-18"/></g>`,
  window: o => `<g><rect x="-36" y="-40" width="72" height="80" rx="6" fill="${C.wood}"/><rect x="-30" y="-34" width="60" height="68" rx="3" fill="${o.snow ? '#DCEBF5' : C.sky}"/>${o.snow ? Array.from({ length: 10 }, (_, i) => `<circle cx="${((i * 23) % 54) - 27}" cy="${((i * 17) % 60) - 30}" r="2.2" fill="#fff"/>`).join('') + '<path d="M-30 24 q30 -10 60 0 v10 h-60z" fill="#fff"/>' : ''}<path d="M0 -34 v68 M-30 0 h60" stroke="${C.wood}" stroke-width="4"/></g>`,
  tree: o => `<g><rect x="-8" y="-60" width="16" height="60" rx="4" fill="${C.brown}"/><circle cx="0" cy="-92" r="38" fill="${C.leaf}"/><circle cx="-26" cy="-72" r="24" fill="${C.leaf}"/><circle cx="26" cy="-72" r="24" fill="${C.leafDeep}"/><circle cx="10" cy="-110" r="20" fill="#6FAE79"/>${o.owls ? `<g transform="translate(-14 -78) scale(.34)">${owl({})}</g><g transform="translate(12 -80) scale(.3)">${owl({ little: true })}</g>` : ''}</g>`,
  hill: () => `<path d="M-160 0 q80 -60 160 -60 q80 0 160 60z" fill="#7DB37F"/>`,
  house: () => `<g><rect x="-34" y="-50" width="68" height="50" fill="#F3D9B1"/><path d="M-42 -48 l42 -34 l42 34z" fill="${C.red}"/><rect x="-10" y="-28" width="20" height="28" rx="2" fill="${C.brown}"/><rect x="-28" y="-40" width="14" height="14" rx="2" fill="${C.gold}"/><rect x="14" y="-40" width="14" height="14" rx="2" fill="${C.gold}"/><rect x="16" y="-78" width="9" height="16" fill="#9C4A3A"/></g>`,
  bed: o => {
    const sleepers = o.sleepers || 0;
    let heads = '';
    const look = o._look || {};
    if (sleepers === 2) heads += `<g transform="translate(-54 -55) scale(.62)">${sleepHead(look, true)}</g>`;
    if (sleepers >= 1) heads += `<g transform="translate(${sleepers === 2 ? -24 : -46} -51) scale(.56)">${sleepHead(look, false)}</g>`;
    if (o.fox) heads += `<g transform="translate(-24 -40) scale(.8)">${fox({ peek: true, pose: 'sleep' })}</g>`;
    return `<g><rect x="-80" y="-70" width="12" height="70" rx="4" fill="${C.wood}"/><rect x="68" y="-48" width="12" height="48" rx="4" fill="${C.wood}"/><rect x="-74" y="-36" width="148" height="22" rx="6" fill="${C.cream}"/><ellipse cx="-52" cy="-40" rx="20" ry="9" fill="#fff"/>${heads}<path d="M-70 -38 q2 -6 10 -6 h134 v30 h-144z" fill="${C.plum}"/><path d="M-66 -32 q60 -6 136 0" stroke="#8E72A2" stroke-width="3" fill="none"/><path d="M-62 -22 h130" stroke="#8E72A2" stroke-width="3"/></g>`;
  },
  rug: () => `<g><ellipse cx="0" cy="-4" rx="80" ry="12" fill="#E7B87A"/><ellipse cx="0" cy="-4" rx="64" ry="8" fill="none" stroke="${C.ember}" stroke-width="2" stroke-dasharray="6 5"/></g>`,
  ball: () => `<g><circle cx="0" cy="-14" r="14" fill="${C.red}"/><path d="M-14 -14 q14 -8 28 0" stroke="#fff" stroke-width="3" fill="none"/></g>`,
  pan: o => o.front
    ? `<g><path d="M-40 -26 q40 10 80 0 q-4 26 -40 26 q-36 0 -40 -26z" fill="#6B7280"/><rect x="38" y="-28" width="44" height="7" rx="3.5" fill="#3F4654"/></g>`
    : `<g><ellipse cx="0" cy="-26" rx="40" ry="6" fill="#4B5563"/></g>`,
  hat: o => o.kind === 'bowl'
    ? (o.front ? `<g><path d="M-34 -30 q34 10 68 0 q0 30 -34 30 q-34 0 -34 -30z" fill="${C.teal}"/><path d="M30 -28 q30 -4 36 4 q-16 6 -36 2z" fill="#2F7C7C"/><path d="M-20 -14 h40" stroke="#2F7C7C" stroke-width="2"/></g>` : `<ellipse cx="0" cy="-30" rx="34" ry="7" fill="#2A6E6E"/>`)
    : o.kind === 'topbowl'
    ? (o.front ? `<g><path d="M-30 -52 q30 8 60 0 v48 q-30 8 -60 0z" fill="${C.ink}"/><path d="M-30 -36 q30 8 60 0 v9 q-30 8 -60 0z" fill="${C.red}"/><path d="M-44 -54 q44 14 88 0" stroke="#2E3550" stroke-width="7" fill="none" stroke-linecap="round"/></g>` : `<ellipse cx="0" cy="-54" rx="44" ry="10" fill="#2E3550"/><ellipse cx="0" cy="-53" rx="30" ry="7" fill="#11141F"/>`)
    : o.kind === 'cap'
    ? `<g><path d="M-30 -2 q0 -34 30 -34 q30 0 30 34z" fill="${C.teal}"/><path d="M24 -4 q30 -2 34 6 h-38z" fill="#2F7C7C"/><circle cx="0" cy="-36" r="4" fill="${C.gold}"/></g>`
    : `<g transform="${o.flip ? 'scale(1,-1) translate(0 0)' : ''}"><rect x="-26" y="-56" width="52" height="54" rx="4" fill="${C.ink}"/><rect x="-26" y="-18" width="52" height="9" fill="${C.red}"/><rect x="-40" y="-6" width="80" height="8" rx="4" fill="${C.ink}"/></g>`,
  bag: () => `<g><path d="M-28 0 q-6 -30 6 -44 h44 q12 14 6 44z" fill="#C8A26B"/><path d="M-22 -44 q22 -14 44 0" stroke="#9E7A47" stroke-width="5" fill="none"/><path d="M-14 -44 q14 -10 28 0" fill="#9E7A47"/></g>`,
  top: () => `<g><path d="M0 0 l-22 -26 q22 -12 44 0z" fill="${C.ember}"/><path d="M-22 -26 q22 -12 44 0 q-22 10 -44 0z" fill="${C.gold}"/><rect x="-3" y="-44" width="6" height="14" rx="3" fill="${C.brown}"/><path d="M-14 -16 h28" stroke="#fff" stroke-width="2.5" opacity=".7"/></g>`,
  hole: () => `<g><ellipse cx="0" cy="-6" rx="56" ry="14" fill="#7A5235"/><ellipse cx="0" cy="-8" rx="44" ry="9" fill="#4A3020"/></g>`,
  dirt: () => `<g fill="#8B6142"><circle cx="-10" cy="-8" r="10"/><circle cx="8" cy="-6" r="8"/><circle cx="20" cy="-20" r="4"/><circle cx="4" cy="-26" r="3"/></g>`,
  mud: () => `<g><ellipse cx="0" cy="-4" rx="70" ry="13" fill="#7A5235"/><ellipse cx="-20" cy="-6" rx="14" ry="4" fill="#94684A"/><ellipse cx="24" cy="-3" rx="10" ry="3" fill="#94684A"/></g>`,
  splash: () => `<g fill="#7A5235">${[[-40, -20, 5], [-28, -34, 4], [30, -28, 5], [44, -16, 4], [0, -40, 3.5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>`,
  tub: o => `<g><rect x="-74" y="-6" width="10" height="10" rx="3" fill="${C.wood}"/><rect x="64" y="-6" width="10" height="10" rx="3" fill="${C.wood}"/><path d="M-84 -60 h168 q-4 54 -50 56 h-68 q-46 -2 -50 -56z" fill="#fff"/><path d="M-84 -60 h168" stroke="#E2E8EE" stroke-width="7" stroke-linecap="round"/><path d="M-78 -54 h156 q-2 8 -6 14 h-144 q-4 -6 -6 -14z" fill="#9FD3E2"/>${o.bubbles ? [[-60, -62, 9], [-46, -70, 7], [50, -64, 10], [64, -72, 6], [36, -74, 5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#DCEFF5" stroke-width="1.5"/>`).join('') : ''}</g>`,
  ship: o => `<g transform="${o.tilt ? 'rotate(-8)' : ''}"><path d="M-36 -18 h72 l-12 18 h-48z" fill="${C.red}"/><rect x="-2" y="-70" width="4" height="54" fill="${C.brown}"/><path d="M2 -66 l30 42 h-30z" fill="${C.paper}"/><path d="M-2 -60 l-24 36 h24z" fill="${C.gold}"/><path d="M2 -70 l14 5 l-14 5z" fill="${C.teal}"/></g>`,
  log: () => `<g><rect x="-70" y="-28" width="140" height="28" rx="14" fill="${C.wood}"/><ellipse cx="66" cy="-14" rx="10" ry="14" fill="#D9AE7E"/><ellipse cx="66" cy="-14" rx="5" ry="7" fill="none" stroke="${C.brown}" stroke-width="1.5"/><path d="M-50 -18 h40 M0 -10 h36" stroke="${C.brown}" stroke-width="2" opacity=".5"/></g>`,
  rock: () => `<g><path d="M-50 0 q-4 -26 20 -32 q30 -8 54 4 q24 10 22 28z" fill="#A3A9B5"/><path d="M-20 -24 q16 -6 30 0" stroke="#C3C8D1" stroke-width="4" fill="none" stroke-linecap="round"/></g>`,
  ripple: () => `<g fill="none" stroke="#fff" stroke-width="2" opacity=".6"><ellipse rx="70" ry="8"/><ellipse rx="44" ry="5"/></g>`,
  cake: o => `<g><ellipse cx="0" cy="-2" rx="56" ry="8" fill="#E6E2DC"/><rect x="-42" y="-44" width="84" height="40" rx="6" fill="#F6C9D2"/><path d="M-42 -40 q10 12 21 0 q10 12 21 0 q10 12 21 0 q10 12 21 0 v-6 h-84z" fill="#fff"/><rect x="-42" y="-26" width="84" height="6" fill="#F0A8B8"/>${o.rose ? `<g transform="translate(0 -52)"><circle r="9" fill="${C.pink}"/><path d="M-5 -2 q5 -6 10 0 q-5 5 -10 0z" fill="#E07A97"/><path d="M-12 6 q-8 -4 -10 2 q6 4 10 -2z M12 6 q8 -4 10 2 q-6 4 -10 -2z" fill="${C.leaf}"/></g>` : `<rect x="-2" y="-62" width="4" height="16" fill="${C.sky}"/><path d="M0 -70 q4 4 0 8 q-4 -4 0 -8z" fill="${C.gold}"/>`}</g>`,
  bowl: o => `<g><path d="M-36 -30 h72 q-4 30 -36 30 q-32 0 -36 -30z" fill="${C.teal}"/><ellipse cx="0" cy="-30" rx="36" ry="7" fill="#F6E6C8"/>${o.stir ? `<rect x="6" y="-62" width="5" height="38" rx="2.5" fill="${C.wood}" transform="rotate(20 8 -30)"/>` : ''}</g>`,
  oven: () => `<g><rect x="-44" y="-90" width="88" height="90" rx="6" fill="#E9E4DA"/><rect x="-34" y="-62" width="68" height="46" rx="6" fill="#3F4654"/><rect x="-28" y="-56" width="56" height="34" rx="4" fill="#F2A65A" opacity=".75"/><circle cx="-24" cy="-76" r="5" fill="#9AA3AF"/><circle cx="-6" cy="-76" r="5" fill="#9AA3AF"/><circle cx="12" cy="-76" r="5" fill="#9AA3AF"/></g>`,
  boat: o => {
    const look = o._look || {};
    const riders = o.riders ? `<g transform="translate(-24 2) scale(.42)">${person({ peek: true }, look, true)}</g><g transform="translate(16 -12) scale(.42)">${person({ peek: true }, look, false)}</g>` : '';
    return `<g>${riders}<path d="M-74 -34 h148 q-10 34 -46 34 h-56 q-36 0 -46 -34z" fill="${C.leaf}"/><path d="M-74 -34 h148" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M-60 -20 h120" stroke="#4E8A5C" stroke-width="3"/>${o.riders ? '<path d="M40 -40 l40 34" stroke="#B98454" stroke-width="4" stroke-linecap="round"/>' : ''}</g>`;
  },
  rainbow: () => ['#E26D5A', '#F2A65A', '#F2C14E', '#8DB596', '#5BA4CF', '#8E72A2'].map((c, i) => `<path d="M${-120 + i * 9} 0 a${120 - i * 9} ${110 - i * 9} 0 0 1 ${240 - i * 18} 0" stroke="${c}" stroke-width="9" fill="none" opacity=".85"/>`).join(''),
  rocket: o => {
    const body = `<path d="M0 -120 q30 30 26 84 h-52 q-4 -54 26 -84z" fill="#D7DCE4"/><rect x="-26" y="-60" width="52" height="24" fill="#C3A27A"/><path d="M-26 -58 h52" stroke="#A88660" stroke-width="2"/><circle cx="0" cy="-84" r="11" fill="${C.sky}" stroke="#9AA3AF" stroke-width="3"/>${o.fox ? `<g transform="translate(0 -78) scale(.36)">${fox({ peek: true })}</g>` : ''}<path d="M-26 -44 l-20 34 l20 -6z M26 -44 l20 34 l-20 -6z" fill="${C.red}"/><path d="M-14 -36 h28 l-6 18 h-16z" fill="#8B949F"/>`;
    const flame = o.flying ? `<path d="M-12 -18 q12 50 24 0 q-12 14 -24 0z" fill="${C.gold}"/><path d="M-6 -18 q6 28 12 0z" fill="${C.ember}"/>` : `<path d="M-30 0 h60" stroke="#6B7280" stroke-width="4"/>`;
    return `<g transform="translate(0 ${o.flying ? -10 : -18})">${flame}${body}</g>`;
  },
  string: () => `<g fill="none" stroke="${C.gold}" stroke-width="3"><ellipse cx="0" cy="-8" rx="18" ry="8"/><ellipse cx="0" cy="-12" rx="14" ry="6"/><path d="M18 -8 q14 4 20 8"/></g>`,
  snowman: o => `<g><circle cx="0" cy="-30" r="32" fill="#fff"/><circle cx="0" cy="-82" r="24" fill="#fff"/><circle cx="0" cy="-120" r="18" fill="#fff"/>${eyes(-6, 6, -124)}<path d="M0 -118 l16 4 l-16 4z" fill="${C.ember}"/><path d="M-6 -110 q6 4 12 0" stroke="${C.ink}" stroke-width="1.5" fill="none"/><circle cx="0" cy="-88" r="2.5" fill="${C.ink}"/><circle cx="0" cy="-76" r="2.5" fill="${C.ink}"/><path d="M-22 -86 l-26 -14 M22 -86 l26 -14" stroke="${C.brown}" stroke-width="3.5" stroke-linecap="round"/><path d="M-18 -102 h36 v8 h-36z" fill="${C.teal}"/>${o.hat ? `<path d="M-16 -134 q0 -22 16 -22 q16 0 16 22z" fill="${C.red}"/><rect x="-20" y="-138" width="40" height="7" rx="3.5" fill="#fff"/><circle cx="0" cy="-158" r="5" fill="#fff"/>` : ''}</g>`,
  snowball: () => `<g><circle cx="0" cy="-26" r="26" fill="#fff"/><path d="M-14 -36 q10 -6 20 0" stroke="#E3ECF3" stroke-width="3" fill="none"/></g>`,
  branch: () => `<g><path d="M-180 0 q90 -16 180 -6 q90 8 180 -4" stroke="${C.brownDeep}" stroke-width="14" fill="none" stroke-linecap="round"/><g fill="${C.leafDeep}"><ellipse cx="-120" cy="-16" rx="16" ry="7" transform="rotate(-20 -120 -16)"/><ellipse cx="110" cy="-18" rx="16" ry="7" transform="rotate(20 110 -18)"/></g></g>`,
  towel: () => '',
  box: o => `<g><path d="M-50 -66 l-14 -16 h36 l14 16z M50 -66 l14 -16 h-36 l-14 16z" fill="#D9B07A"/><rect x="-50" y="-66" width="100" height="66" rx="3" fill="#C99A5F"/><path d="M-50 -66 h100" stroke="#B5864D" stroke-width="3"/><rect x="-10" y="-66" width="20" height="26" fill="#E8D0A6" opacity=".7"/>${o.wheels ? `<circle cx="-30" cy="0" r="11" fill="${C.ink}"/><circle cx="30" cy="0" r="11" fill="${C.ink}"/><circle cx="-30" cy="0" r="4" fill="${C.grey}"/><circle cx="30" cy="0" r="4" fill="${C.grey}"/>` : ''}</g>`,
};

function star(x, y, r) {
  return `<path transform="translate(${x} ${y})" d="M0 ${-r * 2} L${r * 0.6} ${-r * 0.6} L${r * 2} 0 L${r * 0.6} ${r * 0.6} L0 ${r * 2} L${-r * 0.6} ${r * 0.6} L${-r * 2} 0 L${-r * 0.6} ${-r * 0.6}Z" fill="#F7E7A8"/>`;
}

function sleepHead(look, adult) {
  const skin = SKIN[(adult ? look.grownupSkin : look.childSkin) ?? 2];
  const hairC = HAIR[(adult ? look.grownupHairColor : look.childHairColor) ?? 0];
  const style = (adult ? look.grownupHair : look.childHair) || (adult ? 'bun' : 'puffs');
  const h = hair(style, hairC, 0, 0, 20, adult);
  return `<g>${h.back}<circle r="20" fill="${skin}"/>${h.front}${eyes(-7, 7, 2, { closed: true })}${cheeks(-12, 12, 8, 3)}${adult ? '' : zzz(18, -18)}</g>`;
}

// ---- backgrounds -----------------------------------------------------------
function background(bg) {
  const ground = (fill, y = 200) => `<path d="M0 ${y} q100 -10 200 -4 t200 2 v${H - y + 10} h-400z" fill="${fill}"/>`;
  const skyGrad = (id, a, b) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`;
  switch (bg) {
    case 'night': return skyGrad('gN', '#18213B', '#33406A') + [[30, 30, 1.6], [90, 60, 1.2], [150, 24, 1.8], [220, 50, 1.1], [270, 20, 1.4], [340, 64, 1.2], [370, 30, 1.6], [120, 96, 1], [300, 100, 1]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#F7E7A8" opacity=".8"/>`).join('') + ground('#26314F', 206);
    case 'dusk': return skyGrad('gD', '#5B4C8A', '#F2A65A') + ground('#5E6F8F', 206);
    case 'day': return skyGrad('gY', '#AEDCEB', '#E6F4EF') + `<g fill="#fff" opacity=".8"><ellipse cx="80" cy="50" rx="36" ry="10"/><ellipse cx="300" cy="36" rx="30" ry="8"/></g>` + ground('#9CCB8A', 204) + `<path d="M0 230 q120 -14 400 0 v40 h-400z" fill="#8BBE7A"/>`;
    case 'farm': return skyGrad('gF', '#BFE3EE', '#F3F7EC') + ground('#A9CF8C', 204) + `<g stroke="#C79A6B" stroke-width="5"><path d="M0 180 h400 M0 196 h400"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 50 + 10} 172 v34"/>`).join('')}</g>`;
    case 'room': return `<rect width="${W}" height="${H}" fill="#F6E7D3"/><path d="M0 0 h400 v196 h-400z" fill="#F3DFC4"/><g opacity=".35" fill="#E7C9A3">${Array.from({ length: 12 }, (_, i) => `<circle cx="${i * 36 + 14}" cy="${(i % 2) * 40 + 40}" r="3"/>`).join('')}</g><rect y="196" width="400" height="64" fill="#D9B48A"/><path d="M0 196 h400" stroke="#C49A6C" stroke-width="4"/><g transform="translate(345 90)"><rect x="-26" y="-34" width="52" height="40" rx="3" fill="#E9D2B2" stroke="#C49A6C" stroke-width="3"/><path d="M-18 0 l10 -14 l8 8 l8 -12 l10 18z" fill="#8DB596"/></g>`;
    case 'kitchen': return `<rect width="${W}" height="${H}" fill="#FBEFDD"/><g stroke="#EED9BB" stroke-width="2">${Array.from({ length: 8 }, (_, i) => `<path d="M0 ${i * 26 + 12} h400"/>`).join('')}${Array.from({ length: 14 }, (_, i) => `<path d="M${i * 30} 0 v196"/>`).join('')}</g><rect y="190" width="400" height="70" fill="#C99A6B"/><rect y="186" width="400" height="8" fill="#E8D5B7"/>`;
    case 'bath': return `<rect width="${W}" height="${H}" fill="#E4F2F6"/><g stroke="#CDE6EE" stroke-width="2">${Array.from({ length: 9 }, (_, i) => `<path d="M0 ${i * 24 + 12} h400"/>`).join('')}${Array.from({ length: 14 }, (_, i) => `<path d="M${i * 30 + 15} 0 v210"/>`).join('')}</g><rect y="210" width="400" height="50" fill="#BFD9E2"/>`;
    case 'pond': return skyGrad('gP', '#BFE3EE', '#EAF6F0') + ground('#8CC07F', 168) + `<ellipse cx="200" cy="222" rx="230" ry="44" fill="#5FA7B8"/><ellipse cx="200" cy="222" rx="200" ry="30" fill="#6DB4C4"/><g stroke="#5E9C6A" stroke-width="3" stroke-linecap="round"><path d="M30 196 q-4 -30 2 -50 M40 198 q6 -26 0 -44 M370 194 q4 -28 -2 -46"/></g><g fill="#A0703F"><ellipse cx="33" cy="146" rx="4" ry="10"/><ellipse cx="368" cy="148" rx="4" ry="10"/></g>`;
    case 'sea': return skyGrad('gS', '#BFE3EE', '#F3F8F4') + `<rect y="150" width="400" height="110" fill="${C.sea}"/><path d="M0 150 q25 -8 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 v12 h-400z" fill="#6AAABC"/><g stroke="#fff" stroke-width="2" fill="none" opacity=".45"><path d="M40 200 q15 -6 30 0 M260 230 q15 -6 30 0 M150 246 q15 -6 30 0"/></g>`;
    case 'beach': return skyGrad('gB', '#BFE3EE', '#F3F8F4') + `<rect y="132" width="400" height="60" fill="${C.sea}"/><path d="M0 132 q25 -6 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 v8 h-400z" fill="#6AAABC"/><path d="M0 186 q200 -24 400 0 v80 h-400z" fill="${C.sand}"/>`;
    case 'rain': return skyGrad('gR', '#8E9AAF', '#C9D2DE') + `<rect y="150" width="400" height="110" fill="${C.seaDeep}"/><g stroke="#E3ECF5" stroke-width="2" stroke-linecap="round" opacity=".7">${Array.from({ length: 30 }, (_, i) => `<path d="M${(i * 53) % 400} ${(i * 37) % 150} l-6 14"/>`).join('')}</g>`;
    case 'space': return `<rect width="${W}" height="${H}" fill="#121A33"/>` + Array.from({ length: 40 }, (_, i) => `<circle cx="${(i * 97) % 400}" cy="${(i * 61) % 260}" r="${(i % 3) * 0.6 + 0.8}" fill="#F7E7A8" opacity="${0.4 + (i % 4) * 0.15}"/>`).join('');
    case 'snow': return skyGrad('gW', '#C7DCEB', '#EEF4F8') + `<path d="M0 196 q100 -14 200 -6 t200 0 v76 h-400z" fill="${C.snow}"/><path d="M0 230 q120 -10 400 0 v40 h-400z" fill="#E6EEF4"/>`;
    default: return `<rect width="${W}" height="${H}" fill="${C.cream}"/>`;
  }
}

// ---- composition ------------------------------------------------------------
function element(name, o, look) {
  switch (name) {
    case 'child': return person(o, look, false);
    case 'grownup': return person(o, look, true);
    case 'cat': return cat(o);
    case 'dog': return dog(o);
    case 'pup': return dog(o, { color: '#E8D2A6', ear: '#B08452', size: 0.72 });
    case 'hen': return hen(o);
    case 'fox': return fox(o);
    case 'duck': return duck(o);
    case 'fish': return fish(o);
    case 'frog': return frog(o);
    case 'owl': return owl(o);
    case 'seal': return seal(o);
    default: return things[name] ? things[name]({ ...o, _look: look }) : '';
  }
}

/**
 * Render a scene to an SVG string.
 * @param scene {bg, items:[[name, x%, y%, scale, opts]]}
 * @param look  family look (skin/hair choices)
 */
export function renderScene(scene, look = {}, { title = '', className = 'scene' } = {}) {
  const items = (scene.items || []).map(([name, x = 50, y = 86, s = 1, o = {}]) => {
    const flip = o.flip ? -1 : 1;
    const tx = (x / 100) * W, ty = (y / 100) * H;
    const body = element(name, o, look);
    return `<g class="el el-${name}" transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${(s * flip).toFixed(2)} ${s.toFixed(2)})">${body}</g>`;
  }).join('');
  const label = title ? `<title>${title.replace(/</g, '&lt;')}</title>` : '';
  return `<svg class="${className}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid slice">${label}${background(scene.bg)}${items}</svg>`;
}

export const ELEMENTS = ['child', 'grownup', 'cat', 'dog', 'pup', 'hen', 'fox', 'duck', 'fish', 'frog', 'owl', 'seal', ...Object.keys(things)];
export const BACKGROUNDS = ['room', 'kitchen', 'bath', 'day', 'dusk', 'night', 'farm', 'pond', 'sea', 'beach', 'rain', 'space', 'snow'];
export { SKY_ITEMS };
