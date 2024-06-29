import { Avatar } from '@mui/material';
import PropTypes from 'prop-types';

import colors from '../../config/colors';
import { getNameInitials } from '../../utils/helperFunctions';
import { StyledFlex } from '../shared/styles/styled';
import classes from './UserAvatar.module.css';

const UserAvatar = ({
  customUser,
  imgSrc,
  color = colors.primary,
  textColor,
  size = '47',
  className,
  ...otherProps
}) => {
  return (
    <Avatar
      style={{
        '--avatar-background-color': color,
        '--avatar-size': `${size}px`,
        '--avatar-text-color': textColor,
      }}
      className={`${classes.root} ${className}`}
      src={imgSrc}
      alt={`${customUser?.firstName} ${customUser?.lastName}`}
      {...otherProps}
    >
      {getNameInitials(customUser)}
    </Avatar>
  );
};

export const AvatarWithName = ({ customUser, ...rest }) => {
  return (
    <StyledFlex display="inline-flex" direction="row" gap="10px" alignItems="center">
      <UserAvatar imgSrc={customUser?.pfp} customUser={customUser} {...rest} color={customUser ? '#F57B20' : '#C4C4C4'} />
      {`${customUser?.firstName} ${customUser?.lastName}`}
    </StyledFlex>
  );
};

export default UserAvatar;

UserAvatar.propTypes = {
  customUser: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
  imgSrc: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
  textColor: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
