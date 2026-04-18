import React, { useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { scrollBounceSpring } from './animations';

const RESISTANCE = 0.35;
const MAX_BOUNCE = 80;

interface ScrollBounceProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function ScrollBounce({ className, style, children }: ScrollBounceProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);
  const touchStartScroll = useRef(0);
  const isHorizontal = useRef(false);
  const bounceY = useMotionValue(0);
  const springY = useSpring(bounceY, scrollBounceSpring);
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
    touchStartScroll.current = scrollRef.current?.scrollTop ?? 0;
    isHorizontal.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const el = scrollRef.current;
    if (!el || el.scrollHeight <= el.clientHeight) return;

    const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
    const dy = e.touches[0].clientY - touchStartY.current;

    if (isHorizontal.current) return;

    if (dx > Math.abs(dy) && dx > 4) {
      isHorizontal.current = true;
      if (bounceY.get() !== 0) bounceY.set(0);
      return;
    }

    if (Math.abs(dy) < dx + 4) return;

    const maxScroll = el.scrollHeight - el.clientHeight;

    if (dy > 0 && el.scrollTop <= 0) {
      const over = dy - touchStartScroll.current;
      if (over > 0) {
        bounceY.set(Math.min(over * RESISTANCE, MAX_BOUNCE));
        return;
      }
    }

    if (dy < 0 && el.scrollTop >= maxScroll - 1) {
      const over = dy + (maxScroll - touchStartScroll.current);
      if (over < 0) {
        bounceY.set(Math.max(over * RESISTANCE, -MAX_BOUNCE));
        return;
      }
    }

    if (bounceY.get() !== 0) bounceY.set(0);
  }, [bounceY]);

  const handleTouchEnd = useCallback(() => {
    if (bounceY.get() !== 0) bounceY.set(0);
  }, [bounceY]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const el = scrollRef.current;
    if (!el || el.scrollHeight <= el.clientHeight) return;

    const maxScroll = el.scrollHeight - el.clientHeight;
    const atTop = el.scrollTop <= 0 && e.deltaY < 0;
    const atBottom = el.scrollTop >= maxScroll - 1 && e.deltaY > 0;

    if (atTop || atBottom) {
      const current = bounceY.get();
      const bump = current - e.deltaY * 0.12;
      bounceY.set(Math.max(-MAX_BOUNCE, Math.min(MAX_BOUNCE, bump)));

      if (wheelTimer.current) clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(() => bounceY.set(0), 120);
    }
  }, [bounceY]);

  return (
    <div
      ref={scrollRef}
      className={className}
      style={{ overflow: 'auto', ...style }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <motion.div style={{ y: springY }}>
        {children}
      </motion.div>
    </div>
  );
}
