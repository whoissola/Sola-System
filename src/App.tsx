import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import { Play, Ticket, Mail, Instagram, Youtube, Music as MusicIcon, Disc, ExternalLink, ChevronDown } from 'lucide-react';

// --- Configuration ---
const SPLASH_VIDEO_ID = "FLjW9ssv-aI";
const MAIN_VIDEO_ID = "0VzgVed8FKI";

// --- Components ---

const YouTubeBackground = ({ videoId, opacity = 0.6 }: { videoId: string; opacity?: number }) => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ opacity }}>
      <iframe
        className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 scale-110"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&playlist=${videoId}&enablejsapi=1&widget_referrer=${encodeURIComponent(window.location.href)}`}
        allow="autoplay; encrypted-media"
        frameBorder="0"
      />
    </div>
  );
};

const Starfield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: { x: number; y: number; r: number; o: number; speed: number; pulse: number; layer: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createStars();
    };

    const createStars = () => {
      stars = [];
      const count = Math.floor((canvas.width * canvas.height) / 1500); // More stars
      for (let i = 0; i < count; i++) {
        const layer = Math.floor(Math.random() * 8); // 8 layers for more depth
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * (layer * 0.2 + 0.4),
          o: Math.random() * 0.8 + 0.1,
          speed: (layer + 1) * 0.015, // Slower, more subtle movement
          pulse: Math.random() * Math.PI * 2,
          layer
        });
      }
    };

    const scrollYRef = { current: 0 };

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5
      };
    };

    const draw = () => {
      ctx.fillStyle = '#02020a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle nebula glow
      const time = Date.now() * 0.0002;
      const nebulaX = canvas.width / 2 + Math.cos(time) * 100;
      const nebulaY = canvas.height / 2 + Math.sin(time * 0.7) * 100;
      const nebulaGradient = ctx.createRadialGradient(nebulaX, nebulaY, 0, nebulaX, nebulaY, canvas.width * 0.7);
      nebulaGradient.addColorStop(0, 'rgba(30, 15, 60, 0.12)');
      nebulaGradient.addColorStop(0.5, 'rgba(15, 8, 40, 0.04)');
      nebulaGradient.addColorStop(1, 'rgba(2, 2, 10, 0)');
      ctx.fillStyle = nebulaGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((s) => {
        s.pulse += 0.005;
        const opacity = s.o * (0.6 + 0.4 * Math.sin(s.pulse));
        
        // Automatic slow drift with layer-based speed for 3D feel
        s.x += s.speed * 0.2;
        s.y += s.speed * 0.1;

        // Wrap around screen
        if (s.x > canvas.width) s.x = 0;
        if (s.x < 0) s.x = canvas.width;
        if (s.y > canvas.height) s.y = 0;
        if (s.y < 0) s.y = canvas.height;

        // Mouse parallax - stronger on closer layers
        const mouseShiftX = mouseRef.current.x * (s.layer + 1) * 25;
        const mouseShiftY = mouseRef.current.y * (s.layer + 1) * 25;

        // Scroll parallax - stronger on closer layers
        const scrollShiftY = scrollYRef.current * (s.layer + 1) * 0.05;

        let x = (s.x + mouseShiftX) % canvas.width;
        if (x < 0) x += canvas.width;
        
        let y = (s.y + mouseShiftY - scrollShiftY) % canvas.height;
        if (y < 0) y += canvas.height;

        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 184, 255, ${opacity})`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const springConfig = { stiffness: 150, damping: 25 };
  const ringPos = {
    x: useSpring(0, springConfig),
    y: useSpring(0, springConfig)
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      ringPos.x.set(e.clientX);
      ringPos.y.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <motion.div
        className="fixed w-2 h-2 bg-glow rounded-full pointer-events-none z-[9999] mix-blend-difference shadow-[0_0_8px_#c8b8ff]"
        style={{ left: mousePos.x, top: mousePos.y, x: '-50%', y: '-50%' }}
      />
      {/* Single Planetary Ring */}
      <motion.div
        className="fixed border border-glow/40 rounded-full pointer-events-none z-[9998] shadow-[0_0_10px_rgba(200,184,255,0.3)]"
        style={{ 
          width: 36, 
          height: 36, 
          left: ringPos.x, 
          top: ringPos.y, 
          x: '-50%', 
          y: '-50%',
          rotate: -25,
          scaleY: 0.85
        }}
      />
    </>
  );
};

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-8 py-8 flex justify-between items-center">
      <div className="absolute inset-0 bg-gradient-to-b from-void/80 to-transparent pointer-events-none" />
      <a href="#" className="relative font-display text-[0.8rem] tracking-[0.6em] text-glow drop-shadow-[0_0_10px_rgba(200,184,255,0.8)] hover:scale-105 transition-transform duration-300">ṢỌLÁ</a>
      <ul className="relative hidden md:flex gap-12 list-none items-center">
        {['VIDEOS', 'PRESS', 'LIVE', 'CONTACT', 'BIO'].map((item) => (
          <li key={item}>
            <a
              href={`#${item.toLowerCase() === 'bio' ? 'world' : item.toLowerCase() === 'contact' ? 'newsletter' : item.toLowerCase()}`}
              className="font-display text-[0.55rem] tracking-[0.3em] text-dust hover:text-frost transition-colors uppercase"
            >
              {item}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <YouTubeBackground videoId={MAIN_VIDEO_ID} opacity={0.4} />
        {/* Gradient Overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-void via-transparent to-void opacity-80" />
        <div className="absolute inset-0 bg-void/20" />
      </div>

      {/* Orbits */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
        {[
          { id: 'world', label: 'WORLD', size: 320, color: 'bg-amber shadow-[0_0_12px_var(--color-amber)]' },
          { id: 'videos', label: 'VIDEOS', size: 420, color: 'bg-teal shadow-[0_0_16px_var(--color-teal)]' },
          { id: 'press', label: 'PRESS', size: 520, color: 'bg-glow shadow-[0_0_14px_var(--color-glow)]' },
          { id: 'live', label: 'LIVE', size: 620, color: 'bg-glow shadow-[0_0_14px_var(--color-glow)]' },
          { id: 'newsletter', label: 'NEWSLETTER', size: 720, color: 'bg-baby-blue shadow-[0_0_15px_rgba(137,207,240,0.6)]' },
        ].map((orbit, i) => {
          const radius = orbit.size / 2;
          const startRotation = i * (360 / 8);
          return (
            <motion.div
              key={orbit.size}
              className="absolute border border-glow/10 rounded-full"
              style={{ width: orbit.size, height: orbit.size, left: -orbit.size / 2, top: -orbit.size / 2 }}
              initial={{ rotate: startRotation }}
              animate={{ rotate: i % 2 === 0 ? startRotation + 360 : startRotation - 360 }}
              transition={{ duration: 30 + i * 20, repeat: Infinity, ease: "linear" }}
            >
              <a href={`#${orbit.id}`} className="group">
                <svg 
                  viewBox={`0 0 ${orbit.size} ${orbit.size}`} 
                  className="absolute inset-0 pointer-events-none overflow-visible"
                >
                  <defs>
                    <path 
                      id={`path-${orbit.id}`} 
                      d={`M ${radius}, 0 A ${radius},${radius} 0 1,1 ${radius}, ${orbit.size} A ${radius},${radius} 0 1,1 ${radius}, 0`}
                    />
                  </defs>
                  <text className="font-display text-[11px] md:text-[13px] font-medium tracking-[0.5em] fill-glow/70 uppercase group-hover:fill-glow transition-colors filter drop-shadow-[0_0_4px_rgba(200,184,255,0.4)] pointer-events-auto cursor-pointer">
                    <textPath xlinkHref={`#path-${orbit.id}`} startOffset="0.8%">
                      {orbit.label}
                    </textPath>
                  </text>
                </svg>

                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
                  <div className={`rounded-full transition-transform group-hover:scale-150 ${
                    i === 0 ? 'w-2 h-2' :
                    i === 1 ? 'w-3 h-3' :
                    i === 2 ? 'w-4 h-4' :
                    i === 3 ? 'w-2.5 h-2.5' :
                    i === 4 ? 'w-3.5 h-3.5' :
                    i === 5 ? 'w-3 h-3' :
                    'w-2 h-2'
                  } ${orbit.color}`} />
                </div>
              </a>
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
          className="font-serif italic text-[1.75rem] md:text-[2.75rem] tracking-[0.2em] text-glow drop-shadow-[0_0_15px_rgba(200,184,255,0.4)]"
        >
          welcome to the sola system
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-display text-[0.45rem] tracking-[0.4em] text-dust/50 uppercase">Scroll</span>
        <motion.div
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-12 bg-gradient-to-b from-glow to-transparent"
        />
      </motion.div>
    </section>
  );
};

const About = () => {
  return (
    <section id="world" className="snap-start h-screen px-8 pt-32 pb-4 flex flex-col justify-between overflow-hidden relative">
      <SocialLinks />
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="font-display text-[0.45rem] tracking-[0.5em] text-dust mb-8 flex items-center gap-4">
          <div className="w-8 h-px bg-dust" />
          01 — The Artist
        </div>
        <div className="max-w-4xl">
          <h2 className="font-accent text-4xl md:text-5xl font-extrabold leading-[0.75] text-glow mb-10 uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(200,184,255,0.2)]">
            Bio
          </h2>
          <div className="space-y-6 text-dust/70 font-display text-[0.55rem] md:text-[0.7rem] font-normal tracking-[0.25em] leading-relaxed uppercase">
            <p className="indent-12 md:indent-24">
              South London polymath Sola reimagines the formal structures of classical music through an avant-garde, Black British lens. A producer, singer, and multi-instrumentalist, she dismantles her classical piano background to build something entirely her own: a sound rooted in the heavy atmosphere of trip-hop, electronic R&B, and jazz noir.
            </p>
            <p>
              Following her 2023 mixtape Warped Soul and a "One to Watch" nod from The Guardian, Sola’s artistry has earned the respect of both legends and the new vanguard. Her work has caught the attention of Elton John and Doechii, and led to collaborations with Kid Cudi and Jeymes Samuel on The Book of Clarence soundtrack. Her versatility as a performer is equally notable, having been hand-picked to open for Sabrina Carpenter, proving her ability to translate an experimental, moody sound to major stages.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const SolarSystemDivider = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const planets = [
    { name: 'Mercury', color: 'bg-[radial-gradient(circle_at_35%_35%,#b5a196,#5c4038)]', size: 'w-5 h-5', isSun: false, glow: 'shadow-[0_0_10px_rgba(181,161,150,0.3)]', href: '#world' },
    { name: 'Venus', color: 'bg-[radial-gradient(circle_at_35%_35%,#f0c080,#c08000)]', size: 'w-7 h-7', isSun: false, glow: 'shadow-[0_0_15px_rgba(240,192,128,0.3)]', href: '#videos' },
    { name: 'Earth', color: 'bg-[radial-gradient(circle_at_35%_35%,#4ab0f0,#1a6030)]', size: 'w-8 h-8', isSun: false, glow: 'shadow-[0_0_20px_rgba(74,176,240,0.4)]', href: '#videos' },
    { name: 'Mars', color: 'bg-[radial-gradient(circle_at_35%_35%,#e07050,#802020)]', size: 'w-6 h-6', isSun: false, glow: 'shadow-[0_0_12px_rgba(224,112,80,0.3)]', href: '#press' },
    { name: 'Jupiter', color: 'bg-[radial-gradient(circle_at_35%_35%,#e8c090,#a06020)]', size: 'w-14 h-14', isSun: false, glow: 'shadow-[0_0_25px_rgba(232,192,144,0.4)]', href: '#live' },
    { name: 'Saturn', color: 'bg-[radial-gradient(circle_at_35%_35%,#f0d880,#b08030)]', size: 'w-12 h-12', isSun: false, glow: 'shadow-[0_0_20px_rgba(240,216,128,0.3)]', hasRing: true, ringColor: 'border-glow/40', href: '#newsletter' },
  ];

  const allItems = [
    { name: 'SOL', color: 'bg-[radial-gradient(circle_at_40%_40%,#fff5c0,#f0a820_40%,#c06000)]', size: 'w-12 h-12', isSun: true, glow: 'shadow-[0_0_30px_rgba(240,168,32,0.4)]', href: '#' },
    ...planets
  ];

  // Auto-scroll logic
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    const scroll = () => {
      if (!isHovered) {
        scrollContainer.scrollLeft += 0.5; // Slow auto-drift
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  return (
    <div 
      ref={scrollRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative z-10 py-6 overflow-x-auto no-scrollbar scroll-smooth shrink-0"
    >
      <div className="flex items-end gap-0 w-max pb-8">
        {/* Duplicate items for seamless loop */}
        {[...allItems, ...allItems].map((p, i) => (
          <div key={i} className="flex items-end">
            <div className="h-px bg-glow/20 w-12 mb-10" />
            <a href={p.href} className="group">
              <motion.div
                whileHover={{ y: -8, scale: 1.1 }}
                className="flex flex-col items-center gap-4 shrink-0 px-8 cursor-pointer"
              >
                <div className="relative flex items-center justify-center">
                  <motion.div
                    animate={p.isSun ? { y: [0, -8, 0] } : {}}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className={`${p.size} rounded-full ${p.color} ${p.glow} group-hover:brightness-125 transition-all duration-500 relative z-10`}
                  />
                  {p.hasRing && (
                    <div className={`absolute w-[160%] h-[30%] border ${p.ringColor || 'border-glow/30'} rounded-[100%] ${(p as any).ringRotate || 'rotate-[-25deg]'} z-0`} />
                  )}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="font-display text-[0.45rem] md:text-[0.55rem] tracking-[0.4em] text-dust/60 group-hover:text-glow uppercase transition-colors">{p.name}</span>
                </div>
              </motion.div>
            </a>
          </div>
        ))}
        <div className="h-px bg-glow/20 w-12 mb-10" />
      </div>
    </div>
  );
};

const Press = () => {
  const articles = [
    { 
      source: 'The Guardian', 
      title: 'One to Watch: Sola | Music', 
      date: 'Sep 2023',
      url: 'https://www.theguardian.com/music/2023/sep/23/one-to-watch-sola-warped-soul'
    },
    { 
      source: 'Clash Magazine', 
      title: 'Solas Warped Soul Salutes The Tapestry Of Black British Creativity', 
      date: 'Nov 2023',
      url: 'https://www.clashmusic.com/news/solas-warped-soul-salutes-the-tapestry-of-black-british-creativity/'
    },
    { 
      source: 'Interview Magazine', 
      title: 'Meet the Five Artists Making Magic With Anima Studios', 
      date: 'Dec 2023',
      url: 'https://www.interviewmagazine.com/music/meet-the-five-artists-making-magic-with-anima-studios'
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-center py-12 relative">
      <SocialLinks />
      <div className="font-display text-[0.5rem] tracking-[0.5em] text-dust mb-16 flex items-center gap-4">
        <div className="w-8 h-px bg-dust" />
        03 — Press Archive
      </div>
      <div className="max-w-4xl mx-auto w-full space-y-12">
        {articles.map((article, i) => (
          <motion.a
            key={i}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 10 }}
            className="group block border-b border-glow/5 pb-10 transition-all hover:border-glow/20"
          >
            <div className="flex justify-between items-end mb-4">
              <span className="font-display text-[0.45rem] tracking-[0.4em] text-glow uppercase">{article.source}</span>
              <span className="font-display text-[0.4rem] tracking-[0.2em] text-frost/40 uppercase">{article.date}</span>
            </div>
            <h3 className="font-display text-[0.6rem] md:text-[0.8rem] text-frost uppercase tracking-[0.25em] leading-relaxed">
              {article.title}
            </h3>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

const Pictures = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const scrollPosRef = useRef(0);
  
  const videoPlanets = [
    { id: 'a9gT8ZvrxfA', title: 'Slow Dance', name: 'Mercury', color: 'bg-[radial-gradient(circle_at_35%_35%,#b5a196,#5c4038)]', glow: 'shadow-[0_0_10px_rgba(181,161,150,0.3)]', size: 'w-6 h-6' },
    { id: 'Xhr_CGgt5Jc', title: 'Pink Elephants', name: 'Venus', color: 'bg-[radial-gradient(circle_at_35%_35%,#f0c080,#c08000)]', glow: 'shadow-[0_0_15px_rgba(240,192,128,0.3)]', size: 'w-10 h-10' },
    { id: 'x6Cm5y105Ec', title: "What's Your Desire?", name: 'Earth', color: 'bg-[radial-gradient(circle_at_35%_35%,#4ab0f0,#1a6030)]', glow: 'shadow-[0_0_20px_rgba(74,176,240,0.4)]', size: 'w-12 h-12' },
    { id: 'AEWZQAUKkCE', title: 'Nightingale (Live)', name: 'Mars', color: 'bg-[radial-gradient(circle_at_35%_35%,#e07050,#802020)]', glow: 'shadow-[0_0_12px_rgba(224,112,80,0.3)]', size: 'w-8 h-8' },
    { id: 'mfsE2gXhvZo', title: 'Heat', name: 'Jupiter', color: 'bg-[radial-gradient(circle_at_35%_35%,#e8c090,#a06020)]', glow: 'shadow-[0_0_25px_rgba(232,192,144,0.4)]', size: 'w-14 h-14' },
    { id: '-3rzTxmZJWU', title: 'Scream999', name: 'Saturn', color: 'bg-[radial-gradient(circle_at_35%_35%,#f0d880,#b08030)]', glow: 'shadow-[0_0_15px_rgba(240,216,128,0.2)]', size: 'w-12 h-12', hasRing: true, ringColor: 'border-glow/20' },
    { id: 'HE-l10iYH78', title: 'Abide In U', name: 'Uranus', color: 'bg-[radial-gradient(circle_at_35%_35%,#80e0f0,#2080a0)]', glow: 'shadow-[0_0_12px_rgba(128,224,240,0.2)]', size: 'w-10 h-10', hasRing: true, ringColor: 'border-glow/10', ringRotate: 'rotate-[85deg]' },
    { id: 'eoJ3jxX4yWE', title: "You Don't Have To Say", name: 'Neptune', color: 'bg-[radial-gradient(circle_at_35%_35%,#6080f0,#102060)]', glow: 'shadow-[0_0_15px_rgba(96,128,240,0.3)]', size: 'w-10 h-10' },
    { id: 'VfJX0EocKkI', title: 'Feels Like A War', name: 'Pluto', color: 'bg-[radial-gradient(circle_at_35%_35%,#a6a6a6,#404040)]', glow: 'shadow-[0_0_8px_rgba(166,166,166,0.2)]', size: 'w-5 h-5' }
  ];

  // Auto-scroll logic for Vertical sidebar - EVEN SLOWER & SMOOTH
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    const scroll = () => {
      if (!isHovered) {
        scrollPosRef.current += 0.25; // Slower controlled drift
        scrollContainer.scrollTop = Math.floor(scrollPosRef.current);
        
        if (scrollContainer.scrollTop >= scrollContainer.scrollHeight / 2) {
          scrollPosRef.current = 0;
          scrollContainer.scrollTop = 0;
        }
      } else {
        scrollPosRef.current = scrollContainer.scrollTop;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  const activeVideos = videoPlanets;

  return (
    <div className="flex-1 flex flex-col h-full pt-4 pb-12 relative">
      <SocialLinks />
      <div className="font-display text-[0.5rem] tracking-[0.5em] text-frost mb-4 flex items-center gap-4">
        <div className="w-8 h-px bg-frost" />
        02 — Video Archive
      </div>

      <div className="flex flex-1 gap-4 md:gap-6 items-center overflow-hidden min-h-[500px] flex-col md:flex-row">
        {/* Vertical Orbit Sidebar - LEFT Side & Compact (w-20) */}
        <div 
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="hidden md:flex flex-col h-[550px] overflow-y-auto no-scrollbar relative w-20 shrink-0"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)'
          }}
        >
          <div className="flex flex-col items-center gap-0 min-h-max pb-32">
            {[...videoPlanets, ...videoPlanets].map((p, i) => {
              const isActualVideo = i % videoPlanets.length;
              const isActive = activeIndex === isActualVideo;
              
              return (
                <div key={`${p.id}-${i}`} className="flex flex-col items-center">
                  <div className="w-[1px] bg-gradient-to-b from-transparent via-glow/20 to-transparent h-8" />
                  <motion.button
                    onClick={() => setActiveIndex(isActualVideo)}
                    whileHover={{ scale: 1.1, x: 2 }}
                    className={`relative z-10 flex flex-col items-center gap-2 transition-all duration-500 cursor-pointer hover:opacity-100 ${
                      isActive ? 'opacity-100 scale-105' : 'opacity-80 grayscale-[0.2]'
                    }`}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className={`rounded-full transition-all duration-700 ${p.size} ${p.color} ${p.glow} ${
                        isActive ? 'ring-1 ring-glow ring-offset-2 ring-offset-void shadow-[0_0_20px_rgba(200,184,255,0.4)]' : ''
                      }`} />
                      {p.hasRing && (
                        <div className={`absolute w-[180%] h-[30%] border ${p.ringColor || 'border-glow/30'} rounded-[100%] ${(p as any).ringRotate || 'rotate-[-25deg]'} z-0`} />
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <span className={`font-display text-[0.55rem] tracking-[0.4em] uppercase text-center leading-none transition-all duration-500 font-bold ${
                        isActive ? 'text-glow' : 'text-frost'
                      }`}>
                        {p.name}
                      </span>
                      <span className={`font-display text-[0.45rem] tracking-[0.2em] uppercase text-center block max-w-[80px] leading-tight transition-all duration-500 font-semibold ${
                        isActive ? 'text-frost' : 'text-frost/80'
                      }`}>
                        - {p.title}
                      </span>
                    </div>
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Featured Video Stage - Full Width minus Sidebar */}
        <div className="flex-1 flex flex-col h-full justify-center">
          <div className="relative group overflow-hidden bg-void shadow-[30px_30px_80px_rgba(0,0,0,1)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="aspect-video w-full"
              >
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${activeVideos[activeIndex].id}?modestbranding=1&rel=0&showinfo=0&color=white&autoplay=0`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  frameBorder="0"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tour = () => {
  const tourDates = [
    { 
      date: 'Apr 02 2025', 
      city: 'London', 
      venue: 'Southbank Centre', 
      status: 'Archive', 
      planet: { color: 'bg-[radial-gradient(circle_at_35%_35%,#b5a196,#5c4038)]', size: 'w-4 h-4', glow: 'shadow-[0_0_8px_rgba(181,161,150,0.3)]' }
    },
    { 
      date: 'Jul 23 2025', 
      city: 'Sardinia', 
      venue: 'Polifonic Festival', 
      status: 'Tickets', 
      planet: { color: 'bg-[radial-gradient(circle_at_35%_35%,#f0c080,#c08000)]', size: 'w-6 h-6', glow: 'shadow-[0_0_12px_rgba(240,192,128,0.3)]' }
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-center py-12 relative">
      <SocialLinks />
      <div className="font-display text-[0.5rem] tracking-[0.5em] text-dust mb-16 flex items-center gap-4">
        <div className="w-8 h-px bg-dust" />
        04 — Live
      </div>

      <div className="max-w-4xl mx-auto w-full flex flex-col gap-12">
        {tourDates.map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ x: 10 }}
            className="group grid grid-cols-[auto_1fr_auto] gap-8 items-center border-b border-glow/5 pb-12 transition-all hover:border-glow/20"
          >
            {/* Planet */}
            <div className="relative flex items-center justify-center w-12 h-12">
              <div className={`rounded-full ${item.planet.size} ${item.planet.color} ${item.planet.glow} group-hover:scale-110 transition-transform duration-500`} />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-2">
              <span className="font-display text-[0.45rem] tracking-[0.4em] text-glow uppercase">{item.date}</span>
              <h3 className="font-display text-[0.7rem] md:text-[0.85rem] text-frost uppercase tracking-[0.25em] leading-relaxed">
                {item.city} — {item.venue}
              </h3>
            </div>

            {/* Status */}
            <div className={`font-display text-[0.45rem] tracking-[0.3em] px-6 py-2 border transition-colors ${
              item.status === 'Tickets' ? 'border-teal text-teal hover:bg-teal hover:text-void cursor-pointer' :
              'border-glow/20 text-glow/30 cursor-default'
            }`}>
              {item.status}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const Newsletter = () => {
  return (
    <div className="flex-1 flex flex-col justify-center py-12">
      <div className="font-display text-[0.5rem] tracking-[0.5em] text-dust mb-8 flex items-center gap-4">
        <div className="w-8 h-px bg-dust" />
        05 — Contact
      </div>
      <div className="max-w-4xl mx-auto text-center w-full">
        <p className="font-serif italic text-[1.75rem] md:text-[2.25rem] tracking-[0.2em] text-glow drop-shadow-[0_0_15px_rgba(200,184,255,0.4)] mb-12">
          enter the orbit
        </p>
        <form className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
          <input 
            type="email" 
            placeholder="ENTER EMAIL ADDRESS"
            className="flex-1 bg-void border border-glow/20 px-6 py-4 font-display text-[0.6rem] tracking-[0.2em] text-frost focus:outline-none focus:border-glow/50 transition-colors"
          />
          <button className="px-8 py-4 bg-glow text-void font-display text-[0.6rem] tracking-[0.4em] uppercase hover:bg-frost transition-colors">
            Subscribe
          </button>
        </form>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-2 relative z-10 opacity-40">
      <p className="font-display text-[0.45rem] tracking-[0.3em] text-glow uppercase">© 2025 Sola. All rights reserved.</p>
    </footer>
  );
};

const SocialLinks = () => {
  const socials = [
    { id: 'instagram', icon: <Instagram size={14} />, url: 'https://www.instagram.com/thisissola/' },
    { id: 'tiktok', icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ), url: 'https://www.tiktok.com/@thisissola' },
    { id: 'youtube', icon: <Youtube size={14} />, url: 'http://youtube.com/@thisissola' },
    { id: 'spotify', icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14.5c2.5-1 5.5-1 8 0" />
        <path d="M7 11.5c3.5-1.5 7-1.5 10.5 0" />
        <path d="M7 8.5c4-2 8-2 12 0" />
      </svg>
    ), url: 'https://open.spotify.com/artist/1Bfk5r6g6fXLaMoESYbePK' },
    { id: 'x', icon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ), url: 'https://x.com/thisissola' },
  ];

  return (
    <div className="absolute bottom-8 right-8 z-[100] flex items-center gap-6">
      {socials.map((social) => (
        <motion.a
          key={social.id}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -4, color: 'var(--color-glow)' }}
          className="text-glow/40 hover:text-glow transition-colors duration-300"
        >
          {social.icon}
        </motion.a>
      ))}
    </div>
  );
};

const Splash = ({ onEnter }: { onEnter: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      onClick={onEnter}
      className="fixed inset-0 z-[1000] bg-void flex items-end justify-center overflow-hidden pb-24 cursor-pointer"
    >
      <YouTubeBackground videoId={SPLASH_VIDEO_ID} opacity={0.6} />
      <div className="absolute inset-0 bg-void/40 backdrop-blur-[2px]" />
      
      <div className="relative z-10 text-center">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 1.5,
            delay: 2 
          }}
          whileHover={{ scale: 1.05, letterSpacing: '0.6em', boxShadow: '0 0 20px rgba(137,207,240,0.4)' }}
          whileTap={{ scale: 0.95 }}
          className="px-12 py-4 border border-baby-blue/30 font-display text-[0.6rem] tracking-[0.4em] text-baby-blue uppercase hover:bg-baby-blue hover:text-void transition-all duration-500 shadow-[0_0_15px_rgba(137,207,240,0.2)]"
        >
          Enter Orbit
        </motion.button>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);

  const handleEnter = () => {
    setHasEntered(true);
    window.scrollTo(0, 0);
  };

  return (
    <div className="relative min-h-screen selection:bg-glow selection:text-void">
      <AnimatePresence>
        {!hasEntered && <Splash onEnter={handleEnter} />}
      </AnimatePresence>

      <Starfield />
      <CustomCursor />
      <div className={`relative z-10 transition-opacity duration-1000 ${hasEntered ? 'opacity-100' : 'opacity-0'}`}>
        <Navbar />
        <main className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth no-scrollbar">
          <section className="snap-start h-screen">
            <Hero />
          </section>
          <About />
          <section id="videos" className="snap-start h-screen px-8 flex flex-col justify-center overflow-hidden pb-12">
            <Pictures />
          </section>
          <section id="press" className="snap-start h-screen px-8 flex flex-col justify-center overflow-hidden">
            <Press />
          </section>
          <section id="live" className="snap-start h-screen px-8 flex flex-col justify-center overflow-hidden">
            <Tour />
          </section>
          <section id="newsletter" className="snap-start h-screen px-8 flex flex-col justify-between bg-void/30 backdrop-blur-sm overflow-hidden relative">
            <Newsletter />
            <SocialLinks />
            <Footer />
          </section>
        </main>
      </div>

      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[5] opacity-[0.04] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
