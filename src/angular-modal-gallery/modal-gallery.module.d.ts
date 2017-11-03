import { ModuleWithProviders, InjectionToken } from '@angular/core';
import { KeyboardService } from './services/keyboard.service';
import { KeyboardServiceConfig } from './interfaces/keyboard-service-config.interface';
export declare const KEYBOARD_CONFIGURATION: InjectionToken<KeyboardServiceConfig>;
/**
 * Module with `forRoot` method to import it in the root module of your application.
 */
export declare class ModalGalleryModule {
    static forRoot(config?: KeyboardServiceConfig): ModuleWithProviders;
}
export declare function setupRouter(injector: KeyboardServiceConfig): KeyboardService;
