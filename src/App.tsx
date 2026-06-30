import React, { useEffect, useRef, useState } from 'react';
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
    let stars: { x: number; y: number; z: number; r: number; o: number; pulse: number; colorBase: string }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createStars();
    };

    const createStars = () => {
      stars = [];
      const count = Math.floor((canvas.width * canvas.height) / 2500); // More spaced out
      for (let i = 0; i < count; i++) {
        const colRand = Math.random();
        let colorBase = 'rgba(255, 255, 255, '; // white
        if (colRand < 0.45) {
          colorBase = 'rgba(137, 207, 240, '; // icy baby-blue
        } else if (colRand < 0.8) {
          colorBase = 'rgba(200, 184, 255, '; // lilac
        }

        stars.push({
          x: (Math.random() - 0.5) * 3000,
          y: (Math.random() - 0.5) * 3000,
          z: Math.random() * 1000 + 1,
          r: Math.random() * 1.5 + 0.4,
          o: Math.random() * 0.7 + 0.3,
          pulse: Math.random() * Math.PI * 2,
          colorBase
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
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle nebula glow
      const time = Date.now() * 0.0002;
      const nebulaX = canvas.width / 2 + Math.cos(time) * 100;
      const nebulaY = canvas.height / 2 + Math.sin(time * 0.7) * 100;
      const nebulaGradient = ctx.createRadialGradient(nebulaX, nebulaY, 0, nebulaX, nebulaY, canvas.width * 0.7);
      nebulaGradient.addColorStop(0, 'rgba(30, 15, 60, 0.12)');
      nebulaGradient.addColorStop(0.5, 'rgba(15, 8, 40, 0.04)');
      nebulaGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = nebulaGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Mouse look angles (yaw/pitch)
      const mouseYaw = mouseRef.current.x * 0.4;
      const mousePitch = mouseRef.current.y * 0.4;
      
      const cosY = Math.cos(mouseYaw);
      const sinY = Math.sin(mouseYaw);
      const cosX = Math.cos(mousePitch);
      const sinX = Math.sin(mousePitch);

      stars.forEach((s) => {
        // Slow movement forward along Z
        s.z -= 0.6;

        // Wrap around depth
        if (s.z <= 0) {
          s.z = 1000;
          s.x = (Math.random() - 0.5) * 3000;
          s.y = (Math.random() - 0.5) * 3000;
        }

        // Apply interactive 3D rotation based on mouse orientation
        // Spin around Y axis (Yaw)
        let rx = s.x * cosY - s.z * sinY;
        let rz = s.x * sinY + s.z * cosY;

        // Spin around X axis (Pitch)
        let ry = s.y * cosX - rz * sinX;
        rz = s.y * sinX + rz * cosX;

        // Perspective scaling
        const fov = 600;
        const scale = fov / (fov + rz);

        // Calculate screen positions
        const screenX = canvas.width / 2 + rx * scale;
        // Shift stars vertically based on scroll offset & depth factors
        const scrollFactor = scrollYRef.current * 0.15 * (1.5 - rz / 1000);
        const screenY = canvas.height / 2 + ry * scale - scrollFactor;

        const size = s.r * scale * 1.25;

        if (screenX >= 0 && screenX <= canvas.width && screenY >= 0 && screenY <= canvas.height) {
          s.pulse += 0.01;
          const opacity = s.o * (0.6 + 0.4 * Math.sin(s.pulse)) * (1.0 - rz / 1200);

          ctx.beginPath();
          ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
          ctx.fillStyle = `${s.colorBase}${opacity})`;
          ctx.fill();
        }
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

const SocialLinks = ({ 
  className = "absolute bottom-8 right-8 z-[100] flex items-center gap-6",
  iconSize = 18 
}: { 
  className?: string;
  iconSize?: number;
}) => {
  const socials = [
    { id: 'instagram', icon: <Instagram size={iconSize} />, url: 'https://www.instagram.com/thisissola/' },
    { id: 'tiktok', icon: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ), url: 'https://www.tiktok.com/@thisissola' },
    { id: 'youtube', icon: <Youtube size={iconSize} />, url: 'http://youtube.com/@thisissola' },
    { id: 'spotify', icon: (
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14.5c2.5-1 5.5-1 8 0" />
        <path d="M7 11.5c3.5-1.5 7-1.5 10.5 0" />
        <path d="M7 8.5c4-2 8-2 12 0" />
      </svg>
    ), url: 'https://open.spotify.com/artist/1Bfk5r6g6fXLaMoESYbePK' },
    { id: 'x', icon: (
      <svg width={iconSize - 2} height={iconSize - 2} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ), url: 'https://x.com/thisissola' },
  ];

  return (
    <div className={className}>
      {socials.map((social) => (
        <motion.a
          key={social.id}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.15, y: -2, color: 'var(--color-baby-blue)' }}
          className="text-baby-blue/40 hover:text-baby-blue transition-colors duration-300"
        >
          {social.icon}
        </motion.a>
      ))}
    </div>
  );
};

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-8 py-8 flex justify-between items-center">
      <div className="absolute inset-0 bg-gradient-to-b from-void/80 to-transparent pointer-events-none" />
      <a href="#" className="relative font-display text-[0.8rem] tracking-[0.6em] hover:scale-105 transition-transform duration-300 chrome bg-clip-text font-normal">ṢỌ́LÁ</a>
      <ul className="relative hidden md:flex gap-12 list-none items-center">
        {['VIDEOS', 'PRESS & LIVE', 'CONTACT', 'ABOUT'].map((item) => {
          let hrefVal = item.toLowerCase();
          if (hrefVal === 'about') hrefVal = 'world';
          else if (hrefVal === 'contact') hrefVal = 'newsletter';
          else if (hrefVal.includes('press') || hrefVal.includes('live')) hrefVal = 'press';

          return (
            <li key={item}>
              <a
                href={`#${hrefVal}`}
                className="font-display text-[0.55rem] tracking-[0.3em] text-baby-blue hover:text-white transition-all duration-300 uppercase animate-pulse-slow font-normal"
              >
                {item}
              </a>
            </li>
          );
        })}
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
          { id: 'press', label: 'PRESS & LIVE', size: 520, color: 'bg-glow shadow-[0_0_14px_var(--color-glow)]' },
          { id: 'newsletter', label: 'NEWSLETTER', size: 620, color: 'bg-baby-blue shadow-[0_0_15px_rgba(137,207,240,0.6)]' },
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
          className="font-serif italic text-[1.75rem] md:text-[2.75rem] tracking-[0.2em] drop-shadow-[0_0_15px_rgba(200,184,255,0.4)] chrome-blue-lilac-slow bg-clip-text"
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
    <section id="world" className="snap-start h-screen px-4 sm:px-8 py-8 sm:py-12 md:py-16 flex flex-col justify-center overflow-hidden relative">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col justify-center">
        <div className="font-display text-[0.4rem] sm:text-[0.45rem] tracking-[0.5em] text-baby-blue mb-4 sm:mb-6 flex items-center gap-4">
          <div className="w-8 h-px bg-baby-blue" />
          01 — The Artist
        </div>
        <div className="max-w-4xl">
          <h2 
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 300, fontStyle: 'italic' }} 
            className="text-xl md:text-2xl mb-4 sm:mb-6 lowercase tracking-[0.25em] chrome inline-block"
          >
            about
          </h2>
          <div className="space-y-3 sm:space-y-4 text-frost font-display text-[0.58rem] sm:text-[0.64rem] md:text-[0.72rem] font-normal tracking-[0.2em] leading-[1.8] uppercase">
            <p className="indent-12 md:indent-24">
              South London's Sola Reimagines the formal structures of classical music through an avant-garde, Black British lens. A multi-instrumentalist, producer, and composer, she dismantles her classical training to build a sound entirely on her own terms: heavy, atmospheric, somewhere between trip-hop, electronic R&B, and jazz.
            </p>
            <p>
              Her 2023 mixtape Warped Soul earned a "One to Watch" nod from The Guardian. She's since received cosigns from Elton John and Doechii, contributed to Jeymes Samuel's The Book of Clarence soundtrack, and been hand-picked to open for Sabrina Carpenter, showing her experimental sound can translate to both the underground and major stages.
            </p>
          </div>

          <div className="mt-6 md:mt-8">
            <h3 
              style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 300, fontStyle: 'italic' }} 
              className="text-[0.65rem] sm:text-[0.75rem] md:text-[0.85rem] mb-2 sm:mb-3 lowercase tracking-[0.25em] chrome inline-block"
            >
              sync, score & composition
            </h3>
            <div className="space-y-1.5 sm:space-y-2 text-frost font-display text-[0.52rem] sm:text-[0.56rem] md:text-[0.62rem] font-normal tracking-[0.22em] leading-[1.6] uppercase">
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-baby-blue/50 select-none">•</span>
                <p><span className="text-baby-blue font-bold">No Reproductive Justice, No Peace</span> <span className="text-frost/75">| Dir. Nadira Jamerson & Arieanne Evans | Original Score</span></p>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-baby-blue/50 select-none">•</span>
                <p><span className="text-baby-blue font-bold">The Book of Clarence Soundtrack</span> <span className="text-frost/75">| Dir. Jeymes Samuel | Featured Vocalist</span></p>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-baby-blue/50 select-none">•</span>
                <p><span className="text-baby-blue font-bold">Hello Happiness</span> <span className="text-frost/75">| Prod. The Wellcome Collection | Original Score</span></p>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <span className="text-baby-blue/50 select-none">•</span>
                <p><span className="text-baby-blue font-bold">Between The Lines Podcast</span> <span className="text-frost/75">| Jamz Supernova | Original Score</span></p>
              </div>
            </div>
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

