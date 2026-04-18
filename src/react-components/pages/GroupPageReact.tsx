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
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || !hassRef.current) return;
    const hass = hassRef.current;

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
    mountedRef.current = true;
  }, [deviceGroup, customizationManager]);

  useEffect(() => {
    if (!mountedRef.current || !containerRef.current || !hassRef.current) return;
    const hass = hassRef.current;
    if (pageRef.current) {
      pageRef.current.hass = hass;
    }
    const cards = containerRef.current.querySelectorAll('apple-home-card');
    cards.forEach((card: any) => { card.hass = hass; });
  }, [hassVersion]);

  return (
    <motion.div variants={sectionVariants}>
      <div ref={containerRef} />
    </motion.div>
  );
}
