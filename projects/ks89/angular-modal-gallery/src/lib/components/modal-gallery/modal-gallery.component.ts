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
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  SecurityContext,
  SimpleChange,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

import { ButtonEvent, ButtonsConfig } from '../../model/buttons-config.interface';
import { Image, ImageModalEvent } from '../../model/image.class';
import { Action } from '../../model/action.enum';
import { KeyboardConfig } from '../../model/keyboard-config.interface';
import { PreviewConfig } from '../../model/preview-config.interface';
import { SlideConfig } from '../../model/slide-config.interface';
import { AccessibilityConfig } from '../../model/accessibility.interface';
import { KeyboardService } from '../../services/keyboard.service';
import { GalleryService, InternalGalleryPayload } from '../../services/gallery.service';
import { DotsConfig } from '../../model/dots-config.interface';
import { CurrentImageComponent, ImageLoadEvent } from '../current-image/current-image.component';
import { InternalLibImage } from '../../model/image-internal.class';
import { AdvancedLayout, PlainGalleryConfig } from '../../model/plain-gallery-config.interface';
import { KS_DEFAULT_ACCESSIBILITY_CONFIG } from '../accessibility-default';
import { CurrentImageConfig } from '../../model/current-image-config.interface';
import { getIndex } from '../../utils/image.util';

import { Subscription } from 'rxjs';
import { IdValidatorService } from '../../services/id-validator.service';
import { InteractionEvent } from '../../model/interaction-event.interface';
import { ConfigService, LibConfig } from '../../services/config.service';

/**
 * Main Component of this library with both the plain and modal galleries.
 */
