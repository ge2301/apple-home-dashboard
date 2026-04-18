import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useHassRef, useHassVersion, useCustomizationManager } from '../../contexts/HassContext';
import { GroupPage } from '../../pages/GroupPage';
import { DeviceGroup } from '../../config/DashboardConfig';
import { sectionVariants } from '../animations';

interface GroupPageReactProps {
  deviceGroup: DeviceGroup;
}

export function GroupPageReact({ deviceGroup }: GroupPageReactProps) {
  const hassRef = useHassRef();
  const hassVersion = useHassVersion();
  const customizationManager = useCustomizationManager();
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<GroupPage | null>(null);
  const renderedKeyRef = useRef<string>('');

  useEffect(() => {
    if (!containerRef.current || !hassRef.current) return;
    const hass = hassRef.current;

    const renderKey = `${deviceGroup}`;
    if (renderKey === renderedKeyRef.current && containerRef.current.childElementCount > 0) {
      return;
    }
    renderedKeyRef.current = renderKey;

    if (!pageRef.current) {
      pageRef.current = new GroupPage();
    }

    const page = pageRef.current;
    page.hass = hass;
    page.setConfig({
      group: deviceGroup,
      customizations: customizationManager?.getCustomizations?.() || {},
    });

    containerRef.current.innerHTML = '';
    page.render(containerRef.current, deviceGroup, hass, () => {});
  }, [deviceGroup, customizationManager]);

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
