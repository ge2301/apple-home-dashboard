import React, { useEffect, useRef, useCallback } from 'react';
import { useHassRef, useHassVersion, useConfig, useCustomizationManager, useEditMode } from '../../contexts/HassContext';
import { AppleHeader, HeaderConfig } from '../../sections/AppleHeader';
import { EditModeManager } from '../../utils/EditModeManager';
import { localize } from '../../utils/LocalizationService';

interface AppleHeaderReactProps {
  title: string;
  isGroupPage: boolean;
  isSpecialPage: boolean;
  showBackButton?: boolean;
}

export function AppleHeaderReact({ title, isGroupPage, isSpecialPage, showBackButton }: AppleHeaderReactProps) {
  const hassRef = useHassRef();
  const hassVersion = useHassVersion();
  const config = useConfig();
  const customizationManager = useCustomizationManager();
  const { setEditMode } = useEditMode();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<AppleHeader | null>(null);
  const editManagerRef = useRef<EditModeManager | null>(null);
  const setEditModeRef = useRef(setEditMode);
  setEditModeRef.current = setEditMode;
  const initedKeyRef = useRef<string>('');

  const stableSetEditMode = useCallback((mode: boolean) => {
    setEditModeRef.current(mode);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!headerRef.current) {
      headerRef.current = new AppleHeader(true);
      editManagerRef.current = new EditModeManager(stableSetEditMode);
      headerRef.current.setEditModeManager(editManagerRef.current);
      headerRef.current.setCustomizationManager(customizationManager);
    }

    const headerConfig: HeaderConfig = {
      title: title || localize('pages.my_home'),
      isGroupPage,
      isSpecialPage,
      showMenu: !isGroupPage,
      showBackButton,
    };

    const initKey = `${title}|${isGroupPage}|${isSpecialPage}|${showBackButton}`;
    if (initKey !== initedKeyRef.current) {
      initedKeyRef.current = initKey;
      headerRef.current.setHass(hassRef.current);
      headerRef.current.init(containerRef.current, headerConfig);
      headerRef.current.updatePageContentPadding();

      setTimeout(() => {
        const root = containerRef.current?.getRootNode() as ShadowRoot | Document;
        const btn = root?.querySelector?.('.apple-header-sidebar-button, .apple-header-back-button') as HTMLElement;
        if (btn) {
          const cs = getComputedStyle(btn);
          const parent = btn.parentElement;
          const header = parent?.parentElement;
          console.log('[BTN-DEBUG]', {
            left: cs.left, right: cs.right, position: cs.position,
            parentClass: parent?.className,
            parentPaddingLeft: parent ? getComputedStyle(parent).paddingLeft : 'n/a',
            parentPosition: parent ? getComputedStyle(parent).position : 'n/a',
            headerClass: header?.className,
            headerMarginLeft: header ? getComputedStyle(header).marginLeft : 'n/a',
            headerWidth: header ? getComputedStyle(header).width : 'n/a',
            isGroupPage,
            styleSheetCount: (root as ShadowRoot).styleSheets?.length,
          });
        } else {
          console.log('[BTN-DEBUG] no button found');
        }
      }, 500);
    }
  }, [title, isGroupPage, isSpecialPage, showBackButton, customizationManager, stableSetEditMode]);

  useEffect(() => {
    if (headerRef.current && hassRef.current) {
      headerRef.current.setHass(hassRef.current);
    }
  }, [hassVersion]);

  useEffect(() => {
    if (headerRef.current && title) {
      const titleToUse = config.pageType === 'room' ? (config.areaName || title) : title;
      headerRef.current.setTitle(titleToUse);
    }
  }, [title, config.pageType, config.areaName]);

  return <div ref={containerRef} className="apple-home-header permanent-header" />;
}
