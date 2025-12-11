import React from "react";
import { Hero } from "@/components/Hero";
import { ProjectCard } from "@/components/ProjectCard";
import { SkillMatrix } from "@/components/SkillMatrix";
import { Terminal } from "@/components/Terminal";
import { ContactForm } from "@/components/ContactForm";
import { PROJECTS } from "@/constants/constant";
import { Download } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import Image from "next/image";
import Head from "next/head";

function App() {
  return (
    <div
      className="bg-black min-h-screen text-white"
      suppressHydrationWarning={true}
    >
      <NavBar />
      <main className="bg-black min-h-screen text-slate-200 selection:bg-white selection:text-black">
        <Hero />

        {/* Featured Projects Grid */}
        <section
          id="projects"
          className="py-24 max-w-7xl mx-auto px-6 scroll-mt-32"
        >
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-gray-800 pb-6">
            <div>
              <h2 className="text-3xl font-sans font-light tracking-tight text-white mb-2">
                Selected Works
              </h2>
              <p className="text-gray-400 text-sm max-w-lg">
                A collection of web applications and systems.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">
                Index: {PROJECTS.length} items
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        <SkillMatrix />

        {/* Intelligence Section (Gemini) */}
        <section
          id="terminal"
          className="bg-linear-to-b from-palantir-black to-palantir-dark py-24 px-6 scroll-mt-32"
        >
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-sans font-light text-white mb-4">
              Interactive Terminal
            </h2>
            <p className="text-gray-400">
              Query the AI assistant about my technical experience, work
              history, and availability.
            </p>
          </div>
          <Terminal />
        </section>

        {/* Footer & Contact */}
        <footer
          id="contact"
          className="border-t border-gray-700 bg-black py-24 scroll-mt-32 relative overflow-hidden"
        >
          {/* Optional background grid for footer area */}
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
              {/* Left Column: Info & Links */}
              <div className="flex flex-col h-full">
                {/* Brand & Bio */}
                <div className="mb-12">
                  <div className="w-8 h-8 bg-black text-black flex items-center justify-center font-bold font-mono mb-6 rounded-sm overflow-hidden">
                    <Image
                      src="/k.svg"
                      alt="Logo"
                      className="invert"
                      width={32}
                      height={32}
                    />
                  </div>
                  <p className="text-gray-500 max-w-md leading-relaxed mb-8">
                    Specializing in scalable frontend architecture, responsive
                    design, and modern web standards. Building the web, dreaming to work for a more secure world.
                  </p>
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    className="inline-flex items-center gap-2 text-white border border-gray-700 px-5 py-2.5 hover:bg-white/10 transition-colors font-mono text-xs uppercase tracking-widest"
                  >
                    <Download size={14} />
                    Download Resume
                  </a>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-2 gap-8 mt-auto">
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-widest text-white mb-4">
                      Location
                    </h4>
                    <ul className="space-y-2 text-gray-500 text-sm">
                      <li>Treviso, IT</li>
                      <li className="text-gray-500 flex gap-1 items-center"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>Available for Remote</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-widest text-white mb-4">
                      Connect
                    </h4>
                    <ul className="space-y-2 text-gray-500 text-sm">
                      <li>
                        <a
                          href="https://github.com/K4mp47"
                          className="hover:text-white transition-colors"
                        >
                          GitHub
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.linkedin.com/in/alberto-campagnolo-916b86265/"
                          className="hover:text-white transition-colors"
                        >
                          LinkedIn
                        </a>
                      </li>
                      <li>
                        <a
                          href="mailto:campagnoloalberto5@gmail.com"
                          className="hover:text-white transition-colors"
                        >
                          Email
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="text-[10px] text-gray-700 font-mono uppercase tracking-widest pt-12 mt-12 border-t border-gray-900/50">
                  <span>
                    © 2024 Web Developer Portfolio // System Status: Online
                  </span>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <div className="lg:pl-12 lg:border-l border-gray-900">
                <ContactForm />
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
