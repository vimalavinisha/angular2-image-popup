import { Image } from './image.class';

/**
 * Internal representation of an Image adding other fields
 * to the public `Image` class.
 */
export class InternalLibImage extends Image {
  previouslyLoaded: boolean;

  constructor(id: number,
              img: string,
              thumb?: string | null | undefined,
              description?: string | null | undefined,
              extUrl?: string | null | undefined,
              title?: string | null | undefined,
              alt?: string | null | undefined,
              ariaLabel?: string | null | undefined,
              previouslyLoaded: boolean = false) {
    super(id, img, thumb, description, extUrl, title, alt, ariaLabel);

    this.previouslyLoaded = previouslyLoaded;
  }
}
