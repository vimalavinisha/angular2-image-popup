/**
 * Interface `PreviewConfig`.
 */
import { ImageSize } from './image-size.interface';

export interface PreviewConfig {
  number?: number;
  arrows?: boolean;
  clickable?: boolean;
  alwaysCenter?: boolean;
  size?: ImageSize;
}
