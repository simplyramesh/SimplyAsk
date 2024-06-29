import PropTypes from 'prop-types';

import SettingsItem from '../../Settings/SettingsItem/SettingsItem';
import { Heading } from '../../sub';
import css from './Resources.module.css';

const OPTIONS = {
  AVAIL_PARAMS: {
    HEADING: 'Available Parameters',
    INFO: 'View a list of all fully and potentially available parameters for this task',
  },
  LOGIC_OPS: {
    HEADING: 'Logical Operators',
    INFO: 'View a list of all logical operators available to create workflows, plus example uses',
  },
};

const Resources = ({ onClick }) => {
  return (
    <div className={css.container}>
      <div className={css.resources_title}>
        <Heading as="h3" size="large">
          Resources
        </Heading>
      </div>
      <SettingsItem
        heading={OPTIONS.LOGIC_OPS.HEADING}
        info={OPTIONS.LOGIC_OPS.INFO}
        onClick={(e) => onClick(e, 'logicalOps')}
      />
    </div>
  );
};

export default Resources;

Resources.propTypes = {
  onClick: PropTypes.func,
};
