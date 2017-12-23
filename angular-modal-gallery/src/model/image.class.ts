import { Action } from './action.enum';
import { Size } from './size.interface';

/**
 * Class `Image` that represents an Image with both images and thumb paths,
 * also with a description and an external url.
 * The only required value is the image path `img`.
 */
export class Image {
  id: number;

  modal: ModalImage;
  plain?: PlainImage;

  constructor(id: number, modal: ModalImage, plain?: PlainImage) {
    this.id = id;
    this.modal = modal;
    this.plain = plain;
  }
}

export interface ImageData {
  img: string;
  description?: string;
  extUrl?: string;
  title?: string;
  alt?: string;
  ariaLabel?: string;
  size?: Size;
}

export interface PlainImage extends ImageData {}

export interface ModalImage extends ImageData {}

/**
 * Class `ImageModalEvent` that represents the Event after an action `action` and its result.
 */
export class ImageModalEvent {
  action: Action;
  result: number | boolean;

  constructor(action: Action, result: number | boolean) {
    this.action = action;
    this.result = result;
  }
}
