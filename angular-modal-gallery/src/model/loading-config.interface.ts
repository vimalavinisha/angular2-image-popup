/**
 * Interface `LoadingConfig` to configure loading icon
 */
export interface LoadingConfig {
  enable: boolean;
  type: LoadingType;
}

/**
 * Enum `LoadingType` with a list of possible types.
 */
export enum LoadingType {
  STANDARD = 1,
  CIRCULAR,
  BARS,
  DOTS
}
