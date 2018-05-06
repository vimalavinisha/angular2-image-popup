/*
 The MIT License (MIT)

 Copyright (c) 2017-2018 Stefano Cappa (Ks89)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */

/**
 * Index file to export all interfaces, enums, classes and so on.
 * This file represents the public apis.
 */

export { ModalGalleryModule } from './src/modal-gallery.module';

export { Action } from './src/model/action.enum';
export { Image, PlainImage, ModalImage, ImageModalEvent } from './src/model/image.class';
export { Description, DescriptionStrategy } from './src/model/description.interface';
export { KeyboardConfig } from './src/model/keyboard-config.interface';
export { DotsConfig } from './src/model/dots-config.interface';
export { PreviewConfig } from './src/model/preview-config.interface';
export { AccessibilityConfig } from './src/model/accessibility.interface';

export { Size } from './src/model/size.interface';

export { ButtonsConfig, ButtonsStrategy, ButtonType, ButtonEvent } from './src/model/buttons-config.interface';

export { GalleryService } from './src/services/gallery.service';

export { CurrentImageConfig } from './src/model/current-image-config.interface';

export { KS_DEFAULT_ACCESSIBILITY_CONFIG } from './src/components/accessibility-default';
export {
  KS_DEFAULT_BTN_FULL_SCREEN,
  KS_DEFAULT_BTN_CLOSE,
  KS_DEFAULT_BTN_DELETE,
  KS_DEFAULT_BTN_DOWNLOAD,
  KS_DEFAULT_BTN_EXTURL,
  // KS_DEFAULT_BTN_REFRESH,
  KS_DEFAULT_SIZE
} from './src/components/upper-buttons/upper-buttons-default';

export {
  PlainGalleryConfig,
  PlainGalleryLayout,
  LineLayout,
  GridLayout,
  AdvancedLayout,
  PlainGalleryStrategy,
  BreakConfig
} from './src/model/plain-gallery-config.interface';
