/**
 * Interface `PlainGalleryConfig` to configure
 * plain-gallery features.
 */
export interface PlainGalleryConfig {
  strategy: PlainGalleryStrategy;
  layout: PlainGalleryLayout;
  size: Size;
}

export class PlainGalleryLayout {
  breakConfig: BreakConfig;

  constructor(breakConfig: BreakConfig) {
    this.breakConfig = breakConfig;
  }
}

export class LineLayout extends PlainGalleryLayout {
  reverse: boolean;

  constructor(breakConfig: BreakConfig, reverse: boolean) {
    super(breakConfig);
    this.reverse = reverse;
  }
}

export class GridLayout extends PlainGalleryLayout {
  rows: number;
  cols: number;

  constructor(breakConfig: BreakConfig, rows: number, cols: number) {
    super(breakConfig);
    this.rows = rows;
    this.cols = cols;
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
  width: number;
  height: number;
  unit: string;
}


export interface BreakConfig {
  length: number;
  iconClass: string;
  otherCount: number;
}
