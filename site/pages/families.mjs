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
      `<span class="eyebrow">For families</span><h1>Read the bedtime story with confidence.</h1><p class="lead">Hearth is a free app. You practise tonight’s story on your own, with a little help whenever you need it, and then you read it to your child. Bit by bit, it gets easier.</p>`,
      `<span class="eyebrow">Para familias</span><h1>Lea el cuento de buenas noches con confianza.</h1><p class="lead">Hearth es una aplicación gratis. Usted practica el cuento de esta noche a solas, con un poco de ayuda cuando la necesite, y luego se lo lee a su hijo. Poco a poco, se hace más fácil.</p>`,
    )}
    <div class="cta-row"><a class="btn lamp" href="/install">${both('Get the app', 'Obtener la app')}</a><a class="btn line" href="/stories/">${both('Read a story', 'Leer un cuento')}</a></div>
  </div>
</section>

<section class="band paper big-text" data-read aria-label="How it helps">
  <div class="wrap split">
    <div class="stack-lg">
      ${both(
        `<h2>Three small steps</h2><ol class="steps-list"><li><span><b>Tonight’s story.</b> Your child is in it, and every word is one you can read, or one you’re learning.</span></li><li><span><b>Practise on your own.</b> Read it out loud for about five minutes. If you get stuck on a word, Hearth helps a little at a time.</span></li><li><span><b>Read it together.</b> At bedtime, read the same story to your child. They hear your voice. There’s a question on each page you can ask them.</span></li></ol>`,
        `<h2>Tres pasos pequeños</h2><ol class="steps-list"><li><span><b>El cuento de esta noche.</b> Su hijo está en el cuento, y cada palabra es una que usted puede leer, o una que está aprendiendo.</span></li><li><span><b>Practique a solas.</b> Léalo en voz alta unos cinco minutos. Si se traba en una palabra, Hearth le ayuda poco a poco.</span></li><li><span><b>Léanlo juntos.</b> A la hora de dormir, léale el mismo cuento a su hijo. Su hijo escucha su voz. En cada página hay una pregunta que le puede hacer.</span></li></ol>`,
      )}
    </div>
    <div class="media">${phone('app-home.png', 'Tonight’s story in the Hearth app.')}</div>
  </div>
</section>

<section class="band paper-2 big-text" data-read aria-label="Promises">
  <div class="wrap">
    <div class="grid3">
      <div class="card"><div class="glyph">${ICON.lock}</div>${both('<h3>It’s private</h3><p>Your practice stays on your phone. Nobody sees the words you found hard. Not your child, not your program, not us.</p>', '<h3>Es privado</h3><p>Su práctica se queda en su teléfono. Nadie ve las palabras que le costaron. Ni su hijo, ni su programa, ni nosotros.</p>')}</div>
      <div class="card"><div class="glyph">${ICON.heart}</div>${both('<h3>It’s free for you</h3><p>Your school, library or family center pays for Hearth, so you never do. There are no ads, either.</p>', '<h3>Es gratis para usted</h3><p>Su escuela, biblioteca o centro familiar paga Hearth, así que usted nunca paga. Tampoco hay anuncios.</p>')}</div>
      <div class="card"><div class="glyph">${ICON.speaker}</div>${both('<h3>You can hear everything</h3><p>Press and hold any button and Hearth reads it to you. It can talk you through every screen, in English or Spanish.</p>', '<h3>Puede escuchar todo</h3><p>Mantenga presionado cualquier botón para escucharlo. La aplicación le guía en cada pantalla, en inglés o en español.</p>')}</div>
      <div class="card"><div class="glyph">${ICON.star}</div>${both('<h3>No tests, no scores</h3><p>Your progress is a night sky. Every sound you learn lights up another star.</p>', '<h3>Sin exámenes ni puntajes</h3><p>Su progreso es un cielo de noche. Cada sonido que aprende enciende una estrella.</p>')}</div>
      <div class="card"><div class="glyph">${ICON.phone}</div>${both('<h3>Works on your phone</h3><p>Any smartphone will do. After the first time, it works without internet.</p>', '<h3>Funciona en su teléfono</h3><p>Cualquier teléfono inteligente. Después de la primera vez, funciona sin internet.</p>')}</div>
      <div class="card"><div class="glyph">${ICON.moon}</div>${both('<h3>Working late?</h3><p>Record yourself reading tonight’s story. Your child can still hear you read it, even on nights you can’t be home.</p>', '<h3>¿Trabaja de noche?</h3><p>Grabe el cuento con su propia voz. Su hijo puede escucharle leer, aunque usted no esté en casa.</p>')}</div>
    </div>
  </div>
