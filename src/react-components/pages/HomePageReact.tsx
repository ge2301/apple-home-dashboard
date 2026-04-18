import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useHassRef, useHassVersion, useCustomizationManager, useEditMode } from '../../contexts/HassContext';
import { HomePage } from '../../pages/HomePage';
import { DragAndDropManager } from '../../utils/DragAndDropManager';
import { sectionVariants } from '../animations';

interface HomePageReactProps {
  title: string;
}

export function HomePageReact({ title }: HomePageReactProps) {
  const hassRef = useHassRef();
  const hassVersion = useHassVersion();
  const customizationManager = useCustomizationManager();
  const { editMode } = useEditMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HomePage | null>(null);
  const dndRef = useRef<DragAndDropManager | null>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    console.log('[HomePageReact] mount effect, container:', !!containerRef.current, 'hass:', !!hassRef.current, 'title:', title);
    if (!containerRef.current || !hassRef.current) return;
    const hass = hassRef.current;

    if (!pageRef.current) {
      pageRef.current = new HomePage();
    }
    if (!dndRef.current) {
      dndRef.current = new DragAndDropManager(
        (_areaId: string) => { customizationManager?.saveLayoutToStorage?.(hassRef.current); },
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
    mountedRef.current = true;
  }, [title, customizationManager]);

  useEffect(() => {
    if (!mountedRef.current || !containerRef.current || !hassRef.current) return;
    const hass = hassRef.current;
    if (pageRef.current) {
      pageRef.current.hass = hass;
    }
    const cards = containerRef.current.querySelectorAll('apple-home-card');
    cards.forEach((card: any) => { card.hass = hass; });
  }, [hassVersion]);

  useEffect(() => {
    if (!containerRef.current || !dndRef.current) return;
    if (editMode) {
      setTimeout(() => {
        dndRef.current!.enableDragAndDrop(containerRef.current!);
        containerRef.current!.querySelectorAll('.entity-card-wrapper')
          .forEach((w) => (w as HTMLElement).classList.add('edit-mode'));
      }, 100);
    } else {
      dndRef.current.disableDragAndDrop(containerRef.current);
      containerRef.current.querySelectorAll('.entity-card-wrapper')
        .forEach((w) => (w as HTMLElement).classList.remove('edit-mode'));
    }
  }, [editMode]);

  return (
    <motion.div variants={sectionVariants}>
      <div ref={containerRef} />
    </motion.div>
  );
}
