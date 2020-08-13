import { Injectable, Injector, ComponentRef } from '@angular/core';

import { GlobalPositionStrategy, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';

import { DIALOG_DATA } from './modal-gallery.tokens';
import { ModalGalleryComponent } from './modal-gallery.component';
import { ModalGalleryRef } from './modal-gallery-ref';
import { Image, ImageModalEvent } from '../../model/image.class';
import { ConfigService, LibConfig } from '../../services/config.service';
import { ButtonEvent } from '../../model/buttons-config.interface';
import { Subject } from 'rxjs';

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
  dialogRef?: ModalGalleryRef;
}

const DEFAULT_CONFIG: ModalGalleryConfig = {
  hasBackdrop: true,
  backdropClass: 'ks-modal-gallery-backdrop',
  panelClass: 'ks-modal-gallery-panel',
  config: undefined,
  dialogRef: undefined
};

@Injectable({ providedIn: 'root' })
export class ModalGalleryService {
  private updateImages = new Subject<Image[]>();
  updateImages$ = this.updateImages.asObservable();

  private dialogRef: ModalGalleryRef | undefined;

  constructor(private injector: Injector, private overlay: Overlay, private configService: ConfigService) {}

  open(config: ModalGalleryConfig = {}): ModalGalleryRef | undefined {
    // Override default configuration
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };
    // Returns an OverlayRef which is a PortalHost
    const overlayRef: OverlayRef = this.createOverlay(dialogConfig);
    // Instantiate remote control
    this.dialogRef = new ModalGalleryRef(overlayRef);

    const overlayComponent: ModalGalleryComponent = this.attachDialogContainer(overlayRef, dialogConfig, this.dialogRef);
    overlayRef.backdropClick().subscribe(() => {
      if (this.dialogRef) {
        this.dialogRef.closeModal();
      }
    });
    return this.dialogRef;
  }

  close(id: number, clickOutside: boolean): void {
    const libConfig: LibConfig | undefined = this.configService.getConfig(id);
    if (clickOutside) {
      if (this.dialogRef && libConfig && libConfig.enableCloseOutside) {
        this.dialogRef.closeModal();
        // this.dialogRef = null;
      }
    } else {
      if (this.dialogRef) {
        this.dialogRef.closeModal();
        // this.dialogRef = null;
      }
    }
  }

  updateModalImages(images: Image[]): void {
    this.updateImages.next(images);
  }

  emitClose(event: ImageModalEvent): void {
    if (!this.dialogRef) {
      return;
    }
    this.dialogRef.emitClose(event);
  }

  emitShow(event: ImageModalEvent): void {
    if (!this.dialogRef) {
      return;
    }
    this.dialogRef.emitShow(event);
  }

  emitFirstImage(event: ImageModalEvent): void {
    if (!this.dialogRef) {
      return;
    }
    this.dialogRef.emitFirstImage(event);
  }

  emitLastImage(event: ImageModalEvent): void {
    if (!this.dialogRef) {
      return;
    }
    this.dialogRef.emitLastImage(event);
  }

  emitHasData(event: ImageModalEvent): void {
    if (!this.dialogRef) {
      return;
    }
    this.dialogRef.emitHasData(event);
  }

  emitButtonBeforeHook(event: ButtonEvent): void {
    if (!this.dialogRef) {
      return;
    }
    this.dialogRef.emitButtonBeforeHook(event);
  }

  emitButtonAfterHook(event: ButtonEvent): void {
    if (!this.dialogRef) {
      return;
    }
    this.dialogRef.emitButtonAfterHook(event);
  }

  private createOverlay(config: ModalGalleryConfig): OverlayRef {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(overlayRef: OverlayRef, config: ModalGalleryConfig, dialogRef: ModalGalleryRef): ModalGalleryComponent {
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
    const positionStrategy: GlobalPositionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();

    const overlayConfig: OverlayConfig = new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return overlayConfig;
  }
}
