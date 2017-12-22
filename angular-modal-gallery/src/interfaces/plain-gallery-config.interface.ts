/**
 * Interface `PlainGalleryConfig` to configure
 * plain-gallery features.
 */
import { Size } from './size.interface';

export interface PlainGalleryConfig {
  strategy: PlainGalleryStrategy;
  layout: PlainGalleryLayout;
  advanced?: AdvancedConfig;
}

export interface PlainGalleryLayout {}

export class LineLayout implements PlainGalleryLayout {
  breakConfig: BreakConfig;
  justify: string;
  size: Size;

  constructor(size: Size, breakConfig: BreakConfig, justify: string) {
    this.size = size;
    this.breakConfig = breakConfig;
    this.justify = justify;
  }
}

export class GridLayout implements PlainGalleryLayout {
  breakConfig: BreakConfig;
  size: Size;

  constructor(size: Size, breakConfig: BreakConfig) {
    this.size = size;
    this.breakConfig = breakConfig;
  }
}

export class AdvancedLayout implements PlainGalleryLayout {
  modalOpenerByIndex: number;
  hideDefaultPlainGallery: boolean;

  constructor(modalOpenerByIndex: number, hideDefaultPlainGallery: boolean) {
    this.modalOpenerByIndex = modalOpenerByIndex;
    this.hideDefaultPlainGallery = hideDefaultPlainGallery;
  }
}

export enum PlainGalleryStrategy {
  // don't use 0 here
  // the first index is 1 and all of the following members are auto-incremented from that point on
  ROW = 1,
  COLUMN,
  GRID,
  CUSTOM // full custom strategy
}

export interface BreakConfig {
  length: number;
  wrap: boolean;
}

export interface AdvancedConfig {
  aTags: boolean;
}
