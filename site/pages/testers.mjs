import { page, ICON, stars, SITE } from '../layout.mjs';
import { phone } from '../parts.mjs';

// Guide for people testing the prototype, and for staff running test sessions.
// Shared by link (/testers/ or /test), not listed in the menu or search engines.
const both = (en, es) => `<div data-lang="en">${en}</div><div data-lang="es" lang="es" hidden>${es}</div>`;
const inline = (en, es) => `<span data-lang="en">${en}</span><span data-lang="es" lang="es" hidden>${es}</span>`;

const TRY = [
  ['setup', 'Set up Hearth for your family: your child’s name, what they call you, and how the pictures look.', 'Prepare Hearth para su familia: el nombre de su hijo, cómo le llama a usted y cómo se ven los dibujos.'],
  ['check', 'Do the short reading check. Skipping words is completely fine.', 'Haga la pequeña prueba de lectura. Saltar palabras está perfectamente bien.'],
  ['practise', 'Tap <b>Practise first</b> and read tonight’s story out loud. Stop on a word for a few seconds and see what happens.', 'Toque <b>Practicar primero</b> y lea el cuento en voz alta. Deténgase en una palabra unos segundos y vea qué pasa.'],
  ['together', 'Tap <b>Read with</b> your child and read the story at bedtime. No child nearby? Read it to yourself.', 'Toque <b>Leer con</b> su hijo y lea el cuento a la hora de dormir. ¿No hay un niño cerca? Léaselo a usted mismo.'],
  ['sky', 'Open <b>Your sky</b> to see the sounds you can read.', 'Abra <b>Su cielo</b> para ver los sonidos que puede leer.'],
  ['feedback', 'Send us your feedback. It takes a minute (see below).', 'Envíenos sus comentarios. Toma un minuto (vea abajo).'],
];

