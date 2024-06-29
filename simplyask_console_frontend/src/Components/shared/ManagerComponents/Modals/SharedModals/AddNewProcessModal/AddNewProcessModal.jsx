import CloseIcon from '@mui/icons-material/Close';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useRecoilState } from 'recoil';
import * as Yup from 'yup';

import { organizationProcessTypes } from '../../../../../../store';
import { ADD_NEW_AGENT_KEYS } from '../../../../../Managers/AgentManager/AgentManager';
import { ADD_NEW_PROCESS_KEYS } from '../../../../../Managers/ProcessManager/ProcessManager';
import { VALIDATION_TYPES, VALIDATION_TYPES_REGEX } from '../../../../../PublicFormPage/constants/validationTypes';
import FormErrorMessage from '../../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import { INITIATE_API_KEY, IS_UPDATING_ELEMENT, TAGS_KEY } from '../../../../constants/core';
import BaseTextInput from '../../../../REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledLoadingButton } from '../../../../REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../REDISIGNED/controls/InputLabel/InputLabel';
import TagsInput from '../../../../REDISIGNED/controls/TagsInput/TagsInput';
import CustomSelect from '../../../../REDISIGNED/selectMenus/CustomSelect';
import Spinner from '../../../../Spinner/Spinner';
import { StyledFlex } from '../../../../styles/styled';
import { DEACTIVATE_TRIGGER_API, SAVE_BUTTON_KEYS } from '../../../SideModals/SettingsSideDrawer/SettingsSideDrawer';

import { InfoOutlined } from '@mui/icons-material';
import { ADD_NEW_TEST_SUITE_KEYS } from '../../../../../../utils/constants';
import { AgentTypeOptions } from '../../../../../Managers/AgentManager/constants/core';
import CustomIndicatorArrow from '../../../../REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import { IconOption } from '../../../../REDISIGNED/selectMenus/customComponents/options/IconOption';
import { StyledTooltip } from '../../../../REDISIGNED/tooltip/StyledTooltip';
import classes from './AddNewProcessModal.module.css';

const HIDDEN_BUTTON_ID = 'useHiddenButtonToTriggerFormApi';

const NAME_MAX_LEN = 52;
const DESC_MAX_LEN = 78;

const MODAL_TITLE_SCHEMA = {
  headerTitle: '',
  elementTitleName: '',
  descriptionTitleName: '',
  tagsTitleName: '',
};

