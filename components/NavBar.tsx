"use client";
import React, { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  // Height of the fixed navbar to offset scrolling so sections are not hidden
  const HEADER_OFFSET = 80;

  const scrollToId = (id: string) => {
    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    setActiveSection(id);
    if (!el) return;
    const y =
      el.getBoundingClientRect().top + globalThis.scrollY - HEADER_OFFSET;
    try {
      window.history.pushState(null, "", `#${id}`);
    } catch (err) {
      // ignore
    }
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const navLinks = useMemo(
    () => [
      { name: "Projects", href: "/#projects", id: "projects" },
      { name: "Expertise", href: "/#skills", id: "skills" },
      { name: "Terminal", href: "/#terminal", id: "terminal" },
      // { name: "Journal", href: "/blog", id: "blog" },
    ],
    [],
  );

  useEffect(() => {
    if (pathname !== "/") return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === "home") {
              setActiveSection("");
            } else {
              setActiveSection(entry.target.id);
            }
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "-20% 0px -60% 0px",
      },
    );

    // Observe home section to clear active state
    const homeEl = document.getElementById("home");
    if (homeEl) observer.observe(homeEl);

    navLinks.forEach((link) => {
      if (link.href.startsWith("/#")) {
        const element = document.getElementById(link.id);
        if (element) observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [navLinks, pathname]);

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-100 flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto relative flex items-center gap-6 px-3 pl-4 py-2.5 rounded-md border border-white/10 bg-palantir-black/60 backdrop-blur-md shadow-2xl shadow-black/50 w-full max-w-3xl transition-all duration-300">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mr-auto">
            <div className="w-6 h-6 bg-black text-black flex items-center justify-center font-bold font-mono text-xs rounded-sm overflow-hidden">
              <Image
                src="/k.svg"
                alt="Logo"
                className="invert"
                width={24}
                height={24}
              />
            </div>
            <span className="font-sans font-medium text-xs tracking-wider uppercase text-gray-300 hidden sm:block">
              Dev <span className="text-gray-600">{"//"}</span> Portfolio
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith("/#")) {
                    e.preventDefault();
                    scrollToId(link.id);
                  }
                }}
                className={`text-[11px] font-mono uppercase tracking-widest px-3 py-1 rounded-md transition-all duration-300 ${
                  (link.href.startsWith("/#") && activeSection === link.id) || (pathname === "/blog" && link.id === "blog")
                    ? "text-white bg-white/10 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block w-px h-4 bg-white/10"></div>
            <Link
              href="/#contact"
              onClick={(e) => {
                if (pathname === "/") {
                  e.preventDefault();
                  scrollToId("contact");
                }
              }}
              className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-white text-black text-[10px] font-mono uppercase tracking-widest hover:bg-gray-200 rounded-md transition-all"
            >
              Contact
              <ArrowUpRight size={12} />
            </Link>

            <button
              className="md:hidden text-gray-300 hover:text-white p-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="fixed top-24 left-4 right-4 z-90 md:hidden flex flex-col items-center">
          <div className="w-full max-w-3xl bg-palantir-black/95 backdrop-blur-xl border border-white/10 rounded-md p-4 shadow-2xl flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith("/#")) {
                    e.preventDefault();
                    scrollToId(link.id);
                  }
                  setIsMenuOpen(false);
                }}
                className={`w-full text-center py-3 text-xs font-mono uppercase tracking-widest rounded-lg transition-colors ${
                  (link.href.startsWith("/#") && activeSection === link.id) || (pathname === "/blog" && link.id === "blog")
                    ? "text-white bg-white/10"
                    : "text-gray-300 hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px w-full bg-white/10 my-1"></div>
            <Link
              href="/#contact"
              onClick={(e) => {
                if (pathname === "/") {
                  e.preventDefault();
                  scrollToId("contact");
                }
                setIsMenuOpen(false);
              }}
              className="w-full text-center py-3 text-xs font-mono uppercase tracking-widest text-white bg-white/20 hover:bg-white/20 rounded-md transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
