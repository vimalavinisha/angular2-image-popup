import { OnInit, EventEmitter } from '@angular/core';
export declare class AngularModalGallery implements OnInit {
    opened: boolean;
    imgSrc: string;
    currentImageIndex: number;
    loading: boolean;
    showRepeat: boolean;
    modalImages: any;
    imagePointer: number;
    cancelEvent: EventEmitter<any>;
    onKeyDown(e: any): void;
    ngOnInit(): void;
    closeGallery(): void;
    prevImage(): void;
    nextImage(): void;
    openGallery(index: number): void;
    private nextIndex(index);
    private prevIndex(index);
}