@Component({
  selector: 'ks-modal-gallery',
  exportAs: 'ksModalGallery',
  styleUrls: ['modal-gallery.scss'],
  templateUrl: 'modal-gallery.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
   * Output to emit an event when the modal gallery is closed.
   */
  @Output()
  close: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();
  /**
   * Output to emit an event when an image is changed.
   */
  @Output()
  show: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();
  /**
   * Output to emit an event when the current image is the first one.
   */
  @Output()
  firstImage: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();
  /**
   * Output to emit an event when the current image is the last one.
   */
  @Output()
  lastImage: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();
  /**
   * Output to emit an event when the modal gallery is closed.
   */
  @Output()
  hasData: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();
  /**
   * Output to emit an event when a button is clicked, but before that the action is triggered.
   */
  @Output()
  buttonBeforeHook: EventEmitter<ButtonEvent> = new EventEmitter<ButtonEvent>();
  /**
   * Output to emit an event when a button is clicked, but after that the action is triggered.
   */
  @Output()
  buttonAfterHook: EventEmitter<ButtonEvent> = new EventEmitter<ButtonEvent>();
  /**
   * Output to emit an event when someone clicks either an arrow of modal gallery or also in previews.
   */
  @Output()
  arrow: EventEmitter<InteractionEvent> = new EventEmitter<InteractionEvent>();

  /**
   * Reference to the CurrentImageComponent to invoke methods on it.
   */
  @ViewChild(CurrentImageComponent)
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

  private galleryServiceNavigateSubscription: Subscription;
  private galleryServiceCloseSubscription: Subscription;
  private galleryServiceUpdateSubscription: Subscription;
  private galleryServiceAutoPlaySubscription: Subscription;

  /**
   * HostListener to catch browser's back button and destroy the gallery.
   * This prevents weired behaviour about scrolling.
   * Added to fix this issue: https://github.com/Ks89/angular-modal-gallery/issues/159
   */
  @HostListener('window:popstate', ['$event'])
  onPopState(e: Event) {
    this.closeGallery();
  }

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
    private sanitizer: DomSanitizer
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
        this.showModalGallery(currPlainGalleryConfigChange.layout.modalOpenerByIndex);
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

    this.galleryServiceNavigateSubscription = this.galleryService.navigate.subscribe((payload: InternalGalleryPayload) => {
      if (!payload) {
        return;
      }
      // if galleryId is not valid OR galleryId is related to another instance and not this one
      if (payload.galleryId === undefined || payload.galleryId < 0 || payload.galleryId !== this.id) {
        return;
      }
      // if image index is not valid
      if (payload.index < 0 || payload.index > this.images.length) {
        return;
      }
      this.showModalGallery(payload.index, true);
    });

    this.galleryServiceCloseSubscription = this.galleryService.close.subscribe((galleryId: number) => {
      if (galleryId < 0 || this.id !== galleryId) {
        return;
      }
      this.closeGallery(Action.NORMAL, true);
    });

    this.galleryServiceUpdateSubscription = this.galleryService.update.subscribe((payload: InternalGalleryPayload) => {
      if (!payload) {
        return;
      }
      // if galleryId is not valid OR galleryId is related to another instance and not this one
      if (payload.galleryId === undefined || payload.galleryId < 0 || payload.galleryId !== this.id) {
        return;
      }
      // if either image index or image are not valid
      if (payload.index < 0 || payload.index > this.images.length || !payload.image) {
        return;
      }
      const currentIndex: number = getIndex(payload.image, this.images);
      this.images = this.images.map((image: InternalLibImage, index: number) => {
        if (image.id === payload.index) {
          return <InternalLibImage>payload.image;
        }
        return image;
      });
      if (currentIndex === payload.index) {
        this.currentImage = this.images[payload.index];
      }
      this.changeDetectorRef.markForCheck();
    });

    this.galleryServiceAutoPlaySubscription = this.galleryService.autoPlay.subscribe((payload: InternalGalleryPayload) => {
      // if galleryId is not valid OR galleryId is related to another instance and not this one
      if (payload.galleryId === undefined || payload.galleryId < 0 || payload.galleryId !== this.id) {
        return;
      }
      const newSlideConfig: SlideConfig = Object.assign({}, this.slideConfig);
      newSlideConfig.playConfig.autoPlay = payload.result;
      this.configService.set({
        slideConfig: newSlideConfig
      });
    });
  }

  /**
   * Method called by custom upper buttons.
   * @param ButtonEvent event payload
   */
  onCustomEmit(event: ButtonEvent) {
    const eventToEmit: ButtonEvent = this.getButtonEventToEmit(event);
    this.buttonBeforeHook.emit(eventToEmit);
    this.buttonAfterHook.emit(eventToEmit);
  }

  // TODO implement on refresh
  // /**
  //  * Method called by the refresh upper button.
  //  * STILL NOT IMPLEMENTED, SO DON'T USE IT
  //  * @param ButtonEvent event payload
  //  */
  // onRefresh(event: ButtonEvent) {
  //   const eventToEmit: ButtonEvent = this.getButtonEventToEmit(event);
  //
  //   this.buttonBeforeHook.emit(eventToEmit);
  //   // console.log('TODO implement on refresh inside the library', eventToEmit);
  //
  //   this.currentImage = Object.assign({}, this.currentImage, { previouslyLoaded: false });
  //
  //   // TODO add logic to hide and show the current image
  //
  //   // console.log('onRefresh', this.currentImage);
  //
  //   // const indexNum: number = this.currentImageComponent.getIndex();
  //
  //   // this.images = this.images.map((val: InternalLibImage, index: number) => {
  //   //   if (index !== 2) {
  //   //     return val;
  //   //   } else {
  //   //     const img: InternalLibImage = Object.assign({}, val, {previouslyLoaded: false});
  //   //     return img;
  //   //   }
  //   // });
  //   //
  //   // this.closeGallery();
  //   // this.showModalGallery(2);
  //
  //   this.buttonAfterHook.emit(eventToEmit);
  // }

  // /**
  //  * Method called by the rotate upper button.
  //  * @param ButtonEvent event payload
  //  */
  // onRotate(event: ButtonEvent) {
  //   const eventToEmit: ButtonEvent = this.getButtonEventToEmit(event);
  //   this.buttonBeforeHook.emit(eventToEmit);
  //
  //   // TODO implement rotation logic
  //
  //   this.buttonAfterHook.emit(eventToEmit);
  // }

  /**
   * Method called by the full-screen upper button.
   * @param ButtonEvent event payload
   */
  onFullScreen(event: ButtonEvent) {
    const eventToEmit: ButtonEvent = this.getButtonEventToEmit(event);
    this.buttonBeforeHook.emit(eventToEmit);

    const doc: any = <any>document;
    const docEl: any = <any>document.documentElement;

    const fullscreenDisabled: boolean = !doc.fullscreenElement && !doc.webkitFullscreenElement && !doc.mozFullScreenElement && !doc.msFullscreenElement;

    if (fullscreenDisabled) {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.mozRequestFullScreen) {
        docEl.mozRequestFullScreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      }
    }

    this.buttonAfterHook.emit(eventToEmit);
  }

  /**
   * Method called by the delete upper button.
   * @param ButtonEvent event payload
   */
  onDelete(event: ButtonEvent) {
    const eventToEmit: ButtonEvent = this.getButtonEventToEmit(event);
    this.buttonBeforeHook.emit(eventToEmit);

    if (this.images.length === 1) {
      this.closeGallery();
    }

    const imageIndexToDelete: number = this.currentImageComponent.getIndexToDelete(event.image);
    if (imageIndexToDelete === this.images.length - 1) {
      // last image
      this.currentImageComponent.prevImage();
    } else {
      this.currentImageComponent.nextImage();
    }

    this.buttonAfterHook.emit(eventToEmit);
  }

  /**
   * Method called by the navigate upper button.
   * @param ButtonEvent event payload
   */
  onNavigate(event: ButtonEvent) {
    const eventToEmit: ButtonEvent = this.getButtonEventToEmit(event);
    this.buttonBeforeHook.emit(eventToEmit);
    // To support SSR
    if (isPlatformBrowser(this.platformId)) {
      if (eventToEmit.image && eventToEmit.image.modal.extUrl) {
        // where I should open this link? The current tab or another one?
        if (eventToEmit.button && eventToEmit.button.extUrlInNewTab) {
          // in this case I should use target _blank to open the url in a new tab, however these is a security issue.
          // Prevent Reverse Tabnabbing's attacks (https://www.owasp.org/index.php/Reverse_Tabnabbing)
          // Some resources:
          // - https://www.owasp.org/index.php/HTML5_Security_Cheat_Sheet#Tabnabbing
          // - https://medium.com/@jitbit/target-blank-the-most-underestimated-vulnerability-ever-96e328301f4c
          // - https://developer.mozilla.org/en-US/docs/Web/API/Window/open
          const newWindow = window.open(eventToEmit.image.modal.extUrl, 'noopener,noreferrer,');
          newWindow.opener = null; // required to prevent security issues
        } else {
          window.location.href = eventToEmit.image.modal.extUrl;
        }
      }
    }
    this.buttonAfterHook.emit(eventToEmit);
  }

  /**
   * Method called by the download upper button.
   * @param ButtonEvent event payload
   */
  onDownload(event: ButtonEvent) {
    const eventToEmit: ButtonEvent = this.getButtonEventToEmit(event);
    this.buttonBeforeHook.emit(eventToEmit);
    this.downloadImage();
    this.buttonAfterHook.emit(eventToEmit);
  }

  /**
   * Method called by the close upper button.
   * @param ButtonEvent event payload
   * @param Action action that triggered the close method. `Action.NORMAL` by default
   */
  onCloseGallery(event: ButtonEvent, action: Action = Action.NORMAL) {
    const eventToEmit: ButtonEvent = this.getButtonEventToEmit(event);
    this.buttonBeforeHook.emit(eventToEmit);
    this.closeGallery(action);
    this.buttonAfterHook.emit(eventToEmit);
  }

  /**
   * Method to close the modal gallery specifying the action.
   * It also reset the `keyboardService` to prevent multiple listeners.
   * @param Action action type. `Action.NORMAL` by default
   * @param boolean isCalledByService is true if called by gallery.service, otherwise false
   */
  closeGallery(action: Action = Action.NORMAL, isCalledByService: boolean = false) {
    this.close.emit(new ImageModalEvent(action, true));
    this.opened = false;
    this.keyboardService.reset();

    // shows scrollbar
    document.body.style.overflow = 'visible';

    if (isCalledByService) {
      // the following is required, otherwise the view will not be updated
      // this happens only if called by gallery.service
      this.changeDetectorRef.markForCheck();
    }
  }

  /**
   * Method called when you click on an image of your plain (or inline) gallery.
   * @param number index of the clicked image
   */
  onShowModalGallery(index: number) {
    this.showModalGallery(index);
  }

  /**
   * Method to show the modal gallery displaying the image with
   * the index specified as input parameter.
   * It will also register a new `keyboardService` to catch keyboard's events to download the current
   * image with keyboard's shortcuts. This service, will be removed either when modal gallery component
   * will be destroyed or when the gallery is closed invoking the `closeGallery` method.
   * @param number index of the image to show
   * @param boolean isCalledByService is true if called by gallery.service, otherwise false
   */
  showModalGallery(index: number, isCalledByService: boolean = false) {
    // hides scrollbar
    document.body.style.overflow = 'hidden';

    this.keyboardService.add((event: KeyboardEvent, combo: string) => {
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        // internet explorer
        event.returnValue = false;
      }
      this.downloadImage();
    });

    this.opened = true;
    this.currentImage = this.images[index];

    // emit a new ImageModalEvent with the index of the current image
    this.show.emit(new ImageModalEvent(Action.LOAD, index + 1));

    if (isCalledByService) {
      // the following is required, otherwise the view will not be updated
      // this happens only if called by gallery.service
      this.changeDetectorRef.markForCheck();
    }
  }

  /**
   * Method called when the image changes and used to update the `currentImage` object.
   * @param ImageModalEvent event payload
   */
  onChangeCurrentImage(event: ImageModalEvent) {
    const newIndex: number = <number>event.result;
    if (newIndex < 0 || newIndex >= this.images.length) {
      return;
    }

    this.currentImage = this.images[newIndex];

    // emit first/last event based on newIndex value
    this.emitBoundaryEvent(event.action, newIndex);

    // emit current visible image index
    this.show.emit(new ImageModalEvent(event.action, newIndex + 1));
  }

  isPlainGalleryVisible(): boolean {
    if (this.plainGalleryConfig && this.plainGalleryConfig.layout && this.plainGalleryConfig.layout instanceof AdvancedLayout) {
      return !this.plainGalleryConfig.layout.hideDefaultPlainGallery;
    }
    return true;
  }

  /**
   * Method called when you click 'outside' (i.e. on the semi-transparent background)
   * to close the modal gallery if `enableCloseOutside` is true.
   * @param boolean event payload. True to close the modal gallery, false otherwise
   */
  onClickOutside(event: boolean) {
    if (event && this.enableCloseOutside) {
      this.closeGallery(Action.CLICK);
    }
  }

  /**
   * Method called when an image is loaded and the loading spinner has gone.
   * It sets the previouslyLoaded flag inside the Image to hide loading spinner when displayed again.
   * @param ImageLoadEvent event payload
   */
  onImageLoad(event: ImageLoadEvent) {
    // sets as previously loaded the image with index specified by `event.status`
    this.images = this.images.map((img: InternalLibImage) => {
      if (img && img.id === event.id) {
        return Object.assign({}, img, { previouslyLoaded: event.status });
      }
      return img;
    });
  }

  /**
   * Method called when a dot is clicked and used to update the current image.
   * @param number index of the clicked dot
   */
  onClickDot(index: number) {
    this.currentImage = this.images[index];
  }

  /**
   * Method called when an image preview is clicked and used to update the current image.
   * @param Image preview image
   */
  onClickPreview(event: ImageModalEvent) {
    this.onChangeCurrentImage(event);
  }

  // onClickArrow(event: InteractionEvent) {
  //   // TODO validate before to emit
  //   this.arrow.emit(event);
  // }

  /**
   * Method to download the current image, only if `downloadable` is true.
   * It contains also a logic to enable downloading features also for IE11.
   */
  downloadImage() {
    if (this.currentImageConfig && !this.currentImageConfig.downloadable) {
      return;
    }
    // If IE11 or Microsoft Edge use msSaveBlob(...)
    if (this.isIEorEdge()) {
      // I cannot use fetch API because IE11 doesn't support it,
      // so I have to switch to XMLHttpRequest
      this.downloadImageOnlyIEorEdge();
    } else {
      // for all other browsers
      this.downloadImageAllBrowsers();
    }
  }

  /**
   * Method to cleanup resources. In fact, this will reset keyboard's service.
   * This is an Angular's lifecycle hook that is called when this component is destroyed.
   */
  ngOnDestroy() {
    this.keyboardService.reset();

    this.idValidatorService.remove(this.id);

    if (this.galleryServiceNavigateSubscription) {
      this.galleryServiceNavigateSubscription.unsubscribe();
    }
    if (this.galleryServiceCloseSubscription) {
      this.galleryServiceCloseSubscription.unsubscribe();
    }
    if (this.galleryServiceUpdateSubscription) {
      this.galleryServiceUpdateSubscription.unsubscribe();
    }
    if (this.galleryServiceAutoPlaySubscription) {
      this.galleryServiceAutoPlaySubscription.unsubscribe();
    }
  }

  /**
   * Method to convert a base64 to a Blob
   * @param base64Data string with base64 data
   * @param contentType string with the MIME type
   */
  private base64toBlob(base64Data: string, contentType: string = ''): Blob {
    const sliceSize = 1024;
    const byteCharacters: string = atob(base64Data);
    const bytesLength: number = byteCharacters.length;
    const slicesCount: number = Math.ceil(bytesLength / sliceSize);
    const byteArrays: Array<Uint8Array> = new Array(slicesCount);
    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin: number = sliceIndex * sliceSize;
      const end: number = Math.min(begin + sliceSize, bytesLength);
      const bytes: Array<number> = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  /**
   * Private method to download the current image for all browsers except for IE11.
   */
  private downloadImageAllBrowsers() {
    const link = document.createElement('a');
    let isBase64 = false;
    let extension: string;
    let img: string;
    // convert a SafeResourceUrl to a string
    if (typeof this.currentImage.modal.img === 'string') {
      img = <string>this.currentImage.modal.img;
    } else {
      // if it's a SafeResourceUrl
      img = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.currentImage.modal.img);
    }
    if (img.includes('data:image/') || img.includes(';base64,')) {
      extension = img.replace('data:image/', '').split(';base64,')[0];
      const pureBase64: string = img.split(';base64,')[1];
      const blob: Blob = this.base64toBlob(pureBase64, 'image/' + extension);
      link.href = URL.createObjectURL(blob);
      isBase64 = true;
    } else {
      link.href = img;
    }
    link.setAttribute('download', this.getFileName(this.currentImage, isBase64, extension));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Private method to download the current image only for IE11 using
   * custom javascript's methods available only on IE.
   */
  private downloadImageOnlyIEorEdge() {
    if (isPlatformBrowser(this.platformId)) {
      const req = new XMLHttpRequest();
      req.open('GET', <string>this.currentImage.modal.img, true);
      req.responseType = 'arraybuffer';
      req.onload = event => {
        const blob = new Blob([req.response], { type: 'image/png' });
        window.navigator.msSaveBlob(blob, this.getFileName(this.currentImage));
      };
      req.send();
    }
  }

  /**
   * Private method to get the `ButtonEvent` to emit, merging the input `ButtonEvent`
   * with the current image.
   * @param ButtonEvent event payload to return
   * @returns ButtonEvent event payload with the current image included
   */
  private getButtonEventToEmit(event: ButtonEvent): ButtonEvent {
    return Object.assign(event, { image: this.currentImage });
  }

  /**
   * Private method to get the file name from an input path.
   * This is used either to get the image's name from its path or from the Image itself,
   * if specified as 'downloadFileName' by the user.
   * @param Image image to extract its file name
   * @param isBase64 boolean to set if the image is a base64 file or not. False by default.
   * @param base64Extension string to force the extension of the base64 image. Empty string by default.
   * @returns string string file name of the input image.
   */
  private getFileName(image: Image, isBase64: boolean = false, base64Extension: string = ''): string {
    if (!image.modal.downloadFileName || image.modal.downloadFileName.length === 0) {
      if (isBase64) {
        return `Image-${image.id}.${base64Extension !== '' ? base64Extension : 'png'}`;
      } else {
        return (<string>image.modal.img).replace(/^.*[\\\/]/, '');
      }
    } else {
      return image.modal.downloadFileName;
    }
  }

  /**
   * Private method to initialize `images` as array of `Image`s.
   * Also, it will emit ImageowmodaModalEvent to say that images are loaded.
   */
  private initImages() {
    // I'm not cloning the array, but I'm doing this to cast it to an array of InternalLibImages
    this.images = <InternalLibImage[]>this.modalImages;
    this.hasData.emit(new ImageModalEvent(Action.LOAD, true));
    this.showGallery = this.images.length > 0;
  }

  /**
   * Private method to emit events when either the last or the first image are visible.
   * @param action Enum of type Action that represents the source of the event that changed the
   *  current image to the first one or the last one.
   * @param indexToCheck is the index number of the image (the first or the last one).
   */
  private emitBoundaryEvent(action: Action, indexToCheck: number) {
    // to emit first/last event
    switch (indexToCheck) {
      case 0:
        this.firstImage.emit(new ImageModalEvent(action, true));
        break;
      case this.images.length - 1:
        this.lastImage.emit(new ImageModalEvent(action, true));
        break;
    }
  }

  /**
   * Private method to check if this library is running on
   * Microsoft browsers or not (i.e. it detects both IE11 and Edge)
   * supporting also Server-Side Rendering.
   * Inspired by https://msdn.microsoft.com/it-it/library/hh779016(v=vs.85).aspx
   * @returns any the result
   */
  private isIEorEdge(): any {
    if (isPlatformBrowser(this.platformId)) {
      // if both Blob constructor and msSaveOrOpenBlob are supported by the current browser
      return window.Blob && window.navigator.msSaveOrOpenBlob;
    }
    if (isPlatformServer(this.platformId)) {
      // server only
      return true;
    }
  }
}
