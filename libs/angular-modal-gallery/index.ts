/*
 * MIT License
 *
 * Copyright (c) 2017-2018 Stefano Cappa
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

/**
 * Index file to export all interfaces, enums, classes and so on.
 * This file represents the public apis.
 */

export { ModalGalleryModule } from './src/modal-gallery.module';


export { AccessibilityConfig } from './src/model/accessibility.interface';
export { PreviewConfig } from './src/model/preview-config.interface';
export { DotsConfig } from './src/model/dots-config.interface';
export { KeyboardConfig } from './src/model/keyboard-config.interface';
export { Description, DescriptionStrategy } from './src/model/description.interface';
export {
  BreakConfig,
  PlainGalleryConfig,
  PlainGalleryLayout,
  LineLayout,
  GridLayout,
  AdvancedLayout,
  PlainGalleryStrategy
} from './src/model/plain-gallery-config.interface';
export { ButtonsConfig, ButtonsStrategy, ButtonType, ButtonEvent } from './src/model/buttons-config.interface';
export { Size } from './src/model/size.interface';
export { Action } from './src/model/action.enum';
export { Image, PlainImage, ModalImage, ImageModalEvent } from './src/model/image.class';
