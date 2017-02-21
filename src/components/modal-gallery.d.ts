import { OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { Observable } from "rxjs";
import 'rxjs/add/operator/elementAt';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/share';
import 'mousetrap';
export declare enum Action {
    NORMAL = 0,
    CLICK = 1,
    KEYBOARD = 2,
    SWIPE = 3,
    LOAD = 4,
}
export declare class ImageModalEvent {
    action: Action;
    result: number | boolean;
    constructor(action: Action, result: number | boolean);
}
export declare class Image {
    thumb: string;
    img: string;
    description: string;
    constructor(thumb: string, img: string, description: string);
}
export declare enum Keyboard {
    ESC = 27,
    LEFT_ARROW = 37,
    RIGHT_ARROW = 39,
    UP_ARROW = 38,
    DOWN_ARROW = 40,
}
export declare class AngularModalGallery implements OnInit, OnDestroy {
    opened: boolean;
    loading: boolean;
    showGallery: boolean;
    images: Image[];
    currentImage: Image;
    currentImageIndex: number;
    clickAction: Action;
    private SWIPE_ACTION;
    private subscription;
    modalImages: Observable<Array<Image>> | Array<Image>;
    imagePointer: number;
    showDownloadButton: boolean;
    isClosed: EventEmitter<ImageModalEvent>;
    visibleIndex: EventEmitter<ImageModalEvent>;
    isFirstImage: EventEmitter<ImageModalEvent>;
    isLastImage: EventEmitter<ImageModalEvent>;
    isImagesLoaded: EventEmitter<ImageModalEvent>;
    onKeyDown(e: KeyboardEvent): void;
    constructor();
    ngOnInit(): void;
    private initImages();
    swipe(index: number, action?: string): void;
    closeGallery(action?: Action): void;
    prevImage(action?: Action): void;
    nextImage(action?: Action): void;
    showModalGallery(index: number): void;
    downloadImage(image: Image): void;
    private getNextIndex(action, currentIndex);
    private getPrevIndex(action, currentIndex);
    private emitBoundaryEvent(action, indexToCheck);
    private getFileName(path);
    ngOnDestroy(): void;
}
