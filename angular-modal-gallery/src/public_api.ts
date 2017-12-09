/*
 * MIT License
 *
 * Copyright (c) 2017 Stefano Cappa
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { ModalGalleryModule } from './modal-gallery.module';

export { ModalGalleryModule } from './modal-gallery.module';

export { Action } from './interfaces/action.enum';
export { Image, ImageModalEvent } from './interfaces/image.class';
export { Description, DescriptionStrategy } from './interfaces/description.interface';
export { KeyboardConfig } from './interfaces/keyboard-config.interface';
export { DotsConfig } from './interfaces/dots-config.interface';
export { PreviewConfig } from './interfaces/preview-config.interface';
export { AccessibilityConfig } from './interfaces/accessibility.interface';

export { ButtonsConfig, ButtonsStrategy, ButtonType, ButtonEvent } from './interfaces/buttons-config.interface';

export {
  PlainGalleryConfig,
  PlainGalleryLayout,
  LineLayout,
  GridLayout,
  PlainGalleryStrategy,
  Size,
  BreakConfig
} from './interfaces/plain-gallery-config.interface';
