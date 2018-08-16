import { AccessibilityConfig } from '../model/accessibility.interface';

/**
 * Default accessibility configuration.
 */
export const KS_DEFAULT_ACCESSIBILITY_CONFIG: AccessibilityConfig = {
  backgroundAriaLabel: 'Modal gallery full screen background',
  backgroundTitle: '',

  plainGalleryContentAriaLabel: 'Plain gallery content',
  plainGalleryContentTitle: '',

  modalGalleryContentAriaLabel: 'Modal gallery content',
  modalGalleryContentTitle: '',

  loadingSpinnerAriaLabel: 'The current image is loading. Please be patient.',
  loadingSpinnerTitle: 'The current image is loading. Please be patient.',

  mainContainerAriaLabel: 'Current image and navigation',
  mainContainerTitle: '',
  mainPrevImageAriaLabel: 'Previous image',
  mainPrevImageTitle: 'Previous image',
  mainNextImageAriaLabel: 'Next image',
  mainNextImageTitle: 'Next image',

  dotsContainerAriaLabel: 'Image navigation dots',
  dotsContainerTitle: '',
  dotAriaLabel: 'Navigate to image number',

  previewsContainerAriaLabel: 'Image previews',
  previewsContainerTitle: '',
  previewScrollPrevAriaLabel: 'Scroll previous previews',
  previewScrollPrevTitle: 'Scroll previous previews',
  previewScrollNextAriaLabel: 'Scroll next previews',
  previewScrollNextTitle: 'Scroll next previews',

  carouselContainerAriaLabel: 'Current image and navigation',
  carouselContainerTitle: '',
  carouselPrevImageAriaLabel: 'Previous image',
  carouselPrevImageTitle: 'Previous image',
  carouselNextImageAriaLabel: 'Next image',
  carouselNextImageTitle: 'Next image',
  carouselDotsContainerAriaLabel: 'Image navigation dots',
  carouselDotsContainerTitle: '',
  carouselDotAriaLabel: 'Navigate to image number',
  carouselPreviewsContainerAriaLabel: 'Image previews',
  carouselPreviewsContainerTitle: '',
  carouselPreviewScrollPrevAriaLabel: 'Scroll previous previews',
  carouselPreviewScrollPrevTitle: 'Scroll previous previews',
  carouselPreviewScrollNextAriaLabel: 'Scroll next previews',
  carouselPreviewScrollNextTitle: 'Scroll next previews'
};
