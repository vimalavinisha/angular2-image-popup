import { EventEmitter } from '@angular/core';
import { Image } from './modal-gallery.component';
import { ButtonsConfig } from '../interfaces/buttons-config.interface';
/**
 * Component with all upper right buttons.
 * In fact, it uses a template with extUrl, download and close buttons with the right directive.
 * Also it emits click events as outputs.
 */
export declare class UpperButtonsComponent {
    image: Image;
    configButtons: ButtonsConfig;
    close: EventEmitter<boolean>;
    download: EventEmitter<boolean>;
    downloadImage(): void;
    closeGallery(): void;
}
