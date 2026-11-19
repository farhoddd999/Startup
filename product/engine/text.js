// Text utilities: personalisation and tokenisation.

/** Replace {child}, {grownup} and friends with the family's own words. */
export function personalize(text, family = {}) {
  const child = family.childName || 'Maya';
  const grownup = family.grownup || 'Mama';
  return text
    .replace(/\{child\}/g, child)
    .replace(/\{Grownup\}/g, grownup.charAt(0).toUpperCase() + grownup.slice(1))
    .replace(/\{grownup\}/g, grownup);
}

export function normalizeWord(w) {
  return w.toLowerCase().replace(/[’‘`]/g, "'").replace(/[^a-z']/g, '').replace(/^'+|'+$/g, '');
}

/**
 * Split text into display tokens. Words get a running index `wi` so the
 * reader, tracker and hints can all point at the same word.
 * @returns {Array<{t:'w'|'s'|'p', text:string, norm?:string, wi?:number}>}
 */
export function tokenize(text) {
  const out = [];
  const re = /([A-Za-z][A-Za-z'’]*)|(\s+)|([^A-Za-z\s]+)/g;
  let m, wi = 0;
  while ((m = re.exec(text))) {
    if (m[1]) {
      // keep possessive 's with the word for display, but analyse the base too
      out.push({ t: 'w', text: m[1], norm: normalizeWord(m[1]), wi: wi++ });
    } else if (m[2]) out.push({ t: 's', text: m[2] });
    else out.push({ t: 'p', text: m[3] });
  }
  return out;
}

export const words = text => tokenize(text).filter(t => t.t === 'w');

/** Strip a possessive so "Maya's" is checked as "Maya" + 's. */
export function baseForm(norm) {
  return norm.endsWith("'s") ? norm.slice(0, -2) : norm;
}
