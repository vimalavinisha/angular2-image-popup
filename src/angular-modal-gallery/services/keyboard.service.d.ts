import 'mousetrap';
import { KeyboardServiceConfig } from '../interfaces/keyboard-service-config.interface';
/**
 * Service to intercept ctrl+s (or cmd+s on macOS) using a third-party library, called Mousetrap.
 */
export declare class KeyboardService {
    private config;
    private mousetrap;
    private shortcuts;
    constructor(config: KeyboardServiceConfig);
    /**
     * Method to add a lister for ctrl+s/cmd+s keyboard events.
     * @param onBind Callback function
     */
    add(onBind: (e: ExtendedKeyboardEvent, combo: string) => any): void;
    /**
     * Useful function to reset all listeners. Please, call this function when needed
     * to free resources ad prevent leaks.
     */
    reset(): void;
}
