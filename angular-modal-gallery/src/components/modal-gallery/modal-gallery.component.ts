/*
 The MIT License (MIT)

 Copyright (c) 2017 Stefano Cappa (Ks89)
 Copyright (c) 2016 vimalavinisha (only for version 1)

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
  OnInit, Input, Output, EventEmitter, Component, OnDestroy,
  OnChanges, SimpleChanges, PLATFORM_ID, Inject, ViewChild
} from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { ButtonEvent, ButtonsConfig } from '../../interfaces/buttons-config.interface';
import { Image, ImageModalEvent } from '../../interfaces/image.class';
import { Action } from '../../interfaces/action.enum';
import { Description } from '../../interfaces/description.interface';
import { KeyboardConfig } from '../../interfaces/keyboard-config.interface';
import { LoadingConfig } from '../../interfaces/loading-config.interface';
import { PreviewConfig } from '../../interfaces/preview-config.interface';
import { SlideConfig } from '../../interfaces/slide-config.interface';
import { AccessibilityConfig } from '../../interfaces/accessibility.interface';
import { KeyboardService } from '../../services/keyboard.service';
import { DotsConfig } from '../../interfaces/dots-config.interface';
import { CurrentImageComponent } from '../current-image/current-image.component';


export class InternalLibImage extends Image {
  previouslyLoaded: boolean;

  constructor(id: number | string,
              img: string,
              thumb?: string | null | undefined,
              description?: string | null | undefined,
              extUrl?: string | null | undefined,
              title?: string | null | undefined,
              alt?: string | null | undefined,
              ariaLabel?: string | null | undefined,
              previouslyLoaded: boolean = false) {
    super(id, img, thumb, description, extUrl, title, alt, ariaLabel);

    this.previouslyLoaded = previouslyLoaded;
  }
}

const defaultAccessibilityConfig: AccessibilityConfig = {
  backgroundAriaLabel: 'Modal gallery full screen background',
  backgroundTitle: '',

  modalGalleryContentAriaLabel: 'Modal gallery content',
  modalGalleryContentTitle: '',

  loadingSpinnerAriaLabel: 'The current image is loading. Please be patient.',
  loadingSpinnerTitle: 'The current image is loading. Please be patient.',

  mainContainerAriaLabel: 'Current image and navigation',
  mainContainerTitle: '',
  mainPrevImageAriaLabel: 'Previous image',
  mainPrevImageTitle: 'Previous image',
  mainNextImageAriaLabel: 'Next image',
  mainNextImageTitle: 'Next image',

  dotsContainerAriaLabel: 'Image navigation dots',
  dotsContainerTitle: '',
  dotAriaLabel: 'Navigate to image number',

  previewsContainerAriaLabel: 'Image previews',
  previewsContainerTitle: '',
  previewScrollPrevAriaLabel: 'Scroll previous previews',
  previewScrollPrevTitle: 'Scroll previous previews',
  previewScrollNextAriaLabel: 'Scroll next previews',
  previewScrollNextTitle: 'Scroll next previews'
};


/**
 * Main Component of this library with the modal gallery.
 */
