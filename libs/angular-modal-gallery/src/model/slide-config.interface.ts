/**
 * Interface `SlideConfig` to configure sliding features of modal gallery.
 */
import { Size } from './size.interface';

export interface SlideConfig {
  infinite?: boolean;
  sidePreviews?: SidePreviewsConfig;
}

export interface SidePreviewsConfig {
  show: boolean;
  size: Size;
}
