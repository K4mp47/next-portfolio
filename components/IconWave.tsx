"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from 'react'
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRightToLine,
  Box,
  Braces,
  CheckCircle2,
  Code2,
  Command,
  Copy,
  CornerDownLeft,
  Folder,
  GitBranch,
  MonitorUp,
  MoreVertical,
  Network,
  PanelTop,
  SearchCode,
  SlidersHorizontal,
  Sparkle,
  Sparkles,
  WandSparkles,
  type LucideIcon,
} from 'lucide-react'
import './IconWave.css'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const ICONS: LucideIcon[] = [
  CornerDownLeft,
  Braces,
  Network,
  Copy,
  Box,
  Code2,
  GitBranch,
  Folder,
  ArrowRightToLine,
  SlidersHorizontal,
  WandSparkles,
  SearchCode,
  ArrowLeft,
  PanelTop,
  Command,
  Sparkle,
  Sparkles,
  MoreVertical,
  CheckCircle2,
  MonitorUp,
  ArrowDownToLine,
]

export interface IconWaveProps {
  duration?: number;
  amplitude?: number;
  scrollTravel?: number;
  paused?: boolean;
  compact?: boolean;
}

function bounded(value: number, fallback: number, min: number, max: number) {
  return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

export default function IconWave({ duration = 5.28, amplitude = 26, scrollTravel = 520, paused = false, compact = false }: IconWaveProps) {
  const [stopped, setStopped] = useState(false);
  paused = paused || stopped || compact;
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seconds = bounded(duration, 5.28, 0.5, 20);
  const height = bounded(compact ? 12 : amplitude, 26, 0, 40);
  const travel = bounded(scrollTravel, 520, 0, 1000);
  const style: CSSProperties & { '--wave-duration': string; '--wave-amplitude': string } = {
    '--wave-duration': `${seconds}s`,
    '--wave-amplitude': `${height}px`,
  };

  // A fixed shuffle preserves the original composition across renders.
  const iconOrder = useMemo(() => {
    const ordered = [...ICONS];
    let seed = 19;
    for (let index = ordered.length - 1; index > 0; index -= 1) {
      seed = (seed * 9301 + 49297) % 233280;
      const swapIndex = Math.floor((seed / 233280) * (index + 1));
      [ordered[index], ordered[swapIndex]] = [ordered[swapIndex], ordered[index]];
    }
    return ordered;
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isVisible = false;
    let frameId = 0;
    let position: number | undefined;
    let previousTime: number | undefined;

    const updatePosition = (time: number) => {
      frameId = 0;
      if (!isVisible || reduceMotion.matches || paused) return;
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, window.innerHeight + rect.height);
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / distance));
      const horizontalShift = Math.min(travel, window.innerWidth * 0.38) * (0.5 - progress);
      const elapsed = previousTime === undefined ? 1000 / 60 : Math.max(0, time - previousTime);
      previousTime = time;
      position = position === undefined ? horizontalShift : position + (horizontalShift - position) * (1 - Math.exp(-elapsed / 100));
      if (Math.abs(horizontalShift - position) < 0.1) {
        position = horizontalShift;
        previousTime = undefined;
      } else {
        frameId = window.requestAnimationFrame(updatePosition);
      }
      track.style.setProperty('--scroll-x', `${position}px`);
    };
    const schedulePositionUpdate = () => {
      if (!isVisible || frameId || reduceMotion.matches || paused) return;
      frameId = window.requestAnimationFrame(updatePosition);
    };
    const motionChanged = () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
      previousTime = undefined;
      if (reduceMotion.matches) {
        position = undefined;
        track.style.setProperty('--scroll-x', '0px');
      }
      else schedulePositionUpdate();
    };
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      section.classList.toggle('is-visible', isVisible);
      if (isVisible) schedulePositionUpdate();
      else {
        if (frameId) window.cancelAnimationFrame(frameId);
        frameId = 0;
        previousTime = undefined;
      }
    }, { rootMargin: '160px 0px' });

    visibilityObserver.observe(section);
    window.addEventListener('scroll', schedulePositionUpdate, { passive: true });
    window.addEventListener('resize', schedulePositionUpdate, { passive: true });
    reduceMotion.addEventListener('change', motionChanged);
    motionChanged();
    return () => {
      visibilityObserver.disconnect();
      window.removeEventListener('scroll', schedulePositionUpdate);
      window.removeEventListener('resize', schedulePositionUpdate);
      reduceMotion.removeEventListener('change', motionChanged);
      if (frameId) window.cancelAnimationFrame(frameId);
      section.classList.remove('is-visible');
    };
  }, [travel, paused]);

  return (
    <section className={compact ? "icon-wave icon-wave--compact" : "icon-wave"} ref={sectionRef} style={style} data-paused={paused} aria-label="Animated tools">
      {!compact && <Button variant="ghost" size="sm" className="mb-3" onClick={() => setStopped(!stopped)} aria-pressed={stopped}>
        {stopped ? 'Play animation' : 'Pause animation'}
      </Button>}
      <div className="icon-wave__stage">
        <div className="icon-wave__track" ref={trackRef}>
          {iconOrder.map((Icon, index) => (
            <div className="icon-wave__dot" key={index} aria-hidden="true"
              style={{ animationDelay: `${(-index * seconds * 0.58) / (Math.PI * 2)}s` }}>
              <Icon aria-hidden="true" strokeWidth={1.65} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
