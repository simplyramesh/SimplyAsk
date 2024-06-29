export const SIDEBAR_TYPES = {
  ADVANCED_SETTINGS: 'ADVANCED_SETTINGS',
  AGENT_DETAILS: 'AGENT_DETAILS',
  INTENT: 'INTENT',
  CONFIGURE_CHANNELS: 'CONFIGURE_CHANNELS',
};

export const getSidebar = ({
  type,
  payload
}) => ({
  [SIDEBAR_TYPES.ADVANCED_SETTINGS]: {
    type: SIDEBAR_TYPES.ADVANCED_SETTINGS,
    payload,
    width: 720,
  },
  [SIDEBAR_TYPES.AGENT_DETAILS]: {
    type: SIDEBAR_TYPES.AGENT_DETAILS,
    payload,
    width: 500,
  },
  [SIDEBAR_TYPES.INTENT]: {
    type: SIDEBAR_TYPES.INTENT,
    payload,
    width: 500,
  },
  [SIDEBAR_TYPES.CONFIGURE_CHANNELS]: {
    type: SIDEBAR_TYPES.CONFIGURE_CHANNELS,
    payload,
    width: 600,
  },
})[type];
