import { OnChanges, Renderer, ElementRef, SimpleChanges, OnInit } from '@angular/core';
import { ButtonsConfig } from '../interfaces/buttons-config.interface';
/**
 * Directive to display the close button.
 * To hide this button, you must provide a ButtonsConfig object with 'close: false' as property.
 * All other configurations won't hide this button.
 */
export declare class CloseButtonDirective implements OnInit, OnChanges {
    private renderer;
    private el;
    configButtons: ButtonsConfig;
    constructor(renderer: Renderer, el: ElementRef);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    private applyStyle();
}
