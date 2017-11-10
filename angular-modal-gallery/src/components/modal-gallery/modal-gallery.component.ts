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

import { OnInit, Input, Output, EventEmitter, Component, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { ButtonsConfig, ButtonsStrategy } from '../../interfaces/buttons-config.interface';
import { Image, ImageModalEvent } from '../../interfaces/image.class';
import { Action } from '../../interfaces/action.enum';
import { Description } from '../../interfaces/description.interface';
import { KeyboardConfig } from '../../interfaces/keyboard-config.interface';
import { LoadingConfig, LoadingType } from '../../interfaces/loading-config.interface';
import { PreviewConfig } from '../../interfaces/preview-config.interface';
import { SlideConfig } from '../../interfaces/slide-config.interface';
import { AccessibilityConfig } from '../../interfaces/accessibility.interface';


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
  backgroundTitle: 'Modal gallery full screen background',

  modalGalleryContentAriaLabel: 'Modal gallery content',
  modalGalleryContentTitle: 'Modal gallery content',

  loadingSpinnerAriaLabel: 'The current image is loading. Please be patient.',
  loadingSpinnerTitle: 'The current image is loading. Please be patient.',

  mainContainerAriaLabel: 'Current image and navigation',
  mainContainerTitle: 'Current image and navigation',
  mainPrevImageAriaLabel: 'Previous image',
  mainPrevImageTitle: 'Previous image',
  mainNextImageAriaLabel: 'Next image',
  mainNextImageTitle: 'Next image',

  dotsContainerAriaLabel: 'Image navigation dots',
  dotsContainerTitle: 'Image navigation dots',
  dotAriaLabel: 'Navigate to image number',

  previewsContainerAriaLabel: 'Image previews',
  previewsContainerTitle: 'Image previews',
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
  templateUrl: 'modal-gallery.html'
})
export class ModalGalleryComponent implements OnInit, OnDestroy, OnChanges {
  /**
   * Array or Observable input that represents a list of Images used to show both
   * thumbs and the modal gallery.
   */
  @Input() modalImages: Observable<Array<Image>> | Array<Image>;
  // /**
  //  * Number to open the modal gallery (passing a value >=0) showing the image with the
  //  * imagePointer's index.
  //  *
  //  * Be careful, because this feature will be probably deprecated/changed in version 4.0.0
  //  */
  // @Input() imagePointer: number;
  /**
   * Boolean required to enable image download with both ctrl+s/cmd+s and download button.
   * If you want to show enable button, this is not enough. You have to use also `buttonsConfig`.
   */
  @Input() downloadable = false;

  /**
   * Object of type `ButtonsConfig` to show/hide buttons.
   * This is used only inside `ngOnInit()` to create `configButtons`
   */
  @Input() buttonsConfig: ButtonsConfig = {strategy: ButtonsStrategy.DEFAULT};
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
   */
  @Input() slideConfig: SlideConfig = {
    infinite: false,
    sidePreviews: {show: true, width: 100, height: 100, unit: 'px'}
  }; // TODO disable previews

  /**
   * Description object with the configuration to show image descriptions.
   */
  @Input() description: Description;

  @Input() loadingConfig: LoadingConfig = {enable: true, type: LoadingType.STANDARD};

  @Input() previewConfig: PreviewConfig = {
    number: 3, arrows: true, clickable: true,
    alwaysCenter: false, size: {width: 90, height: 90, unit: 'px'}
  };

  @Input() accessibilityConfig: AccessibilityConfig = defaultAccessibilityConfig;

  @Output() close: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();
  @Output() show: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();
  @Output() firstImage: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();
  @Output() lastImage: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();
  @Output() hasData: EventEmitter<ImageModalEvent> = new EventEmitter<ImageModalEvent>();

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
   * Object of type `ButtonsConfig` used to configure buttons visibility. This is a temporary value
   * initialized by the real `buttonsConfig`'s input
   */
  // configButtons: ButtonsConfig;

  /**
   * When you pass an Observable of `Image`s as `modalImages`, you have to subscribe to that
   * Observable. So, to prevent memory leaks, you must store the subscription and call `unsubscribe` in
   * OnDestroy.
   */
  private subscription: Subscription;

  /**
   * Method ´ngOnInit´ to build `configButtons` and to call `initImages()`.
   * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
   * In particular, it's called only one time!!!
   */
  ngOnInit() {
    // build configButtons to use it inside upper-buttons
    // this.configButtons = {
    //   download: this.buttonsConfig && this.buttonsConfig.download,
    //   extUrl: this.buttonsConfig && this.buttonsConfig.extUrl,
    //   close: this.buttonsConfig && this.buttonsConfig.close
    // };

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
    // to prevent errors when you pass to this library
    // the array of images inside a subscribe block, in this way: `...subscribe(val => { this.images = arrayOfImages })`
    // As you can see, I'm providing examples in these situations in all official demos
    if (this.modalImages) {
      // I pass `false` as parameter, because I DON'T want to emit `hasData`
      // event (preventing multiple hasData events while initializing)
      this.initImages(false);
    }
  }


  onRefresh(event: boolean, action: Action = Action.NORMAL) {
    console.log('on refresh', action);
  }

  onDelete(event: boolean, action: Action = Action.NORMAL) {
    console.log('on delete', action);
  }

  onNavigate(extUrl: string, action: Action = Action.NORMAL) {
    console.log('on navigate', action);
    window.location.href = extUrl;
  }

  // /**
  //  * Method `closeGallery` to close the modal gallery.
  //  * @param action Enum of type `Action` that represents the source
  //  *  action that closed the modal gallery. NORMAL by default.
  //  */
  onCloseGallery(event: boolean, action: Action = Action.NORMAL) {
    this.closeGallery(action);
  }

  closeGallery(action: Action = Action.NORMAL) {
    this.close.emit(new ImageModalEvent(action, true));
    this.opened = false;
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
    this.opened = true;
    this.currentImage = this.images[index];

    // emit current visible image index
    this.show.emit(new ImageModalEvent(Action.LOAD, index + 1));
  }


  onChangeCurrentImage(event: ImageModalEvent) {
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

  // FIXME experimental
  onDownload(event: Event) {
    console.log('onDownload triggered');
  }


  /**
   * Method `ngOnDestroy` to cleanup resources. In fact, this will unsubscribe
   * all subscriptions and it will reset keyboard's service.
   */
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Private method ´initImages´ to initialize `images` as array of `Image` or as an
   * Observable of `Array<Image>`. Also, it will call completeInitialization.
   * @param emitHasDataEvent boolean to emit `hasData` event while initializing `angular-modal-gallery`.
   *  Use this parameter to prevent multiple `hasData` events.
   */
  private initImages(emitHasDataEvent: boolean = false) {
    if (this.modalImages instanceof Array) {
      this.images = <Array<InternalLibImage>>this.modalImages;
      this.completeInitialization(emitHasDataEvent);
    } else {
      if (this.modalImages instanceof Observable) {
        this.subscription = (<Observable<Array<Image>>>this.modalImages).subscribe((val: Array<Image>) => {
          this.images = <Array<InternalLibImage>>val;
          this.completeInitialization(emitHasDataEvent);
        });
      }
    }
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
    this.showGallery = true;
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

}
