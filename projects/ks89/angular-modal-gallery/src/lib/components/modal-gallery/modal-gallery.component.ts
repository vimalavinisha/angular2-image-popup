import { ChangeDetectorRef, Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID, SecurityContext, ViewChild } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

import { Subscription } from 'rxjs';

import { DIALOG_DATA } from './modal-gallery.tokens';
import { Image, ImageModalEvent } from '../../model/image.class';
import { ConfigService } from '../../services/config.service';
import { DotsConfig } from '../../model/dots-config.interface';
import { ButtonConfig, ButtonEvent, ButtonsConfig, ButtonType } from '../../model/buttons-config.interface';
import { InternalLibImage } from '../../model/image-internal.class';
import { Action } from '../../model/action.enum';
import { CurrentImageComponent, ImageLoadEvent } from '../current-image/current-image.component';
import { KeyboardService } from '../../services/keyboard.service';
import { IdValidatorService } from '../../services/id-validator.service';
import { KeyboardConfig } from '../../model/keyboard-config.interface';
import { PreviewConfig } from '../../model/preview-config.interface';
import { SlideConfig } from '../../model/slide-config.interface';
import { AccessibilityConfig } from '../../model/accessibility.interface';
import { PlainGalleryConfig } from '../../model/plain-gallery-config.interface';
import { KS_DEFAULT_ACCESSIBILITY_CONFIG } from '../accessibility-default';
import { CurrentImageConfig } from '../../model/current-image-config.interface';
import { ModalGalleryService } from './modal-gallery.service';
import { LibConfig } from '../../model/lib-config.interface';
import { ModalGalleryConfig } from '../../model/modal-gallery-config.interface';

@Component({
  selector: 'ks-modal-gallery',
  templateUrl: './modal-gallery.component.html',
  styleUrls: ['./modal-gallery.component.scss']
})
export class ModalGalleryComponent implements OnInit, OnDestroy {
  /**
   * Reference to the CurrentImageComponent to invoke methods on it.
   */
  @ViewChild(CurrentImageComponent, { static: true }) currentImageComponent: CurrentImageComponent | undefined;

  /**
   * Unique id (>=0) of the current instance of this library. This is useful when you are using
   * the service to call modal gallery without open it manually.
   */
  id: number;
  /**
   * Object of type `ButtonsConfig` to show/hide buttons.
   */
  buttonsConfig: ButtonsConfig | undefined;
  /**
   * Boolean to enable modal-gallery close behaviour when clicking
   * on the semi-transparent background. Enabled by default.
   */
  enableCloseOutside = true;
  /**
   * Object of type `DotsConfig` to init DotsComponent's features.
   * For instance, it contains a param to show/hide dots.
   */
  dotsConfig: DotsConfig | undefined;
  /**
   * Object of type `PreviewConfig` to init PreviewsComponent's features.
   * For instance, it contains a param to show/hide previews.
   */
  previewConfig: PreviewConfig | undefined;
  /**
   * Object of type `SlideConfig` to init side previews and `infinite sliding`.
   */
  slideConfig: SlideConfig | undefined;
  /**
   * Object of type `AccessibilityConfig` to init custom accessibility features.
   * For instance, it contains titles, alt texts, aria-labels and so on.
   */
  accessibilityConfig: AccessibilityConfig = KS_DEFAULT_ACCESSIBILITY_CONFIG;
  /**
   * Object of type `KeyboardConfig` to assign custom keys to ESC, RIGHT and LEFT keyboard's actions.
   */
  keyboardConfig: KeyboardConfig | undefined;
  /**
   * Object of type `PlainGalleryConfig` to configure the plain gallery.
   */
  plainGalleryConfig: PlainGalleryConfig | undefined;

  /**
   * Array of `InternalLibImage` representing the model of this library with all images, thumbs and so on.
   */
  images: InternalLibImage[];
  /**
   * `Image` that is visible right now.
   */
  currentImage: InternalLibImage;
  /**
   * Boolean to open the modal gallery. False by default.
   */
  showGallery = false;
  /**
   * TODO write doc
   */
  libConfig: LibConfig | undefined;

  private updateImagesSubscription: Subscription | undefined;

  /**
   * HostListener to catch browser's back button and destroy the gallery.
   * This prevents weired behaviour about scrolling.
   * Added to fix this issue: https://github.com/Ks89/angular-modal-gallery/issues/159
   */
  @HostListener('window:popstate', ['$event'])
  onPopState(e: Event): void {
    this.closeGallery();
  }

