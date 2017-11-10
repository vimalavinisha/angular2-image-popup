/**
 * Class `Image` that represents an Image with both images and thumb paths,
 * also with a description and an external url.
 * The only required value is the image path `img`.
 */
import { Action } from './action.enum';

export class Image {
  id: number | string;
  img: string;
  thumb?: string | null | undefined;
  description?: string | null | undefined;
  extUrl?: string | null | undefined;
  title?: string | null | undefined;
  alt?: string | null | undefined;
  ariaLabel?: string | null | undefined;

  constructor(id: number | string,
              img: string,
              thumb?: string | null | undefined,
              description?: string | null | undefined,
              extUrl?: string | null | undefined,
              title?: string | null | undefined,
              alt?: string | null | undefined,
              ariaLabel?: string | null | undefined) {
    this.id = id;
    this.img = img;
    this.thumb = thumb;
    this.description = description;
    this.extUrl = extUrl;
    this.title = title;
    this.alt = alt;
    this.ariaLabel = ariaLabel;
  }
}


// aria-label="Click to navigate to the next image"
// title="Current image" alt="{{getAltDescriptionByImage(currentImage)}}"/>

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