const AddNewProcessModal = ({
  setShowAddNewElementModal = () => {},
  setAddNewElementFormCollector,
  dataCollector,
  activateEditElementSideModal = false,
  isTestManagerView = false,
  isProcessManagerView = false,
  isAgentManagerView = false,
  ADD_NEW_MODAL_TITLES,
  isApiLoading,
  setSaveButtonConfigurations = () => {},
  saveButtonConfigurations = {},
  deactivateTriggerApi,
}) => {
  const [savedFormData, setSavedFormData] = useState();
  const [titleSchemaData, setTitleSchemaData] = useState(MODAL_TITLE_SCHEMA);
  const [tags, setTags] = useState({});
  const [processTypes] = useRecoilState(organizationProcessTypes);
  const [processTypesOptions, setProcessTypesOptions] = useState([]);
  const [selectedOptionProcessType, setSelectedOptionProcessType] = useState(null);

  const [agentTypeOptionValue, setAgentTypeOptionValue] = useState(AgentTypeOptions[0]);

  useEffect(() => {
    if (dataCollector) {
      setTitleSchemaData(ADD_NEW_MODAL_TITLES);
      setSavedFormData(dataCollector);
      setSaveButtonConfigurations((prev) => ({
        ...prev,
        [SAVE_BUTTON_KEYS.IS_BUTTON_DISABLED]: false,
      }));
    }

    setTags(
      dataCollector[TAGS_KEY].map((tag) => {
        const tagValue = tag.name ?? tag;

        return { value: tagValue, label: tagValue };
      })
    );
  }, [dataCollector]);

  useEffect(() => {
    if (processTypes?.length) {
      setProcessTypesOptions(processTypes.map((type) => ({ value: type.id, label: type.name })));
    }
  }, [processTypes]);

  useEffect(() => {
    if (processTypesOptions?.length && dataCollector) {
      if (dataCollector.processTypeId) {
        const processTypeOption =
          processTypesOptions.find((option) => option.value === dataCollector.processTypeId) ?? '';

        setSelectedOptionProcessType(processTypeOption);
      } else {
        setSelectedOptionProcessType(processTypesOptions[0]);
      }
    }
  }, [processTypesOptions, dataCollector]);

  useEffect(() => {
    const getSubmitButton = document.getElementById(HIDDEN_BUTTON_ID);
    if (saveButtonConfigurations[SAVE_BUTTON_KEYS.TRIGGER_API]) {
      getSubmitButton.click();
    }
  }, [saveButtonConfigurations]);

  const processManagerYupValidation = Yup.object({
    [ADD_NEW_PROCESS_KEYS?.processName]: Yup.string()
      .required('A Process name is required')
      .max(NAME_MAX_LEN, 'Up to 52 characters allowed')
      .test('is-first-char-alpha', 'The first character must be an alphabet letter', (value) =>
        VALIDATION_TYPES_REGEX[VALIDATION_TYPES.ALPHABET].test(value?.[0])
      ),
    [ADD_NEW_PROCESS_KEYS?.processDescription]: Yup.string().max(DESC_MAX_LEN, 'Up to 78 characters allowed'),
  });

  const agentManagerYupValidation = Yup.object({
    [ADD_NEW_AGENT_KEYS?.agentName]: Yup.string()
      .required('An Agent name is required')
      .max(NAME_MAX_LEN, 'Up to 52 characters allowed'),
    [ADD_NEW_AGENT_KEYS?.agentDescription]: Yup.string().max(DESC_MAX_LEN, 'Up to 78 characters allowed'),
  });

  const testManagerYupValidation = Yup.object({
    [ADD_NEW_TEST_SUITE_KEYS?.testName]: Yup.string()
      .required('A Test Suite name is required')
      .max(NAME_MAX_LEN, 'Up to 52 characters allowed'),
    [ADD_NEW_TEST_SUITE_KEYS?.testDescription]: Yup.string()
      .required('A Test Suite description is required')
      .max(DESC_MAX_LEN, 'Up to 78 characters allowed'),
  });

  const handleFormSubmission = async (values) => {
    values[TAGS_KEY] = tags.map(({ value }) => (isAgentManagerView ? value : { name: value }));
    values[IS_UPDATING_ELEMENT] = activateEditElementSideModal;
    values[INITIATE_API_KEY] = true;
    values[DEACTIVATE_TRIGGER_API] = activateEditElementSideModal ? deactivateTriggerApi : null;

    if (isProcessManagerView) {
      values.processTypeId = selectedOptionProcessType.value;
    }

    if (isAgentManagerView) {
      values.type = agentTypeOptionValue.value;
    }

    setAddNewElementFormCollector(() => ({ ...values }));
  };

  const getValidationSchema = () => {
    if (isTestManagerView) return testManagerYupValidation;
    if (isProcessManagerView) return processManagerYupValidation;
    if (isAgentManagerView) return agentManagerYupValidation;
  };

  const getTextFieldName = () => {
    if (isTestManagerView) return ADD_NEW_TEST_SUITE_KEYS.testName;
    if (isProcessManagerView) return ADD_NEW_PROCESS_KEYS.processName;
    if (isAgentManagerView) return ADD_NEW_AGENT_KEYS.agentName;
  };

  const getTextFieldDesc = () => {
    if (isTestManagerView) return ADD_NEW_TEST_SUITE_KEYS.testDescription;
    if (isProcessManagerView) return ADD_NEW_PROCESS_KEYS.processDescription;
    if (isAgentManagerView) return ADD_NEW_AGENT_KEYS.agentDescription;
  };

  const getSelectComponent = ({ label, options, value, onChange, tooltipTitle, iconOption }) => (
    <StyledFlex mb={2}>
      <StyledFlex direction="row" gap="10px" alignItems="center" mb="8px">
        <InputLabel label={label} mb={0} />
        <StyledTooltip arrow placement="top" title={tooltipTitle} p="10px 15px">
          <InfoOutlined fontSize="inherit" />
        </StyledTooltip>
      </StyledFlex>
      <CustomSelect
        options={options}
        value={value}
        mb={0}
        closeMenuOnSelect
        components={{
          DropdownIndicator: CustomIndicatorArrow,
          ...(iconOption && { Option: IconOption }),
        }}
        form
        onChange={onChange}
        isClearable={false}
        isSearchable={false}
      />
    </StyledFlex>
  );

  if (!savedFormData) return <Spinner global />;

  return (
    <div
      className={`${classes.root}
    ${activateEditElementSideModal && classes.sideModalRoot}`}
    >
      {isApiLoading && <Spinner fadeBgParentFixedPosition roundedBg />}
      {!activateEditElementSideModal && (
        <div className={classes.flex_row_bg_orange}>
          <div className={classes.newProcess}>{titleSchemaData?.headerTitle ?? '---'}</div>
          <div className={classes.closeIconRoot} onClick={() => setShowAddNewElementModal(false)}>
            <CloseIcon className={classes.closeIconSvg} />
          </div>
        </div>
      )}

      <Scrollbars>
        <Formik
          initialValues={savedFormData}
          enableReinitialize
          validationSchema={getValidationSchema()}
          onSubmit={handleFormSubmission}
          onChange={(e) => console.log(e)}
          validateOnMount
        >
          {({ values, errors, setFieldValue, touched, submitForm }) => (
            <StyledFlex p="24px 20px">
              <StyledFlex mb={2}>
                <InputLabel label={titleSchemaData?.elementTitleName} />
                <BaseTextInput
                  name={getTextFieldName()}
                  type="text"
                  value={values[getTextFieldName()]}
                  onChange={(e) => setFieldValue(getTextFieldName(), e.target.value)}
                  invalid={touched[getTextFieldName()] && errors[getTextFieldName()]}
                  showLength
                  maxLength={NAME_MAX_LEN}
                />
                {touched[getTextFieldName()] && errors[getTextFieldName()] && (
                  <FormErrorMessage>{errors[getTextFieldName()]}</FormErrorMessage>
                )}
              </StyledFlex>
              <StyledFlex mb={2}>
                <InputLabel label={titleSchemaData?.descriptionTitleName} isOptional />
                <BaseTextInput
                  name={getTextFieldDesc()}
                  type="text"
                  value={values[getTextFieldDesc()]}
                  onChange={(e) => setFieldValue(getTextFieldDesc(), e.target.value)}
                  invalid={touched[getTextFieldDesc()] && errors[getTextFieldDesc()]}
                  showLength
                  maxLength={DESC_MAX_LEN}
                />

                {touched[getTextFieldDesc()] && errors[getTextFieldDesc()] && (
                  <FormErrorMessage>{errors[getTextFieldDesc()]}</FormErrorMessage>
                )}
              </StyledFlex>

              {isAgentManagerView &&
                getSelectComponent({
                  label: titleSchemaData?.agentType,
                  options: AgentTypeOptions,
                  value: agentTypeOptionValue || AgentTypeOptions[0],
                  onChange: (e) => setAgentTypeOptionValue(e),
                  tooltipTitle:
                    'Select the Type of agent you would like to create. Generative Agents support flexible conversation flows whereas Structured Agents follow a defined set of conversation steps.',
                  iconOption: true,
                })}

              {isProcessManagerView &&
                getSelectComponent({
                  label: 'Process Type',
                  options: processTypesOptions,
                  value: selectedOptionProcessType || processTypesOptions[0],
                  onChange: (e) => setSelectedOptionProcessType(e),
                  tooltipTitle: 'Process Type',
                })}

              <StyledFlex>
                <InputLabel label={titleSchemaData?.tagsTitleName} isOptional />
                <TagsInput
                  value={tags}
                  onCreateOption={(tag) => setTags((prev) => [...prev, { value: tag, label: tag }])}
                  onChange={(e) => setTags(e)}
                  placeholder="Create..."
                />
              </StyledFlex>

              <StyledFlex alignItems="flex-end" mt={3} display={activateEditElementSideModal ? 'none' : 'flex'}>
                <StyledLoadingButton
                  primary
                  variant="contained"
                  id={HIDDEN_BUTTON_ID}
                  onClick={submitForm}
                  loading={isApiLoading}
                >
                  Confirm
                </StyledLoadingButton>
              </StyledFlex>
            </StyledFlex>
          )}
        </Formik>
      </Scrollbars>
    </div>
  );
};

export default AddNewProcessModal;

AddNewProcessModal.propTypes = {
  setShowAddNewElementModal: PropTypes.func,
  setAddNewElementFormCollector: PropTypes.func,
  dataCollector: PropTypes.object,
  activateEditElementSideModal: PropTypes.bool,
  isTestManagerView: PropTypes.bool,
  isProcessManagerView: PropTypes.bool,
  isAgentManagerView: PropTypes.bool,
  ADD_NEW_MODAL_TITLES: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
  isApiLoading: PropTypes.bool,
  setSaveButtonConfigurations: PropTypes.func,
  saveButtonConfigurations: PropTypes.object,
  deactivateTriggerApi: PropTypes.func,
};
