import CloseIcon from '@mui/icons-material/Close';
import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { toast } from 'react-toastify';
import { Button } from 'simplexiar_react_components';
import * as Yup from 'yup';

import { ADD_NEW_TEST_CASE_KEYS, ADD_NEW_TEST_SUITE_KEYS } from '../../../../../../utils/constants';
import { checkIfArrayContainsTrue } from '../../../../../../utils/helperFunctions';
import InputLabel from '../../../../REDISIGNED/controls/InputLabel/InputLabel';
import CustomSelect from '../../../../REDISIGNED/selectMenus/CustomSelect';
import Spinner from '../../../../Spinner/Spinner';
import TextField from '../../../../TextField/TextField';
import { EXECUTION_FRAMEWORKS } from '../../../../constants/core';
import { StyledFlex } from '../../../../styles/styled';
import { DEACTIVATE_TRIGGER_API, SAVE_BUTTON_KEYS } from '../../../SideModals/SettingsSideDrawer/SettingsSideDrawer';
import classes from './AddNewTestCaseModal.module.css';

export const IS_UPDATING_ELEMENT = 'isUpdating';

export const INITIATE_API_KEY = 'initiateApi';

export const TAGS_KEY = 'tags';

const HIDDEN_BUTTON_ID = 'useHiddenButtonToTriggerFormApi';

const NAME_MAX_LEN = 52;
const DESC_MAX_LEN = 78;

const MODAL_TITLE_SCHEMA = {
  headerTitle: '',
  elementTitleName: '',
  descriptionTitleName: '',
  tagsTitleName: '',
};

