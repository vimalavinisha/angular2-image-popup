import { EventEmitter } from '@angular/core';
import { Image } from './modal-gallery.component';
/**
 * Component with the gallery of thumbs.
 * In receives an array of Images and a boolean to show/hide
 * the gallery (feature used by imagePointer).
 * Also it emits click events as outputs.
 */
export declare class GalleryComponent {
    images: Image[];
    showGallery: boolean;
    show: EventEmitter<number>;
    showModalGallery(index: number): void;
    /**
     * Method to get `alt attribute`.
     * `alt` specifies an alternate text for an image, if the image cannot be displayed.
     * There is a similar version of this method into `modal-gallery.component.ts` that
     * receives an Image as input.
     * @param index Number that represents the image index.
     */
    getAltDescriptionByIndex(index: number): string;
}
