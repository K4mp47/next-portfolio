"use client";

import React, { useEffect, useRef, useState } from "react";

export type TimelineEntry = {
  title: string;
  content: React.ReactNode;
};

type TimelineProps = {
  data: TimelineEntry[];
};

export function Timeline({ data }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    let animationFrame = 0;

    const updateProgress = () => {
      const bounds = timeline.getBoundingClientRect();
      const viewportMarker = window.innerHeight * 8;
      const distance = viewportMarker - bounds.top;
      const nextProgress = Math.min(Math.max(distance / bounds.height, 0), 1);

      setProgress(nextProgress);
      animationFrame = 0;
    };

    const requestUpdate = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div ref={timelineRef} className="relative">
      <div
        className="absolute bottom-0 left-[14px] top-3 w-px bg-palantir-gray md:left-[184px]"
        aria-hidden="true"
      >
        <div
          className="absolute inset-x-0 top-0 origin-top bg-linear-to-b from-blue-400 via-blue-500 to-blue-500/20 shadow-[0_0_14px_rgba(59,130,246,0.55)] motion-reduce:transition-none"
          style={{ height: `${progress * 100}%` }}
        />
      </div>

      {data.map((entry, index) => (
        <article
          key={`${entry.title}-${index}`}
          className="group relative grid grid-cols-[28px_1fr] gap-x-4 pb-14 last:pb-0 md:grid-cols-[160px_48px_1fr] md:gap-x-0 md:pb-20"
        >
          <div className="hidden md:block">
            <div className="sticky top-[50vh] -translate-y-1/2 pr-8 text-right">
              <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-blue-400">
                {entry.title}
              </h4>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="sticky top-[50vh] z-10 flex h-3 w-3 -translate-y-1/2 items-center justify-center rounded-full border border-gray-700 bg-palantir-black transition-colors duration-300 group-hover:border-blue-400">
              <span className="h-1 w-1 rounded-full bg-gray-500 transition-colors duration-300 group-hover:bg-blue-400" />
            </div>
          </div>

          <div className="min-w-0 pb-2">
            <div className="mb-4 md:hidden">
              <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-blue-400">
                {entry.title}
              </h4>
            </div>
            {entry.content}
          </div>
        </article>
      ))}
    </div>
  );
}
