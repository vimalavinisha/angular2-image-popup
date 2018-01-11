import { ButtonConfig, ButtonType } from '../../model/buttons-config.interface';
import { Size } from '../../model/size.interface';

/**
 * Default button size object
 * @type Size
 */
export const defaultSize: Size = { height: 'auto', width: '30px' };

/**
 * Default close button object
 * @type ButtonConfig
 */
export const closeButton: ButtonConfig = {
  className: 'close-image',
  size: defaultSize,
  type: ButtonType.CLOSE,
  title: 'Close this modal image gallery',
  ariaLabel: 'Close this modal image gallery'
};
/**
 * Default download button object
 * @type ButtonConfig
 */
export const downloadButton: ButtonConfig = {
  className: 'download-image',
  size: defaultSize,
  type: ButtonType.DOWNLOAD,
  title: 'Download the current image',
  ariaLabel: 'Download the current image'
};
/**
 * Default exturl button object
 * @type ButtonConfig
 */
export const extUrlButton: ButtonConfig = {
  className: 'ext-url-image',
  size: defaultSize,
  type: ButtonType.EXTURL,
  title: 'Navigate the current image',
  ariaLabel: 'Navigate the current image'
};
/**
 * Default refresh button object
 * @type ButtonConfig
 */
export const refreshButton: ButtonConfig = {
  className: 'refresh-image',
  size: defaultSize,
  type: ButtonType.REFRESH,
  title: 'Refresh all images',
  ariaLabel: 'Refresh all images'
};
/**
 * Default delete button object
 * @type ButtonConfig
 */
export const deleteButton: ButtonConfig = {
  className: 'delete-image',
  size: defaultSize,
  type: ButtonType.DELETE,
  title: 'Delete the current image',
  ariaLabel: 'Delete the current image'
};
