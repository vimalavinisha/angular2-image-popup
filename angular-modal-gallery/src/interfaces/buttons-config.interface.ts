/**
 * Interface `ButtonsConfig` to show/hide buttons.
 */
import { Action } from './action.enum';
import { Image } from "./image.class";

export interface ButtonsConfig {
  visible: boolean;
  strategy: ButtonsStrategy;
  buttons?: ButtonConfig[];
}

export interface ButtonConfig {
  className?: string;
  size?: ButtonSize;
  fontSize?: string;
  type: ButtonType;
  title?: string;
  ariaLabel?: string;
}

export interface ButtonSize {
  width: number;
  height: number;
  unit: string;
}

export interface ButtonEvent {
  buttonIndex: number;
  button: ButtonConfig;
  image: Image | void;
  action: Action;
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
  CLOSE,
  CUSTOM
}

export const WHITELIST_BUTTON_TYPES: ButtonType[] = [
  ButtonType.REFRESH,
  ButtonType.DELETE,
  ButtonType.EXTURL,
  ButtonType.DOWNLOAD,
  ButtonType.CLOSE,
  ButtonType.CUSTOM
];
