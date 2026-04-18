import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useHassRef, useHassVersion, useCustomizationManager, useEditMode } from '../../contexts/HassContext';
import { RoomPage } from '../../pages/RoomPage';
import { DragAndDropManager } from '../../utils/DragAndDropManager';
import { sectionVariants } from '../animations';

interface RoomPageReactProps {
  areaId: string;
  areaName: string;
}

export function RoomPageReact({ areaId, areaName }: RoomPageReactProps) {
  const hassRef = useHassRef();
  const hassVersion = useHassVersion();
  const customizationManager = useCustomizationManager();
  const { editMode } = useEditMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<RoomPage | null>(null);
  const dndRef = useRef<DragAndDropManager | null>(null);
  const renderedKeyRef = useRef<string>('');

  useEffect(() => {
    if (!containerRef.current || !hassRef.current) return;
    const hass = hassRef.current;

    const renderKey = `${areaId}|${areaName}`;
    if (renderKey === renderedKeyRef.current && containerRef.current.childElementCount > 0) {
      return;
    }
    renderedKeyRef.current = renderKey;

    if (!pageRef.current) {
      pageRef.current = new RoomPage();
    }
    if (!dndRef.current) {
      dndRef.current = new DragAndDropManager(
        () => customizationManager?.saveLayoutToStorage?.(hassRef.current),
        customizationManager,
        'room'
      );
    }

    const page = pageRef.current;
    page.hass = hass;
    page.setConfig({
      areaId,
      customizations: customizationManager?.getCustomizations?.() || {},
    });

    containerRef.current.innerHTML = '';
    page.render(containerRef.current, areaId, areaName, hass, () => {});
  }, [areaId, areaName, customizationManager]);

  useEffect(() => {
    if (!containerRef.current || !hassRef.current) return;
    const hass = hassRef.current;
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
