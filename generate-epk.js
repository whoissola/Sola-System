import PDFDocument from 'pdfkit';
import fs from 'fs';

async function generateEPK() {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 0, // We'll handle margins manually for the background
  });

  const stream = fs.createWriteStream('SOLA_EPK.pdf');
  doc.pipe(stream);

  // Colors from the website
  const voidColor = '#02020a';
  const glowColor = '#c8b8ff';
  const dustColor = '#a0a0b0';
  const frostColor = '#f0f0f5';

  // Helper: Draw Background
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(voidColor);

  // Helper: Planet drawing
  const drawPlanet = (x, y, radius, color, hasRing = false) => {
    doc.save()
       .circle(x, y, radius)
       .fill(color);
    
    if (hasRing) {
      doc.ellipse(x, y, radius * 2.2, radius * 0.4)
         .lineWidth(0.5)
         .stroke(color + '88'); // Semi-transparent ring
    }
    doc.restore();
  };

  // Header Section
  doc.y = 60;
  doc.fillColor(glowColor)
     .fontSize(45)
     .text('SOLA', { align: 'center', characterSpacing: 15 });

  // Manual accent for O and A (simulating Unicode)
  doc.circle(doc.page.width / 2 - 2, 55, 1.5).fill(glowColor); // Over the O
  doc.circle(doc.page.width / 2 + 58, 55, 1.5).fill(glowColor); // Over the A

  doc.moveDown(0.2);
  doc.fillColor(dustColor)
     .fontSize(12)
     .text('WELCOME TO THE SOLA SYSTEM', { align: 'center', characterSpacing: 4 });

  // Orbit Line
  doc.moveTo(100, 140).lineTo(495, 140).lineWidth(0.5).stroke(glowColor + '33');

  // Bio Section
  doc.y = 180;
  doc.x = 60;
  doc.fillColor(glowColor)
     .fontSize(18)
     .text('BIO', { characterSpacing: 2 });
  
  doc.moveDown(0.5);
  doc.fillColor(frostColor)
     .fontSize(10)
     .text('South London polymath Sola reimagines the formal structures of classical music through an avant-garde, Black British lens. A producer, singer, and multi-instrumentalist, she dismantles her classical piano background to build something entirely her own: a sound rooted in the heavy atmosphere of trip-hop, electronic R&B, and jazz noir.', {
       width: 475,
       lineGap: 4,
       align: 'justify'
     });

  doc.moveDown();
  doc.text('Following her 2023 mixtape Warped Soul and a "One to Watch" nod from The Guardian, Sola’s artistry has earned the respect of both legends and the new vanguard. Her work has caught the attention of Elton John and Doechii, and led to collaborations with Kid Cudi and Jeymes Samuel on The Book of Clarence soundtrack.', {
    width: 475,
    lineGap: 4,
    align: 'justify'
  });

  // Music & Videos Grid
  doc.y = 380;
  const colWidth = 220;

  // Music Column
  doc.x = 60;
  doc.fillColor(glowColor).fontSize(16).text('DISCOGRAPHY', { characterSpacing: 1 });
  doc.moveDown(0.5);
  doc.fillColor(frostColor).fontSize(9);
  
  ['Aphelion', 'Tidal Lock', 'Roche Limit', 'Dark Side', 'Synodic Return'].forEach(track => {
    doc.text(track.toUpperCase(), { lineGap: 6 });
  });

  // Videos Column
  doc.y = 380;
  doc.x = 315;
  doc.fillColor(glowColor).fontSize(16).text('VIDEOS', { characterSpacing: 1 });
  doc.moveDown(0.5);
  doc.fillColor(frostColor).fontSize(8);
  
  [
    { title: 'SLOW DANCE', url: 'https://youtu.be/a9gT8ZvrxfA' },
    { title: 'PINK ELEPHANTS', url: 'https://youtu.be/Xhr_CGgt5Jc' },
    { title: "WHAT'S YOUR DESIRE?", url: 'https://youtu.be/x6Cm5y105Ec' },
    { title: 'NIGHTINGALE (LIVE)', url: 'https://youtu.be/AEWZQAUKkCE' },
    { title: 'HEAT', url: 'https://youtu.be/mfsE2gXhvZo' },
    { title: 'SCREAM999', url: 'https://youtu.be/-3rzTxmZJWU' },
    { title: 'ABIDE IN U', url: 'https://youtu.be/HE-l10iYH78' },
    { title: "YOU DON'T HAVE TO SAY", url: 'https://youtu.be/eoJ3jxX4yWE' },
    { title: 'FEELS LIKE A WAR', url: 'https://youtu.be/VfJX0EocKkI' }
  ].forEach(vid => {
    doc.fillColor(glowColor).text(vid.title, { 
      link: vid.url,
      underline: true,
      lineGap: 10
    });
  });

  // Press Section (Moved down)
  doc.y = 530;
  doc.x = 60;
  doc.fillColor(glowColor).fontSize(13).text('PRESS HIGHLIGHTS', { characterSpacing: 1 });
  doc.moveDown(0.3);
  doc.fillColor(dustColor).fontSize(8);
  doc.text('THE GUARDIAN · CLASH · NME · PITCHFORK · VOGUE', { characterSpacing: 1 });

  // Tour Section
  doc.y = 550;
  doc.x = 60;
  doc.fillColor(glowColor).fontSize(16).text('ORBIT TOUR 2025', { characterSpacing: 1 });
  doc.moveDown(0.5);
  
  const shows = [
    { date: 'FEB 14', city: 'LONDON', venue: 'ROUNDHOUSE' },
    { date: 'FEB 21', city: 'BERLIN', venue: 'BERGHAIN' },
    { date: 'MAR 08', city: 'PARIS', venue: 'LA GAÎTÉ LYRIQUE' },
    { date: 'MAR 15', city: 'TOKYO', venue: 'LIQUIDROOM' }
  ];

  shows.forEach(show => {
    doc.fillColor(frostColor).fontSize(10).text(`${show.date} — ${show.city}`, { continued: true })
       .fillColor(dustColor).fontSize(8).text(` — ${show.venue}`, { align: 'right' });
    doc.moveDown(0.5);
  });

  // Footer Planets (Mini System)
  const footerY = 750;
  const startX = 140;
  const gap = 45;
  const colors = ['#888888', '#e3bb76', '#4f91ff', '#ff4f4f', '#c19552', '#ead6b8', '#b8e3ea', '#6081ff'];
  
  colors.forEach((c, i) => {
    drawPlanet(startX + (i * gap), footerY, 6, c, i === 5 || i === 6);
  });

  // Final Footer
  doc.y = 780;
  doc.x = 0;
  doc.fillColor(dustColor)
     .fontSize(8)
     .text('© 2026 SOLA SYSTEM · ALL RIGHTS RESERVED', { align: 'center', characterSpacing: 2 });

  doc.moveDown(0.5);
  doc.fillColor(glowColor)
     .fontSize(10)
     .text('SOLENE.WORLD', {
       align: 'center',
       link: 'https://ais-dev-v62hsfjxum4nvufwhwot7g-395734228170.europe-west2.run.app',
       underline: true
     });

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on('finish', () => {
      console.log('PDF Generation Complete.');
      resolve();
    });
    stream.on('error', reject);
  });
}

generateEPK().catch(err => {
  console.error('Failed to generate PDF:', err);
  process.exit(1);
});
