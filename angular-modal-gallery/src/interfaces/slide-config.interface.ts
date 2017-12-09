/**
 * Interface `SlideConfig` to configure sliding features of modal gallery.
 */
export interface SlideConfig {
  infinite?: boolean;
  sidePreviews?: SidePreviewsConfig;
}

export interface SidePreviewsConfig {
  show: boolean;
  width: string;
  height: string;
}
