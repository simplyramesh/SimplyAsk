import { useCallback, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';

import { VALIDATION_TYPES } from '../../../../../../PublicFormPage/constants/validationTypes';
import FormErrorMessage from '../../../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import BaseTextInput from '../../../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CustomSelect from '../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex } from '../../../../../../shared/styles/styled';
import CustomDropdownIndicator from '../../../base/inputs/DropdownSelector/CustomDropdownIndicator';
import { GROUPED_VALIDATION_TYPES_OPTIONS, VALIDATION_TYPES_OPTIONS } from '../../../SideMenu/validationTypes';
import DynamicParamInput from '../../DynamicParamInput/DynamicParamInput';
import SettingsHeading from '../../SettingsHeading/SettingsHeading';

const PARAM_PROPS = {
  PARAM_NAME: 'paramName',
  VALIDATION_TYPE: 'validationType',
  VALUE: 'value',
};

const NewTestInputParam = ({ onBackClick, onConfirmClick, headingPromptText }) => {
  const [param, setParam] = useState({
    [PARAM_PROPS.PARAM_NAME]: '',
    [PARAM_PROPS.VALIDATION_TYPE]: GROUPED_VALIDATION_TYPES_OPTIONS[0].options[0].value,
    [PARAM_PROPS.VALUE]: '',
  });

  const [valueError, setValueError] = useState(false);

  const handleChange = useCallback(
    (e) => {
      const propName = e.target ? e.target.name : PARAM_PROPS.VALIDATION_TYPE;
      const value = e.target ? e.target.value : e.value;

      setParam((prev) => ({
        ...prev,
        [propName]: value,
      }));
    },
    [param]
  );

  const getInitialValueByType = (type) => {
    if (type === VALIDATION_TYPES.BOOLEAN) {
      return true;
    }

    return '';
  };

  const onValueChange = (value) =>
    setParam({
      ...param,
      [PARAM_PROPS.VALUE]: value,
    });

  const onTypeChange = (option) => {
    const { value } = option;

    setParam({
      ...param,
      [PARAM_PROPS.VALIDATION_TYPE]: value,
      [PARAM_PROPS.VALUE]: getInitialValueByType(value),
    });
    setValueError(null);
  };

  const handleConfirmClick = () => {
    onConfirmClick((prev) => ({
      ...prev,
      inputParamSets: [
        {
          ...prev?.inputParamSets[0],
          name: 'Parameters',
          orderNumber: 0,
          staticInputParams: [...prev.inputParamSets[0]?.staticInputParams, param],
        },
      ],
    }));

    closePanel();
  };

  const closePanel = () => onBackClick((prev) => ({ current: prev.previous, previous: prev.current }));

  const isSumbitDisabled = () => param[PARAM_PROPS.PARAM_NAME] === '' || param[PARAM_PROPS.VALUE] === '' || valueError;

  return (
    <>
      <SettingsHeading heading={`New Default Parameter`} onBackClick={closePanel} promptText={headingPromptText} />

      <Scrollbars id="new-input-param" autoHeight autoHeightMin={500} autoHide>
        <StyledFlex gap={4} ml={3} mr={2}>
          <StyledFlex>
            <InputLabel label="Parameter Name" size={16} weight={600} />
            <BaseTextInput
              placeholder="Parameter Name"
              name={PARAM_PROPS.PARAM_NAME}
              value={param[PARAM_PROPS.PARAM_NAME] || ''}
              onChange={handleChange}
            />
          </StyledFlex>
          <StyledFlex>
            <InputLabel label="Expect Parameter Type" size={16} weight={600} />
            <CustomSelect
              options={GROUPED_VALIDATION_TYPES_OPTIONS}
              placeholder="Select Workflow Parameter"
              name={PARAM_PROPS.VALIDATION_TYPE}
              value={VALIDATION_TYPES_OPTIONS.find((v) => v.value === param[PARAM_PROPS.VALIDATION_TYPE])}
              onChange={onTypeChange}
              components={{ DropdownIndicator: CustomDropdownIndicator }}
              menuPortalTarget={document.body}
              form
              mb={2}
              closeMenuOnSelect
            />
          </StyledFlex>

          <StyledFlex>
            <InputLabel label="Parameter Value" size={16} weight={600} />
            <DynamicParamInput
              placeholder="Parameter Value"
              type={param[PARAM_PROPS.VALIDATION_TYPE]}
              name={PARAM_PROPS.VALUE}
              value={param[PARAM_PROPS.VALUE]}
              isError={valueError}
              onChange={onValueChange}
              onError={(e) => setValueError(e)}
            />
            {valueError && <FormErrorMessage>{valueError}</FormErrorMessage>}
          </StyledFlex>

          <StyledFlex width="35%" mt={2} alignSelf="center">
            <StyledButton variant="contained" primary disabled={isSumbitDisabled()} onClick={handleConfirmClick}>
              Confirm
            </StyledButton>
          </StyledFlex>
        </StyledFlex>
      </Scrollbars>
    </>
  );
};

export default NewTestInputParam;
