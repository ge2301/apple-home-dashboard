import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useHassRef, useHassVersion, useCustomizationManager } from '../../contexts/HassContext';
import { CamerasPage } from '../../pages/CamerasPage';
import { sectionVariants } from '../animations';

export function CamerasPageReact() {
  const hassRef = useHassRef();
  const hassVersion = useHassVersion();
  const customizationManager = useCustomizationManager();
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<CamerasPage | null>(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || !hassRef.current) return;
    const hass = hassRef.current;

    if (renderedRef.current && containerRef.current.childElementCount > 0) {
      return;
    }
    renderedRef.current = true;

    if (!pageRef.current) {
      pageRef.current = new CamerasPage();
    }

    const page = pageRef.current;
    page.hass = hass;
    page.setConfig({
      customizations: customizationManager?.getCustomizations?.() || {},
    });

    containerRef.current.innerHTML = '';
    page.render(containerRef.current, hass, () => {});
  }, [customizationManager]);

  useEffect(() => {
    if (!containerRef.current || !hassRef.current) return;
    const hass = hassRef.current;
    const cards = containerRef.current.querySelectorAll('apple-home-card');
    cards.forEach((card: any) => { card.hass = hass; });
  }, [hassVersion]);

  return (
    <motion.div variants={sectionVariants}>
      <div ref={containerRef} />
    </motion.div>
  );
}
