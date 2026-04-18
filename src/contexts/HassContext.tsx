import React, { createContext, useContext, useRef, useMemo, useState, useCallback } from 'react';

export interface ViewConfig {
  title?: string;
  pageType?: string;
  deviceGroup?: string;
  areaId?: string;
  areaName?: string;
  customizations?: any;
  activeGroup?: string;
}

interface HassOnlyContextValue {
  hassRef: React.MutableRefObject<any>;
  hassVersion: number;
  bumpHass: (hass: any) => void;
}

interface AppContextValue {
  config: ViewConfig;
  customizationManager: any;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
}

const HassOnlyContext = createContext<HassOnlyContextValue>({
  hassRef: { current: null },
  hassVersion: 0,
  bumpHass: () => {},
});

const AppContext = createContext<AppContextValue>({
  config: {},
  customizationManager: null,
  editMode: false,
  setEditMode: () => {},
});

export function useHass(): any {
  return useContext(HassOnlyContext).hassRef.current;
}

export function useHassRef(): React.MutableRefObject<any> {
  return useContext(HassOnlyContext).hassRef;
}

export function useHassVersion(): number {
  return useContext(HassOnlyContext).hassVersion;
}

/** Imperatively push a new hass object without calling root.render() again. */
export function useBumpHass(): (hass: any) => void {
  return useContext(HassOnlyContext).bumpHass;
}

export function useConfig() {
  return useContext(AppContext).config;
}

export function useCustomizationManager() {
  return useContext(AppContext).customizationManager;
}

export function useEditMode() {
  const { editMode, setEditMode } = useContext(AppContext);
  return { editMode, setEditMode };
}

interface HassProviderProps {
  initialHass: any;
  config: ViewConfig;
  customizationManager: any;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  children: React.ReactNode;
}

export function HassProvider({
  initialHass,
  config,
  customizationManager,
  editMode,
  setEditMode,
  children,
}: HassProviderProps) {
  const hassRef = useRef<any>(initialHass);
  const [hassVersion, setHassVersion] = useState(0);

  const bumpHass = useCallback((hass: any) => {
    hassRef.current = hass;
    setHassVersion(v => v + 1);
  }, []);

  const hassValue = useMemo(
    () => ({ hassRef, hassVersion, bumpHass }),
    [hassVersion, bumpHass]
  );

  const appValue = useMemo(
    () => ({ config, customizationManager, editMode, setEditMode }),
    [config, customizationManager, editMode, setEditMode]
  );

  return React.createElement(
    HassOnlyContext.Provider,
    { value: hassValue },
    React.createElement(
      AppContext.Provider,
      { value: appValue },
      children
    )
  );
}

export { HassOnlyContext, AppContext };
