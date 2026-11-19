import { page, ICON, stars } from '../layout.mjs';
import { phone } from '../parts.mjs';

// Bilingual page: every block exists in English and Spanish; a toggle shows one.
const both = (en, es) => `<div data-lang="en">${en}</div><div data-lang="es" lang="es" hidden>${es}</div>`;

export default page({
  path: '/families/',
  title: 'For families',
  description: 'Hearth helps you read the bedtime story with confidence. Private, free for families, in English or Spanish. Hearth le ayuda a leer el cuento de buenas noches.',
  body: `
<section class="page-hero night">
  ${stars(50)}
  <div class="wrap">
    <div class="cta-row no-print" style="margin-bottom:18px">
      <div class="lang-switch" role="group" aria-label="Language / Idioma"><button data-set-lang="en" aria-pressed="true">English</button><button data-set-lang="es" aria-pressed="false">Español</button></div>
      <button class="btn line sm listen-btn" data-listen aria-label="Listen to this page"><span style="width:20px;height:20px;display:inline-flex">${ICON.speaker}</span><span data-lang="en">Listen to this page</span><span data-lang="es" lang="es" hidden>Escuchar esta página</span></button>
    </div>
    ${both(
      `<span class="eyebrow">For families</span><h1>Read the bedtime story with confidence.</h1><p class="lead">Hearth is a free app that helps you practise tonight’s story in private. Then you read it to your child. Every night, you both get better at reading.</p>`,
      `<span class="eyebrow">Para familias</span><h1>Lea el cuento de buenas noches con confianza.</h1><p class="lead">Hearth es una aplicación gratis que le ayuda a practicar el cuento de esta noche en privado. Luego usted se lo lee a su hijo. Cada noche, los dos mejoran en la lectura.</p>`,
    )}
    <div class="cta-row"><a class="btn lamp" href="/app/">${both('Try Hearth now', 'Probar Hearth ahora')}</a><a class="btn line" href="/stories/">${both('Read a story', 'Leer un cuento')}</a></div>
  </div>
</section>

<section class="band paper big-text" data-read aria-label="How it helps">
  <div class="wrap split">
    <div class="stack-lg">
      ${both(
        `<h2>Three small steps</h2><ol class="steps-list"><li><span><b>Tonight’s story.</b> Your child is in the story. Every word is one you can read, or one you are learning.</span></li><li><span><b>Practise alone.</b> Read out loud for about five minutes. If you stop on a word, Hearth helps a little at a time.</span></li><li><span><b>Read together.</b> Read the same story at bedtime. Your child hears your voice. Ask the question on each page.</span></li></ol>`,
        `<h2>Tres pasos pequeños</h2><ol class="steps-list"><li><span><b>El cuento de esta noche.</b> Su hijo está en el cuento. Cada palabra es una que usted puede leer, o una que está aprendiendo.</span></li><li><span><b>Practique a solas.</b> Lea en voz alta unos cinco minutos. Si se detiene en una palabra, Hearth le ayuda poco a poco.</span></li><li><span><b>Lean juntos.</b> Lea el mismo cuento a la hora de dormir. Su hijo escucha su voz. Haga la pregunta de cada página.</span></li></ol>`,
      )}
    </div>
    <div class="media">${phone('app-home.png', 'Tonight’s story in the Hearth app.')}</div>
  </div>
</section>

<section class="band paper-2 big-text" data-read aria-label="Promises">
  <div class="wrap">
    <div class="grid3">
      <div class="card"><div class="glyph">${ICON.lock}</div>${both('<h3>It’s private</h3><p>Your practice stays on your phone. Nobody sees your mistakes: not your child, not your program, not us.</p>', '<h3>Es privado</h3><p>Su práctica se queda en su teléfono. Nadie ve sus errores: ni su hijo, ni su programa, ni nosotros.</p>')}</div>
      <div class="card"><div class="glyph">${ICON.heart}</div>${both('<h3>It’s free for you</h3><p>Your school, library or family center pays for Hearth. You never pay. There are no ads.</p>', '<h3>Es gratis para usted</h3><p>Su escuela, biblioteca o centro familiar paga Hearth. Usted nunca paga. No hay anuncios.</p>')}</div>
      <div class="card"><div class="glyph">${ICON.speaker}</div>${both('<h3>You can hear everything</h3><p>Press and hold any button to hear it. The app can talk you through every screen, in English or Spanish.</p>', '<h3>Puede escuchar todo</h3><p>Mantenga presionado cualquier botón para escucharlo. La aplicación le guía en cada pantalla, en inglés o en español.</p>')}</div>
      <div class="card"><div class="glyph">${ICON.star}</div>${both('<h3>No tests, no scores</h3><p>Your progress is a night sky. Each sound you learn lights a star.</p>', '<h3>Sin exámenes ni puntajes</h3><p>Su progreso es un cielo de noche. Cada sonido que aprende enciende una estrella.</p>')}</div>
      <div class="card"><div class="glyph">${ICON.phone}</div>${both('<h3>Works on your phone</h3><p>Any smartphone. After the first time, it works without internet.</p>', '<h3>Funciona en su teléfono</h3><p>Cualquier teléfono inteligente. Después de la primera vez, funciona sin internet.</p>')}</div>
      <div class="card"><div class="glyph">${ICON.moon}</div>${both('<h3>Working late?</h3><p>Record tonight’s story in your own voice. Your child can hear you read it, even when you can’t be home.</p>', '<h3>¿Trabaja de noche?</h3><p>Grabe el cuento con su propia voz. Su hijo puede escucharle leer, aunque usted no esté en casa.</p>')}</div>
    </div>
  </div>
</section>

<section class="band paper big-text" data-read aria-labelledby="getTitle">
  <div class="wrap split top">
    <div class="stack">
      ${both(
        `<h2 id="getTitle">How to get Hearth</h2><ol class="steps-list"><li><span>Ask at your child’s Head Start, school, library or doctor’s office if they offer Hearth.</span></li><li><span>They give you a code on a small card.</span></li><li><span>Open Hearth on your phone and enter the code. That’s it.</span></li></ol><p class="mt">You can also try Hearth right now with a demo family.</p>`,
        `<h2>Cómo obtener Hearth</h2><ol class="steps-list"><li><span>Pregunte en el Head Start, la escuela, la biblioteca o el consultorio de su hijo si ofrecen Hearth.</span></li><li><span>Le dan un código en una tarjeta pequeña.</span></li><li><span>Abra Hearth en su teléfono y escriba el código. Eso es todo.</span></li></ol><p class="mt">También puede probar Hearth ahora con una familia de demostración.</p>`,
      )}
      <div><a class="btn ink" href="/app/">${both('Try Hearth', 'Probar Hearth')}</a></div>
    </div>
    <div class="card stack no-print-shadow">
      ${both(
        `<h3>Ask your program for Hearth</h3><p>Fill in the name of your program, and we’ll write a short note you can show, send or print. It doesn’t say anything about your reading.</p>`,
        `<h3>Pida Hearth a su programa</h3><p>Escriba el nombre de su programa y le preparamos una nota corta para mostrar, enviar o imprimir. No dice nada sobre su lectura.</p>`,
      )}
      <div class="field"><label for="progName">${both('Program name (optional)', 'Nombre del programa (opcional)')}</label><input id="progName" type="text" autocomplete="organization" placeholder="Riverside Head Start"></div>
      <div class="field"><label for="noteText">${both('Your note', 'Su nota')}</label><textarea id="noteText" rows="5" readonly></textarea></div>
      <div class="cta-row"><button class="btn ember sm" data-copy-note>${both('Copy note', 'Copiar nota')}</button><button class="btn line sm" data-print-note>${both('Print', 'Imprimir')}</button></div>
      <p class="small muted" data-copied hidden>${both('Copied.', 'Copiado.')}</p>
    </div>
  </div>
</section>

<section class="band night big-text" data-read aria-labelledby="faqTitle" id="es-faq">
  <div class="wrap">
    ${both('<h2 id="faqTitle">Questions</h2>', '<h2>Preguntas</h2>')}
    <div class="faq mt">
      ${both(`
      <details><summary>What if I can’t read at all yet?</summary><p>Hearth starts where you are. The first stories have only a few words, like “I am Mateo. I am Mama.”, with big pictures. The questions on each page help you talk about the story together.</p></details>
      <details><summary>Will my child know I’m practising?</summary><p>No. At story time your child sees a picture book. Hints are quiet marks only you notice, and Hearth stays silent unless you turn spoken hints on.</p></details>
      <details><summary>Who can see my reading?</summary><p>Only you. If you join through a program, you choose whether to share a short summary: how many nights you read and which sounds you learned. Recordings and mistakes are never shared.</p></details>
      <details><summary>How much time does it take?</summary><p>About five minutes to practise, and five to ten minutes of story time. Any time of day works for practice.</p></details>
      <details><summary>Is my child looking at a screen?</summary><p>Your child looks at a picture book on a phone that you hold, for a few minutes. Bedtime mode dims the screen. The important part is your voice and your talk together.</p></details>`, `
      <details><summary>¿Y si todavía no sé leer nada?</summary><p>Hearth empieza donde usted está. Los primeros cuentos tienen pocas palabras, como “I am Mateo. I am Mama.”, con dibujos grandes. Las preguntas de cada página les ayudan a conversar sobre el cuento.</p></details>
      <details><summary>¿Sabrá mi hijo que estoy practicando?</summary><p>No. A la hora del cuento su hijo ve un libro con dibujos. Las pistas son marcas discretas que solo usted ve, y Hearth se queda en silencio a menos que usted active las pistas habladas.</p></details>
      <details><summary>¿Quién puede ver mi lectura?</summary><p>Solo usted. Si se une por un programa, usted decide si comparte un resumen corto: cuántas noches leyó y qué sonidos aprendió. Las grabaciones y los errores nunca se comparten.</p></details>
      <details><summary>¿Cuánto tiempo toma?</summary><p>Unos cinco minutos de práctica y de cinco a diez minutos de cuento. Puede practicar a cualquier hora del día.</p></details>
      <details><summary>¿Mi hijo mira una pantalla?</summary><p>Su hijo mira un libro con dibujos en un teléfono que usted sostiene, por unos minutos. El modo de noche baja el brillo. Lo importante es su voz y su conversación.</p></details>`)}
    </div>
  </div>
</section>
`,
});
