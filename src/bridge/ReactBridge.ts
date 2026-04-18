import React from 'react';
import { createRoot, Root } from 'react-dom/client';

export class ReactBridge {
  private root: Root | null = null;
  private container: HTMLDivElement;
  private styleContainer: HTMLDivElement;

  constructor(shadowRoot: ShadowRoot) {
    this.styleContainer = document.createElement('div');
    shadowRoot.appendChild(this.styleContainer);

    this.container = document.createElement('div');
    this.container.className = 'react-root';
    shadowRoot.appendChild(this.container);
    this.root = createRoot(this.container);
  }

  render(element: React.ReactElement) {
    this.root?.render(element);
  }

  unmount() {
    this.root?.unmount();
    this.root = null;
  }

  getContainer(): HTMLDivElement {
    return this.container;
  }

  getStyleContainer(): HTMLDivElement {
    return this.styleContainer;
  }
}
