import { useMemo } from 'react';
import { useHass } from '../contexts/HassContext';
import { DataService } from '../utils/DataService';
import { DashboardConfig, DeviceGroup } from '../config/DashboardConfig';

export function useEntityState(entityId: string) {
  const hass = useHass();
  return hass.states?.[entityId] ?? null;
}

export function useEntityAreaId(entityId: string): string {
  const hass = useHass();
  const entityReg = hass.entities?.[entityId];
  if (entityReg?.area_id) return entityReg.area_id;
  if (entityReg?.device_id) {
    const device = hass.devices?.[entityReg.device_id];
    if (device?.area_id) return device.area_id;
  }
  return 'no_area';
}

export function useFilteredEntities(opts?: { excludeHidden?: boolean }) {
  const hass = useHass();
  const excludeHidden = opts?.excludeHidden ?? true;

  return useMemo(() => {
    if (!hass?.states) return [];
    const entityIds = Object.keys(hass.states);
    if (!excludeHidden) return entityIds;

    return entityIds.filter((id) => {
      const reg = hass.entities?.[id];
      return !reg?.hidden_by && !reg?.disabled_by && !reg?.entity_category;
    });
  }, [hass?.states, hass?.entities, excludeHidden]);
}

export function useGroupedEntities() {
  const hass = useHass();

  return useMemo(() => {
    const groups: Record<string, string[]> = {};
    if (!hass?.states) return groups;

    for (const entityId of Object.keys(hass.states)) {
      const reg = hass.entities?.[entityId];
      if (reg?.hidden_by || reg?.disabled_by || reg?.entity_category) continue;

      const domain = entityId.split('.')[0];
      const state = hass.states[entityId];
      const group = DashboardConfig.getDeviceGroup(domain, entityId, state?.attributes) || DeviceGroup.OTHER;
      if (!groups[group]) groups[group] = [];
      groups[group].push(entityId);
    }

    return groups;
  }, [hass?.states, hass?.entities]);
}
