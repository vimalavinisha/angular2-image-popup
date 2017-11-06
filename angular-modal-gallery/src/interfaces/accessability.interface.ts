/**
 * Interface `Accessability`.
 */
export interface AccessabilityConfig {
  backgroundAriaLabel: string;
  loadingSpinnerAriaLabel: string;

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
