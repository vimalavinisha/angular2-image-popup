/*
 The MIT License (MIT)

 Copyright (c) 2017-2019 Stefano Cappa (Ks89)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

import {
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  SimpleChange,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ButtonsConfig } from '../../model/buttons-config.interface';
import { Image, ImageModalEvent } from '../../model/image.class';
import { Action } from '../../model/action.enum';
import { KeyboardConfig } from '../../model/keyboard-config.interface';
import { PreviewConfig } from '../../model/preview-config.interface';
import { SlideConfig } from '../../model/slide-config.interface';
import { AccessibilityConfig } from '../../model/accessibility.interface';
import { KeyboardService } from '../../services/keyboard.service';
import { GalleryService } from '../../services/gallery.service';
import { DotsConfig } from '../../model/dots-config.interface';
import { CurrentImageComponent } from '../current-image/current-image.component';
import { InternalLibImage } from '../../model/image-internal.class';
import { AdvancedLayout, PlainGalleryConfig } from '../../model/plain-gallery-config.interface';
import { KS_DEFAULT_ACCESSIBILITY_CONFIG } from '../accessibility-default';
import { CurrentImageConfig } from '../../model/current-image-config.interface';

import { IdValidatorService } from '../../services/id-validator.service';
import { ConfigService, LibConfig } from '../../services/config.service';
import { ModalOverlayService } from '../overlaycontent/modal-overlay.service';
import { ModalOverlayRef } from '../overlaycontent/modal-overlay-ref';
import { Overlay } from '@angular/cdk/overlay';

/**
 * Main Component of this library with both the plain and modal galleries.
 */
@Component({
  selector: 'ks-modal-gallery',
  exportAs: 'ksModalGallery',
  styleUrls: ['modal-gallery.scss'],
  templateUrl: 'modal-gallery.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfigService]
})
export class ModalGalleryComponent implements OnInit, OnDestroy, OnChanges {
  /**
   * Unique id (>=0) of the current instance of this library. This is useful when you are using
   * the service to call modal gallery without open it manually.
   */
  @Input()
  id: number;
  /**
   * Array of `Image` that represent the model of this library with all images, thumbs and so on.
   */
  @Input()
  modalImages: Image[];
  /**
   * Object of type `ButtonsConfig` to show/hide buttons.
   */
  @Input()
  buttonsConfig: ButtonsConfig;
  /**
   * Boolean to enable modal-gallery close behaviour when clicking
   * on the semi-transparent background. Enabled by default.
   */
  @Input()
  enableCloseOutside = true;
  /**
   * Interface to configure current image in modal-gallery.
   * For instance you can disable navigation on click on current image (enabled by default).
   */
  @Input()
  currentImageConfig: CurrentImageConfig;
  /**
   * Object of type `DotsConfig` to init DotsComponent's features.
   * For instance, it contains a param to show/hide dots.
   */
  @Input()
  dotsConfig: DotsConfig;
  /**
   * Object of type `PreviewConfig` to init PreviewsComponent's features.
   * For instance, it contains a param to show/hide previews.
   */
  @Input()
  previewConfig: PreviewConfig;
  /**
   * Object of type `SlideConfig` to init side previews and `infinite sliding`.
   */
  @Input()
  slideConfig: SlideConfig;
  /**
   * Object of type `AccessibilityConfig` to init custom accessibility features.
   * For instance, it contains titles, alt texts, aria-labels and so on.
   */
  @Input()
  accessibilityConfig: AccessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
  /**
   * Object of type `KeyboardConfig` to assign custom keys to ESC, RIGHT and LEFT keyboard's actions.
   */
  @Input()
  keyboardConfig: KeyboardConfig;
  /**
   * Object of type `PlainGalleryConfig` to configure the plain gallery.
   */
  @Input()
  plainGalleryConfig: PlainGalleryConfig;

  /**
   * Reference to the CurrentImageComponent to invoke methods on it.
   */
  @ViewChild(CurrentImageComponent, { static: true })
  currentImageComponent;

  /**
   * Boolean that it is true if the modal gallery is visible. False by default.
   */
  opened = false;
  /**
   * Boolean to open the modal gallery. False by default.
   */
  showGallery = false;
  /**
   * Array of `InternalLibImage` representing the model of this library with all images, thumbs and so on.
   */
  images: InternalLibImage[];
  /**
   * `Image` that is visible right now.
   */
  currentImage: InternalLibImage;

