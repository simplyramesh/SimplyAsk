import { Tooltip } from '@mui/material';
import PropTypes from 'prop-types';

// import AccessManagementIcons from '../../icons/AccessManagementIcons';
import css from './SpecialRolesTooltip.module.css';

const renderTitle = (roles) => {
  return (
    <>
      {roles.map((item, index) => (
        <p key={index} className={css.role}>{item}</p>
      ))}
    </>
  );
};

const SpecialRolesTooltip = ({ roles, children, ...props }) => {
  return (
    <Tooltip
      // title="roles"
      title={renderTitle(roles)}
      arrow
      placement="right"
      PopperProps={{
        sx: {
          '& .MuiTooltip-tooltip': {
            fontFamily: 'Montserrat',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignItems: 'flex-start',
            justifyContent: 'center',
            boxShadow: '1px 1px 10px 2px rgba(0, 0, 0, 0.1)',
            padding: '14px 22px',
            borderRadius: '25px',
            background: '#ffffff',
          },
          '& .MuiTooltip-tooltipArrow': {
            '& .MuiTooltip-arrow': {
              color: '#ffffff',
            },
          },
        },
      }}
      // open
    >
      {children({ ...props })}
    </Tooltip>
  );
};

export default SpecialRolesTooltip;

SpecialRolesTooltip.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.func,
};
