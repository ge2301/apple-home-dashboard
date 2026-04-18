import React, { useEffect, useRef } from 'react';
import { useHass, useCustomizationManager, useConfig } from '../../contexts/HassContext';
import { AppleChips } from '../../sections/AppleChips';
import { ChipsConfigurationManager } from '../../utils/ChipsConfigurationManager';
import { DeviceGroup } from '../../config/DashboardConfig';

interface AppleChipsReactProps {
  activeGroup?: DeviceGroup;
}

/**
 * Bridge component: mounts the existing imperative AppleChips into a React ref.
 * Full React rewrite will follow in a later phase.
 */
export function AppleChipsReact({ activeGroup }: AppleChipsReactProps) {
  const hass = useHass();
  const customizationManager = useCustomizationManager();
  const config = useConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<AppleChips | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!chipsRef.current) {
      chipsRef.current = new AppleChips(containerRef.current, customizationManager);
    }

    const chipsSettings = ChipsConfigurationManager.getSettingsFromConfig(config);
    chipsRef.current.setConfig(chipsSettings.chips_config);
    chipsRef.current.hass = hass;
  }, [hass, customizationManager, config]);

  useEffect(() => {
    if (chipsRef.current) {
      chipsRef.current.setActiveGroup(activeGroup);
    }
  }, [activeGroup]);

  return <div ref={containerRef} />;
}
