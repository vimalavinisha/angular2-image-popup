import { ButtonsStrategy, LibConfig, Size } from '@ks89/angular-modal-gallery';

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

export const LIBCONFIG_16: LibConfig = LIBCONFIG_15;
