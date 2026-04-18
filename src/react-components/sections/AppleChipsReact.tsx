import React, { useEffect, useRef } from 'react';
import { useHassRef, useHassVersion, useCustomizationManager, useConfig } from '../../contexts/HassContext';
import { AppleChips } from '../../sections/AppleChips';
import { ChipsConfigurationManager } from '../../utils/ChipsConfigurationManager';
import { DeviceGroup } from '../../config/DashboardConfig';

interface AppleChipsReactProps {
  activeGroup?: DeviceGroup;
}

export function AppleChipsReact({ activeGroup }: AppleChipsReactProps) {
  const hassRef = useHassRef();
  const hassVersion = useHassVersion();
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
  }, [customizationManager, config]);

  useEffect(() => {
    if (chipsRef.current && hassRef.current) {
      chipsRef.current.hass = hassRef.current;
    }
  }, [hassVersion]);

  useEffect(() => {
    if (chipsRef.current) {
      chipsRef.current.setActiveGroup(activeGroup);
    }
  }, [activeGroup]);

  return <div ref={containerRef} />;
}
