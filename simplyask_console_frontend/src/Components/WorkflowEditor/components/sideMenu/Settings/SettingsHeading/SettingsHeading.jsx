import PropTypes from 'prop-types';

import LeftArrowIcon from '../../../../Assets/Icons/leftArrow.svg?component';
import { Heading } from '../../sub';
import css from './SettingsHeading.module.css';

const SettingsHeading = (props) => {
  const { onBackClick, heading, promptText } = props;
  return (
    <div className={css.header}>
      <span className={css.icon} onClick={onBackClick}>
        <LeftArrowIcon />
      </span>
      <Heading as="h2" size="medium" promptText={promptText}>
        {heading}
      </Heading>
    </div>
  );
};

export default SettingsHeading;

SettingsHeading.propTypes = {
  onBackClick: PropTypes.func,
  heading: PropTypes.string,
  promptText: PropTypes.string,
};
