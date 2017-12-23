/**
 * Interface `PreviewConfig`.
 */
import { Size } from './size.interface';

export interface PreviewConfig {
  visible: boolean;
  number?: number;
  arrows?: boolean;
  clickable?: boolean;
  alwaysCenter?: boolean;
  size?: Size;
}
