import React, { createContext, useContext } from 'react';

export interface ViewConfig {
  title?: string;
  pageType?: string;
  deviceGroup?: string;
  areaId?: string;
  areaName?: string;
  customizations?: any;
  activeGroup?: string;
}

interface HassContextValue {
  hass: any;
  config: ViewConfig;
  customizationManager: any;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
}

export const HassContext = createContext<HassContextValue>({
  hass: null,
  config: {},
  customizationManager: null,
  editMode: false,
  setEditMode: () => {},
});

export function useHass() {
  const ctx = useContext(HassContext);
  if (!ctx.hass) {
    throw new Error('useHass must be used within a HassContext provider with a valid hass object');
  }
  return ctx.hass;
}

export function useConfig() {
  return useContext(HassContext).config;
}

export function useCustomizationManager() {
  return useContext(HassContext).customizationManager;
}

export function useEditMode() {
  const { editMode, setEditMode } = useContext(HassContext);
  return { editMode, setEditMode };
}

interface HassProviderProps {
  hass: any;
  config: ViewConfig;
  customizationManager: any;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  children: React.ReactNode;
}

export function HassProvider({
  hass,
  config,
  customizationManager,
  editMode,
  setEditMode,
  children,
}: HassProviderProps) {
  const value = React.useMemo(
    () => ({ hass, config, customizationManager, editMode, setEditMode }),
    [hass, config, customizationManager, editMode, setEditMode]
  );
  return React.createElement(HassContext.Provider, { value }, children);
}
