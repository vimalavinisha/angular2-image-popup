import {
  ButtonsConfig,
  ButtonsStrategy,
  ButtonType,
  DescriptionStrategy,
  KS_DEFAULT_BTN_CLOSE,
  KS_DEFAULT_BTN_DELETE,
  KS_DEFAULT_BTN_DOWNLOAD,
  KS_DEFAULT_BTN_EXTURL,
  KS_DEFAULT_BTN_FULL_SCREEN,
  LibConfig,
  LoadingType,
  Size
} from '@ks89/angular-modal-gallery';

const DEFAULT_SIZE_PREVIEWS: Size = {
  width: '100px',
  height: 'auto'
};

export const LIBCONFIG_6: LibConfig = {
  slideConfig: {
    infinite: true,
    sidePreviews: {
      show: true,
      size: DEFAULT_SIZE_PREVIEWS
    }
  }
};

export const LIBCONFIG_7: LibConfig = {
  slideConfig: {
    infinite: true,
    sidePreviews: {
      show: false,
      size: DEFAULT_SIZE_PREVIEWS
    }
  }
};

export const LIBCONFIG_8: LibConfig = {
  slideConfig: {
    infinite: true,
    sidePreviews: {
      show: false,
      size: DEFAULT_SIZE_PREVIEWS
    }
  }
};

export const LIBCONFIG_9: LibConfig = {
  previewConfig: {
    visible: false
  },
  dotsConfig: {
    visible: false
  }
};

export const LIBCONFIG_10: LibConfig = {
  buttonsConfig: {
    visible: false,
    strategy: ButtonsStrategy.DEFAULT
  },
  previewConfig: {
    visible: false
  },
  dotsConfig: {
    visible: false
  }
};

export const LIBCONFIG_11: LibConfig = {
  buttonsConfig: {
    visible: false,
    strategy: ButtonsStrategy.DEFAULT
  },
  slideConfig: {
    infinite: false,
    sidePreviews: {
      show: false,
      size: DEFAULT_SIZE_PREVIEWS
    }
  },
  previewConfig: {
    visible: false
  },
  dotsConfig: {
    visible: false
  }
};

export const LIBCONFIG_12: LibConfig = {
  previewConfig: {
    visible: true,
    size: {
      width: '90px',
      height: 'auto'
    }
  }
};

export const LIBCONFIG_14: LibConfig = {
  currentImageConfig: { downloadable: false },
  buttonsConfig: {
    visible: true,
    strategy: ButtonsStrategy.DEFAULT
  }
};

export const LIBCONFIG_15: LibConfig = {
  currentImageConfig: { downloadable: true },
  buttonsConfig: {
    visible: true,
    strategy: ButtonsStrategy.DEFAULT
  }
};

export const LIBCONFIG_16: LibConfig = {
  currentImageConfig: { downloadable: true },
  buttonsConfig: {
    visible: true,
    strategy: ButtonsStrategy.SIMPLE
  }
};

export const LIBCONFIG_17: LibConfig = {
  slideConfig: {
    infinite: true,
    sidePreviews: {
      show: false,
      size: DEFAULT_SIZE_PREVIEWS
    }
  }
};

export const LIBCONFIG_18: LibConfig = {
  slideConfig: {
    infinite: true,
    sidePreviews: {
      show: true,
      size: DEFAULT_SIZE_PREVIEWS
    }
  }
};

export const LIBCONFIG_19: LibConfig = {
  currentImageConfig: {
    loadingConfig: {
      enable: false,
      type: LoadingType.STANDARD
    }
  }
};
export const LIBCONFIG_20: LibConfig = {
  currentImageConfig: {
    loadingConfig: {
      enable: true,
      type: LoadingType.STANDARD
    }
  }
};
export const LIBCONFIG_21: LibConfig = {
  currentImageConfig: {
    loadingConfig: {
      enable: true,
      type: LoadingType.CIRCULAR
    }
  }
};
export const LIBCONFIG_22: LibConfig = {
  currentImageConfig: {
    loadingConfig: {
      enable: true,
      type: LoadingType.BARS
    }
  }
};
export const LIBCONFIG_23: LibConfig = {
  currentImageConfig: {
    loadingConfig: {
      enable: true,
      type: LoadingType.DOTS
    }
  }
};
export const LIBCONFIG_24: LibConfig = {
  currentImageConfig: {
    loadingConfig: {
      enable: true,
      type: LoadingType.CUBE_FLIPPING
    }
  }
};
export const LIBCONFIG_25: LibConfig = {
  currentImageConfig: {
    loadingConfig: {
      enable: true,
      type: LoadingType.CIRCLES
    }
  }
};
export const LIBCONFIG_26: LibConfig = {
  currentImageConfig: {
    loadingConfig: {
      enable: true,
      type: LoadingType.EXPLOSING_SQUARES
    }
  }
};