const AddNewTestCaseModal = ({
  setShowAddNewElementModal = () => {},
  dataCollector,
  activateEditElementSideModal = false,
  ADD_NEW_MODAL_TITLES,
  isApiLoading,
  setAddNewElementFormCollector,
  setSaveButtonConfigurations = () => {},
  saveButtonConfigurations = {},
  addNewTestCaseToSuite,
  deactivateTriggerApi,
  setActiveMenu,
}) => {
  const EXECUTION_FRAMEWORK_OPTIONS = [
    {
      label: 'Cucumber',
      value: EXECUTION_FRAMEWORKS.CUCUMBER,
    },
    {
      label: 'Symphona Test Framework (RPA)',
      value: EXECUTION_FRAMEWORKS.RPA,
    },
  ];

  const [savedFormData, setSavedFormData] = useState(
    activateEditElementSideModal
      ? null
      : {
          [ADD_NEW_TEST_CASE_KEYS.testCaseType]: EXECUTION_FRAMEWORK_OPTIONS[0],
        }
  );
  const [titleSchemaData, setTitleSchemaData] = useState(MODAL_TITLE_SCHEMA);
  const [isFormDirty, setIsFormDirty] = useState({});
  const [doesFormContainsError, setDoesFormContainsError] = useState({});

  useEffect(() => {
    if (dataCollector && !isApiLoading) {
      setTitleSchemaData(ADD_NEW_MODAL_TITLES);
      setSavedFormData(dataCollector);
    }
  }, [dataCollector, isApiLoading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        checkIfArrayContainsTrue(Object.values(isFormDirty)) &&
        !checkIfArrayContainsTrue(Object.values(doesFormContainsError))
      ) {
        setSaveButtonConfigurations((prev) => ({
          ...prev,
          [SAVE_BUTTON_KEYS.IS_BUTTON_DISABLED]: false,
        }));
      } else {
        setSaveButtonConfigurations((prev) => ({
          ...prev,
          [SAVE_BUTTON_KEYS.IS_BUTTON_DISABLED]: true,
        }));
      }
    }, [400]);

    return () => {
      clearTimeout(timer);
    };
  }, [isFormDirty]);

  useEffect(() => {
    const getSubmitButton = document.getElementById(HIDDEN_BUTTON_ID);
    if (getSubmitButton && saveButtonConfigurations[SAVE_BUTTON_KEYS.TRIGGER_API]) {
      getSubmitButton.click();
    }
  }, [saveButtonConfigurations]);

  const testManagerYupValidation = Yup.object({
    [ADD_NEW_TEST_CASE_KEYS?.name]: Yup.string()
      .required('A Test Case name is required')
      .max(NAME_MAX_LEN, 'Upto 52 characters allowed'),
    [ADD_NEW_TEST_CASE_KEYS?.description]: Yup.string()
      .required('A Test Case description is required')
      .max(DESC_MAX_LEN, 'Upto 78 characters allowed'),
  });

  const handleFormSubmission = async (values) => {
    if (!values) return toast.error('Something went wrong ...');
    values[DEACTIVATE_TRIGGER_API] = activateEditElementSideModal ? deactivateTriggerApi : null;
    values[ADD_NEW_TEST_SUITE_KEYS.TEST_CASE_ID] = dataCollector?.[ADD_NEW_TEST_SUITE_KEYS.TEST_CASE_ID];
    values[ADD_NEW_TEST_CASE_KEYS.testCaseType] =
      values[ADD_NEW_TEST_CASE_KEYS.testCaseType]?.value || EXECUTION_FRAMEWORKS.CUCUMBER;
    values.setActiveMenu = setActiveMenu;
    setAddNewElementFormCollector({ ...values }, activateEditElementSideModal);

    addNewTestCaseToSuite({ ...values }, activateEditElementSideModal);
  };

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
      {activateEditElementSideModal ? (
        <Scrollbars>
          <Formik
            initialValues={savedFormData}
            enableReinitialize
            validationSchema={testManagerYupValidation}
            onSubmit={handleFormSubmission}
          >
            <div
              className={`${classes.formRoot}
                ${classes.activateEditElementSideModal}`}
            >
              <Form>
                <div className={classes.flex_col_form}>
                  <TextField
                    label={titleSchemaData?.elementTitleName}
                    name={ADD_NEW_TEST_CASE_KEYS.name}
                    type="text"
                    showCharacterCount={NAME_MAX_LEN}
                    setIsFormDirty={setIsFormDirty}
                    setDoesFormContainsError={setDoesFormContainsError}
                  />
                  <TextField
                    label={titleSchemaData?.descriptionTitleName}
                    name={ADD_NEW_TEST_CASE_KEYS.description}
                    type="text"
                    largeHeightInput
                    showCharacterCount={DESC_MAX_LEN}
                    setIsFormDirty={setIsFormDirty}
                    setDoesFormContainsError={setDoesFormContainsError}
                  />
                </div>
                <button
                  className={classes.hideBtn}
                  type="submit"
                  id={HIDDEN_BUTTON_ID}
                  onClick={() => console.log('fired')}
                >
                  Confirm
                </button>
              </Form>
            </div>
          </Formik>
        </Scrollbars>
      ) : (
        <Scrollbars>
          <Formik
            initialValues={savedFormData}
            enableReinitialize
            validationSchema={testManagerYupValidation}
            onSubmit={handleFormSubmission}
          >
            {({ setFieldValue, values }) => (
              <div className={`${classes.formRoot}`}>
                <Form>
                  <div className={classes.flex_col_form}>
                    <TextField
                      label={titleSchemaData?.elementTitleName}
                      name={ADD_NEW_TEST_CASE_KEYS.name}
                      type="text"
                      showCharacterCount={NAME_MAX_LEN}
                    />
                    <TextField
                      label={titleSchemaData?.descriptionTitleName}
                      name={ADD_NEW_TEST_CASE_KEYS.description}
                      type="text"
                      largeHeightInput
                      showCharacterCount={DESC_MAX_LEN}
                    />

                    <StyledFlex>
                      <InputLabel label="Execution Framework" />
                      <CustomSelect
                        options={EXECUTION_FRAMEWORK_OPTIONS}
                        onChange={(e) => setFieldValue(ADD_NEW_TEST_CASE_KEYS.testCaseType, e)}
                        value={values[ADD_NEW_TEST_CASE_KEYS.testCaseType]}
                        placeholder="Select Execution Framework"
                        closeMenuOnSelect
                        mb="0"
                        menuPortalTarget={document.body}
                      />
                    </StyledFlex>
                  </div>

                  <div className={`${classes.flex_end}`}>
                    <Button className={classes.continueBtn} type="submit">
                      Confirm
                    </Button>
                  </div>
                </Form>
              </div>
            )}
          </Formik>
        </Scrollbars>
      )}
    </div>
  );
};

export default AddNewTestCaseModal;

AddNewTestCaseModal.propTypes = {
  setShowAddNewElementModal: PropTypes.func,
  dataCollector: PropTypes.object,
  activateEditElementSideModal: PropTypes.bool,
  ADD_NEW_MODAL_TITLES: PropTypes.object,
  isApiLoading: PropTypes.bool,
  setAddNewElementFormCollector: PropTypes.func,
  setSaveButtonConfigurations: PropTypes.func,
  saveButtonConfigurations: PropTypes.object,
  addNewTestCaseToSuite: PropTypes.func,
  deactivateTriggerApi: PropTypes.func,
  setActiveMenu: PropTypes.func,
};
