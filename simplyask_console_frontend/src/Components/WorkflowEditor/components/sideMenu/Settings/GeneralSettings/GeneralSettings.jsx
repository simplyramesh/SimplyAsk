import { useFormik } from 'formik';
import { MultiDirectedGraph } from 'graphology';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import { useRecoilValue } from 'recoil';
import { useFalloutDestinations } from '../../../../../../hooks/fallout/useFalloutDestinations';
import { organizationProcessTypes } from '../../../../../../store';
import { PROCESS_TRIGGER_DATA_VALUE_SEPARATOR } from '../../../../../ProcessTrigger/utils/constants';
import FormValidationMessage from '../../../../../shared/forms/FormValidationMessage/FormValidationMessage';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import Spinner from '../../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { useHistoricalRecoilState } from '../../../../hooks/useHistoricalRecoilState';
import { isSpecificNodesUsed } from '../../../../services/graph';
import { ERROR_TYPES, processEditorGeneralSettingsValidationSchema } from '../../../../utils/validation';
import { Button, InputField } from '../../base';
import CustomDropdownIndicator from '../../base/inputs/DropdownSelector/CustomDropdownIndicator';
import { Content, LabeledField } from '../../wrappers';
import { dropdownStyles } from '../dropdownStyles';
import ScheduledProcessWarning from '../ScheduledProcessWarning/ScheduledProcessWarning';
import SettingsHeading from '../SettingsHeading/SettingsHeading';
import css from './GeneralSettings.module.css';
import { indicatorSeparatorStyles } from './indicatorSeparator';

const DROPDOWN_FALLOUT_DEFAULT_DESTINATION = { label: 'Symphona Resolve', value: 'SIMPLYASK' };
const DROPDOWN_FALLOUT_DESTINATION_DEFAULT_OPTIONS = [DROPDOWN_FALLOUT_DEFAULT_DESTINATION];

const isTelusEnvActivated = import.meta.env.VITE_IS_TELUS_ENV_ACTIVATED;
isTelusEnvActivated && DROPDOWN_FALLOUT_DESTINATION_DEFAULT_OPTIONS.push();

const INPUT_API_KEYS = {
  displayName: 'displayName',
  falloutDestination: 'falloutDestination',
  processTypeId: 'processTypeId',
};

const LABELED_FIELD_MARGIN_BOTTOM = 10; // area between label and input field

