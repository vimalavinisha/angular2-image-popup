/**
 * Interface `Description` to change the description, either with a full custom
 * description or with a small and simple customization.
 */
export interface Description {
  strategy?: DescriptionStrategy;
  customFullDescription?: string;
  imageText?: string;
  numberSeparator?: string;
  beforeTextDescription?: string;
}

/**
 * Enum `DescriptionStrategy` with keys and their relative key codes.
 */
export enum DescriptionStrategy {
  ALWAYS_HIDDEN = 1,
  ALWAYS_VISIBLE,
  HIDE_IF_EMPTY
}