export const LIBCONFIG_27: LibConfig = {
  buttonsConfig: {
    visible: true,
    strategy: ButtonsStrategy.DEFAULT
  }
};
export const LIBCONFIG_28: LibConfig = {
  buttonsConfig: {
    visible: true,
    strategy: ButtonsStrategy.SIMPLE
  }
};
export const LIBCONFIG_29: LibConfig = {
  buttonsConfig: {
    visible: true,
    strategy: ButtonsStrategy.ADVANCED
  }
};
export const LIBCONFIG_30: LibConfig = {
  buttonsConfig: {
    visible: true,
    strategy: ButtonsStrategy.FULL
  }
};

// default buttons but extUrl will open the link in a new tab instead of the current one
// this requires to specify all buttons manually (also if they are not really custom)
export const LIBCONFIG_31: LibConfig = {
  currentImageConfig: { downloadable: true },
  buttonsConfig: {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'ext-url-image',
        type: ButtonType.EXTURL,
        extUrlInNewTab: true // <--- this is the important thing to understand this example
      },
      {
        className: 'download-image',
        type: ButtonType.DOWNLOAD
      },
      {
        className: 'close-image',
        type: ButtonType.CLOSE
      }
    ]
  }
};

export const LIBCONFIG_32: LibConfig = {
  currentImageConfig: {
    downloadable: true
  },
  buttonsConfig: {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      // KS_DEFAULT_BTN_ROTATE,
      KS_DEFAULT_BTN_FULL_SCREEN,
      KS_DEFAULT_BTN_DELETE,
      KS_DEFAULT_BTN_EXTURL,
      KS_DEFAULT_BTN_DOWNLOAD,
      KS_DEFAULT_BTN_CLOSE
    ]
  }
};

export const LIBCONFIG_33: LibConfig = {
  currentImageConfig: {
    downloadable: true
  },
  buttonsConfig: {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'fas fa-plus white',
        type: ButtonType.CUSTOM,
        ariaLabel: 'custom plus aria label',
        title: 'custom plus title',
        fontSize: '20px'
      },
      {
        className: 'fas fa-times white',
        type: ButtonType.CLOSE,
        ariaLabel: 'custom close aria label',
        title: 'custom close title',
        fontSize: '20px'
      },
      {
        className: 'fas fa-download white',
        type: ButtonType.DOWNLOAD,
        ariaLabel: 'custom download aria label',
        title: 'custom download title',
        fontSize: '20px'
      },
      {
        className: 'fas fa-external-link-alt white',
        type: ButtonType.EXTURL,
        ariaLabel: 'custom exturl aria label',
        title: 'custom exturl title',
        fontSize: '20px'
      }
    ]
  }
};

export const LIBCONFIG_34: LibConfig = {
  keyboardConfig: {
    esc: 81,
    left: 40,
    right: 38
  }
};

export const LIBCONFIG_35: LibConfig = {
  currentImageConfig: {
    description: {
      strategy: DescriptionStrategy.ALWAYS_VISIBLE,
      imageText: 'Look this image ',
      numberSeparator: ' of ',
      beforeTextDescription: ' => '
    }
  }
};

export const LIBCONFIG_36: LibConfig = {
  currentImageConfig: {
    description: {
      strategy: DescriptionStrategy.HIDE_IF_EMPTY,
      imageText: 'Look this image ',
      numberSeparator: ' of ',
      beforeTextDescription: ' => '
    }
  }
};

export const LIBCONFIG_37: LibConfig = {
  currentImageConfig: {
    description: {
      strategy: DescriptionStrategy.ALWAYS_HIDDEN,
      // you should build this value programmatically with the result of (show)="..()" event
      customFullDescription: 'Custom description of the current visible image'
      // if customFullDescription !== undefined, all other fields will be ignored
      // imageText: '',
      // numberSeparator: '',
      // beforeTextDescription: '',
    }
  }
};

export const LIBCONFIG_38: LibConfig = {
  currentImageConfig: {
    description: {
      strategy: DescriptionStrategy.ALWAYS_VISIBLE,
      // you should build this value programmatically with the result of (show)="..()" event
      customFullDescription: 'Custom description of the current visible image'
      // if customFullDescription !== undefined, all other fields will be ignored
      // imageText: '',
      // numberSeparator: '',
      // beforeTextDescription: '',
    }
  }
};

export const LIBCONFIG_39: LibConfig = {
  currentImageConfig: {
    description: {
      strategy: DescriptionStrategy.ALWAYS_VISIBLE,
      imageText: 'Look this image ',
      numberSeparator: ' of ',
      beforeTextDescription: ' => '
    }
  }
};

