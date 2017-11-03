import { ElementRef, OnChanges, SimpleChanges, OnInit, Renderer } from '@angular/core';
import { ButtonsConfig } from '../interfaces/buttons-config.interface';
/**
 * Directive to display the download button.
 * To show this button, you must provide a ButtonsConfig object with 'download: true' as property.
 * All other configurations will hide this button.
 * Pay attention, because this directive is quite smart to choose button's order using the
 * correct right margin in pixels. To do that, it uses also imgExtUrl and configButtons.
 */
export declare class DownloadButtonDirective implements OnInit, OnChanges {
    private renderer;
    private el;
    configButtons: ButtonsConfig;
    imgExtUrl: string | void;
    private RIGHT;
    constructor(renderer: Renderer, el: ElementRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private applyStyle();
    private getNumOfPrecedingButtons();
}