  constructor(
    @Inject(DIALOG_DATA) private dialogContent: ModalGalleryConfig,
    private modalGalleryService: ModalGalleryService,
    private keyboardService: KeyboardService,
    // tslint:disable-next-line:ban-types
    @Inject(PLATFORM_ID) private platformId: Object,
    private changeDetectorRef: ChangeDetectorRef,
    private idValidatorService: IdValidatorService,
    private configService: ConfigService,
    private sanitizer: DomSanitizer
  ) {
    this.id = (this.dialogContent as ModalGalleryConfig).id;
    this.images = (this.dialogContent as ModalGalleryConfig).images as InternalLibImage[];
    this.currentImage = (this.dialogContent as ModalGalleryConfig).currentImage as InternalLibImage;
    this.libConfig = (this.dialogContent as ModalGalleryConfig).libConfig;
    this.configService.setConfig(this.id, this.libConfig);

    this.updateImagesSubscription = this.modalGalleryService.updateImages$.subscribe((images: Image[]) => {
      this.images = images.map((image: Image) => {
        const newImage: InternalLibImage = Object.assign({}, image, { previouslyLoaded: false });
        return newImage;
      });
      this.initImages();
      this.images.forEach((image: InternalLibImage) => {
        if (image.id === this.currentImage.id) {
          this.currentImage = image;
        }
      });
      this.changeDetectorRef.markForCheck();
    });
  }

  /**
   * Method ´ngOnInit´ to init images calling `initImages()`.
   * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called only one time!!!
   */
  ngOnInit(): void {
    this.idValidatorService.checkAndAdd(this.id);

    // id is a mandatory input and must a number > 0
    if ((!this.id && this.id !== 0) || this.id < 0) {
      throw new Error(
        `'[id]="a number >= 0"' is a mandatory input in angular-modal-gallery.` +
        `If you are using multiple instances of this library, please be sure to use different ids`
      );
    }

    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig || !libConfig.dotsConfig) {
      throw new Error('Internal library error - libConfig and dotsConfig must be defined');
    }

    this.dotsConfig = libConfig.dotsConfig;