export default page({
  path: '/testers/',
  title: 'Testing Hearth',
  description: 'How to open, install and test the Hearth prototype, send feedback, and run a test session.',
  noindex: true,
  scripts: ['/assets/vendor/qrcode.js', '/assets/testers.js'],
  body: `
<section class="page-hero night">
  ${stars(50)}
  <div class="wrap">
    <div class="cta-row no-print" style="margin-bottom:18px">
      <div class="lang-switch" role="group" aria-label="Language / Idioma"><button data-set-lang="en" aria-pressed="true">English</button><button data-set-lang="es" aria-pressed="false">Español</button></div>
      <button class="btn line sm listen-btn" data-listen aria-label="Listen to this page"><span style="width:20px;height:20px;display:inline-flex">${ICON.speaker}</span>${inline('Listen to this page', 'Escuchar esta página')}</button>
    </div>
    ${both(
      `<span class="eyebrow">Hearth test version</span><h1>Thank you for testing Hearth.</h1><p class="lead">Hearth helps parents practise tonight’s bedtime story in private, then read it to their child. This is an early test. Your honest reactions, especially when something is hard or confusing, decide what we build next.</p>`,
      `<span class="eyebrow">Versión de prueba de Hearth</span><h1>Gracias por probar Hearth.</h1><p class="lead">Hearth ayuda a los padres a practicar el cuento de esta noche en privado, y luego leérselo a su hijo. Esta es una prueba temprana. Sus reacciones sinceras, sobre todo cuando algo es difícil o confuso, deciden lo que haremos después.</p>`,
    )}
    <div class="cta-row"><a class="btn lamp" href="/app/">${inline('Open the app', 'Abrir la app')}</a><a class="btn line" href="#feedback">${inline('How to send feedback', 'Cómo enviar comentarios')}</a></div>
  </div>
</section>

<section class="band paper big-text" data-read aria-labelledby="openTitle">
  <div class="wrap split">
    <div class="stack-lg">
      ${both(
        `<h2 id="openTitle">Open Hearth on your phone</h2>
         <ol class="steps-list">
           <li><span><b>Scan the code</b> with your phone’s camera, or type the address under it.</span></li>
           <li><span><b>Allow the microphone</b> if you want Hearth to follow your voice. You can also tap words instead.</span></li>
           <li><span><b>Put it on your home screen.</b> Android (Chrome): tap the menu <b>⋮</b>, then <b>Add to Home screen</b> or <b>Install app</b>. iPhone (Safari): tap <b>Share</b>, then <b>Add to Home Screen</b>.</span></li>
         </ol>
         <p class="callout">Voice works best in <b>Chrome on Android</b> or <b>Safari on iPhone</b>, in a quiet room. If Hearth can’t hear you, open Settings and choose <b>I’ll tap words I need</b>.</p>`,
        `<h2>Abra Hearth en su teléfono</h2>
         <ol class="steps-list">
           <li><span><b>Escanee el código</b> con la cámara de su teléfono, o escriba la dirección que aparece abajo.</span></li>
           <li><span><b>Permita el micrófono</b> si quiere que Hearth siga su voz. También puede tocar las palabras.</span></li>
           <li><span><b>Póngalo en su pantalla de inicio.</b> Android (Chrome): toque el menú <b>⋮</b> y luego <b>Agregar a la pantalla principal</b> o <b>Instalar app</b>. iPhone (Safari): toque <b>Compartir</b> y luego <b>Agregar a inicio</b>.</span></li>
         </ol>
         <p class="callout">La voz funciona mejor en <b>Chrome en Android</b> o <b>Safari en iPhone</b>, en un lugar tranquilo. Si Hearth no le escucha, abra Ajustes y elija <b>Tocaré las palabras que necesito</b>.</p>`,
      )}
    </div>
    <div class="qr-card" id="qrCard">
      <div class="qr-brand"><span>hearth</span> ${inline('Scan to open Hearth', 'Escanee para abrir Hearth')}</div>
      <div class="qr" data-qr role="img" aria-label="QR code that opens the Hearth app"></div>
      <p class="qr-url" data-app-url>/app/</p>
      <div class="cta-row no-print" style="justify-content:center"><button class="btn ink sm" type="button" data-copy-url>${inline('Copy link', 'Copiar enlace')}</button><button class="btn line sm" type="button" data-print="card">${inline('Print this card', 'Imprimir esta tarjeta')}</button></div>
    </div>
  </div>
</section>

<section class="band paper-2 big-text" data-read aria-labelledby="tryTitle">
  <div class="wrap">
    <div class="section-head">${both('<h2 id="tryTitle">What to try</h2><p class="lead">About 20 minutes in all. Tick things off as you go; this list is saved only on this device.</p>', '<h2>Qué probar</h2><p class="lead">Unos 20 minutos en total. Marque cada paso al terminarlo; esta lista se guarda solo en este aparato.</p>')}</div>
    <ul class="todo" data-checklist>
      ${TRY.map(([id, en, es]) => `<li><label><input type="checkbox" data-check="${id}"><span class="box" aria-hidden="true">${ICON.check}</span><span>${inline(en, es)}</span></label></li>`).join('')}
    </ul>
    <p class="muted mt" data-check-count aria-live="polite"></p>
    ${both('<p class="small muted">Extra, if you have time: switch to Spanish in Settings, or record yourself reading a story for a night you work late.</p>', '<p class="small muted">Extra, si tiene tiempo: cambie a inglés o español en Ajustes, o grábese leyendo un cuento para una noche en que trabaje tarde.</p>')}
  </div>
</section>

<section class="band night big-text" id="feedback" data-read aria-labelledby="fbTitle">
  <div class="wrap split">
    <div class="stack-lg">
      ${both(
        `<span class="eyebrow">Your feedback</span><h2 id="fbTitle">Tell us what you think.</h2>
         <ol class="steps-list">
           <li><span>In Hearth, open <b>Settings</b> and tap <b>Send feedback</b>. After story time you can also tap <b>Tell us how it went</b>.</span></li>
           <li><span>Tap a face, choose a few words, or <b>record a voice message</b>. You don’t have to write anything.</span></li>
           <li><span>You see exactly what will be sent. Send it to the person who invited you, or email us at <a href="mailto:${SITE.contact}">${SITE.contact}</a>.</span></li>
         </ol>
         <p class="lead">There are no wrong answers. If something is confusing, that’s our mistake, not yours.</p>`,
        `<span class="eyebrow">Sus comentarios</span><h2>Díganos qué piensa.</h2>
         <ol class="steps-list">
           <li><span>En Hearth, abra <b>Ajustes</b> y toque <b>Enviar comentarios</b>. Después de la hora del cuento también puede tocar <b>Cuéntenos cómo le fue</b>.</span></li>
           <li><span>Toque una cara, elija unas palabras o <b>grabe un mensaje de voz</b>. No tiene que escribir nada.</span></li>
           <li><span>Usted ve exactamente lo que se enviará. Envíelo a la persona que le invitó, o escríbanos a <a href="mailto:${SITE.contact}">${SITE.contact}</a>.</span></li>
         </ol>
         <p class="lead">No hay respuestas incorrectas. Si algo es confuso, el error es nuestro, no suyo.</p>`,
      )}
    </div>
    <div class="media">${phone('app-feedback.png', 'The feedback screen in Hearth: three faces, a few quick choices, a button to record a voice message, and a preview of exactly what will be sent.')}</div>
  </div>
</section>

<section class="band paper big-text" data-read aria-labelledby="privTitle">
  <div class="wrap">
    <div class="section-head">${both('<h2 id="privTitle">Your privacy in this test</h2>', '<h2>Su privacidad en esta prueba</h2>')}</div>
    <div class="grid2">
      <div class="card"><div class="glyph">${ICON.phone}</div>${both('<h3>It stays on your phone</h3><p>Your names, your progress and your recordings are saved only on your phone. We can’t see them.</p>', '<h3>Se queda en su teléfono</h3><p>Sus nombres, su progreso y sus grabaciones se guardan solo en su teléfono. Nosotros no podemos verlos.</p>')}</div>
      <div class="card"><div class="glyph">${ICON.speaker}</div>${both('<h3>Your voice</h3><p>In this test version, your browser’s speech service listens so Hearth can follow along. It may send the sound of your voice to the company that makes your browser (Google for Chrome, Apple for Safari). Tap mode doesn’t use it.</p>', '<h3>Su voz</h3><p>En esta versión de prueba, el servicio de voz de su navegador escucha para que Hearth siga la lectura. Puede enviar el sonido de su voz a la empresa que hace su navegador (Google para Chrome, Apple para Safari). El modo de tocar no lo usa.</p>')}</div>
      <div class="card"><div class="glyph">${ICON.hand}</div>${both('<h3>Feedback is your choice</h3><p>Hearth sends nothing by itself. Feedback goes only where you send it, and you see it first.</p>', '<h3>Los comentarios son su decisión</h3><p>Hearth no envía nada por sí solo. Los comentarios van solo a donde usted los envíe, y usted los ve primero.</p>')}</div>
      <div class="card"><div class="glyph">${ICON.lock}</div>${both('<h3>Start over any time</h3><p>In Settings, <b>Start over</b> deletes everything Hearth saved on this phone.</p>', '<h3>Empiece de nuevo cuando quiera</h3><p>En Ajustes, <b>Empezar de nuevo</b> borra todo lo que Hearth guardó en este teléfono.</p>')}</div>
    </div>
  </div>
</section>

<section class="band paper-2 big-text" data-read aria-labelledby="limitsTitle">
  <div class="wrap">
    <div class="section-head">${both('<h2 id="limitsTitle">Good to know</h2>', '<h2>Bueno saber</h2>')}</div>
    ${both(
      `<ul class="checklist">
        <li>This is a test version. Some things may not work yet. Please tell us when they don’t.</li>
        <li>There are 14 stories in the library. Writing brand-new stories is turned off in this test.</li>
        <li>Your progress is saved in this browser on this phone. Clearing your browsing data, or using a different phone, starts fresh.</li>
        <li>Voice following is still learning and can miss words, especially in a noisy room. Tap mode always works.</li>
        <li>On iPhone, if Hearth can’t hear you from the home-screen icon, open it in Safari instead.</li>
      </ul>`,
      `<ul class="checklist">
        <li>Esta es una versión de prueba. Algunas cosas pueden no funcionar todavía. Por favor, díganos cuando pase.</li>
        <li>Hay 14 cuentos en la biblioteca. Escribir cuentos nuevos está desactivado en esta prueba.</li>
        <li>Su progreso se guarda en este navegador, en este teléfono. Si borra los datos de navegación o usa otro teléfono, empieza de cero.</li>
        <li>Seguir la voz todavía está aprendiendo y puede perder palabras, sobre todo con ruido. El modo de tocar siempre funciona.</li>
        <li>En iPhone, si Hearth no le escucha desde el ícono de inicio, ábralo en Safari.</li>
      </ul>`,
    )}
  </div>
</section>

<section class="band paper" id="facilitators" aria-labelledby="facTitle">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">For program staff and researchers</span>
      <h2 id="facTitle">Running a test session</h2>
      <p class="lead">A 30-minute session with one parent at a time. Print this section and bring it with you.</p>
      <div class="cta-row no-print"><button class="btn ink sm" type="button" data-print="guide">Print the session guide</button></div>
    </div>
    <div class="grid2">
      <div class="card">
        <h3>Who to invite first</h3>
        <p>Start with staff and parents who are comfortable giving honest feedback. Before testing with families who find reading hard, put your program’s consent process in place. Invite everyone in a group the same way, so no one is singled out because of reading.</p>
        <h3 class="mt">Before the session</h3>
        <ul class="checklist"><li>A charged phone, or the parent’s own phone</li><li>A quiet corner, away from other parents</li><li>The QR card above, printed</li><li>A thank-you for the parent’s time</li><li>Your consent form, read aloud</li></ul>
      </div>
      <div class="card">
        <h3>Say this before you start</h3>
        <blockquote class="consent">“We’re testing a new app that helps parents practise bedtime stories. We’re testing the app, not you. There are no wrong answers, and you can stop at any time. What you practise stays on your phone. If you want to share feedback, you choose what to send. Is it okay if I watch and take a few notes?”</blockquote>
      </div>
    </div>
    <div class="table-wrap mt-l">
      <table class="t">
        <thead><tr><th>Minutes</th><th>What happens</th><th>What to watch for</th></tr></thead>
        <tbody>
          <tr><td>0–5</td><td>Welcome, consent, open Hearth from the QR code</td><td>Can they open and install it without help?</td></tr>
          <tr><td>5–10</td><td>Setup: child’s name, look, short reading check</td><td>Do they use “press and hold to hear”? Do they skip words comfortably?</td></tr>
          <tr><td>10–20</td><td>Practise tonight’s story alone</td><td>Where they pause, which hint helps (chunks, sounds or the word), anything that feels like a test</td></tr>
          <tr><td>20–25</td><td>Read the story aloud, to their child or to you</td><td>Confidence compared with practice; do they use the question on each page?</td></tr>
          <tr><td>25–30</td><td>Talk, then send feedback together from Settings</td><td>Their words, not yours</td></tr>
        </tbody>
      </table>
    </div>
    <div class="grid2 mt-l">
      <div class="card">
        <h3>While you watch</h3>
        <ul class="checklist"><li>Let them work through a hard word before you help; that’s what Hearth is for.</li><li>Don’t read words for them unless they ask.</li><li>Write down what they say, where they pause and what they tap.</li><li>If they seem embarrassed, switch to the demo reader in Settings and talk about it together instead.</li></ul>
      </div>
      <div class="card">
        <h3>Questions to ask at the end</h3>
        <ol class="steps-list"><li><span>What was that like for you?</span></li><li><span>When did Hearth help, and when did it get in the way?</span></li><li><span>Would you use it tonight? What would stop you?</span></li><li><span>Did anything feel like a test?</span></li><li><span>What would you tell a friend about it?</span></li></ol>
      </div>
    </div>
    <p class="muted mt">Afterwards, send your notes with the parent’s permission, from <b>Settings → Send feedback</b> on your own phone, or by email to <a href="mailto:${SITE.contact}">${SITE.contact}</a>. Include the build number shown at the bottom of Settings.</p>
  </div>
</section>
`,
});
