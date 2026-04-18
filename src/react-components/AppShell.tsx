import React, { useCallback } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useHassRef, useConfig, useCustomizationManager } from '../contexts/HassContext';
import { AppleHeaderReact } from './sections/AppleHeaderReact';
import { AppleChipsReact } from './sections/AppleChipsReact';
import { HomePageReact } from './pages/HomePageReact';
import { GroupPageReact } from './pages/GroupPageReact';
import { RoomPageReact } from './pages/RoomPageReact';
import { ScenesPageReact } from './pages/ScenesPageReact';
import { CamerasPageReact } from './pages/CamerasPageReact';
import { RTLHelper } from '../utils/RTLHelper';
import { DeviceGroup } from '../config/DashboardConfig';
import { pageVariants } from './animations';

export function AppShell() {
  const hassRef = useHassRef();
  const config = useConfig();
  const isRTL = RTLHelper.isRTL();

  const pageType = config.pageType || 'home';
  const pageKey = `${pageType}-${config.areaId || config.deviceGroup || 'default'}`;

  const isGroupPage = pageType === 'group';
  const isSpecialPage = ['room', 'scenes', 'cameras'].includes(pageType);
  const showChips = !isSpecialPage;

  const renderPage = useCallback(() => {
    switch (pageType) {
      case 'group':
        return (
          <GroupPageReact
            key={pageKey}
            deviceGroup={config.deviceGroup as DeviceGroup}
          />
        );
      case 'room':
        return (
          <RoomPageReact
            key={pageKey}
            areaId={config.areaId!}
            areaName={config.areaName!}
          />
        );
      case 'scenes':
        return <ScenesPageReact key={pageKey} />;
      case 'cameras':
        return <CamerasPageReact key={pageKey} />;
      default:
        return (
          <HomePageReact
            key={pageKey}
            title={config.title || hassRef.current?.config?.location_name || 'My Home'}
          />
        );
    }
  }, [pageType, pageKey, config]);

  return (
    <div className={`wrapper-content ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className={`page-content${isGroupPage ? ' has-fixed-header' : ''}`}>
        <AppleHeaderReact
          title={config.title || ''}
          isGroupPage={isGroupPage}
          isSpecialPage={isSpecialPage}
          showBackButton={isSpecialPage || isGroupPage}
        />
        {showChips && (
          <div className="permanent-chips">
            <AppleChipsReact
              activeGroup={isGroupPage ? config.deviceGroup as DeviceGroup : undefined}
            />
          </div>
        )}
        <LayoutGroup>
          <AnimatePresence mode="wait">
            <motion.div
              key={pageKey}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </div>
  );
}
