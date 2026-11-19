import { page, stars } from '../layout.mjs';

const ROWS = [
  ['28%', 'U.S. adults (16–65) at or below PIAAC Level 1 in literacy, 2023; up from 19% in 2017', 'NCES, U.S. PIAAC 2023 results', 'Strong: national assessment'],
  ['~58.9M', 'The same group as a count', 'ProLiteracy, citing PIAAC 2023', 'Strong (derived)'],
  ['77%', 'Adults at the lowest literacy levels (Below Level 1 and Level 1) who have children', 'IES/NCER blog (M. Larson), analysis of PIAAC', 'Medium: likely an earlier PIAAC cycle'],
  ['~1 in 3', 'Low-literacy U.S. adults born outside the U.S.', 'LEO PIAAC 2023 brief; Migration Policy Institute', 'Medium'],
  ['739M', 'Adults worldwide lacking basic literacy skills; two-thirds women', 'UNESCO, International Literacy Day 2024', 'Strong'],
  ['67% / 53%', 'Patients with low health literacy who admitted reading difficulty and had never told their spouse / their children', 'Parikh et al. (1996), n = 58', 'One small clinical study'],
  ['~296,660', 'Words heard in books by kindergarten when read one book a day (vs. 4,662 never read to)', 'Logan et al. (2019)', 'Strong for book exposure'],
  ['d = 0.59', 'Effect of dialogic reading on children’s expressive vocabulary vs. typical shared reading; smaller for children at risk', 'Mol et al. (2008), meta-analysis of 16 studies', 'Moderate'],
  ['~1.2M', 'People served by federally funded adult education, program year 2023', 'Migration Policy Institute', 'Strong'],
  ['$12.27B', 'Federal Head Start and Early Head Start funding, FY2024, for 715,873 funded slots', 'HHS Head Start Program Facts FY2024', 'Strong'],
  ['4.6M', 'Children served by Reach Out and Read through 39,000 clinicians, FY2024', 'Reach Out and Read FY24 Annual Report', 'Strong'],
  ['$106–238B', 'Yearly U.S. cost of low health literacy', 'Vernon et al. (2007)', 'Medium: older estimate'],
  ['43 + DC', 'States with evidence-based reading laws or policies since 2013', 'Education Week tracker (Aug 2026)', 'Strong'],
];

const SOURCES = [
  ['s1', 'National Center for Education Statistics (2024). U.S. results from the 2023 Program for the International Assessment of Adult Competencies (PIAAC): 28% of adults aged 16–65 at Level 1 or below in literacy, up from 19% in 2017.'],
  ['s2', 'Larson, M. Institute of Education Sciences, NCER blog. “Family, work, and education: a balancing act for millions of U.S. adults.” Of adults at the lowest literacy levels, 77% have children.'],
  ['s3', 'UNESCO, International Literacy Day 2024: 739 million adults and youth lack basic literacy skills; two-thirds are women.'],
  ['s4', 'Parikh, N. S., Parker, R. M., Nurss, J. R., Baker, D. W., & Williams, M. V. (1996). Shame and health literacy: the unspoken connection. Patient Education and Counseling, 27(1), 33–39.'],
  ['s5', 'Logan, J. A. R., Justice, L. M., Yumuş, M., & Chaparro-Moreno, L. J. (2019). When children are not read to at home: the million word gap. Journal of Developmental & Behavioral Pediatrics, 40(5), 383–386.'],
  ['s6', 'Migration Policy Institute. Adult English Instruction at Risk: about 1.2 million adults served by federally funded adult education in program year 2023.'],
  ['s7', 'Mol, S. E., Bus, A. G., de Jong, M. T., & Smeets, D. J. H. (2008). Added value of dialogic parent–child book readings: a meta-analysis. Early Education and Development, 19(1), 7–26.'],
  ['s8', 'Pew Research Center (2024). Mobile Technology and Home Broadband 2024.'],
  ['s9', 'U.S. Department of Health and Human Services. Head Start Program Facts, Fiscal Year 2024.'],
  ['s10', 'Reach Out and Read. FY24 Annual Report.'],
  ['s11', 'Vernon, J. A., Trujillo, A., Rosenbaum, S., & DeBuono, B. (2007). Low Health Literacy: Implications for National Health Policy.'],
  ['s12', 'Rothwell, J. (2020). Assessing the Economic Gains of Eradicating Illiteracy Nationally and Regionally in the United States. Barbara Bush Foundation for Family Literacy and Gallup.'],
  ['s13', 'Education Week. Which states have passed science of reading laws? (tracker, updated August 2026).'],
  ['s14', 'Pugh, A., Kearns, D. M., & Hiebert, E. H. (2023). Review of research on decodable texts.'],
  ['s15', 'Datasets: CMU Pronouncing Dictionary; SUBTLEX-US word frequencies (Brysbaert & New, 2009).'],
];

export default page({
  path: '/research/',
  title: 'Research and sources',
  description: 'The evidence behind Hearth: adult literacy, parents, shared reading and dialogic reading, with sources and an honest note on how strong each figure is.',
  body: `
<section class="page-hero night">
  ${stars(40)}
  <div class="wrap">
    <span class="eyebrow">Research and sources</span>
    <h1>The numbers, and how sure we are.</h1>
    <p class="lead">Every figure on this website comes from this page. Where the evidence is thin, we say so.</p>
  </div>
</section>

<section class="band paper" aria-labelledby="numTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Key figures</span><h2 id="numTitle">What we know.</h2></div>
    <div class="table-wrap"><table class="t">
      <thead><tr><th style="width:13%">Figure</th><th style="width:42%">What it measures</th><th style="width:26%">Source</th><th>Strength</th></tr></thead>
      <tbody>${ROWS.map(r => `<tr><td class="num" style="font-weight:700;font-size:18px">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</tbody>
    </table></div>
  </div>
</section>

<section class="band paper-2" aria-labelledby="notTitle">
  <div class="wrap split top">
    <div class="stack"><span class="eyebrow">What we don’t say</span><h2 id="notTitle">Figures we chose not to use.</h2></div>
    <div class="stack prose">
      <p><b>“54% of U.S. adults read below a sixth-grade level.”</b> This mixes PIAAC levels with school grade levels, and several outlets have withdrawn it.</p>
      <p><b>“72% of children of low-literacy parents end up at the lowest reading levels.”</b> Widely repeated, without a clear primary source we could verify.</p>
      <p><b>Hearth outcome claims.</b> Hearth is a prototype with no users yet. We cite research on the methods it uses, not results for Hearth itself. Our first pilot will measure those.</p>
    </div>
  </div>
</section>

<section class="band paper" aria-labelledby="srcTitle">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Sources</span><h2 id="srcTitle">References.</h2></div>
    <div class="sources prose" style="max-width:none"><ol>${SOURCES.map(([id, t]) => `<li id="${id}">${t}</li>`).join('')}</ol></div>
  </div>
</section>
`,
});
