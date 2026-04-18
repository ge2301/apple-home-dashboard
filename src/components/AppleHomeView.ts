import React from 'react';
import { ReactBridge } from '../bridge/ReactBridge';
import { HassProvider, ViewConfig, useBumpHass } from '../contexts/HassContext';
import { AppShell } from '../react-components/AppShell';
import { viewStyles } from '../react-components/ViewStyles';
import { CustomizationManager } from '../utils/CustomizationManager';
import { setupLocalize, localize } from '../utils/LocalizationService';
import { RTLHelper } from '../utils/RTLHelper';
import { RegistrySubscriptionManager, RegistryChangeCallback, RegistryChangeEvent } from '../utils/RegistrySubscriptionManager';
import { DashboardStateManager } from '../utils/DashboardStateManager';

export class AppleHomeView extends HTMLElement {
  private static dashboardActiveInstances = new Map<string, AppleHomeView>();

  private config?: any;
  private _hass?: any;
  private _config?: any;
  private _rendered = false;
  private currentDashboardKey: string = 'default';
  private _editMode = false;

  private reactBridge?: ReactBridge;
  private customizationManager: CustomizationManager;
  private _viewConfig?: ViewConfig;
  private _setEditMode: (mode: boolean) => void;
  private _bumpHass?: (hass: any) => void;
  private _hassUpdateTimer?: ReturnType<typeof setTimeout>;

  private registrySubscriptionManager?: RegistrySubscriptionManager;
  private registryChangeHandler?: RegistryChangeCallback;
  private rtlChangeHandler?: (isRTL: boolean, language: string) => void;
  private _lastLanguage?: string;
  private visibilityChangeHandler?: () => void;
  private globalRefreshHandler?: (event: Event) => void;

  private getDashboardKey(): string {
    const currentPath = window.location.pathname;
    const dashboardMatch = currentPath.match(/\/([^\/]+)/);
    return dashboardMatch && dashboardMatch[1] ? dashboardMatch[1] : 'default';
  }

  private getCurrentActiveInstance(): AppleHomeView | undefined {
    return AppleHomeView.dashboardActiveInstances.get(this.currentDashboardKey);
  }

  private setCurrentActiveInstance(instance: AppleHomeView | undefined): void {
    if (instance) {
      AppleHomeView.dashboardActiveInstances.set(this.currentDashboardKey, instance);
    } else {
      AppleHomeView.dashboardActiveInstances.delete(this.currentDashboardKey);
    }
  }

  constructor() {
    super();
    this.currentDashboardKey = this.getDashboardKey();
    this.customizationManager = CustomizationManager.getInstance();
    this._setEditMode = (mode: boolean) => {
      this._editMode = mode;
      this.classList.toggle('edit-mode', mode);
      this.renderReact();
    };
  }

  connectedCallback() {
    this.visibilityChangeHandler = () => {
      if (!document.hidden && this._hass) {
        this.pushHassUpdate();
      }
    };
    document.addEventListener('visibilitychange', this.visibilityChangeHandler);

    this.globalRefreshHandler = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (this._hass && customEvent.detail?.customizations) {
        this.handleGlobalRefresh(customEvent.detail.customizations);
      }
    };
    document.addEventListener('apple-home-dashboard-refresh', this.globalRefreshHandler);

