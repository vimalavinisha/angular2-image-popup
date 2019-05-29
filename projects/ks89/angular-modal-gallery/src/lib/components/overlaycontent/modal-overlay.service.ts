import { Injectable, Injector, ComponentRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';

import { DIALOG_DATA } from './modal-overlay.tokens';
import { OverlaycontentComponent } from './overlaycontent.component';
import { ModalOverlayRef } from './modal-overlay-ref';

export interface Image {
  name: string;
  url: string;
}

interface ModalOverlayConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  image?: Image;
}

const DEFAULT_CONFIG: ModalOverlayConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'tm-file-preview-dialog-panel',
  image: null
};

@Injectable({ providedIn: 'root' })
export class ModalOverlayService {
  constructor(private injector: Injector, private overlay: Overlay) {}

  open(config: ModalOverlayConfig = {}) {
    console.log('completed config-', config);

    // Override default configuration
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };

    // Returns an OverlayRef which is a PortalHost
    const overlayRef = this.createOverlay(dialogConfig);

    // Instantiate remote control
    const dialogRef = new ModalOverlayRef(overlayRef);

    const overlayComponent = this.attachDialogContainer(overlayRef, dialogConfig, dialogRef);

    overlayRef.backdropClick().subscribe(() => dialogRef.close());

    console.log('completed open');
    return dialogRef;
  }

  private createOverlay(config: ModalOverlayConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(overlayRef: OverlayRef, config: ModalOverlayConfig, dialogRef: ModalOverlayRef) {
    const injector = this.createInjector(config, dialogRef);

    const containerPortal = new ComponentPortal(OverlaycontentComponent, null, injector);
    const containerRef: ComponentRef<OverlaycontentComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(config: ModalOverlayConfig, dialogRef: ModalOverlayRef): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(ModalOverlayRef, dialogRef);
    injectionTokens.set(DIALOG_DATA, config.image);

    return new PortalInjector(this.injector, injectionTokens);
  }

  private getOverlayConfig(config: ModalOverlayConfig): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return overlayConfig;
  }
}
