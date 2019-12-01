import { Injectable, Injector, ComponentRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';

import { DIALOG_DATA } from './modal-gallery.tokens';
import { ModalGalleryComponent } from './modal-gallery.component';
import { ModalGalleryRef } from './modal-gallery-ref';
import { Image } from '../../model/image.class';
import { LibConfig } from '../../services/config.service';

export interface ModalGalleryInput {
  id: number;
  images: Image[];
  currentImage: Image;
  libConfig?: LibConfig;
}

export interface ModalGalleryConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  config?: ModalGalleryInput;
}

const DEFAULT_CONFIG: ModalGalleryConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'tm-file-preview-dialog-panel',
  config: null
};

@Injectable({ providedIn: 'root' })
export class ModalGalleryService {
  private dialogRef;

  constructor(private injector: Injector, private overlay: Overlay) {}

  open(config: ModalGalleryConfig = {}) {
    // console.log('completed config-', config);

    // Override default configuration
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };

    // Returns an OverlayRef which is a PortalHost
    const overlayRef = this.createOverlay(dialogConfig);

    // Instantiate remote control
    this.dialogRef = new ModalGalleryRef(overlayRef);

    const overlayComponent = this.attachDialogContainer(overlayRef, dialogConfig, this.dialogRef);

    overlayRef.backdropClick().subscribe(() => this.dialogRef.close());

    // console.log('completed open');
    return this.dialogRef;
  }

  close() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }

  isOpen(): boolean {
    return !!this.dialogRef;
  }

  private createOverlay(config: ModalGalleryConfig) {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(overlayRef: OverlayRef, config: ModalGalleryConfig, dialogRef: ModalGalleryRef) {
    const injector = this.createInjector(config, dialogRef);

    const containerPortal = new ComponentPortal(ModalGalleryComponent, null, injector);
    const containerRef: ComponentRef<ModalGalleryComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createInjector(overlayConfig: ModalGalleryConfig, dialogRef: ModalGalleryRef): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(ModalGalleryRef, dialogRef);
    injectionTokens.set(DIALOG_DATA, overlayConfig.config);

    return new PortalInjector(this.injector, injectionTokens);
  }

  private getOverlayConfig(config: ModalGalleryConfig): OverlayConfig {
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
