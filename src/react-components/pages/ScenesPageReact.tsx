import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useHass, useCustomizationManager } from '../../contexts/HassContext';
import { ScenesPage } from '../../pages/ScenesPage';
import { sectionVariants } from '../animations';

export function ScenesPageReact() {
  const hass = useHass();
  const customizationManager = useCustomizationManager();
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<ScenesPage | null>(null);

  useEffect(() => {
    if (!containerRef.current || !hass) return;

    if (!pageRef.current) {
      pageRef.current = new ScenesPage();
    }

    const page = pageRef.current;
    page.hass = hass;
    page.setConfig({
      customizations: customizationManager?.getCustomizations?.() || {},
    });

    containerRef.current.innerHTML = '';
    page.render(containerRef.current, hass, () => {});
  }, [hass, customizationManager]);

  return (
    <motion.div variants={sectionVariants}>
      <div ref={containerRef} />
    </motion.div>
  );
}
