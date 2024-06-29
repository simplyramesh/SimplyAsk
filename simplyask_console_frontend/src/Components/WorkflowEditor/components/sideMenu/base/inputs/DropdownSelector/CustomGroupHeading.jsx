import PropTypes from 'prop-types';
import { components } from 'react-select';

import { Heading } from '../../../sub';
import Divider from '../../Divider/Divider';
import css from './DropdownSelector.module.css';

const CustomGroupHeading = (props) => {
  const { data, selectProps } = props;

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!data.displayDynamicParameters || !data.includeDivider) {
      const option = data.options.find((o) => o.label === e.target.innerText);

      selectProps.onChange(option);
      selectProps.onMenuClose();
    }
  };

  return (
    <components.GroupHeading {...props} onClick={handleClick}>
      <div className={css.header_divider}>
        {(data.includeDivider || data.label.toLowerCase() === 'potentially available parameters') && <Divider color="gray" />}
        {data.options.length > 0 && <Heading as="h4" size="medium">{data.label}</Heading>}
      </div>
    </components.GroupHeading>
  );
};

export default CustomGroupHeading;

CustomGroupHeading.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string,
    includeDivider: PropTypes.bool,
    options: PropTypes.array,
    displayDynamicParameters: PropTypes.bool,
  }),
  selectProps: PropTypes.shape({
    onChange: PropTypes.func,
    onMenuClose: PropTypes.func,
    options: PropTypes.array,
    noClick: PropTypes.bool,
  }),
};
