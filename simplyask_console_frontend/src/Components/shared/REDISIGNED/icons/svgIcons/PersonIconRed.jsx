import { useTheme } from '@emotion/react';

import PersonIcon from './PersonIcon';

const PersonIconRed = (props) => {
  const { colors } = useTheme();
  return (
    <PersonIcon
      {...props}
      sx={{
        backgroundColor: colors.stepLightRedBg,
        fill: colors.statusOverdue,
        borderRadius: '5px',
        padding: '3px',
        width: '30px',
        height: '30px',
      }}
    />
  );
};
export default PersonIconRed;