    this.setupRegistrySubscriptions();
    this.setupRTLChangeDetection();
    this.setCurrentActiveInstance(this);
  }

  disconnectedCallback() {
    if (this.visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
    }
    if (this.globalRefreshHandler) {
      document.removeEventListener('apple-home-dashboard-refresh', this.globalRefreshHandler);
    }

    this.cleanupRegistrySubscriptions();
    this.cleanupRTLChangeDetection();

    if (this.getCurrentActiveInstance() === this) {
      this.setCurrentActiveInstance(undefined);
    }

    if (this._hassUpdateTimer) {
      clearTimeout(this._hassUpdateTimer);
      this._hassUpdateTimer = undefined;
    }

    if (this.reactBridge) {
      this.reactBridge.unmount();
      this.reactBridge = undefined;
    }
  }

  async setConfig(config: any) {
    if (this._config && JSON.stringify(this._config) === JSON.stringify(config)) {
      return;
    }

    this._rendered = false;
    this.config = config;

    if (this._hass) {
      await this.loadAndApplyCustomizations();
    } else {
      await this.customizationManager.setCustomizations(config.customizations || {
        home: { sections: { order: [], hidden: [] }, favorites: [], excluded_from_dashboard: [], excluded_from_home: [] },
        pages: {},
        ui: {},
        background: {},
      });
    }

    this._config = config;
    this.renderReact();
  }

  set hass(hass: any) {
    const oldHass = this._hass;
    this._hass = hass;

    setupLocalize(hass);
    this.customizationManager.setHass(hass);

    if (this.registrySubscriptionManager) {
      this.registrySubscriptionManager.setHass(hass);
    }

    const currentLanguage = hass?.locale?.language || hass?.language;
    if (this._lastLanguage && currentLanguage && this._lastLanguage !== currentLanguage) {
      RTLHelper.checkForChanges(hass);
    }
    this._lastLanguage = currentLanguage;

    if (!oldHass) {
      this.loadAndApplyCustomizations();
      this.ensureShadowRoot();
      this.renderReact();
      return;
    }

    this.ensureShadowRoot();
    this.scheduleHassUpdate();
  }

  /**
   * Debounce hass-only updates: update ref + bump version inside React
   * without calling root.render() again.
   */
  private scheduleHassUpdate() {
    if (this._hassUpdateTimer) return;
    this._hassUpdateTimer = setTimeout(() => {
      this._hassUpdateTimer = undefined;
      this.pushHassUpdate();
    }, 100);
  }

  private pushHassUpdate() {
    if (this._bumpHass && this._hass) {
      this._bumpHass(this._hass);
    }
  }

  getCardSize() {
    return 1;
  }

  // --- React rendering ---

  private ensureShadowRoot() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }

    if (!this.reactBridge) {
      const style = document.createElement('style');
      style.textContent = viewStyles;
      this.shadowRoot!.appendChild(style);

      this.reactBridge = new ReactBridge(this.shadowRoot!);
    }
  }

  private buildViewConfig(): ViewConfig {
    return {
      title: this.config!.title,
      pageType: this.config!.pageType,
      deviceGroup: this.config!.deviceGroup,
      areaId: this.config!.areaId,
      areaName: this.config!.areaName,
      customizations: this.config!.customizations,
      activeGroup: this.config!.activeGroup,
    };
  }

  private viewConfigChanged(a: ViewConfig | undefined, b: ViewConfig): boolean {
    if (!a) return true;
    return a.title !== b.title || a.pageType !== b.pageType ||
      a.deviceGroup !== b.deviceGroup || a.areaId !== b.areaId ||
      a.areaName !== b.areaName || a.activeGroup !== b.activeGroup ||
      a.customizations !== b.customizations;
  }

  /**
   * Full React tree mount / structural update.
   * Only call this for config changes, editMode changes, or initial mount.
   * hass-only updates go through pushHassUpdate() → bumpHass().
   */
  private renderReact() {
    if (!this._hass || !this.config) return;

    this.ensureShadowRoot();

    const nextConfig = this.buildViewConfig();
    if (this.viewConfigChanged(this._viewConfig, nextConfig)) {
      this._viewConfig = nextConfig;
    }

    const self = this;
    this.reactBridge!.render(
      React.createElement(
        HassProvider,
        {
          initialHass: this._hass,
          config: this._viewConfig!,
          customizationManager: this.customizationManager,
          editMode: this._editMode,
          setEditMode: this._setEditMode,
          children: React.createElement(BumpHassCapture, {
            onCapture: (bump: (hass: any) => void) => { self._bumpHass = bump; },
            children: React.createElement(AppShell),
          }),
        }
      )
    );

    this._rendered = true;
  }

  // --- Customization & registry management (preserved from original) ---

  private _lastCustomizationsJSON?: string;

  private async loadAndApplyCustomizations() {
    if (!this._hass) return;
    try {
      const customizations = await this.customizationManager.loadCustomizations();
      const json = JSON.stringify(customizations);
      if (json === this._lastCustomizationsJSON) return;
      this._lastCustomizationsJSON = json;

      await this.customizationManager.setCustomizations(customizations);
      if (this.config) {
        this.config = { ...this.config, customizations };
      }
      this.renderReact();
    } catch (error) {
      console.error('Error loading customizations:', error);
    }
  }

  private async handleGlobalRefresh(customizations: any) {
    try {
      const json = JSON.stringify(customizations);
      if (json === this._lastCustomizationsJSON) return;
      this._lastCustomizationsJSON = json;

      await this.customizationManager.setCustomizations(customizations);
      this.config = { ...this.config, customizations };
      this.renderReact();
    } catch (error) {
      console.error('Error during global refresh:', error);
    }
  }

  private setupRegistrySubscriptions(): void {
    this.registrySubscriptionManager = RegistrySubscriptionManager.getInstance();
    this.registryChangeHandler = (event) => {
      if (this._editMode) return;
      if (this._bumpHass && this._hass) {
        this._bumpHass(this._hass);
      }
    };
    this.registrySubscriptionManager.addListener(this.registryChangeHandler);
    if (this._hass) {
      this.registrySubscriptionManager.setHass(this._hass);
    }
  }

  private cleanupRegistrySubscriptions(): void {
    if (this.registryChangeHandler && this.registrySubscriptionManager) {
      this.registrySubscriptionManager.removeListener(this.registryChangeHandler);
    }
    this.registryChangeHandler = undefined;
  }

  private setupRTLChangeDetection(): void {
    this.rtlChangeHandler = (_isRTL: boolean, _language: string) => {
      this.renderReact();
    };
    RTLHelper.addListener(this.rtlChangeHandler);
  }

  private cleanupRTLChangeDetection(): void {
    if (this.rtlChangeHandler) {
      RTLHelper.removeListener(this.rtlChangeHandler);
    }
    this.rtlChangeHandler = undefined;
  }
}

function BumpHassCapture({ onCapture, children }: { onCapture: (bump: (hass: any) => void) => void; children: React.ReactNode }) {
  const bump = useBumpHass();
  const captured = React.useRef(false);
  if (!captured.current) {
    captured.current = true;
    onCapture(bump);
  }
  return React.createElement(React.Fragment, null, children);
}