@Component({
  selector: 'ks-modal-gallery',
  exportAs: 'modalGallery',
  styleUrls: ['modal-gallery.scss'],
  templateUrl: 'modal-gallery.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalGalleryComponent implements OnInit, OnDestroy, OnChanges {
  /**
   * Array input that represents a list of Images used to show both
   * thumbs and the modal gallery.
   */
  @Input() modalImages: Image[];
  /**
   * Boolean required to enable image download with both ctrl+s/cmd+s and download button.
   * If you want to show enable button, this is not enough. You have to use also `buttonsConfig`.
   */
  @Input() downloadable = false;

  /**
   * Object of type `ButtonsConfig` to show/hide buttons.
   * This is used only inside `ngOnInit()` to create `configButtons`
   */
  @Input() buttonsConfig: ButtonsConfig;
  /**
   * Object of type `KeyboardConfig` to assign custom keys to ESC, RIGHT and LEFT keyboard's actions.
   */
  @Input() keyboardConfig: KeyboardConfig;
  /**
   * enableCloseOutside's input to enable modal-gallery close's behaviour while clicking
   * on the semi-transparent background. Enabled by default.
   */
  @Input() enableCloseOutside = true;

  /**
   * Object of type `SlideConfig` to configure sliding of modal gallery.
   * Disabled by default.
   * Leave here the default values because it's used by two sibling components.
   */
  @Input() slideConfig: SlideConfig = {
    infinite: false,
    sidePreviews: {show: true, width: 100, height: 100, unit: 'px'}
  };

  /**
   * Description object with the configuration to show image descriptions.
   */
  @Input() description: Description;

  @Input() loadingConfig: LoadingConfig;

  @Input() dotsConfig: DotsConfig;

  @Input() previewConfig: PreviewConfig;

  @Input() accessibilityConfig: AccessibilityConfig = defaultAccessibilityConfig;

  @Output() close: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();
  @Output() show: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();
  @Output() firstImage: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();
  @Output() lastImage: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();
  @Output() hasData: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();
  @Output() buttonBeforeHook: EventEmitter<ButtonEvent> = new EventEmitter<ButtonEvent>();
  @Output() buttonAfterHook: EventEmitter<ButtonEvent> = new EventEmitter<ButtonEvent>();


  @ViewChild(CurrentImageComponent) currentImageComponent;

  /**
   * Boolean that it is true if the modal gallery is visible
   */
  opened = false;
  /**
   * Boolean to open the modal gallery. Closed by default.
   */
  showGallery = false;
  /**
   * Array of `InternalLibImage` that represent the model of this library with all images, thumbs and so on.
   */
  images: InternalLibImage[];
  /**
   * `Image` currently visible.
   */
  currentImage: InternalLibImage;

  /**
   * Constructor with the injection of ´KeyboardService´
   */
  constructor(private keyboardService: KeyboardService,
              @Inject(PLATFORM_ID) private platformId: Object) {
  }

  /**
   * Method ´ngOnInit´ to build `configButtons` and to call `initImages()`.
   * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called only one time!!!
   */
  ngOnInit() {
    // call initImages passing true as parameter, because I want to emit `hasData` event
    this.initImages(true);
  }

  /**
   * Method ´ngOnChanges´ to init images preventing errors.
   * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called before `ngOnInit()` and whenever one or more data-bound input properties change.
   * @param changes `SimpleChanges` object of current and previous property values provided by Angular.
   */
  ngOnChanges(changes: SimpleChanges) {
    // TODO probably I should check changes.something
    // to prevent errors when you pass to this library
    // the array of images inside a subscribe block, in this way: `...subscribe(val => { this.images = arrayOfImages })`
    // As you can see, I'm providing examples in these situations in all official demos
    if (this.modalImages) {
      // I pass `false` as parameter, because I DON'T want to emit `hasData`
      // event (preventing multiple hasData events while initializing)
      this.initImages(false);
    }
  }

  onCustomEmit(event: ButtonEvent) {
    const eventToEmit: ButtonEvent = this.getButtonEventToEmit(event);
    this.buttonBeforeHook.emit(eventToEmit);
    console.log('on onCustomEmit', eventToEmit);
    this.buttonAfterHook.emit(eventToEmit);
  }

  // TODO implement on refresh
  onRefresh(event: ButtonEvent) {
    const eventToEmit: ButtonEvent = this.getButtonEventToEmit(event);

    this.buttonBeforeHook.emit(eventToEmit);
    console.log('TODO implement on refresh inside the library', eventToEmit);

    this.currentImage = Object.assign({}, this.currentImage, {previouslyLoaded: false});

    // TODO add logic to hide and show the current image

    this.buttonAfterHook.emit(eventToEmit);
  }

  onDelete(event: ButtonEvent) {
    const eventToEmit: ButtonEvent = this.getButtonEventToEmit(event);

    const imageIndexToDelete: number = this.currentImageComponent.getIndex(event.image);

    console.log('ondelete - imageIndexToDelete: ' + imageIndexToDelete);

    this.buttonBeforeHook.emit(eventToEmit);
    console.log('TODO implement on delete in this example outside of this library', eventToEmit);

    console.log('----------- this.images.length ' + this.images.length);
    if (this.images.length === 1) {
      this.closeGallery();
    }

    if (imageIndexToDelete === this.images.length - 1) {
      // last image
      this.currentImageComponent.prevImage();
    } else {
      this.currentImageComponent.nextImage();
    }

    this.buttonAfterHook.emit(eventToEmit);
  }

  onNavigate(event: ButtonEvent) {
    const eventToEmit: ButtonEvent = this.getButtonEventToEmit(event);

    this.buttonBeforeHook.emit(eventToEmit);
    console.log('on navigate', eventToEmit);
    // To support SSR
    if (isPlatformBrowser(this.platformId)) {
      // Client only code
      if (eventToEmit.image) {
        window.location.href = eventToEmit.image.extUrl;
      }
    }
    this.buttonAfterHook.emit(eventToEmit);
  }

  onDownload(event: ButtonEvent) {
    const eventToEmit: ButtonEvent = this.getButtonEventToEmit(event);

    this.buttonBeforeHook.emit(eventToEmit);
    console.log('on download', eventToEmit);
    this.downloadImage();
    this.buttonAfterHook.emit(eventToEmit);
  }

  // /**
  //  * Method `closeGallery` to close the modal gallery.
  //  * @param action Enum of type `Action` that represents the source
  //  *  action that closed the modal gallery. NORMAL by default.
  //  */
  onCloseGallery(event: ButtonEvent, action: Action = Action.NORMAL) {
    const eventToEmit: ButtonEvent = this.getButtonEventToEmit(event);

    this.buttonBeforeHook.emit(eventToEmit);
    console.log('on close', eventToEmit);
    this.closeGallery(action);
    this.buttonAfterHook.emit(eventToEmit);
  }

  closeGallery(action: Action = Action.NORMAL) {
    this.close.emit(new ImageModalEvent(action, true));
    this.opened = false;
    this.keyboardService.reset();
  }

  /**
   * Method `onShowModalGallery` called when you click on an image of your gallery.
   * The input index is the index of the clicked image thumb.
   * @param index Number that represents the index of the clicked image.
   */
  onShowModalGallery(index: number) {
    this.showModalGallery(index);
  }

  /**
   * Method `showModalGallery` to show the modal gallery displaying the image with
   * the index specified as input parameter.
   * It will also register a new `keyboardService` to catch keyboard's events to download the current
   * image with keyboard's shortcuts. This service, will be removed when modal gallery component will be destroyed.
   * @param index Number that represents the index of the image to show.
   */
  showModalGallery(index: number) {
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

    // emit current visible image index
    this.show.emit(new ImageModalEvent(Action.LOAD, index + 1));
  }


  onChangeCurrentImage(event: ImageModalEvent) {
    console.log('modal-gallery.component onChangeCurrentImage');
    const newIndex: number = <number>event.result;

    // TODO add validation

    this.currentImage = this.images[newIndex];
    this.emitBoundaryEvent(event.action, newIndex);
  }

  /**
   * Method `onClickOutside` to close modal gallery when both `enableCloseOutside` is true and user
   * clicked on the semi-transparent background around the image.
   * @param event Boolean that is true if user clicked on the semi-transparent background, false otherwise.
   */
  onClickOutside(event: boolean) {
    if (event && this.enableCloseOutside) {
      this.closeGallery(Action.CLICK);
    }
  }

  onImageLoad(result: any) {
    // sets as previously loaded the image with index specified by `result.index`
    (this.images[result.index]).previouslyLoaded = result.status;
  }

  onClickDot(index: number) {
    this.currentImage = this.images[index];
  }

  onClickPreview(preview: Image) {
    console.log('modalgallery click preview with id: ' + preview.id);
    this.currentImage = this.images.find((img: InternalLibImage) => img.id === preview.id);
  }

  /**
   * Method `downloadImage` to download the current visible image, only if `downloadable` is true.
   */
  downloadImage() {
    console.log('downloadImage called with downloadImage: ' + this.downloadable);
    if (!this.downloadable) {
      return;
    }
    // If IE11 or Microsoft Edge use msSaveBlob(...)
    if (this.isIEorEdge()) {
      // I cannot use fetch API because IE11 doesn't support it,
      // so I have to switch to XMLHttpRequest
      this.downloadImageOnlyIEorEdge();
    } else {
      console.log('downloadImageAllBrowsers');
      // for all other browsers
      this.downloadImageAllBrowsers();
    }
  }

  private downloadImageAllBrowsers() {
    console.log('downloading...');
    const link = document.createElement('a');
    link.href = this.currentImage.img;
    link.setAttribute('download', this.getFileName(this.currentImage.img));
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private downloadImageOnlyIEorEdge() {
    if (isPlatformBrowser(this.platformId)) {
      const req = new XMLHttpRequest();
      req.open('GET', this.currentImage.img, true);
      req.responseType = 'arraybuffer';
      req.onload = event => {
        const blob = new Blob([req.response], {type: 'image/png'});
        window.navigator.msSaveBlob(blob, this.getFileName(this.currentImage.img));
      };
      req.send();
    }
  }

  /**
   * Method `ngOnDestroy` to cleanup resources. In fact, this will reset keyboard's service.
   */
  ngOnDestroy() {
    this.keyboardService.reset();
  }

  // add other info to ButtonImage, for instance the current image as payload
  private getButtonEventToEmit(event: ButtonEvent) {
    return Object.assign(event, {image: this.currentImage});
  }

  /**
   * Method `getFileName` to get the filename from an input path.
   * This is used to get the image's name from its path.
   * @param path String that represents the path of the image.
   */
  private getFileName(path: string): string {
    return path.replace(/^.*[\\\/]/, '');
  }

  /**
   * Private method ´initImages´ to initialize `images` as array of `Image` or as an
   * Observable of `Image[]`. Also, it will call completeInitialization.
   * @param emitHasDataEvent boolean to emit `hasData` event while initializing `angular-modal-gallery`.
   *  Use this parameter to prevent multiple `hasData` events.
   */
  private initImages(emitHasDataEvent: boolean = false) {
    // if (this.modalImages instanceof Array) {
    this.images = <InternalLibImage[]>this.modalImages;
    this.completeInitialization(emitHasDataEvent);
    // } else {
    //   if (this.modalImages instanceof Observable) {
    //     this.subscription = (<Observable<Image[]>>this.modalImages).subscribe((val: Image[]) => {
    //       this.images = <InternalLibImage[]>val;
    //       this.completeInitialization(emitHasDataEvent);
    //     });
    //   }
    // }
  }

  /**
   * Private method ´completeInitialization´ to emit ImageModalEvent to say that images are loaded. If you are
   * using imagePointer feature, it will also call showModalGallery with imagePointer as parameter.
   * @param emitHasDataEvent boolean to emit `hasData` event while initializing `angular-modal-gallery`.
   *  Use this parameter to prevent multiple `hasData` events.
   */
  private completeInitialization(emitHasDataEvent: boolean) {
    if (emitHasDataEvent) {
      // this will prevent multiple emissions if called from both ngOnInit and ngOnChanges
      this.hasData.emit(new ImageModalEvent(Action.LOAD, true));
    }
    // this.loading = false;
    // if (this.imagePointer >= 0) {
    //   this.showGallery = false;
    //   this.showModalGallery(this.imagePointer);
    // } else {

    this.showGallery = this.images.length > 0;
    // }
  }

  /**
   * Private method `emitBoundaryEvent` to emit events when either the last or the first image are visible.
   * @param action Enum of type Action that represents the source of the event that changed the
   *  current image to the first one or the last one.
   * @param indexToCheck Number of type Action that represents the source of the event that changed the
   *  current image to either the first or the last one.
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

  // taken from https://msdn.microsoft.com/it-it/library/hh779016(v=vs.85).aspx
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
