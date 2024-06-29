import PropTypes from 'prop-types';

import CloseIcon from '../../../../Assets/Icons/closeIcon.svg?component';
import css from './AddedInputItem.module.css';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';

const AddedInputItem = ({ title, value, onRemove }) => {

    const renderValue = (value) => {
        if(typeof value === 'string' || value instanceof String) {
            return value;
        } else if(value instanceof Object) {
            return value.paramName;
        }
        return "N/A";
    }

  return (
    <div className={css.added}>
      <StyledFlex direction="row" width="100%">
        <StyledText weight={600} ellipsis>
          {title}
          {' - '}
          <StyledText display="inline">{renderValue(value)}</StyledText>
        </StyledText>
      </StyledFlex>
      <span className={css.added_icon} onClick={onRemove}>
        <CloseIcon />
      </span>
    </div>
  );
};

export default AddedInputItem;

AddedInputItem.propTypes = {
  title: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  onRemove: PropTypes.func,
};