  /**
   * Constructor with the injection of ´KeyboardService´, an object to support Server-Side Rendering and other useful services.
   */
  constructor(
    private keyboardService: KeyboardService,
    private galleryService: GalleryService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private changeDetectorRef: ChangeDetectorRef,
    private idValidatorService: IdValidatorService,
    private configService: ConfigService,
    private sanitizer: DomSanitizer,
    private overlay: Overlay,
    private modalGalleryService: ModalOverlayService
  ) {}

  /**
   * Method ´ngOnChanges´ to re-init images if input is changed.
   * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called before `ngOnInit()` and whenever one or more data-bound input properties change.
   * @param changes `SimpleChanges` object of current and previous property values provided by Angular.
   */
  ngOnChanges(changes: SimpleChanges) {
    const imagesChange: SimpleChange = changes.modalImages;
    const plainGalleryConfigChange: SimpleChange = changes.plainGalleryConfig;

    if (imagesChange && !imagesChange.firstChange && imagesChange.previousValue !== imagesChange.currentValue) {
      this.initImages();
    }

    if (plainGalleryConfigChange) {
      // const prevPlainGalleryConfigChange: any = plainGalleryConfigChange.previousValue;
      const currPlainGalleryConfigChange: PlainGalleryConfig = plainGalleryConfigChange.currentValue;
      if (
        currPlainGalleryConfigChange.layout &&
        currPlainGalleryConfigChange.layout instanceof AdvancedLayout &&
        currPlainGalleryConfigChange.layout.modalOpenerByIndex !== -1
      ) {
        // this.showModalGallery(currPlainGalleryConfigChange.layout.modalOpenerByIndex);
      }
    }
  }

  /**
   * Method ´ngOnInit´ to init images calling `initImages()`.
   * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called only one time!!!
   */
  ngOnInit() {
    this.idValidatorService.checkAndAdd(this.id);

    // id is a mandatory input and must a number > 0
    if ((!this.id && this.id !== 0) || this.id < 0) {
      throw new Error(
        `'[id]="a number >= 0"' is a mandatory input from 6.0.0 in angular-modal-gallery.` +
          `If you are using multiple instances of this library, please be sure to use different ids`
      );
    }

    // init ligConfig with inputs
    this.configService.set(<LibConfig>{
      slideConfig: this.slideConfig,
      accessibilityConfig: this.accessibilityConfig,
      previewConfig: this.previewConfig,
      buttonsConfig: this.buttonsConfig,
      dotsConfig: this.dotsConfig,
      plainGalleryConfig: this.plainGalleryConfig,
      keyboardConfig: this.keyboardConfig,
      currentImageConfig: this.currentImageConfig
    });

    // call initImages to init images and to emit `hasData` event
    this.initImages();
  }

  /**
   * Method called when you click on an image of your plain (or inline) gallery.
   * @param number index of the clicked image
   */
  onShowModalGallery(index: number) {
    // this.showModalGallery(index);
    this.showPreview(index);
  }

  isPlainGalleryVisible(): boolean {
    if (this.plainGalleryConfig && this.plainGalleryConfig.layout && this.plainGalleryConfig.layout instanceof AdvancedLayout) {
      return !this.plainGalleryConfig.layout.hideDefaultPlainGallery;
    }
    return true;
  }

  /**
   * Method to cleanup resources. In fact, this will reset keyboard's service.
   * This is an Angular's lifecycle hook that is called when this component is destroyed.
   */
  ngOnDestroy() {
    this.keyboardService.reset();

    this.idValidatorService.remove(this.id);
  }

  showPreview(index: number) {
    const imageToShow: Image = this.images[index];
    console.log('--imageToShow', imageToShow);
    const dialogRef: ModalOverlayRef = this.modalGalleryService.open({
      image: {
        id: this.id,
        images: this.images,
        currentImage: this.images[0]
      }
    });
  }

  /**
   * Private method to initialize `images` as array of `Image`s.
   * Also, it will emit ImageowmodaModalEvent to say that images are loaded.
   */
  private initImages() {
    // I'm not cloning the array, but I'm doing this to cast it to an array of InternalLibImages
    this.images = <InternalLibImage[]>this.modalImages;
    this.showGallery = this.images.length > 0;
  }
}
