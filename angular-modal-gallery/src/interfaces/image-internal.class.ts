import { Image, ModalImage, PlainImage } from './image.class';

/**
 * Internal representation of an Image adding other fields
 * to the public `Image` class.
 */
export class InternalLibImage extends Image {
  previouslyLoaded: boolean;

  constructor(id: number, modal: ModalImage, plain?: PlainImage, previouslyLoaded: boolean = false) {
    super(id, modal, plain);

    this.previouslyLoaded = previouslyLoaded;
  }
}
