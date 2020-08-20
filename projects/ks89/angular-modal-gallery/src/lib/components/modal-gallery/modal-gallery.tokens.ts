import { InjectionToken } from '@angular/core';
import { ModalGalleryConfig } from '../../model/modal-gallery-config.interface';

export const DIALOG_DATA = new InjectionToken<ModalGalleryConfig>('DIALOG_DATA');