    // call initImages to init images and to emit `hasData` event
    this.initImages();
    this.showModalGallery();
  }

  /**
   * Method called by custom upper buttons.
   * @param event ButtonEvent payload
   */
  onCustomEmit(event: ButtonEvent): void {
    const eventToEmit: ButtonEvent = this.getButtonEventToEmit(event);
    this.modalGalleryService.emitButtonBeforeHook(eventToEmit);
    this.modalGalleryService.emitButtonAfterHook(eventToEmit);
  }

  /**
   * Method called by the full-screen upper button.
   * @param ButtonEvent event payload
   */
  onFullScreen(event: ButtonEvent): void {
    const eventToEmit: ButtonEvent = this.getButtonEventToEmit(event);
    this.modalGalleryService.emitButtonBeforeHook(eventToEmit);

    // tslint:disable-next-line:no-any
    const doc: any = document as any;
    // tslint:disable-next-line:no-any
    const docEl: any = document.documentElement as any;

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

    this.modalGalleryService.emitButtonAfterHook(eventToEmit);
  }

  /**
   * Method called by the delete upper button.
   * @param ButtonEvent event payload
   */
  onDelete(event: ButtonEvent): void {
    const eventToEmit: ButtonEvent = this.getButtonEventToEmit(event);
    this.modalGalleryService.emitButtonBeforeHook(eventToEmit);

    if (this.images.length === 1) {
      this.closeGallery();
    }

    if (!this.currentImageComponent) {
      throw new Error('currentImageComponent must be defined');
    }

    const imageIndexToDelete: number = this.currentImageComponent.getIndexToDelete(event.image as InternalLibImage);
    if (imageIndexToDelete === this.images.length - 1) {
      // last image
      this.currentImageComponent.prevImage();
    } else {
      this.currentImageComponent.nextImage();
    }

    this.modalGalleryService.emitButtonAfterHook(eventToEmit);
  }

  /**
   * Method called by the navigate upper button.
   * @param ButtonEvent event payload
   */
  onNavigate(event: ButtonEvent): void {
    const eventToEmit: ButtonEvent = this.getButtonEventToEmit(event);
    this.modalGalleryService.emitButtonBeforeHook(eventToEmit);
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
          const newWindow: Window | null = window.open(eventToEmit.image.modal.extUrl, 'noopener,noreferrer,');
          // it returns null if the call failed, so I have to do this check
          if (newWindow) {
            newWindow.opener = null; // required to prevent security issues
            // emit only in case of success
            this.modalGalleryService.emitButtonAfterHook(eventToEmit);
          }
        } else {
          window.location.href = eventToEmit.image.modal.extUrl;
          // emit only in case of success
          this.modalGalleryService.emitButtonAfterHook(eventToEmit);
        }
      }
    }
  }

  /**
   * Method called by the download upper button.
   * @param ButtonEvent event payload
   */
  onDownload(event: ButtonEvent): void {
    const eventToEmit: ButtonEvent = this.getButtonEventToEmit(event);
    this.modalGalleryService.emitButtonBeforeHook(eventToEmit);
    this.downloadImage();
    this.modalGalleryService.emitButtonAfterHook(eventToEmit);
  }

  /**
   * Method called by the close upper button.
   * @param ButtonEvent event payload
   * @param Action action that triggered the close method. `Action.NORMAL` by default
   */
  onCloseGalleryButton(event: ButtonEvent, action: Action = Action.NORMAL): void {
    const eventToEmit: ButtonEvent = this.getButtonEventToEmit(event);
    this.modalGalleryService.emitButtonBeforeHook(eventToEmit);
    this.closeGallery(action, false);
    this.modalGalleryService.emitButtonAfterHook(eventToEmit);
  }

  onCloseGallery(event: ImageModalEvent, action: Action = Action.NORMAL): void {
    // remap ImageModalEvent to ButtonEvent
    const buttonEvent: ButtonEvent = {
      button: {
        type: ButtonType.CLOSE
      } as ButtonConfig,
      image: null,
      action: event.action,
      galleryId: event.galleryId
    };
    this.modalGalleryService.emitButtonBeforeHook(buttonEvent);
    this.closeGallery(action, false);
    this.modalGalleryService.emitButtonAfterHook(buttonEvent);
  }

  /**
   * Method to close the modal gallery specifying the action.
   * It also reset the `keyboardService` to prevent multiple listeners.
   * @param Action action type. `Action.NORMAL` by default
   * @param boolean isCalledByService is true if called by gallery.service, otherwise false
   */
  closeGallery(action: Action = Action.NORMAL, clickOutside: boolean = false, isCalledByService: boolean = false): void {
    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig) {
      throw new Error('Internal library error - libConfig must be defined');
    }

    this.modalGalleryService.emitClose(new ImageModalEvent(this.id, action, true));
    this.keyboardService.reset(libConfig);
    this.modalGalleryService.close(this.id, clickOutside);

    // TODO: check if this is really useful also with CDK. It causes some troubles when you try to close the gallery via close method
    // shows scrollbar
    // document.body.style.overflow = 'visible';

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
  onChangeCurrentImage(event: ImageModalEvent): void {
    const newIndex: number = event.result as number;
    if (newIndex < 0 || newIndex >= this.images.length) {
      return;
    }

    this.currentImage = this.images[newIndex];

    // emit first/last event based on newIndex value
    this.emitBoundaryEvent(event.action, newIndex);

    // emit current visible image index
    this.modalGalleryService.emitShow(new ImageModalEvent(this.id, event.action, newIndex + 1));
  }

  /**
   * Method called when you click 'outside' (i.e. on the semi-transparent background)
   * to close the modal gallery if `enableCloseOutside` is true.
   * @param boolean event payload. True to close the modal gallery, false otherwise
   */
  onClickOutside(event: boolean): void {
    if (event && this.enableCloseOutside) {
      this.closeGallery(Action.CLICK, true);
    }
  }

  /**
   * Method called when an image is loaded and the loading spinner has gone.
   * It sets the previouslyLoaded flag inside the Image to hide loading spinner when displayed again.
   * @param ImageLoadEvent event payload
   */
  onImageLoad(event: ImageLoadEvent): void {
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
  onClickDot(index: number): void {
    this.currentImage = this.images[index];
  }

  /**
   * Method called when an image preview is clicked and used to update the current image.
   * @param ImageModalEvent preview image
   */
  onClickPreview(event: ImageModalEvent): void {
    this.onChangeCurrentImage(event);
  }

  /**
   * Method to cleanup resources. In fact, this will reset keyboard's service.
   * This is an Angular's lifecycle hook that is called when this component is destroyed.
   */
  ngOnDestroy(): void {
    if (this.keyboardService) {
      const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
      if (this.id && libConfig) {
        this.keyboardService.reset(libConfig);
      }
    }
    if (this.updateImagesSubscription) {
      this.updateImagesSubscription.unsubscribe();
    }
    this.idValidatorService.remove(this.id);
  }

  /**
   * Method to show the modal gallery displaying the image with
   * the index specified as input parameter.
   * It will also register a new `keyboardService` to catch keyboard's events to download the current
   * image with keyboard's shortcuts. This service, will be removed either when modal gallery component
   * will be destroyed or when the gallery is closed invoking the `closeGallery` method.
   * @param number index of the image to show
   */
  private showModalGallery(): void {
    // TODO: check if this is really useful also with CDK. It causes some troubles when you try to close the gallery via close method
    // hides scrollbar
    // document.body.style.overflow = 'hidden';

    if (this.id === null || this.id === undefined) {
      throw new Error('Internal library error - id must be defined');
    }
    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig) {
      throw new Error('Internal library error - libConfig must be defined');
    }

    this.keyboardService.init(libConfig).then(() => {
      this.keyboardService.add((event: KeyboardEvent, combo: string) => {
        if (event.preventDefault) {
          event.preventDefault();
        } else {
          // internet explorer
          event.returnValue = false;
        }
        this.downloadImage();
      }, libConfig);

      const currentIndex: number = this.images.indexOf(this.currentImage);
      // emit a new ImageModalEvent with the index of the current image
      this.modalGalleryService.emitShow(new ImageModalEvent(this.id, Action.LOAD, currentIndex + 1));
      this.changeDetectorRef.markForCheck();
    });
  }

  /**
   * Method to download the current image, only if `downloadable` is true.
   * It contains also a logic to enable downloading features also for IE11.
   */
  private downloadImage(): void {
    if (this.id === null || this.id === undefined) {
      throw new Error('Internal library error - id must be defined');
    }
    const libConfig: LibConfig | undefined = this.configService.getConfig(this.id);
    if (!libConfig) {
      throw new Error('Internal library error - libConfig must be defined');
    }

    const currentImageConfig: CurrentImageConfig | undefined = libConfig.currentImageConfig;
    if (currentImageConfig && !currentImageConfig.downloadable) {
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
  private downloadImageAllBrowsers(): void {
    const link = document.createElement('a');
    let isBase64 = false;
    let img: string;
    // convert a SafeResourceUrl to a string
    if (typeof this.currentImage.modal.img === 'string') {
      img = this.currentImage.modal.img as string;
    } else {
      // if it's a SafeResourceUrl
      img = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.currentImage.modal.img) as string;
    }
    if (img.includes('data:image/') || img.includes(';base64,')) {
      const extension: string = img.replace('data:image/', '').split(';base64,')[0];
      const pureBase64: string = img.split(';base64,')[1];
      const blob: Blob = this.base64toBlob(pureBase64, 'image/' + extension);
      link.href = URL.createObjectURL(blob);
      isBase64 = true;
      link.setAttribute('download', this.getFileName(this.currentImage, isBase64, extension));
    } else {
      link.href = img;
      link.setAttribute('download', this.getFileName(this.currentImage, isBase64));
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Private method to download the current image only for IE11 using
   * custom javascript's methods available only on IE.
   */
  private downloadImageOnlyIEorEdge(): void {
    if (isPlatformBrowser(this.platformId)) {
      const req = new XMLHttpRequest();
      req.open('GET', this.currentImage.modal.img as string, true);
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
        return (image.modal.img as string).replace(/^.*[\\\/]/, '');
      }
    } else {
      return image.modal.downloadFileName;
    }
  }

  /**
   * Private method to initialize `images` as array of `Image`s.
   * Also, it will emit ImageowmodaModalEvent to say that images are loaded.
   */
  private initImages(): void {
    this.modalGalleryService.emitHasData(new ImageModalEvent(this.id, Action.LOAD, true));
    this.showGallery = this.images.length > 0;
  }

  /**
   * Private method to emit events when either the last or the first image are visible.
   * @param action Enum of type Action that represents the source of the event that changed the
   *  current image to the first one or the last one.
   * @param indexToCheck is the index number of the image (the first or the last one).
   */
  private emitBoundaryEvent(action: Action, indexToCheck: number): void {
    // to emit first/last event
    switch (indexToCheck) {
      case 0:
        this.modalGalleryService.emitFirstImage(new ImageModalEvent(this.id, action, true));
        break;
      case this.images.length - 1:
        this.modalGalleryService.emitLastImage(new ImageModalEvent(this.id, action, true));
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
  private isIEorEdge(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      // if both Blob constructor and msSaveOrOpenBlob are supported by the current browser
      return !!window.Blob && !!window.navigator.msSaveOrOpenBlob;
    }
    if (isPlatformServer(this.platformId)) {
      // server only
      return true;
    }
    return false;
  }
}
