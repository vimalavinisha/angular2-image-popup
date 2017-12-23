/**
 * Interface `Accessability`.
 */
export interface AccessibilityConfig {
  backgroundAriaLabel: string;
  backgroundTitle: string;

  modalGalleryContentAriaLabel: string;
  modalGalleryContentTitle: string;

  loadingSpinnerAriaLabel: string;
  loadingSpinnerTitle: string;

  mainContainerAriaLabel: string;
  mainContainerTitle: string;
  mainPrevImageAriaLabel: string;
  mainPrevImageTitle: string;
  mainNextImageAriaLabel: string;
  mainNextImageTitle: string;

  dotsContainerAriaLabel: string;
  dotsContainerTitle: string;
  dotAriaLabel: string;

  previewsContainerAriaLabel: string;
  previewsContainerTitle: string;
  previewScrollPrevAriaLabel: string;
  previewScrollPrevTitle: string;
  previewScrollNextAriaLabel: string;
  previewScrollNextTitle: string;
}
