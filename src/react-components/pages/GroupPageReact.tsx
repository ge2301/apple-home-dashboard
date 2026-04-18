import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useHass, useCustomizationManager } from '../../contexts/HassContext';
import { GroupPage } from '../../pages/GroupPage';
import { DeviceGroup } from '../../config/DashboardConfig';
import { sectionVariants } from '../animations';

interface GroupPageReactProps {
  deviceGroup: DeviceGroup;
}

export function GroupPageReact({ deviceGroup }: GroupPageReactProps) {
  const hass = useHass();
  const customizationManager = useCustomizationManager();
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<GroupPage | null>(null);

  useEffect(() => {
    if (!containerRef.current || !hass) return;

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
  }, [hass, deviceGroup, customizationManager]);

  return (
    <motion.div variants={sectionVariants}>
      <div ref={containerRef} />
    </motion.div>
  );
}
