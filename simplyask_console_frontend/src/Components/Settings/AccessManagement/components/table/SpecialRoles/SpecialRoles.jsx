import PropTypes from 'prop-types';

import SpecialRolesTooltip from '../../tooltips/SpecialRolesTooltip/SpecialRolesTooltip';
import css from './SpecialRoles.module.css';

const SpecialRoles = ({ roles }) => {
  if (!roles) {
    return <></>;
  }

  const rolesLength = roles.length;
  const isAdmin = roles.includes('admin');

  const rolesNames = roles.map((item) => item.name);

  const rolesTooltip = rolesNames.filter((item, index) => item !== 'Admin' && index !== 0);

  const renderMultiRole = (value) => {
    return (
      <>
        <SpecialRolesTooltip roles={rolesTooltip}>
          {({ ref, ...props }) => (
            <div ref={ref} {...props} className={css.multiRole}>
              <p className={css.role}>{value}</p>
              <p className={css.more}>
                <span className={css.plus}>+</span>
                <span className={css.length}>{` ${rolesLength - 1} `}</span>
                <span className={css.moreText}>more</span>
              </p>
            </div>
          )}
        </SpecialRolesTooltip>
      </>
    );
  };

  return (
    <>
      {rolesLength === 1 && <p className={css.role}>{rolesNames[0]}</p>}
      {rolesLength > 1 && isAdmin && renderMultiRole('Admin')}
      {rolesLength > 1 && !isAdmin && renderMultiRole(rolesNames[0])}
      {rolesLength === 0 && <p className={css.role}>None</p>}
    </>
  );
};

export default SpecialRoles;

SpecialRoles.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
};
