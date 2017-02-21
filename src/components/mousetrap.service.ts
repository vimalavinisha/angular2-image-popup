import {Injectable} from '@angular/core';
import 'mousetrap';

@Injectable()
export class MousetrapService {
  private mousetrap: MousetrapInstance;

  constructor() {
    this.mousetrap = new (<any>Mousetrap)();
  }

  add(onBind: (e: ExtendedKeyboardEvent, combo: string) => any) {
    this.mousetrap.bind(['ctrl+s', 'meta+s'], (event: KeyboardEvent, combo: string) => {
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        // internet explorer
        event.returnValue = false;
      }
      onBind(event, combo);
    });
  }

  reset() {
    this.mousetrap.reset();
  }
}