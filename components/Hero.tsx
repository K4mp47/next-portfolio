"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Activity,
  Circle,
  Cloud,
  Code,
  Command,
  Cpu,
  Database,
  Hash,
  Layers,
  Lock,
  Server,
  Terminal,
  Wifi,
} from "lucide-react";

export const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const HEADER_OFFSET = 80;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { left, top, width, height } =
        heroRef.current.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y =
      el.getBoundingClientRect().top + globalThis.scrollY - HEADER_OFFSET;
    try {
      globalThis.history.pushState(null, "", `#${id}`);
    } catch (err) {
      // ignore: some environments or older browsers may throw
    }
    globalThis.scrollTo({ top: y, behavior: "smooth" });
  };

  // Card Content Data
  const row1 = [
    { icon: <Code size={20} />, label: "React" },
    { icon: <Terminal size={20} />, label: "TypeScript" },
    { icon: <Cpu size={20} />, label: "Node.js" },
    { icon: <Database size={20} />, label: "PostgreSQL" },
    { icon: <Cloud size={20} />, label: "AWS" },
    { icon: <Layers size={20} />, label: "Next.js" },
  ];

  const row2 = [
    { icon: <Lock size={20} />, label: "Auth0" },
    { icon: <Wifi size={20} />, label: "WebSockets" },
    { icon: <Command size={20} />, label: "GraphQL" },
    { icon: <Hash size={20} />, label: "Rust" },
    { icon: <Server size={20} />, label: "Docker" },
    { icon: <Activity size={20} />, label: "Monitoring" },
  ];

  const row3 = [
    { icon: <Terminal size={20} />, label: "Vim" },
    { icon: <Code size={20} />, label: "Tailwind" },
    { icon: <Database size={20} />, label: "Redis" },
    { icon: <Cloud size={20} />, label: "GCP" },
    { icon: <Layers size={20} />, label: "System Design" },
    { icon: <Cpu size={20} />, label: "Performance" },
  ];

  const Card = ({
    item,
  }: {
    item: { icon: React.ReactNode; label: string };
  }) => (
    <div className="w-48 h-32 mx-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm flex flex-col items-center justify-center gap-3 shadow-xl transform transition-transform hover:scale-105 group">
      <div className="text-gray-400 group-hover:text-blue-400 transition-colors">
        {item.icon}
      </div>
      <span className="text-xs font-mono uppercase tracking-widest text-gray-500 group-hover:text-gray-300">
        {item.label}
      </span>
    </div>
  );

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 perspective-1000"
    >
      {/* 3D Animated Background */}
      <div className="absolute inset-0 z-0 bg-black flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#0f172a_0%,#000000_100%)] opacity-40 z-0"></div>

        {/* 3D Tilted Container */}
        <div
          className="absolute w-[150vw] h-[150vh] flex flex-col gap-8 justify-center items-center opacity-30 transition-transform duration-200 ease-out"
          style={{
            transform: `
                    rotateX(${20 + mousePosition.y * 5}deg) 
                    rotateY(${-10 + mousePosition.x * 5}deg) 
                    rotateZ(${20}deg) 
                    scale(1.2)
                `,
          }}
        >
          {/* Row 1: Marquee Left */}
          <div className="flex w-max animate-marquee">
            {[...row1, ...row1, ...row1, ...row1].map((item, i) => (
              <Card key={`r1-${i}`} item={item} />
            ))}
          </div>

          {/* Row 2: Marquee Right */}
          <div className="flex w-max animate-marquee-reverse">
            {[...row2, ...row2, ...row2, ...row2].map((item, i) => (
              <Card key={`r2-${i}`} item={item} />
            ))}
          </div>

          {/* Row 3: Marquee Left */}
          <div className="flex w-max animate-marquee">
            {[...row3, ...row3, ...row3, ...row3].map((item, i) => (
              <Card key={`r3-${i}`} item={item} />
            ))}
          </div>
        </div>

        {/* Vignette Mask to fade edges */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_85%)] z-10 pointer-events-none"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-end pb-24 md:pb-0 pointer-events-none">
        {/* Main Text Block - Enable pointer events for text interaction */}
        <div className="flex-1 mb-12 md:mb-0 pointer-events-auto">
          <div
            className={`inline-flex items-center gap-2 border border-white/10 rounded-full px-3 py-1 mb-8 backdrop-blur-md bg-white/5 shadow-[0_0_15px_rgba(255,255,255,0.05)] ${isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
            style={{ animationDelay: "100ms", animationFillMode: "both" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-gray-300">
              Open to Opportunities
            </span>
          </div>

          <h1
            className={`text-5xl md:text-7xl lg:text-8xl font-sans font-medium text-white tracking-tighter leading-[0.9] mb-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
            style={{ animationDelay: "300ms", animationFillMode: "both" }}
          >
            K4mp47, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-gray-500 to-white bg-size-[200%_auto] animate-shimmer">
              Web & Software
            </span>{" "}
            <br /> Engineer.
          </h1>

          <p
            className={`text-lg text-gray-400 max-w-md font-light leading-relaxed mb-10 border-l border-gray-800 pl-6 ${isVisible ? "animate-fade-in-up" : "opacity-0"
              }`}
            style={{ animationDelay: "500ms", animationFillMode: "both" }}
          >
            Crafting digital experiences with React, Node.js,
            and modern web applications. Focused on accessibility, and clean code.
          </p>

          <div
            className={`mt-6 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
            style={{ animationDelay: "700ms", animationFillMode: "both" }}
          >
            <button
              className="text-xs font-mono text-gray-500 hover:text-blue-400 flex items-center gap-2 transition-colors cursor-pointer"
              onClick={() => scrollToId("terminal")}
            >
              <Terminal size={12} />
              <span>Initialize AI Assistant</span>
            </button>
          </div>
        </div>

        {/* Decorative Stats Column */}
        <div
          className={`hidden lg:flex flex-col gap-6 w-64 mb-10 opacity-70 ${isVisible ? "animate-fade-in-up" : "opacity-0"
            }`}
          style={{ animationDelay: "900ms", animationFillMode: "both" }}
        >
          <div className="border-t border-gray-800 pt-4">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Activity size={14} />
              <span className="text-[10px] font-mono uppercase tracking-widest">
                Clean Code
              </span>
            </div>
            <div className="text-2xl font-mono text-white">Is a must</div>
          </div>

          <div className="border-t border-gray-800 pt-4">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Circle size={14} />
              <span className="text-[10px] font-mono uppercase tracking-widest">
                Main Focus
              </span>
            </div>
            <div className="text-2xl font-mono text-white">Being productive</div>
          </div>
        </div>
      </div>
    </div>
  );
};
