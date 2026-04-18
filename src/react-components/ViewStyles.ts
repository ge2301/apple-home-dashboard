/**
 * All CSS styles for the apple-home-view shadow DOM.
 * Extracted from the original AppleHomeView.ts so they can be
 * injected into the shadow root alongside the React tree.
 */
export const viewStyles = `
:host {
  display: block;
  padding: 0 var(--apple-page-padding, 22px) var(--apple-page-padding-bottom, 22px) var(--apple-page-padding, 22px);
  box-sizing: border-box;
  width: 100%;
  background: transparent;
  position: relative;
  container-type: inline-size;
  container-name: apple-home-view;
  --card-gap: var(--apple-card-gap, 10px);
  --section-margin: var(--apple-section-gap, 20px);
  overflow-x: clip;
}

@media (prefers-reduced-motion: reduce) {
  :host * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

.wrapper-content {
  width: 100%;
  max-width: none;
}

.permanent-chips {
  display: block;
  width: 100%;
  position: relative;
}

.page-content.has-fixed-header .permanent-chips {
  margin-top: 8px;
}

/* Align overlay buttons flush with the content grid.
   Home header: sticky with margin-left:-22px (edge-to-edge via CSS).
     Buttons need page-padding + extra to align with cards.
   Group header: position:fixed, left set by JS to panel edge.
     Buttons only need page-padding since header already starts at panel edge.
   Mobile: slightly smaller inset to avoid clipping. */
.apple-home-header .apple-header-sidebar-button,
.apple-home-header .apple-header-back-button {
  left: calc(var(--apple-page-padding, 22px) + 25px) !important;
}
.apple-home-header .apple-header-menu-button {
  right: calc(var(--apple-page-padding, 22px) + 25px) !important;
}
.apple-home-header.group-page .apple-header-sidebar-button,
.apple-home-header.group-page .apple-header-back-button {
  left: var(--apple-page-padding, 22px) !important;
}
.apple-home-header.group-page .apple-header-menu-button {
  right: var(--apple-page-padding, 22px) !important;
}
.apple-home-header.rtl .apple-header-sidebar-button,
.apple-home-header.rtl .apple-header-back-button {
  left: auto !important;
  right: calc(var(--apple-page-padding, 22px) + 25px) !important;
}
.apple-home-header.rtl .apple-header-menu-button {
  right: auto !important;
  left: calc(var(--apple-page-padding, 22px) + 25px) !important;
}
.apple-home-header.group-page.rtl .apple-header-sidebar-button,
.apple-home-header.group-page.rtl .apple-header-back-button {
  left: auto !important;
  right: var(--apple-page-padding, 22px) !important;
}
.apple-home-header.group-page.rtl .apple-header-menu-button {
  right: auto !important;
  left: var(--apple-page-padding, 22px) !important;
}
@media (max-width: 768px) {
  .apple-home-header .apple-header-sidebar-button,
  .apple-home-header .apple-header-back-button {
    left: calc(var(--apple-page-padding, 22px) + 6px) !important;
  }
  .apple-home-header .apple-header-menu-button {
    right: calc(var(--apple-page-padding, 22px) + 6px) !important;
  }
  .apple-home-header.rtl .apple-header-sidebar-button,
  .apple-home-header.rtl .apple-header-back-button {
    left: auto !important;
    right: calc(var(--apple-page-padding, 22px) + 6px) !important;
  }
  .apple-home-header.rtl .apple-header-menu-button {
    right: auto !important;
    left: calc(var(--apple-page-padding, 22px) + 6px) !important;
  }
}

.apple-page-title {
  font-size: var(--apple-title-size, 28px);
  font-weight: 700;
  color: #ffffff;
  margin: 10px 0 15px 0;
  letter-spacing: -0.5px;
  line-height: 1.2;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
  display: block;
  visibility: visible;
}

.area-section {
  margin-bottom: var(--section-margin);
}

.area-title {
  font-weight: 600;
  font-size: var(--apple-section-title-size, 17px);
  color: #fff;
  margin: 20px 0 6px;
  padding: 0;
  letter-spacing: 0.2px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.apple-home-section-title {
  font-size: var(--apple-section-title-size, 17px);
  font-weight: 600;
  color: #fff;
  margin: 20px 0 6px;
  padding: 0;
  letter-spacing: 0.2px;
}

.clickable-section-title {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  transition: opacity 0.2s ease;
  user-select: none;
  font-size: inherit;
  font-weight: inherit;
  color: inherit;
}

.clickable-section-title .section-arrow {
  color: rgba(255, 255, 255, 0.6);
  --mdc-icon-size: 22px;
  transition: color 0.2s ease;
}

.permanent-chips + .apple-home-section-title, .permanent-chips + .area-title,
.apple-status-section + .apple-home-section-title,
.apple-status-section + .area-title {
  margin: 12px 0 6px;
}

.carousel-container {
  overflow-x: auto;
  overflow-y: hidden;
  margin-bottom: var(--section-margin);
  contain: layout style;
  margin-inline-start: calc(-1 * var(--apple-page-padding, 22px));
  margin-inline-end: calc(-1 * var(--apple-page-padding, 22px));
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  user-select: none;
}

.carousel-container::-webkit-scrollbar {
  display: none;
}

.carousel-grid {
  display: inline-flex;
  gap: var(--card-gap);
  padding-inline-start: var(--apple-page-padding, 22px);
  padding-inline-end: var(--apple-page-padding, 22px);
  min-width: 100%;
  box-sizing: border-box;
}

.carousel-grid.scenes { gap: var(--card-gap); }

.carousel-grid.scenes .entity-card-wrapper {
  flex: 0 0 calc((100cqw - 3 * var(--card-gap, 10px)) / 4 * 0.9);
  height: calc(var(--apple-card-height, 70px) * 0.9);
}

.carousel-grid.cameras {
  gap: 2px;
  padding-inline-end: 0;
}

.carousel-grid.cameras::after {
  content: '';
  flex-shrink: 0;
  width: var(--apple-page-padding, 22px);
  min-width: var(--apple-page-padding, 22px);
}

.carousel-grid .entity-card-wrapper {
  flex: 0 0 auto;
  width: calc(23% - 9px);
  height: var(--apple-card-height, 70px);
  display: flex;
  flex-direction: column;
  position: relative;
  grid-column: unset;
}

.carousel-grid.cameras .entity-card-wrapper {
  height: var(--apple-camera-height, 180px);
  flex: 0 0 calc((100cqw - 3 * var(--card-gap, 10px)) / 4 * 1.2);
}

.carousel-grid.cameras .entity-card-wrapper { grid-row: unset; }

.carousel-grid.cameras .entity-card-wrapper apple-home-card { overflow: hidden; }

apple-home-card {
  border-radius: var(--apple-card-radius, 25px);
  overflow: hidden;
}

.carousel-grid.cameras .entity-card-wrapper apple-home-card { border-radius: 0; }
.carousel-grid.cameras .entity-card-wrapper:first-child apple-home-card {
  border-radius: var(--apple-card-radius, 25px) 0 0 var(--apple-card-radius, 25px);
}
.carousel-grid.cameras .entity-card-wrapper:last-child apple-home-card {
  border-radius: 0 var(--apple-card-radius, 25px) var(--apple-card-radius, 25px) 0;
}
.carousel-grid.cameras .entity-card-wrapper:first-child:last-child apple-home-card {
  border-radius: var(--apple-card-radius, 25px);
}

.wrapper-content.rtl .carousel-grid.cameras .entity-card-wrapper:first-child apple-home-card {
  border-radius: 0 var(--apple-card-radius, 25px) var(--apple-card-radius, 25px) 0;
}
.wrapper-content.rtl .carousel-grid.cameras .entity-card-wrapper:last-child apple-home-card {
  border-radius: var(--apple-card-radius, 25px) 0 0 var(--apple-card-radius, 25px);
}

.carousel-grid .entity-card-wrapper.edit-mode {
  transition: transform 0.2s ease, opacity 0.2s ease;
  animation: apple-home-shake 1.3s ease-in-out infinite;
  touch-action: none;
}

.weather-energy-row {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  align-items: stretch;
}
.weather-energy-row .apple-weather-card,
.weather-energy-row .apple-energy-card {
  flex: 1;
  margin-top: 0;
  width: auto;
  min-width: 0;
  overflow: hidden;
}
.weather-energy-row .apple-weather-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

@container apple-home-view (max-width: 1100px) {
  .weather-energy-row .weather-card-inner { flex-direction: column; gap: 10px; }
  .weather-energy-row .weather-clock-side { padding-right: 0; border-right: none; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); }
}
@container apple-home-view (max-width: 755px) {
  .weather-energy-row { flex-direction: column; }
  .weather-energy-row .apple-weather-card, .weather-energy-row .apple-energy-card { width: 100%; }
  .weather-energy-row .weather-card-inner { flex-direction: row; gap: 24px; }
  .weather-energy-row .weather-clock-side { padding-right: 24px; border-right: 1px solid rgba(255,255,255,0.1); padding-bottom: 0; border-bottom: none; }
}
@container apple-home-view (max-width: 555px) {
  .weather-energy-row .weather-card-inner { flex-direction: column; gap: 10px; text-align: center; }
  .weather-energy-row .weather-clock-side { padding-right: 0; border-right: none; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); align-items: center; }
}

.room-group-grid, .scenes-grid, .cameras-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: var(--apple-card-height, 70px);
  gap: var(--card-gap);
  margin-bottom: var(--section-margin);
  contain: layout style;
}

.room-group-grid .entity-card-wrapper,
.scenes-grid .entity-card-wrapper,
.cameras-grid .entity-card-wrapper {
  grid-column: span 3;
  display: flex;
  flex-direction: column;
  position: relative;
}

.cameras-grid .entity-card-wrapper { grid-row: span 2; }

.room-group-title {
  font-size: var(--apple-section-title-size, 17px);
  font-weight: 600;
  color: #fff;
  margin: 30px 0 16px;
  padding: 0;
  letter-spacing: 0.3px;
}

.room-group-section { margin-bottom: var(--section-margin); }
.room-group-section:last-child { margin-bottom: 16px; }

.area-entities {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: var(--apple-card-height, 70px);
  gap: var(--card-gap);
  margin-bottom: 24px;
}

.entity-card-wrapper {
  grid-column: span 3;
  display: flex;
  flex-direction: column;
  position: relative;
}

.entity-card-wrapper.edit-mode {
  transition: transform 0.2s ease, opacity 0.2s ease;
  animation: apple-home-shake 1.3s ease-in-out infinite;
  touch-action: none;
}

@media (hover: none) and (pointer: coarse) {
  .entity-card-wrapper.edit-mode {
    animation: apple-home-shake 1.8s ease-in-out infinite;
    touch-action: none;
  }
}

@keyframes apple-home-shake {
  0%, 100% { transform: translateX(0px) rotate(0deg); }
  10% { transform: translateX(-1px) rotate(-0.6deg); }
  20% { transform: translateX(1px) rotate(0.6deg); }
  30% { transform: translateX(-1px) rotate(-0.6deg); }
  40% { transform: translateX(1px) rotate(0.6deg); }
  50% { transform: translateX(-1px) rotate(-0.6deg); }
  60% { transform: translateX(1px) rotate(0.6deg); }
  70% { transform: translateX(-1px) rotate(-0.6deg); }
  80% { transform: translateX(1px) rotate(0.6deg); }
  90% { transform: translateX(-1px) rotate(-0.6deg); }
}

.drag-placeholder {
  background: transparent !important;
  border: none !important;
  transition: opacity 0.2s ease !important;
  pointer-events: none !important;
  min-height: 70px !important;
  position: relative !important;
}

.sortable-ghost { opacity: 0.2 !important; background: rgba(255,255,255,0.05) !important; border-radius: var(--apple-card-radius, 25px) !important; box-shadow: none !important; }
.sortable-ghost > * { opacity: 0 !important; }
.sortable-chosen { animation: none !important; }
.sortable-drag { opacity: 1 !important; }

.sortable-fallback {
  position: fixed !important;
  opacity: 1 !important;
  box-shadow: 0 12px 40px rgba(0,0,0,0.5) !important;
  transform: scale(1.05) rotate(2deg) !important;
  border-radius: var(--apple-card-radius, 25px) !important;
  z-index: 100000 !important;
  pointer-events: none !important;
  transition: none !important;
}

.entity-card-wrapper:not(.dragging):not(.sortable-ghost) {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.entity-card-wrapper.dragging, .entity-card-wrapper.sortable-chosen { animation: none !important; }
.entity-card-wrapper.animating { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }

.chip-wrapper.sortable-ghost { opacity: 0 !important; visibility: hidden !important; }
.chip-wrapper.sortable-ghost > * { opacity: 0 !important; visibility: hidden !important; }
.chip-wrapper.sortable-drag { opacity: 0 !important; visibility: hidden !important; transition: none !important; }
.chip-wrapper.sortable-fallback {
  position: fixed !important; opacity: 1 !important;
  box-shadow: 0 12px 40px rgba(0,0,0,0.5) !important;
  transform: scale(1.05) rotate(2deg) !important;
  border-radius: var(--apple-chip-radius, 50px) !important;
  z-index: 100000 !important; pointer-events: none !important; transition: none !important;
}
.chip-wrapper.sortable-fallback .chip {
  display: flex !important; align-items: center !important; gap: 8px !important;
  padding: 4px 20px 4px 10px !important; border-radius: var(--apple-chip-radius, 50px) !important;
  background: rgba(255,255,255,0.25) !important; backdrop-filter: blur(20px) !important; -webkit-backdrop-filter: blur(20px) !important;
}
.chip-wrapper:not(.dragging):not(.sortable-ghost) { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important; }
.chip-wrapper.sortable-chosen, .chip-wrapper.dragging { animation: none !important; }

.entity-controls {
  position: absolute; top: -8px; right: -8px;
  display: none; gap: 4px; z-index: 10; opacity: 0.99; transform: scaleX(-1);
}

:host(.edit-mode) .entity-controls, .edit-mode .entity-controls, .entity-card-wrapper.edit-mode .entity-controls {
  display: flex !important;
}

.entity-control-btn {
  background: rgb(234 234 234 / 90%); border: none; border-radius: 50%;
  width: 28px; height: 28px; color: #666; cursor: pointer; font-size: 12px;
  display: flex; align-items: center; justify-content: center;
  transition: background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease;
  backdrop-filter: blur(10px); box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.entity-control-btn.tall-toggle { background: #dfdfdfe6; color: #3d3d3d; font-size: 14px; font-weight: 600; line-height: 1; }
.entity-control-btn.tall-toggle ha-icon { --mdc-icon-size: 18px; }
.entity-control-btn.tall-toggle.active { background: rgba(255,255,255,0.9); color: #666; }

.entity-card-wrapper.tall { grid-row: span 2; }

/* Responsive Container Queries */
@container apple-home-view (min-width: 1356px) {
  .entity-card-wrapper, .room-group-grid .entity-card-wrapper, .scenes-grid .entity-card-wrapper, .cameras-grid .entity-card-wrapper { grid-column: span var(--apple-card-span-xl, 2); }
  .carousel-grid .entity-card-wrapper { width: calc(16.666% - 8px); }
  .carousel-grid.scenes .entity-card-wrapper { flex: 0 0 calc((100cqw - 5 * var(--card-gap, 10px)) / 6 * 0.9); }
  .carousel-grid.cameras .entity-card-wrapper { height: var(--apple-camera-height, 180px); flex: 0 0 calc((100cqw - 5 * var(--card-gap, 10px)) / 6 * 1.2); }
}

@container apple-home-view (min-width: 1056px) and (max-width: 1355px) {
  .entity-card-wrapper, .room-group-grid .entity-card-wrapper, .scenes-grid .entity-card-wrapper, .cameras-grid .entity-card-wrapper { grid-column: span var(--apple-card-span-desktop, 3); }
  .carousel-grid .entity-card-wrapper { width: calc(25% - 8px); }
  .carousel-grid.scenes .entity-card-wrapper { flex: 0 0 calc((100cqw - 3 * var(--card-gap, 10px)) / 4 * 0.9); }
  .carousel-grid.cameras .entity-card-wrapper { height: var(--apple-camera-height, 180px); flex: 0 0 calc((100cqw - 3 * var(--card-gap, 10px)) / 4 * 1.2); }
}

@container apple-home-view (min-width: 756px) and (max-width: 1055px) {
  .wrapper-content { --card-gap: 10px; }
  .entity-card-wrapper, .room-group-grid .entity-card-wrapper, .scenes-grid .entity-card-wrapper, .cameras-grid .entity-card-wrapper { grid-column: span var(--apple-card-span-desktop, 3); }
  .carousel-grid .entity-card-wrapper { width: calc(25% - 8px); }
  .carousel-grid.scenes .entity-card-wrapper { flex: 0 0 calc((100cqw - 3 * var(--card-gap, 10px)) / 4 * 0.9); }
  .carousel-grid.cameras .entity-card-wrapper { height: var(--apple-camera-height, 220px); flex: 0 0 calc((100cqw - 3 * var(--card-gap, 10px)) / 4 * 1.2); }
}

@container apple-home-view (min-width: 556px) and (max-width: 755px) {
  .wrapper-content { --card-gap: 10px; }
  .entity-card-wrapper, .room-group-grid .entity-card-wrapper, .scenes-grid .entity-card-wrapper, .cameras-grid .entity-card-wrapper { grid-column: span var(--apple-card-span-tablet, 4); }
  .carousel-grid .entity-card-wrapper { width: calc(33.333% - 8px); }
  .carousel-grid.scenes .entity-card-wrapper { flex: 0 0 calc((100cqw - 2 * var(--card-gap, 10px)) / 3 * 0.9); }
  .carousel-grid.cameras .entity-card-wrapper { height: var(--apple-camera-height, 220px); flex: 0 0 calc((100cqw - 2 * var(--card-gap, 10px)) / 3 * 1.2); }
}

@container apple-home-view (min-width: 356px) and (max-width: 555px) {
  .wrapper-content { --card-gap: 10px; --section-margin: 18px; }
  .apple-page-title { font-size: var(--apple-title-size, 28px); margin-bottom: 20px; }
  .entity-card-wrapper, .room-group-grid .entity-card-wrapper, .scenes-grid .entity-card-wrapper, .cameras-grid .entity-card-wrapper { grid-column: span var(--apple-card-span-mobile, 6); }
  .entity-card-wrapper.tall { grid-row: span 2; }
  .cameras-grid .entity-card-wrapper { grid-row: span 2; }
  .carousel-grid .entity-card-wrapper { width: calc(46% - 6px); }
  .carousel-grid.scenes .entity-card-wrapper { flex: 0 0 calc((100cqw - var(--card-gap, 10px)) / 2 * 0.9); }
  .carousel-grid.cameras .entity-card-wrapper { height: var(--apple-camera-height, 220px); flex: 0 0 calc((100cqw - 2px) / 2); }
  .entity-controls { top: -10px; right: -10px; gap: 6px; }
  .entity-control-btn { font-size: 14px; padding: 0; }
}

@container apple-home-view (min-width: 316px) and (max-width: 355px) {
  .wrapper-content { --card-gap: 8px; --section-margin: 16px; }
  .apple-page-title { font-size: 22px; }
  .area-title, .apple-home-section-title, .room-group-title { font-size: 16px; margin-top: 16px; }
  .entity-card-wrapper, .room-group-grid .entity-card-wrapper, .scenes-grid .entity-card-wrapper { grid-column: span var(--apple-card-span-mobile, 6); }
  .cameras-grid .entity-card-wrapper { grid-column: span 12; grid-row: span 2; }
  .carousel-grid.scenes .entity-card-wrapper { flex: 0 0 calc((100cqw - var(--card-gap, 8px)) / 2 * 0.9); }
  .carousel-grid.cameras .entity-card-wrapper { height: var(--apple-camera-height, 220px); flex: 0 0 calc((100cqw - 2px) / 2); }
}

@container apple-home-view (max-width: 315px) {
  .wrapper-content { --card-gap: 8px; --section-margin: 14px; }
  .apple-page-title { font-size: 20px; }
  .area-title, .apple-home-section-title, .room-group-title { font-size: 15px; margin-top: 14px; }
  .entity-card-wrapper, .room-group-grid .entity-card-wrapper, .scenes-grid .entity-card-wrapper, .cameras-grid .entity-card-wrapper { grid-column: span var(--apple-card-span-xs, 12) !important; }
  .carousel-grid.scenes .entity-card-wrapper { flex: 0 0 calc(100cqw * 0.9); }
  .carousel-grid.cameras .entity-card-wrapper { height: var(--apple-camera-height, 220px); flex: 0 0 100cqw; }
  .carousel-grid .entity-card-wrapper { max-width: 100%; }
}

@media (max-width: 359px) {
  :host { padding: 0 var(--apple-page-padding, 10px) var(--apple-page-padding-bottom, 10px) var(--apple-page-padding, 10px); --card-gap: 8px; --section-margin: 14px; }
  .apple-page-title { font-size: 20px; }
  .area-title, .apple-home-section-title, .room-group-title { font-size: 15px; margin-top: 14px; }
  .entity-card-wrapper { grid-column: span var(--apple-card-span-xs, 12) !important; }
  .room-group-grid .entity-card-wrapper, .scenes-grid .entity-card-wrapper { grid-column: span var(--apple-card-span-xs, 12) !important; }
  .entity-card-wrapper.tall { grid-row: span 2; }
  .carousel-grid .entity-card-wrapper { width: 100% !important; max-width: 100%; }
  .carousel-grid.cameras .entity-card-wrapper { height: var(--apple-camera-height, 220px); }
}

@media (max-width: 320px) and (min-resolution: 2dppx) {
  .room-group-grid .entity-card-wrapper, .scenes-grid .entity-card-wrapper { grid-column: span var(--apple-card-span-xs, 12); }
}

@media (max-width: 320px) {
  :host { padding: 0 var(--apple-page-padding, 8px) var(--apple-page-padding-bottom, 8px) var(--apple-page-padding, 8px); }
  .apple-page-title { font-size: 20px; }
  .area-title, .apple-home-section-title, .room-group-title { font-size: 16px; }
  .carousel-grid.cameras .entity-card-wrapper { height: 150px; }
}
`;