const GeneralSettings = (props) => {
  const { falloutDestinations, isFetching } = useFalloutDestinations({
    select: (res) =>
      res
        ?.filter((destination) => destination.deploymentId)
        ?.map((destination) => ({ label: destination.name, value: destination.deploymentId })) || [],
  });

  const falloutDestinationOptions = falloutDestinations
    ? [...falloutDestinations, ...DROPDOWN_FALLOUT_DESTINATION_DEFAULT_OPTIONS]
    : DROPDOWN_FALLOUT_DESTINATION_DEFAULT_OPTIONS;

  const { value, onChange, onBackClick } = props;

  const [inputParamSets, setInputParamSets] = useState();

  const processTypes = useRecoilValue(organizationProcessTypes);
  const [isSpecificTypeNodeUsed, setIsSpecificTypeNodeUsed] = useState(false);
  const { state } = useHistoricalRecoilState();

  const { workflow } = state;

  const graph = useMemo(() => new MultiDirectedGraph().import(workflow), [state]);

  const { values, errors, isValid } = useFormik({
    enableReinitialize: true,
    validateOnMount: true,
    validationSchema: processEditorGeneralSettingsValidationSchema,
    initialValues: { ...inputParamSets },
  });

  const handleChange = (key, value) => {
    setInputParamSets((prev) => ({ ...prev, [key]: value }));
  };

  const multiSelectStringToArray = (val) => {
    if (!val) return [];

    const values = val.split(PROCESS_TRIGGER_DATA_VALUE_SEPARATOR)?.map((item) => item) || [];

    const filteredOptions = falloutDestinationOptions?.filter((option) => values?.includes(option.value)) || [];

    return filteredOptions;
  };

  const arrayToMultiSelectValue = (val) =>
    val?.map((item) => item.value)?.join(PROCESS_TRIGGER_DATA_VALUE_SEPARATOR) || null;

  const getSelectedProcessType = (id) => processTypes?.find((processType) => processType.id === id);

  const handleSaveClick = () => {
    if (typeof onChange === 'function') {
      const falloutDestination = arrayToMultiSelectValue(inputParamSets?.falloutDestination);

      onChange({ ...inputParamSets, falloutDestination });
      onBackClick((prev) => ({ current: 'settings', previous: prev.current }));
    }
  };

  useEffect(() => {
    onChange((prev) => ({
      ...prev,
      [INPUT_API_KEYS.falloutDestination]:
        prev[INPUT_API_KEYS.falloutDestination] || DROPDOWN_FALLOUT_DEFAULT_DESTINATION.value,
    }));
  }, []);

  useEffect(() => {
    if (value) {
      const falloutDestination = multiSelectStringToArray(value.falloutDestination);

      setInputParamSets({ ...value, falloutDestination });
    }
  }, [value, falloutDestinations]);

  useEffect(() => {
    if (graph && value) {
      setIsSpecificTypeNodeUsed(isSpecificNodesUsed(graph, value.processTypeId));
    }
  }, [graph, value]);

  return (
    <>
      <SettingsHeading
        onBackClick={() => onBackClick((prev) => ({ current: 'settings', previous: prev.current }))}
        heading="General Settings"
      />
      <Content variant="default" gap={!isValid ? 14 : 0}>
        {isSpecificTypeNodeUsed ? (
          <ScheduledProcessWarning altText="The Process has Steps specific to the currently selected Process Type. To change the selected type, please remove any type-specific Steps." />
        ) : null}
        <StyledFlex position="relative">
          {isFetching && <Spinner fadeBgParent medium />}
          <LabeledField label="Workflow Name" marginBottom={LABELED_FIELD_MARGIN_BOTTOM}>
            <InputField
              variant="default"
              placeholder="Workflow Name"
              id={INPUT_API_KEYS.displayName}
              name={INPUT_API_KEYS.displayName}
              value={values.displayName || ''}
              error={errors?.[INPUT_API_KEYS.displayName] && { type: ERROR_TYPES.ERROR }}
              onChange={(e) => handleChange(INPUT_API_KEYS.displayName, e.target.value)}
            />
            <StyledFlex marginTop="7px">
              <FormValidationMessage text={errors?.[INPUT_API_KEYS.displayName]} />
            </StyledFlex>
          </LabeledField>

          <LabeledField label="Fallout Destination" marginBottom={LABELED_FIELD_MARGIN_BOTTOM}>
            <CustomSelect
              options={falloutDestinationOptions}
              placeholder="Select Fallout Destination..."
              value={values[INPUT_API_KEYS.falloutDestination]}
              form
              closeMenuOnScroll
              isMulti
              onChange={(val) => handleChange(INPUT_API_KEYS.falloutDestination, val)}
              components={{
                DropdownIndicator: CustomDropdownIndicator,
              }}
              isClearable={false}
            />

            <StyledFlex marginTop="7px">
              <FormValidationMessage text={errors?.[INPUT_API_KEYS.falloutDestination]} />
            </StyledFlex>
          </LabeledField>

          <LabeledField label="Process Type" marginBottom={LABELED_FIELD_MARGIN_BOTTOM}>
            {processTypes?.length > 1 ? (
              <Select
                components={{ DropdownIndicator: CustomDropdownIndicator }}
                value={getSelectedProcessType(values.processTypeId)}
                onChange={(e) => {
                  values.processTypeId = e.id;
                  handleChange(INPUT_API_KEYS.processTypeId, e.id);
                }}
                styles={{ ...dropdownStyles, ...indicatorSeparatorStyles }}
                options={processTypes}
                getOptionLabel={(option) => option?.name}
                getOptionValue={(option) => option?.id}
                maxMenuHeight={300}
                isSearchable={false}
                closeMenuOnScroll
                closeMenuOnSelect
                isDisabled={isSpecificTypeNodeUsed}
                openMenuOnClick
              />
            ) : (
              <StyledText>{getSelectedProcessType(values.processTypeId)?.name || 'Standard'}</StyledText>
            )}
          </LabeledField>
          <LabeledField>
            <div className={css.save_button}>
              <Button
                text="Save"
                variant={isValid ? 'filled' : 'disabled'}
                radius="ten"
                onClick={handleSaveClick}
                disabled={!isValid}
              />
            </div>
          </LabeledField>
        </StyledFlex>
      </Content>
    </>
  );
};

export default GeneralSettings;

GeneralSettings.propTypes = {
  value: PropTypes.shape({
    displayName: PropTypes.string,
    falloutDestination: PropTypes.string,
  }),
  onChange: PropTypes.func,
  onBackClick: PropTypes.func,
};
