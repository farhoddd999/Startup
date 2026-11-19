// Words never offered to the story writer or shown as examples, even if decodable.
// (Stories are also reviewed by the validator; this keeps the vocabulary clean.)
export const BLOCKED_WORDS = new Set(`
shit shits shitty shots shag shagged hash stoned crotch crap damn damned hell piss pissed fuck fucks fucked fucking ass asses arse bitch bitches bastard slut whore
cock dick dicks prick pussy tits tit boob boobs sex sexy porn nude naked rape raped kill kills killed killer die dies died dead death
gun guns shot shoot shoots stab stabbed blood bloody gore drug drugs meth weed beer wine booze drunk vodka gin rum
hate hates stupid dumb idiot moron fat ugly sucks suck sucked jerk jerks loser shut-up nazi slave whip whips cuss
fag fags dyke homo retard retarded spaz cripple tranny gay lesbian crack crackhead pimp hooker bum bums butt butts fart farts
`.split(/\s+/).filter(Boolean));
export const isBlocked = w => BLOCKED_WORDS.has(String(w).toLowerCase());