export const LIBCONFIG_40: LibConfig = {
  currentImageConfig: {
    description: {
      strategy: DescriptionStrategy.ALWAYS_VISIBLE,
      imageText: 'Look this image ',
      numberSeparator: ' of ',
      beforeTextDescription: ' => ',
      style: {
        bgColor: 'rgba(255,0,0,.5)',
        textColor: 'blue',
        marginTop: '3px',
        marginBottom: '0px',
        marginLeft: '5px',
        marginRight: '5px',
        position: 'absolute',
        top: '0px',
        height: '25px'
        // be careful to use width, in particular with % values
      }
    }
  }
};

export const LIBCONFIG_41: LibConfig = {
  previewConfig: {
    visible: true,
    number: 1
  }
};

export const LIBCONFIG_42: LibConfig = {
  previewConfig: {
    visible: true,
    number: 5
  }
};

export const LIBCONFIG_43: LibConfig = {
  previewConfig: {
    visible: true,
    arrows: false
  }
};

export const LIBCONFIG_44: LibConfig = {
  previewConfig: {
    visible: true,
    clickable: false
  }
};

export const LIBCONFIG_45: LibConfig = {
  previewConfig: {
    visible: true,
    size: { width: '30px', height: '30px' }
  }
};

export const LIBCONFIG_46: LibConfig = {
  accessibilityConfig: {
    backgroundAriaLabel: 'CUSTOM Modal gallery full screen background',
    backgroundTitle: 'CUSTOM background title',

    plainGalleryContentAriaLabel: 'CUSTOM Plain gallery content',
    plainGalleryContentTitle: 'CUSTOM plain gallery content title',

    modalGalleryContentAriaLabel: 'CUSTOM Modal gallery content',
    modalGalleryContentTitle: 'CUSTOM modal gallery content title',

    loadingSpinnerAriaLabel: 'CUSTOM The current image is loading. Please be patient.',
    loadingSpinnerTitle: 'CUSTOM The current image is loading. Please be patient.',

    mainContainerAriaLabel: 'CUSTOM Current image and navigation',
    mainContainerTitle: 'CUSTOM main container title',
    mainPrevImageAriaLabel: 'CUSTOM Previous image',
    mainPrevImageTitle: 'CUSTOM Previous image',
    mainNextImageAriaLabel: 'CUSTOM Next image',
    mainNextImageTitle: 'CUSTOM Next image',

    dotsContainerAriaLabel: 'CUSTOM Image navigation dots',
    dotsContainerTitle: 'CUSTOM dots container title',
    dotAriaLabel: 'CUSTOM Navigate to image number',

    previewsContainerAriaLabel: 'CUSTOM Image previews',
    previewsContainerTitle: 'CUSTOM previews title',
    previewScrollPrevAriaLabel: 'CUSTOM Scroll previous previews',
    previewScrollPrevTitle: 'CUSTOM Scroll previous previews',
    previewScrollNextAriaLabel: 'CUSTOM Scroll next previews',
    previewScrollNextTitle: 'CUSTOM Scroll next previews',

    carouselContainerAriaLabel: 'Current image and navigation',
    carouselContainerTitle: '',
    carouselPrevImageAriaLabel: 'Previous image',
    carouselPrevImageTitle: 'Previous image',
    carouselNextImageAriaLabel: 'Next image',
    carouselNextImageTitle: 'Next image',
    carouselPreviewsContainerAriaLabel: 'Image previews',
    carouselPreviewsContainerTitle: '',
    carouselPreviewScrollPrevAriaLabel: 'Scroll previous previews',
    carouselPreviewScrollPrevTitle: 'Scroll previous previews',
    carouselPreviewScrollNextAriaLabel: 'Scroll next previews',
    carouselPreviewScrollNextTitle: 'Scroll next previews'
  }
};

export const LIBCONFIG_47: LibConfig = {
  currentImageConfig: {
    navigateOnClick: false
  }
};

export const LIBCONFIG_50: LibConfig = {
  currentImageConfig: {
    downloadable: true
  },
  buttonsConfig: {
    visible: true,
    strategy: ButtonsStrategy.SIMPLE
  }
};

export const LIBCONFIG_51: LibConfig = {
  currentImageConfig: {
    invertSwipe: true
  }
};

export const LIBCONFIG_52: LibConfig = {
  slideConfig: {
    infinite: true,
    sidePreviews: {
      show: true,
      size: DEFAULT_SIZE_PREVIEWS
    }
  }
};

export const LIBCONFIG_54: LibConfig = {
  slideConfig: {
    playConfig: {
      autoPlay: true,
      interval: 5000,
      pauseOnHover: true
    }
  }
};

export const LIBCONFIG_55: LibConfig = {
  slideConfig: {
    infinite: true,
    playConfig: {
      autoPlay: true,
      interval: 5000,
      pauseOnHover: false
    }
  }
};

export const LIBCONFIG_56: LibConfig = {
  slideConfig: {
    playConfig: {
      autoPlay: true,
      interval: 1000,
      pauseOnHover: false
    }
  }
};
