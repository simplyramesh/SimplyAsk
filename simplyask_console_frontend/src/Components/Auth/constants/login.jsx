export const ERROR_TITLE = 'Login Failed';

export const WAVE_INVALID_HEIGHT_EDGE_CASE = 0;

export const SCREEN_PIXEL_POSITION_WHEN_FORM_INTERSECTS_WITH_WAVE_IMG = 420;

export const TELUS_ENV_ACTIVATE_KEY = 'true';

export const REGISTRATION_CSS_TRANSITION_ACTIVE_MENUS = {
  PRIMARY_MENU: 'primaryMenu',
  SECONDARY_MENU: 'secondaryMenu',
};

export const ERROR_EXCEPTION_MAP = {
  BadCredentialsException: {
    title: ERROR_TITLE,
    message: 'Invalid username or password',
  },
  DisabledException: {
    title: ERROR_TITLE,
    message: "Your organization's account has been disabled. Contact support for more information.",
  },
  LockedException: {
    title: ERROR_TITLE,
    message: 'Your user account has been locked. Contact your admin for support.',
  },
  InternalAuthenticationServiceException: {
    title: ERROR_TITLE,
    message: "Your organization's account has been disabled. Contact support for more information.",
  },
};
