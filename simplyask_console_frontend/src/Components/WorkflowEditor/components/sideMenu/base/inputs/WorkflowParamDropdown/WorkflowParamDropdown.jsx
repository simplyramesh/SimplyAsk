import classnames from 'classnames';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { useRecoilValue } from 'recoil';

import { fullyAndPotentiallyParams } from '../../../../../store/selectors';
import { ERROR_TYPES } from '../../../../../utils/validation';
import AddDeleteButton from '../AddDeleteButton/AddDeleteButton';
import { dropdownStyles } from './dropdownStyles';
import css from './WorkflowParamDropdown.module.css';
import CustomIndicatorArrow from "../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow";
import CustomParamOption from "../DropdownSelector/CustomParamOption";
import CustomParamMenuList from "../DropdownSelector/CustomParamMenuList";
import { isEqual } from "lodash";

const WorkflowParamDropdown = ({
  name, placeholder, value, error, onChange, plusIcon, isMulti, deleteIcon, onIconClick, isDisabled, disabledOption, ...props
}) => {
  const { flatParams } = useRecoilValue(fullyAndPotentiallyParams);

  console.log(flatParams)

  return (
    <>
      <div className={css.wrapper}>
        <div className={css.container}>
          <Select
            className={classnames({
              [css.disabled]: isDisabled,
              [css.error]: error?.type === ERROR_TYPES.ERROR,
              [css.warning]: error?.type === ERROR_TYPES.WARNING,
            })}
            components={{
              DropdownIndicator: CustomIndicatorArrow,
              Option: CustomParamOption,
              Menu: CustomParamMenuList,
            }}
            maxMenuHeight={360}
            placeholder={placeholder}
            name={name}
            options={flatParams}
            value={flatParams.find((option) => isEqual(option, value)) || null}
            onChange={onChange}
            styles={dropdownStyles}
            closeMenuOnSelect
            closeMenuOnScroll
            isMulti={isMulti}
            isDisabled={isDisabled}
            isOptionDisabled={(option) => option.label === disabledOption}
            error={error?.type}
            menuPlacement="auto"
            menuPortalTarget={document.body}
            {...props}
          />
        </div>
        {(plusIcon || deleteIcon) && (
          <AddDeleteButton
            onIconClick={onIconClick}
            plusIcon={plusIcon}
            deleteIcon={deleteIcon}
          />
        )}
      </div>

    </>
  );
};

export default WorkflowParamDropdown;

WorkflowParamDropdown.propTypes = {
  name: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.arrayOf(PropTypes.object)]),
  error: PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
  }),
  onChange: PropTypes.func,
  plusIcon: PropTypes.bool,
  isMulti: PropTypes.bool,
  deleteIcon: PropTypes.bool,
  onIconClick: PropTypes.func,
};
