/**
 * Interface `ButtonsConfig` to show/hide buttons.
 */
export interface ButtonsConfig {
  strategy: ButtonsStrategy;
  buttons?: ButtonConfig[];
}

export interface ButtonConfig {
  className?: string;
  size?: ButtonSize;
  type: ButtonType;
  title?: string;
  ariaLabel?: string;
}

export interface ButtonSize {
  width: number;
  height: number;
  unit: string;
}


/**
 * Enum `ButtonsStrategy`.
 */
export enum ButtonsStrategy {
  // don't use 0 here
  // the first index is 1 and all of the following members are auto-incremented from that point on
  DEFAULT = 1,
  SIMPLE,
  ADVANCED,
  FULL,
  CUSTOM
}

/**
 * Enum `ButtonsStrategy`.
 */
export enum ButtonType {
  // don't use 0 here
  // the first index is 1 and all of the following members are auto-incremented from that point on
  REFRESH = 1,
  DELETE,
  EXTURL,
  DOWNLOAD,
  CLOSE
}

