import { EventEmitter } from '@angular/core';
/**
 * Directive to close the modal gallery clicking on the semi-transparent background.
 * In fact, it listens for a click on the element with id="ng-gallery-content" and it emits
 * an event using `@Output clickOutside`.
 */
export declare class ClickOutsideDirective {
    clickOutsideEnable: boolean;
    clickOutside: EventEmitter<boolean>;
    onClick(targetElement: Element): void;
}