const PressAndLive = () => {
  const articles = [
    { 
      source: 'The Guardian', 
      title: 'One to Watch: Sola | Music', 
      date: 'Sep 2023',
      url: 'https://www.theguardian.com/music/2023/sep/23/one-to-watch-sola-warped-soul'
    },
    { 
      source: 'Clash Magazine', 
      title: "Sola's Warped Soul Salutes The Tapestry Of Black British Creativity", 
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
    <div className="flex-1 flex flex-col justify-center py-6 sm:py-8 md:py-12 relative max-w-6xl mx-auto w-full">
      <div className="font-display text-[0.4rem] sm:text-[0.45rem] tracking-[0.5em] text-baby-blue mb-6 sm:mb-8 flex items-center gap-4">
        <div className="w-8 h-px bg-baby-blue" />
        03 — Press & Live
      </div>

      <div className="flex flex-col gap-6 sm:gap-8 md:gap-10 max-w-4xl">
        {/* Press Column */}
        <div className="space-y-3 md:space-y-4">
          <h3 
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 300, fontStyle: 'italic' }} 
            className="text-[0.65rem] sm:text-[0.75rem] md:text-[0.85rem] mb-2 sm:mb-3 lowercase tracking-[0.25em] chrome inline-block"
          >
            press
          </h3>
          <div className="space-y-1.5 sm:space-y-2 text-frost font-display text-[0.52rem] sm:text-[0.56rem] md:text-[0.62rem] font-normal tracking-[0.22em] leading-[1.6] uppercase">
            {articles.map((article, i) => (
              <motion.a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ x: 4 }}
                className="flex items-start gap-2 sm:gap-3 group cursor-pointer"
              >
                <span className="text-baby-blue/50 select-none group-hover:text-baby-blue transition-colors">•</span>
                <p className="flex-1">
                  <span className="text-baby-blue font-semibold group-hover:text-white transition-colors">{article.source}</span>
                  <span className="text-frost/75"> — </span>
                  <span className="text-frost group-hover:text-glow transition-colors">{article.title}</span>
                </p>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Live Column */}
        <div className="space-y-3 md:space-y-4">
          <h3 
            style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 300, fontStyle: 'italic' }} 
            className="text-[0.65rem] sm:text-[0.75rem] md:text-[0.85rem] mb-2 sm:mb-3 lowercase tracking-[0.25em] chrome inline-block"
          >
            live
          </h3>
          <div className="space-y-1.5 sm:space-y-2 text-frost font-display text-[0.52rem] sm:text-[0.56rem] md:text-[0.62rem] font-normal tracking-[0.22em] leading-[1.6] uppercase">
            {tourDates.map((item, i) => {
              const isTickets = item.status === 'Tickets';
              return (
                <div key={i} className="flex items-start gap-2 sm:gap-3 group">
                  <span className="text-baby-blue/50 select-none">•</span>
                  <div className="flex-1 flex justify-between items-center gap-4">
                    <p>
                      <span className="text-baby-blue font-semibold">{item.venue}</span>
                      <span className="text-frost/75"> ({item.city}) — </span>
                      <span className="text-frost">{item.date}</span>
                    </p>
                    {isTickets ? (
                      <a 
                        href="https://www.southbankcentre.co.uk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 text-[0.4rem] sm:text-[0.45rem] tracking-[0.15em] px-2.5 py-0.5 border border-teal text-teal hover:bg-teal hover:text-void transition-all font-bold uppercase rounded-sm"
                      >
                        Tickets
                      </a>
                    ) : (
                      <span className="shrink-0 text-[0.4rem] sm:text-[0.45rem] tracking-[0.15em] px-2.5 py-0.5 border border-glow/15 text-glow/30 uppercase rounded-sm select-none">
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
    { id: 'a9gT8ZvrxfA', title: 'Slow Dance', name: 'Mercury', color: 'bg-[radial-gradient(circle_at_35%_35%,#b5a196,#5c4038)]', glow: 'shadow-[0_0_10px_rgba(181,161,150,0.3)]', size: 'w-[12px] h-[12px]' },
    { id: 'x6Cm5y105Ec', title: "What's Your Desire?", name: 'Earth', color: 'bg-[radial-gradient(circle_at_35%_35%,#4ab0f0,#1a6030)]', glow: 'shadow-[0_0_20px_rgba(74,176,240,0.4)]', size: 'w-[18px] h-[18px]' },
    { id: 'Xhr_CGgt5Jc', title: 'Pink Elephants', name: 'Venus', color: 'bg-[radial-gradient(circle_at_35%_35%,#f0c080,#c08000)]', glow: 'shadow-[0_0_15px_rgba(240,192,128,0.3)]', size: 'w-[16px] h-[16px]' },
    { id: 'AEWZQAUKkCE', title: 'Nightingale (Live)', name: 'Mars', color: 'bg-[radial-gradient(circle_at_35%_35%,#e07050,#802020)]', glow: 'shadow-[0_0_12px_rgba(224,112,80,0.3)]', size: 'w-[14px] h-[14px]' },
    { id: 'mfsE2gXhvZo', title: 'Heat', name: 'Jupiter', color: 'bg-[radial-gradient(circle_at_35%_35%,#e8c090,#a06020)]', glow: 'shadow-[0_0_25px_rgba(232,192,144,0.4)]', size: 'w-[26px] h-[26px]' },
    { id: 'eoJ3jxX4yWE', title: "You Don't Have To Say", name: 'Neptune', color: 'bg-[radial-gradient(circle_at_35%_35%,#6080f0,#102060)]', glow: 'shadow-[0_0_15px_rgba(96,128,240,0.3)]', size: 'w-[18px] h-[18px]' }
  ];
 
  // Center Slow Dance on mount
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const centerTarget = () => {
      const innerContainer = scrollContainer.firstElementChild;
      if (!innerContainer) return false;

      const children = Array.from(innerContainer.children);
      const targetIndex = videoPlanets.length;
      const targetChild = children[targetIndex] as HTMLElement;

      if (targetChild) {
        const containerWidth = scrollContainer.getBoundingClientRect().width;
        if (containerWidth === 0) return false; // Container not laid out yet

        const childOffsetLeft = targetChild.offsetLeft;
        const childWidth = targetChild.offsetWidth;

        const targetScrollLeft = childOffsetLeft - (containerWidth / 2) + (childWidth / 2);
        scrollContainer.scrollLeft = targetScrollLeft;
        scrollPosRef.current = targetScrollLeft;
        return true;
      }
      return false;
    };

    // Try immediately
    if (centerTarget()) return;

    // Retry on layout/poll
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (centerTarget() || attempts > 30) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [videoPlanets.length]);

  // Auto-scroll logic for Horizontal list - EVEN SLOWER & SMOOTH
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
 
    let animationFrameId: number;
    const scroll = () => {
      if (!isHovered) {
        scrollPosRef.current += 0.12; // Slower controlled drift
        scrollContainer.scrollLeft = Math.floor(scrollPosRef.current);
        
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollPosRef.current = 0;
          scrollContainer.scrollLeft = 0;
        }
      } else {
        scrollPosRef.current = scrollContainer.scrollLeft;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };
 
    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);
 
  const activeVideos = videoPlanets;
 
  return (
    <div className="flex-1 flex flex-col h-full pt-4 pb-4 relative justify-between overflow-hidden">
      <div className="font-display text-[0.5rem] tracking-[0.5em] text-baby-blue mb-2 flex items-center gap-4 shrink-0">
        <div className="w-8 h-px bg-baby-blue" />
        02 — Video Archive
      </div>

      {/* Featured Video Stage - Maximized Real Estate with mathematically perfect 16:9 proportion */}
      <div className="flex-1 flex flex-col justify-center w-full px-2 md:px-4 my-2 min-h-0">
        <div 
          className="relative group overflow-hidden bg-void shadow-[0_25px_60px_rgba(0,0,0,0.85)] rounded-lg mx-auto shrink-0 border border-glow/5"
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            maxHeight: 'calc(100vh - 210px)',
            maxWidth: 'min(1200px, 95vw, calc((100vh - 210px) * 1.777))'
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="w-full h-full"
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

      {/* Horizontal Video Thumbnail Navigation at the bottom */}
      <div 
         ref={scrollRef}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
         className="w-full relative flex items-center overflow-x-auto no-scrollbar shrink-0 mt-4 mb-2 h-[140px]"
         style={{
           maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
           WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
         }}
      >
        <div className="flex items-start gap-4 md:gap-6 px-12 relative min-h-[110px] pt-1">
          {[...videoPlanets, ...videoPlanets].map((p, i) => {
            const isActualVideo = i % videoPlanets.length;
            const isActive = activeIndex === isActualVideo;
            
            return (
              <div key={`${p.id}-${i}`} className="flex flex-col items-center shrink-0 relative">
                <motion.button
                  onClick={() => setActiveIndex(isActualVideo)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className={`relative z-10 flex flex-col items-start gap-2 transition-all duration-500 cursor-pointer w-40 md:w-44 ${
                    isActive ? 'opacity-100' : 'opacity-40 hover:opacity-80'
                  }`}
                >
                  <div className={`relative aspect-video w-full overflow-hidden rounded border transition-all duration-500 ${
                    isActive ? 'border-glow shadow-[0_0_15px_rgba(200,184,255,0.25)]' : 'border-frost/10'
                  }`}>
                    {/* Real YouTube Thumbnail */}
                    <img 
                      src={`https://img.youtube.com/vi/${p.id}/mqdefault.jpg`} 
                      alt={p.title}
                      className={`w-full h-full object-cover transition-all duration-500 ${
                        isActive ? 'scale-105 filter-none' : 'filter grayscale'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                    {/* Overlay Sequence Number */}
                    <div className="absolute top-1.5 left-1.5 bg-void/80 backdrop-blur-sm px-1 py-0.5 rounded-[1px] font-mono text-[0.4rem] tracking-wider text-baby-blue">
                      {String(isActualVideo + 1).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-0.5 w-full pl-0.5">
                    <span className={`font-display text-[0.45rem] tracking-[0.2em] uppercase truncate w-full text-left transition-all duration-500 font-bold ${
                      isActive ? 'text-glow' : 'text-frost/85'
                    }`}>
                      {p.title}
                    </span>
                  </div>
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};



const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setErrorMessage('PLEASE ENTER A VALID EMAIL ADDRESS');
      return;
    }

    try {
      // 1. Save email to localStorage subscribers list as fallback/backup
      const saved = localStorage.getItem('sola-subscribers');
      const list = saved ? JSON.parse(saved) : [];
      
      const emailLower = email.trim().toLowerCase();
      if (!list.some((sub: any) => sub.email.toLowerCase() === emailLower)) {
        list.push({
          email: email.trim(),
          date: new Date().toISOString()
        });
        localStorage.setItem('sola-subscribers', JSON.stringify(list));
      }

      // 2. Submit to Google Form using dual-delivery (hidden iframe form submit AND background URLSearchParams POST fetch)
      const configuredFormUrl = localStorage.getItem('sola-form-url') || "https://docs.google.com/forms/d/1Rxb2YDX72obeQ1IoZEqOOtSM7xycUefU7LSjp0_LpS0/formResponse";
      const configuredEntryId = localStorage.getItem('sola-entry-id') || "entry.1044431221";

      if (configuredFormUrl) {
        // Automatically make sure the url has any query split off first
        let cleanUrl = configuredFormUrl.trim();
        cleanUrl = cleanUrl.split('#')[0];
        
        // Comprehensive string replacements for Google Sheets/Forms edit vs view vs response URLs
        if (cleanUrl.includes('/viewform')) {
          cleanUrl = cleanUrl.replace(/\/viewform(\?.*)?$/, '/formResponse');
          if (cleanUrl.includes('/viewform')) {
            cleanUrl = cleanUrl.split('/viewform')[0] + '/formResponse';
          }
        } else if (cleanUrl.includes('/edit')) {
          cleanUrl = cleanUrl.replace(/\/edit(\?.*)?$/, '/formResponse');
          if (cleanUrl.includes('/edit')) {
            cleanUrl = cleanUrl.split('/edit')[0] + '/formResponse';
          }
        }

        // Method A: Iframe-Target Form POST (bypasses direct page navigation locks)
        const iframeId = 'sola_gform_target_iframe';
        let iframe = document.getElementById(iframeId) as HTMLIFrameElement;
        if (!iframe) {
          iframe = document.createElement('iframe');
          iframe.id = iframeId;
          iframe.setAttribute('name', iframeId);
          iframe.style.display = 'none';
          document.body.appendChild(iframe);
        }

        const hiddenForm = document.createElement('form');
        hiddenForm.action = cleanUrl;
        hiddenForm.method = 'POST';
        hiddenForm.target = iframeId;

        // Custom Entry ID Field input
        const emailInput = document.createElement('input');
        emailInput.type = 'hidden';
        emailInput.name = configuredEntryId;
        emailInput.value = email.trim();
        hiddenForm.appendChild(emailInput);

        // Standard Collect-Emails Field (forces mapping to both, ensuring capture regardless of form configuration)
        const emailAddressInput = document.createElement('input');
        emailAddressInput.type = 'hidden';
        emailAddressInput.name = 'emailAddress';
        emailAddressInput.value = email.trim();
        hiddenForm.appendChild(emailAddressInput);

        document.body.appendChild(hiddenForm);
        hiddenForm.submit();

        // Perform clean background sweep of domestic nodes
        setTimeout(() => {
          if (hiddenForm.parentNode) {
            document.body.removeChild(hiddenForm);
          }
        }, 850);

        // Method B: CORS-immune Background POST fetch as bulletproof backup
        try {
          const formData = new URLSearchParams();
          formData.append(configuredEntryId, email.trim());
          formData.append('emailAddress', email.trim());

          fetch(cleanUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString()
          }).catch(err => console.debug('Fetch post response discarded (expected):', err));
        } catch (fetchErr) {
          console.debug('Background sync dispatch fallback failed:', fetchErr);
        }
      }

      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setErrorMessage('AN ERROR OCCURRED. PLEASE TRY AGAIN.');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-12">
      <div className="font-display text-[0.5rem] tracking-[0.5em] text-baby-blue mb-8 flex items-center gap-4">
        <div className="w-8 h-px bg-baby-blue" />
        05 — Contact
      </div>
      <div className="max-w-4xl mx-auto text-center w-full">
        <p className="font-serif italic text-[1.75rem] md:text-[2.25rem] tracking-[0.2em] drop-shadow-[0_0_15px_rgba(137,207,240,0.4)] mb-12 animate-pulse-slow chrome-ice-clean bg-clip-text">
          enter the orbit
        </p>
        
        {status === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto p-6 border border-baby-blue/30 bg-surface/80 rounded backdrop-blur-sm shadow-[0_0_20px_rgba(137,207,240,0.1)]"
          >
            <p className="font-display text-[0.6rem] tracking-[0.3em] text-baby-blue mb-2 uppercase font-bold">orbit entered</p>
            <p className="font-ibm-mono text-[0.55rem] tracking-[0.1em] text-frost/80 uppercase">you are now synchronized with the sola system.</p>
            <button 
              onClick={() => setStatus('idle')}
              className="mt-4 font-display text-[0.45rem] tracking-[0.2em] text-baby-blue/60 hover:text-baby-blue uppercase transition-colors"
            >
              [ Subscribe Another ]
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <input 
                type="email" 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="ENTER EMAIL ADDRESS"
                className="w-full bg-void border border-baby-blue/20 px-6 py-4 font-display text-[0.6rem] tracking-[0.2em] text-[#89CFF0] focus:outline-none focus:border-baby-blue/60 transition-colors placeholder:text-baby-blue/40"
              />
              {status === 'error' && (
                <span className="text-left font-ibm-mono text-[0.5rem] tracking-[0.1em] text-coral uppercase mt-1">
                  {errorMessage}
                </span>
              )}
            </div>
            <button type="submit" className="px-8 py-4 bg-chrome-ice text-void font-display text-[0.6rem] tracking-[0.4em] uppercase hover:brightness-110 transition-all font-bold h-fit shrink-0">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const Footer = ({ onOpenAdmin }: { onOpenAdmin?: () => void }) => {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    if (!onOpenAdmin) return;
    setClickCount(prev => {
      const next = prev + 1;
      if (next >= 5) {
        onOpenAdmin();
        return 0;
      }
      return next;
    });
  };

  return (
    <footer className="px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-2 relative z-10 opacity-40">
      <p 
        onClick={handleClick}
        className="font-display text-[0.45rem] tracking-[0.3em] text-[#89CFF0] hover:text-[#c8b8ff] transition-colors uppercase cursor-pointer select-none"
      >
        © 2025 Sola. All rights reserved. {clickCount > 0 && clickCount < 5 && `(${clickCount})`}
      </p>
    </footer>
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
          whileHover={{ scale: 1.05, letterSpacing: '0.6em', boxShadow: '0 0 20px rgba(137,207,240,0.5)' }}
          whileTap={{ scale: 0.95 }}
          className="enter-orbit-btn px-12 py-4 border border-baby-blue/30 font-display text-[0.6rem] tracking-[0.4em] uppercase hover:brightness-110 transition-all duration-500 shadow-[0_0_15px_rgba(137,207,240,0.2)]"
        >
          <span className="chrome font-bold">Enter Orbit</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

const SubscriberModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [subscribers, setSubscribers] = useState<{ email: string; date: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'list' | 'gform'>('list');
  const [formUrl, setFormUrl] = useState('');
  const [entryId, setEntryId] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem('sola-subscribers');
        setSubscribers(saved ? JSON.parse(saved) : []);

        const savedUrl = localStorage.getItem('sola-form-url') || "https://docs.google.com/forms/d/1Rxb2YDX72obeQ1IoZEqOOtSM7xycUefU7LSjp0_LpS0/viewform";
        const savedEntryId = localStorage.getItem('sola-entry-id') || "entry.1044431221";
        setFormUrl(savedUrl);
        setEntryId(savedEntryId);
      } catch (e) {
        console.error(e);
      }
    }
  }, [isOpen]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('sola-form-url', formUrl.trim());
      localStorage.setItem('sola-entry-id', entryId.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (err) {
      alert("Error saving settings.");
    }
  };

  const handleDownload = () => {
    if (subscribers.length === 0) return;
    try {
      const csvContent = "data:text/csv;charset=utf-8,Email,SignUp Date\n" 
        + subscribers.map(s => `"${s.email.replace(/"/g, '""')}","${new Date(s.date).toLocaleString()}"`).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `sola_subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Error generating download.");
    }
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear your subscriber list? This cannot be undone.")) {
      localStorage.removeItem('sola-subscribers');
      setSubscribers([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-void/90 backdrop-blur-md">
      <div className="w-full max-w-lg border border-baby-blue/30 bg-[#05050a] rounded p-6 shadow-[0_0_50px_rgba(137,207,240,0.15)] flex flex-col max-h-[85vh] relative z-100">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-[0.7rem] tracking-[0.4em] uppercase text-baby-blue flex items-center gap-2">
            <div className="w-2 h-2 bg-baby-blue rounded-full animate-ping" />
            Control Center
          </h3>
          <button 
            onClick={onClose}
            className="text-baby-blue/40 hover:text-baby-blue transition-colors font-display text-[0.5rem] tracking-[0.2em] uppercase shrink-0"
          >
            [ ESC ]
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-baby-blue/10 mb-6 font-display text-[0.55rem] tracking-[0.2em] uppercase shrink-0">
          <button 
            type="button" 
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-2 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'list' ? 'border-baby-blue text-baby-blue font-bold' : 'border-transparent text-baby-blue/40 hover:text-baby-blue/70'
            }`}
          >
            Registry List ({subscribers.length})
          </button>
          <button 
            type="button" 
            onClick={() => setActiveTab('gform')}
            className={`flex-1 py-2 text-center transition-colors border-b-2 cursor-pointer ${
              activeTab === 'gform' ? 'border-baby-blue text-baby-blue font-bold' : 'border-transparent text-baby-blue/40 hover:text-baby-blue/70'
            }`}
          >
            Google Form Integration
          </button>
        </div>

        {/* Tab content */}
        {activeTab === 'list' ? (
          <>
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 mb-6 pr-1 max-h-[40vh]">
              {subscribers.length === 0 ? (
                <p className="font-ibm-mono text-[0.55rem] tracking-[0.1em] text-dust/60 text-center py-12 uppercase italic">
                  no entities registered in this solar orbit yet.
                </p>
              ) : (
                subscribers.map((sub, i) => (
                  <div key={i} className="flex justify-between items-center bg-void border border-baby-blue/5 p-3 rounded font-ibm-mono text-[0.55rem] tracking-[0.05em] uppercase">
                    <span className="text-frost select-all truncate mr-4">{sub.email}</span>
                    <span className="text-dust/40 text-[0.5rem] shrink-0">{new Date(sub.date).toLocaleDateString()}</span>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-4">
              <button 
                type="button"
                onClick={handleDownload}
                disabled={subscribers.length === 0}
                className="flex-1 px-4 py-3 bg-chrome-ice text-void font-display text-[0.55rem] tracking-[0.2em] uppercase font-bold hover:brightness-110 active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all cursor-pointer"
              >
                Export CSV
              </button>
              <button 
                type="button"
                onClick={handleClear}
                disabled={subscribers.length === 0}
                className="px-4 py-3 border border-coral/30 hover:bg-coral/10 text-coral font-display text-[0.55rem] tracking-[0.2em] uppercase transition-all active:scale-95 disabled:opacity-30 disabled:scale-100 cursor-pointer"
              >
                Clear list
              </button>
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-3 border border-baby-blue/20 hover:bg-baby-blue/5 text-baby-blue font-display text-[0.55rem] tracking-[0.2em] uppercase transition-all active:scale-95 cursor-pointer"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSaveSettings} className="flex-1 flex flex-col justify-between max-h-[50vh]">
            <div className="space-y-4 overflow-y-auto no-scrollbar pr-1 mb-6 text-left">
              <div className="flex flex-col gap-1.5">
                <label className="font-display text-[0.5rem] tracking-[0.2em] text-[#89CFF0] uppercase">Google Form Link</label>
                <input 
                  type="url"
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  placeholder="https://docs.google.com/forms/d/.../viewform"
                  className="w-full bg-void border border-baby-blue/20 px-4 py-3 font-ibm-mono text-[0.55rem] tracking-[0.05em] text-[#89CFF0] focus:outline-none focus:border-baby-blue/60 transition-colors"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-display text-[0.5rem] tracking-[0.2em] text-[#89CFF0] uppercase">Email Field Entry ID</label>
                <input 
                  type="text"
                  value={entryId}
                  onChange={(e) => setEntryId(e.target.value)}
                  placeholder="entry.1044431221"
                  className="w-full bg-void border border-baby-blue/20 px-4 py-3 font-ibm-mono text-[0.55rem] tracking-[0.05em] text-[#89CFF0] focus:outline-none focus:border-baby-blue/60 transition-colors"
                  required
                />
              </div>

              <div className="border border-baby-blue/10 bg-void/50 p-4 rounded text-left space-y-2.5">
                <p className="font-display text-[0.45rem] tracking-[0.25em] text-baby-blue uppercase font-bold">integration & troubleshooting:</p>
                <ol className="list-decimal list-inside font-ibm-mono text-[0.5rem] tracking-[0.05em] text-dust/70 space-y-2 uppercase leading-relaxed">
                  <li>open your google form editor, click "send", choose the link tab, and copy/paste it into google form link.</li>
                  <li>open the public form link. right-click the email input field and choose "inspect". find the name="..." attribute (e.g., entry.1044431221).</li>
                  <li>copy that code and paste it above under "email field entry id". if submissions arrive blank, the entry id is wrong.</li>
                  <li><span className="text-baby-blue/80 font-bold">critical:</span> remove "required" tags from all other fields on your form, otherwise submissions will be rejected by google's server.</li>
                  <li><span className="text-emerald-400 font-bold">fail-safe:</span> all successful email submissions are always 100% saved in the registry list tab. you can view and export them as csv anytime.</li>
                </ol>
              </div>
            </div>

            <div className="flex gap-4 shrink-0">
              <button 
                type="submit"
                className="flex-1 px-4 py-3 bg-chrome-ice text-void font-display text-[0.55rem] tracking-[0.2em] uppercase font-bold hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                {isSaved ? "Saved Successfully" : "Save Integration"}
              </button>
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-3 border border-baby-blue/20 hover:bg-baby-blue/5 text-baby-blue font-display text-[0.55rem] tracking-[0.2em] uppercase transition-all active:scale-95 cursor-pointer"
              >
                Close
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const handleEnter = () => {
    setHasEntered(true);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (!hasEntered) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id || "home");
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll("main > section");
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [hasEntered]);

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
          <section id="home" className="snap-start h-screen">
            <Hero />
          </section>
          <About />
          <section id="videos" className="snap-start h-screen px-2 sm:px-6 md:px-8 flex flex-col justify-center overflow-hidden pb-2 md:pb-4">
            <Pictures />
          </section>
          <section id="press" className="snap-start h-screen px-4 sm:px-8 flex flex-col justify-center overflow-hidden">
            <PressAndLive />
          </section>
          <section id="newsletter" className="snap-start h-screen px-8 flex flex-col justify-between bg-void/30 backdrop-blur-sm overflow-hidden relative">
            <Newsletter />
            <Footer onOpenAdmin={() => setIsAdminOpen(true)} />
          </section>
        </main>
        {/* Global persistent fixed social footer on bottom right */}
        <SocialLinks 
          className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[110] flex items-center gap-6 sm:gap-7 transition-all duration-300 ${
            activeSection === 'videos' 
              ? 'opacity-0 pointer-events-none translate-y-4' 
              : 'opacity-100 translate-y-0'
          }`} 
          iconSize={24} 
        />
      </div>

      <SubscriberModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[5] opacity-[0.04] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
