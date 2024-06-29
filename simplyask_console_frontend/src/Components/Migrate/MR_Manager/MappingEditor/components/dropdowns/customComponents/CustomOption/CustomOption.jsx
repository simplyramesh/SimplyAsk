import moment from 'moment';
import PropTypes from 'prop-types';
import { components } from 'react-select';

import css from './CustomOption.module.css';

const CustomOption = ({ data, ...rest }) => {
  const renderOption = (action) => (
    <components.Option
      {...rest}
      innerProps={{
        ...rest.innerProps,
        onClick: () => {
          action();
          rest.selectProps.onMenuClose();
        },
      }}
    >
      <p className={css.reset_label}>{data.label}</p>
      {data.type === 'reset' && (
        <p className={css.last_save}>
          {`Saved On: ${moment(rest.selectProps.date).format('MMMM D, YYYY - h:mmA')}`}
        </p>
      )}
    </components.Option>
  );

  return (
    <>
      {data.type === 'undo' && renderOption(rest.selectProps.undo, false, !rest.selectProps.canUndo)}
      {data.type === 'redo' && renderOption(rest.selectProps.redo, false, !rest.selectProps.canRedo)}
      {data.type === 'reset' && renderOption(rest.selectProps.reset, true)}
    </>
  );
};

CustomOption.propTypes = {
  data: PropTypes.object,
  innerProps: PropTypes.object,
  selectProps: PropTypes.object,
};

export default CustomOption;