</section>

<section class="band paper big-text" data-read aria-labelledby="getTitle">
  <div class="wrap split top">
    <div class="stack">
      ${both(
        `<h2 id="getTitle">How to get Hearth</h2><ol class="steps-list"><li><span>Ask at your child’s Head Start, school, library or doctor’s office whether they offer Hearth.</span></li><li><span>If they do, they’ll give you a small card with a code on it.</span></li><li><span>Put Hearth on your phone and type in the code. That’s all.</span></li></ol><p class="mt">Hearth is still being tested, so right now you can try it without a code.</p>`,
        `<h2>Cómo obtener Hearth</h2><ol class="steps-list"><li><span>Pregunte en el Head Start, la escuela, la biblioteca o el consultorio de su hijo si ofrecen Hearth.</span></li><li><span>Si lo ofrecen, le darán una tarjeta pequeña con un código.</span></li><li><span>Ponga Hearth en su teléfono y escriba el código. Eso es todo.</span></li></ol><p class="mt">Hearth todavía está en prueba, así que ahora mismo puede probarlo sin código.</p>`,
      )}
      <div><a class="btn ink" href="/install">${both('Get the app', 'Obtener la app')}</a></div>
    </div>
    <div class="card stack no-print-shadow">
      ${both(
        `<h3>Ask your program for Hearth</h3><p>Type the name of your program and we’ll write a short note you can show them, send or print. It says nothing at all about your reading.</p>`,
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
      <details><summary>What if I can’t read at all yet?</summary><p>That’s okay. Hearth starts wherever you are. The first stories have just a few words, like “I am Mateo. I am Mama.”, and big pictures. The question on each page gives you something to talk about together, too.</p></details>
      <details><summary>Will my child know I’m practising?</summary><p>No. At story time your child just sees a picture book. Any help shows up quietly where only you notice it, and Hearth stays silent unless you switch spoken hints on.</p></details>
      <details><summary>Who can see my reading?</summary><p>Only you. Later, if you join through a program, you’ll be able to choose whether to share a short summary with them: how many nights you read and which sounds you’ve learned. Your recordings and the words you found hard are never shared. In this test version, nothing is shared at all.</p></details>
      <details><summary>How much time does it take?</summary><p>About five minutes to practise, and five to ten minutes of story time. You can practise whenever suits you: on the bus, on a break, after dinner.</p></details>
      <details><summary>Is my child looking at a screen?</summary><p>For a few minutes, yes: a picture book on a phone that you’re holding. Bedtime mode dims the screen. What really matters is your voice and the talking you do together.</p></details>`, `
      <details><summary>¿Y si todavía no sé leer nada?</summary><p>No pasa nada. Hearth empieza donde usted esté. Los primeros cuentos tienen solo unas pocas palabras, como “I am Mateo. I am Mama.”, y dibujos grandes. La pregunta de cada página también les da algo de qué conversar.</p></details>
      <details><summary>¿Sabrá mi hijo que estoy practicando?</summary><p>No. A la hora del cuento su hijo ve un libro con dibujos. Las pistas son marcas discretas que solo usted ve, y Hearth se queda en silencio a menos que usted active las pistas habladas.</p></details>
      <details><summary>¿Quién puede ver mi lectura?</summary><p>Solo usted. Más adelante, si se une por un programa, podrá decidir si comparte un resumen corto con ellos: cuántas noches leyó y qué sonidos aprendió. Sus grabaciones y las palabras que le costaron nunca se comparten. En esta versión de prueba no se comparte nada.</p></details>
      <details><summary>¿Cuánto tiempo toma?</summary><p>Unos cinco minutos de práctica y de cinco a diez minutos de cuento. Puede practicar cuando le quede bien: en el autobús, en un descanso, después de cenar.</p></details>
      <details><summary>¿Mi hijo mira una pantalla?</summary><p>Por unos minutos, sí: un libro con dibujos en un teléfono que usted sostiene. El modo de noche baja el brillo. Lo que de verdad importa es su voz y lo que conversan juntos.</p></details>`)}
    </div>
  </div>
</section>
`,
});
