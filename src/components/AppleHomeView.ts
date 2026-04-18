import React from 'react';
import { ReactBridge } from '../bridge/ReactBridge';
import { HassProvider, ViewConfig } from '../contexts/HassContext';
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
  }

  connectedCallback() {
    this.visibilityChangeHandler = () => {
      // Re-render when visibility changes (cameras resume etc.)
      if (!document.hidden) this.renderReact();
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

    if (this.reactBridge) {
      this.reactBridge.unmount();
      this.reactBridge = undefined;
    }
  }

  async setConfig(config: any) {
    const oldConfig = this._config;
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

    const isFirstHassSet = !oldHass;
    if (isFirstHassSet) {
      this.loadAndApplyCustomizations();
    }

    this.ensureShadowRoot();
    this.renderReact();
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

  private renderReact() {
    if (!this._hass || !this.config) return;

    this.ensureShadowRoot();

    const viewConfig: ViewConfig = {
      title: this.config.title,
      pageType: this.config.pageType,
      deviceGroup: this.config.deviceGroup,
      areaId: this.config.areaId,
      areaName: this.config.areaName,
      customizations: this.config.customizations,
      activeGroup: this.config.activeGroup,
    };

    const setEditMode = (mode: boolean) => {
      this._editMode = mode;
      this.classList.toggle('edit-mode', mode);
      this.renderReact();
    };

    this.reactBridge!.render(
      React.createElement(
        HassProvider,
        {
          hass: this._hass,
          config: viewConfig,
          customizationManager: this.customizationManager,
          editMode: this._editMode,
          setEditMode,
          children: React.createElement(AppShell),
        }
      )
    );

    this._rendered = true;
  }

  // --- Customization & registry management (preserved from original) ---

  private async loadAndApplyCustomizations() {
    if (!this._hass) return;
    try {
      const customizations = await this.customizationManager.loadCustomizations();
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
      this.renderReact();
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
