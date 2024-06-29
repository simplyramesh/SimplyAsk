import PropTypes from 'prop-types';

import ChevronIcon from '../../../../Assets/Icons/chevronLeft.svg?component';
import { Typography } from '../../base';
import { Heading } from '../../sub';
import css from './SettingsItem.module.css';

const SettingsItem = ({ heading, info, withIcon, onClick }) => {
  return (
    <section className={css.container} onClick={onClick}>
      <div className={css.left}>
        <Heading as="h2" size="default">
          {heading}
        </Heading>
        <Typography as="p" variant="small" color="gray">
          {info}
        </Typography>
      </div>
      <div className={css.right}>
        {withIcon && (
          <span className={css.icon}>
            <ChevronIcon />
          </span>
        )}
      </div>
    </section>
  );
};

export default SettingsItem;

SettingsItem.propTypes = {
  heading: PropTypes.string,
  info: PropTypes.string,
  withIcon: PropTypes.bool,
  onClick: PropTypes.func,
};
