import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useHass, useCustomizationManager, useEditMode } from '../../contexts/HassContext';
import { HomePage } from '../../pages/HomePage';
import { DragAndDropManager } from '../../utils/DragAndDropManager';
import { sectionVariants } from '../animations';

interface HomePageReactProps {
  title: string;
}

export function HomePageReact({ title }: HomePageReactProps) {
  const hass = useHass();
  const customizationManager = useCustomizationManager();
  const { editMode } = useEditMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HomePage | null>(null);
  const dndRef = useRef<DragAndDropManager | null>(null);

  useEffect(() => {
    if (!containerRef.current || !hass) return;

    if (!pageRef.current) {
      pageRef.current = new HomePage();
    }

    if (!dndRef.current) {
      dndRef.current = new DragAndDropManager(
        (_areaId: string) => {
          customizationManager?.saveLayoutToStorage?.(hass);
        },
        customizationManager,
        'home'
      );
    }

    const page = pageRef.current;
    page.hass = hass;
    page.setConfig({
      title,
      customizations: customizationManager?.getCustomizations?.() || {},
    });

    containerRef.current.innerHTML = '';
    page.render(containerRef.current, hass, title, () => {});
  }, [hass, title, customizationManager]);

  useEffect(() => {
    if (!containerRef.current || !dndRef.current) return;

    if (editMode) {
      setTimeout(() => {
        dndRef.current!.enableDragAndDrop(containerRef.current!);
        const wrappers = containerRef.current!.querySelectorAll('.entity-card-wrapper');
        wrappers.forEach((w) => (w as HTMLElement).classList.add('edit-mode'));
      }, 100);
    } else {
      dndRef.current.disableDragAndDrop(containerRef.current);
      const wrappers = containerRef.current.querySelectorAll('.entity-card-wrapper');
      wrappers.forEach((w) => (w as HTMLElement).classList.remove('edit-mode'));
    }
  }, [editMode]);

  return (
    <motion.div variants={sectionVariants}>
      <h1 className="apple-page-title">{title}</h1>
      <div ref={containerRef} />
    </motion.div>
  );
}
