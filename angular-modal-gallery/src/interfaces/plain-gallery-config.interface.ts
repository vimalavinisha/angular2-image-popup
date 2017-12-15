/**
 * Interface `PlainGalleryConfig` to configure
 * plain-gallery features.
 */
export interface PlainGalleryConfig {
  strategy: PlainGalleryStrategy;
  layout: PlainGalleryLayout;
  size: Size;
  advanced?: AdvancedConfig;
}

export class PlainGalleryLayout {
  breakConfig: BreakConfig;

  constructor(breakConfig: BreakConfig) {
    this.breakConfig = breakConfig;
  }
}

export class LineLayout extends PlainGalleryLayout {
  justify: string;

  constructor(breakConfig: BreakConfig, justify: string) {
    super(breakConfig);
    this.justify = justify;
  }
}

export class GridLayout extends PlainGalleryLayout {
  constructor(breakConfig: BreakConfig) {
    super(breakConfig);
  }
}

export enum PlainGalleryStrategy {
  // don't use 0 here
  // the first index is 1 and all of the following members are auto-incremented from that point on
  ROW = 1,
  COLUMN,
  GRID,
  ADVANCED_GRID
}

export interface Size {
  width: string;
  height: string;
}


export interface BreakConfig {
  length: number;
  iconClass: string;
  wrap: boolean;
}

export interface AdvancedConfig {
  aTags: boolean;
  customPlainGallery?: CustomConfig;
}

export interface CustomConfig {
  modalOpenerByIndex: number;
  hideDefaultPlainGallery: boolean;
}
