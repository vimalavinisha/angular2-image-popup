/**
 * Interface `PreviewConfig`.
 */
import { ImageSize } from './image-size.interface';

export interface PreviewConfig {
  visible: boolean;
  number: number;
  arrows?: boolean;
  clickable?: boolean;
  alwaysCenter?: boolean;
  size?: ImageSize;
}
