import { useTheme } from "@mui/material";

const ACTIVITY_STATUS = {
  UNASSIGNED: 'UNASSIGNED',
  ASSIGNED: 'ASSIGNED',
  CREATED: 'STATUS_CHANGED',
  COMMENT: 'COMMENT',
  ACTION_PERFORMED: 'ACTION_PERFORMED',
};

const useActivitiesColors = () => {
  const { colors, statusColors } = useTheme();

  return {
    [ACTIVITY_STATUS.UNASSIGNED]: statusColors.blue.color,
    [ACTIVITY_STATUS.ASSIGNED]: statusColors.yellow.color,
    [ACTIVITY_STATUS.ACTION_PERFORMED]: statusColors.green.color,
    [ACTIVITY_STATUS.CREATED]: colors.secondary,
    [ACTIVITY_STATUS.COMMENT]: colors.primary,
    DEFAULT: colors.primary,
  }
}

export default useActivitiesColors;