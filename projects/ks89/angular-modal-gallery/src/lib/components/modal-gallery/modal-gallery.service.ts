import { Injectable, Injector, ComponentRef } from '@angular/core';

import { GlobalPositionStrategy, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { Subject } from 'rxjs';

import { DIALOG_DATA } from './modal-gallery.tokens';
import { ModalGalleryComponent } from './modal-gallery.component';
import { ModalGalleryRef } from './modal-gallery-ref';
import { Image, ImageModalEvent } from '../../model/image.class';
import { ConfigService } from '../../services/config.service';
import { ButtonEvent } from '../../model/buttons-config.interface';
import { ModalGalleryConfig } from '../../model/modal-gallery-config.interface';
import { LibConfig } from '../../model/lib-config.interface';

// private interface used only in this file
interface ModalDialogConfig {
  panelClass: string;
  hasBackdrop: boolean;
  backdropClass: string;
}

const DEFAULT_DIALOG_CONFIG: ModalDialogConfig = {
  hasBackdrop: true,
  backdropClass: 'ks-modal-gallery-backdrop',
  panelClass: 'ks-modal-gallery-panel'
};

@Injectable({ providedIn: 'root' })
export class ModalGalleryService {
  private updateImages = new Subject<Image[]>();
  updateImages$ = this.updateImages.asObservable();

  private dialogRef: ModalGalleryRef | undefined;

  constructor(private injector: Injector, private overlay: Overlay, private configService: ConfigService) {}

  open(config: ModalGalleryConfig): ModalGalleryRef | undefined {
    // Returns an OverlayRef which is a PortalHost
    const overlayRef: OverlayRef = this.createOverlay();
    // Instantiate remote control
    this.dialogRef = new ModalGalleryRef(overlayRef);

    const overlayComponent: ModalGalleryComponent = this.attachDialogContainer(overlayRef, config, this.dialogRef);
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

  private createOverlay(): OverlayRef {
    const overlayConfig = this.getOverlayConfig();
    return this.overlay.create(overlayConfig);
  }

  private attachDialogContainer(overlayRef: OverlayRef, config: ModalGalleryConfig, dialogRef: ModalGalleryRef): ModalGalleryComponent {
    const injector: Injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: ModalGalleryRef, useValue: dialogRef },
        { provide: DIALOG_DATA, useValue: config }
      ]
    });

    const containerPortal = new ComponentPortal(ModalGalleryComponent, null, injector);
    const containerRef: ComponentRef<ModalGalleryComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private getOverlayConfig(): OverlayConfig {
    const positionStrategy: GlobalPositionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();

    const overlayConfig: OverlayConfig = new OverlayConfig({
      hasBackdrop: DEFAULT_DIALOG_CONFIG.hasBackdrop,
      backdropClass: DEFAULT_DIALOG_CONFIG.backdropClass,
      panelClass: DEFAULT_DIALOG_CONFIG.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return overlayConfig;
  }
}
