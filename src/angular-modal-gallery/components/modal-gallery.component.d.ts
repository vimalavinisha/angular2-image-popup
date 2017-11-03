import { OnInit, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { KeyboardService } from '../services/keyboard.service';
import { ButtonsConfig } from '../interfaces/buttons-config.interface';
/**
 * Enum `Action` with a list of possible actions.
 */
export declare enum Action {
    NORMAL = 0,
    CLICK = 1,
    KEYBOARD = 2,
    SWIPE = 3,
    LOAD = 4,
}
/**
 * Class `ImageModalEvent` that represents the Event after an action `action` and its result.
 */
export declare class ImageModalEvent {
    action: Action;
    result: number | boolean;
    constructor(action: Action, result: number | boolean);
}
/**
 * Class `Image` that represents an Image with both images and thumb paths,
 * also with a description and an external url.
 * The only required value is the image path `img`.
 */
export declare class Image {
    img: string;
    thumb?: string | null | undefined;
    description?: string | null | undefined;
    extUrl?: string | null | undefined;
    constructor(img: string, thumb?: string | null | undefined, description?: string | null | undefined, extUrl?: string | null | undefined);
}
/**
 * Enum `Keyboard` with keys and their relative key codes.
 */
export declare enum Keyboard {
    ESC = 27,
    LEFT_ARROW = 37,
    RIGHT_ARROW = 39,
    UP_ARROW = 38,
    DOWN_ARROW = 40,
}
/**
 * Interface `Description` to change the description, either with a full custom
 * description or with a small and simple customization.
 */
export interface Description {
    customFullDescription?: string;
    imageText?: string;
    numberSeparator?: string;
    beforeTextDescription?: string;
}
/**
 * Interface `KeyboardConfig` to assign custom keyCodes to ESC, RIGHT and LEFT keyboard's actions.
 */
export interface KeyboardConfig {
    esc?: number;
    right?: number;
    left?: number;
}
/**
 * Interface `SlideConfig` to configure sliding features of modal gallery.
 */
export interface SlideConfig {
    infinite?: boolean;
}
/**
 * Main Component of this library with the modal gallery.
 */
export declare class AngularModalGalleryComponent implements OnInit, OnDestroy, OnChanges {
    private keyboardService;
    /**
     * Array or Observable input that represents a list of Images used to show both
     * thumbs and the modal gallery.
     */
    modalImages: Observable<Array<Image>> | Array<Image>;
    /**
     * Number to open the modal gallery (passing a value >=0) showing the image with the
     * imagePointer's index.
     *
     * Be careful, because this feature will be probably deprecated/changed in version 4.0.0
     */
    imagePointer: number;
    /**
     * Boolean required to enable image download with both ctrl+s/cmd+s and download button.
     * If you want to show enable button, this is not enough. You have to use also `buttonsConfig`.
     */
    downloadable: boolean;
    /**
     * Description object with the configuration to show image descriptions.
     */
    description: Description;
    /**
     * Object of type `ButtonsConfig` to show/hide buttons.
     * This is used only inside `ngOnInit()` to create `configButtons`
     */
    buttonsConfig: ButtonsConfig;
    /**
     * Object of type `KeyboardConfig` to assign custom keys to ESC, RIGHT and LEFT keyboard's actions.
     */
    keyboardConfig: KeyboardConfig;
    /**
     * enableCloseOutside's input to enable modal-gallery close's behaviour while clicking
     * on the semi-transparent background. Disabled by default.
     */
    enableCloseOutside: boolean;
    /**
     * Object of type `SlideConfig` to configure sliding of modal gallery.
     */
    slideConfig: SlideConfig;
    /**
     * DEPRECATED
     * -----REMOVE THIS IN 4.0.0----- deprecated both showDownloadButton and showExtUrlButton
     */
    showDownloadButton: boolean;
    /**
     * DEPRECATED
     * -----REMOVE THIS IN 4.0.0----- deprecated both showDownloadButton and showExtUrlButton
     */
    showExtUrlButton: boolean;
    close: EventEmitter<ImageModalEvent>;
    show: EventEmitter<ImageModalEvent>;
    firstImage: EventEmitter<ImageModalEvent>;
    lastImage: EventEmitter<ImageModalEvent>;
    hasData: EventEmitter<ImageModalEvent>;
    /**
     * Boolean that it is true if the modal gallery is visible
     */
    opened: boolean;
    /**
     * Boolean that it is true if an image of the modal gallery is still loading
     */
    loading: boolean;
    /**
     * Boolean to open the modal gallery. Closed by default.
     */
    showGallery: boolean;
    /**
     * Array of `Image` that represent the model of this library with all images, thumbs and so on.
     */
    images: Image[];
    /**
     * `Image` currently visible.
     */
    currentImage: Image;
    /**
     * Number that represents the index of the current image.
     */
    currentImageIndex: number;
    /**
     * Object of type `ButtonsConfig` used to configure buttons visibility. This is a temporary value
     * initialized by the real `buttonsConfig`'s input
     */
    configButtons: ButtonsConfig;
    /**
     * Enum of type `Action` used to pass a click action when you click on the modal image.
     * Declared here to be used inside the template.
     */
    clickAction: Action;
    /**
     * Boolean that it's true when you are watching the first image (currently visible).
     */
    isFirstImage: boolean;
    /**
     * Boolean that it's true when you are watching the last image (currently visible).
     */
    isLastImage: boolean;
    /**
     * Private SWIPE_ACTION to define all swipe actions used by hammerjs.
     */
    private SWIPE_ACTION;
    /**
     * When you pass an Observable of `Image`s as `modalImages`, you have to subscribe to that
     * Observable. So, to prevent memory leaks, you must store the subscription and call `unsubscribe` in
     * OnDestroy.
     */
    private subscription;
    /**
     * Listener to catch keyboard's events and call the right method based on the key.
     * For instance, pressing esc, this will call `closeGallery(Action.KEYBOARD)` and so on.
     * If you passed a valid `keyboardConfig` esc, right and left buttons will be customized based on your data.
     * @param e KeyboardEvent caught by the listener.
     */
    onKeyDown(e: KeyboardEvent): void;
    /**
     * Constructor with the injection of ´KeyboardService´ that initialize some description fields
     * based on default values.
     */
    constructor(keyboardService: KeyboardService);
    /**
     * Method ´ngOnInit´ to build `configButtons` and to call `initImages()`.
     * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
     * In particular, it's called only one time!!!
     */
    ngOnInit(): void;
    /**
     * Method ´ngOnChanges´ to init images preventing errors.
     * This is an Angular's lifecycle hook, so its called automatically by Angular itself.
     * In particular, it's called before `ngOnInit()` and whenever one or more data-bound input properties change.
     * @param changes `SimpleChanges` object of current and previous property values provided by Angular.
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * Method `getDescriptionToDisplay` to get the image description based on input params.
     * If you provide a full description this will be the visible description, otherwise,
     * it will be built using the `description` object, concatenating its fields.
     * @returns String description to display.
     */
    getDescriptionToDisplay(): string;
    /**
     * Method `swipe` used by Hammerjs to support touch gestures.
     * @param index Number that represent the current visible index
     * @param action String that represent the direction of the swipe action. 'swiperight' by default.
     */
    swipe(index: number, action?: string): void;
    /**
     * Method `closeGallery` to close the modal gallery.
     * @param action Enum of type `Action` that represents the source
     *  action that closed the modal gallery. NORMAL by default.
     */
    closeGallery(action?: Action): void;
    /**
     * Method `prevImage` to go back to the previous image shown into the modal gallery.
     * @param action Enum of type `Action` that represents the source
     *  action that moved back to the previous image. NORMAL by default.
     */
    prevImage(action?: Action): void;
    /**
     * Method `nextImage` to go back to the previous image shown into the modal gallery.
     * @param action Enum of type `Action` that represents the source
     *  action that moved to the next image. NORMAL by default.
     */
    nextImage(action?: Action): void;
    /**
     * Method `onShowModalGallery` called when you click on an image of your gallery.
     * The input index is the index of the clicked image thumb.
     * @param index Number that represents the index of the clicked image.
     */
    onShowModalGallery(index: number): void;
    /**
     * Method `showModalGallery` to show the modal gallery displaying the image with
     * the index specified as input parameter.
     * It will also register a new `keyboardService` to catch keyboard's events to download the current
     * image with keyboard's shortcuts. This service, will be removed when modal gallery component will be destroyed.
     * @param index Number that represents the index of the image to show.
     */
    showModalGallery(index: number): void;
    /**
     * Method `downloadImage` to download the current visible image, only if `downloadable` is true.
     * For IE, this will navigate to the image instead of a direct download as in all modern browsers.
     */
    downloadImage(): void;
    /**
     * Method `onClickOutside` to close modal gallery when both `enableCloseOutside` is true and user
     * clicked on the semi-transparent background around the image.
     * @param event Boolean that is true if user clicked on the semi-transparent background, false otherwise.
     */
    onClickOutside(event: boolean): void;
    /**
     * Method to get `alt attribute`.
     * `alt` specifies an alternate text for an image, if the image cannot be displayed.
     * There is a similar version of this method into `gallery.component.ts` that
     * receives the image index as input.
     * @param currentImage Image that represents the current visible image.
     */
    getAltDescriptionByImage(currentImage: Image): string;
    /**
     * Method `ngOnDestroy` to cleanup resources. In fact, this will unsubscribe
     * all subscriptions and it will reset keyboard's service.
     */
    ngOnDestroy(): void;
    /**
     * Private method `getNextIndex` to get the next index, based on the action and the current index.
     * This is necessary because at the end, when you call next again, you'll go to the first image.
     * That happens because all modal images are shown like in a circle.
     * @param action Enum of type Action that represents the source of the event that changed the
     *  current image to the next one.
     * @param currentIndex Number that represents the current index of the visible image.
     */
    private getNextIndex(action, currentIndex);
    /**
     * Private method `getPrevIndex` to get the previous index, based on the action and the current index.
     * This is necessary because at index 0, when you call prev again, you'll go to the last image.
     * That happens because all modal images are shown like in a circle.
     * @param action Enum of type Action that represents the source of the event that changed the
     *  current image to the previous one.
     * @param currentIndex Number that represents the current index of the visible image.
     */
    private getPrevIndex(action, currentIndex);
    /**
     * Private method ´initImages´ to initialize `images` as array of `Image` or as an
     * Observable of `Array<Image>`. Also, it will call completeInitialization.
     * @param emitHasDataEvent boolean to emit `hasData` event while initializing `angular-modal-gallery`.
     *  Use this parameter to prevent multiple `hasData` events.
     */
    private initImages(emitHasDataEvent?);
    /**
     * Private method ´completeInitialization´ to emit ImageModalEvent to say that images are loaded. If you are
     * using imagePointer feature, it will also call showModalGallery with imagePointer as parameter.
     * @param emitHasDataEvent boolean to emit `hasData` event while initializing `angular-modal-gallery`.
     *  Use this parameter to prevent multiple `hasData` events.
     */
    private completeInitialization(emitHasDataEvent);
    /**
     * Private method `emitBoundaryEvent` to emit events when either the last or the first image are visible.
     * @param action Enum of type Action that represents the source of the event that changed the
     *  current image to the first one or the last one.
     * @param indexToCheck Number of type Action that represents the source of the event that changed the
     *  current image to either the first or the last one.
     */
    private emitBoundaryEvent(action, indexToCheck);
    /**
     * Method `getFileName` to get the filename from an input path.
     * This is used to get the image's name from its path.
     * @param path String that represents the path of the image.
     */
    private getFileName(path);
    /**
     * Method `manageSlideConfig` to manage boundary arrows and sliding.
     * This is based on @Input() slideConfig to enable/disable 'infinite sliding'.
     * @param {number} index Number of the current visile image
     */
    private manageSlideConfig(index);
    /**
     * Method `isPreventSliding` to check if next/prev actions should be blocked.
     * It checks if slideConfig.infinite === false and if the image index is equals to the input parameter.
     * If yes, it returns true to say that sliding should be blocked, otherwise not.
     * @param {number} boundaryIndex Number that could be either the beginning index (0) or the last index
     *  of images (this.images.length - 1).
     * @returns {boolean} True if slideConfig.infinite === false and the current index is
     *  either the first or the last one.
     */
    private isPreventSliding(boundaryIndex);
}
