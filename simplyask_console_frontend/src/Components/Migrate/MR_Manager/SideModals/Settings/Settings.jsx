/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { setAllMrManagerSettings } from '../../../../../Services/axios/migrate';
import { checkIfArrayContainsTrue } from '../../../../../utils/helperFunctions';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import TextField from '../../../../shared/TextField/TextField';
import { SAVE_BUTTON_KEYS, SAVE_BUTTON_KEYS_SCHEMA, SETTINGS_SIDE_MODAL_KEYS } from '../../MR_Manager';
import classes from './Settings.module.css';

const HIDDEN_BUTTON_ID = 'useHiddenButtonToTriggerFormApi';

const HeaderComponent = ({ name }) => {
  return (
    <div className={classes.headers}>
      <div className={classes.headersLine} />
      <StyledText weight={600} mt={30} mb={30}>{name}</StyledText>
    </div>
  );
};

const Settings = ({
  settingsSideModalFormCollector,
  settingSideModalDataFetching,
  settingSideModalDataRefetch,
  migrationWorkflows,
  migrationWorkflowsLoading,
}) => {
  const [savedFormData, setSavedFormData] = useState();
  const [saveButtonConfigurations, setSaveButtonConfigurations] = useState();
  const [isFormDirty, setIsFormDirty] = useState({});
  const [doesFormContainsError, setDoesFormContainsError] = useState({});
  const [postApiLoader, setPostApiLoader] = useState(false);
  const [migrationWorkflowsOptions, setMigrationWorkflowsOptions] = useState([]);
  const [transformProcess, setTransformProcess] = useState();
  const [notifyProcess, setNotifyProcess] = useState();
  const [loadProcess, setLoadProcess] = useState();
  const [extractProcess, setExtractProcess] = useState();

  useEffect(() => {
    if (migrationWorkflows?.content?.length && !migrationWorkflowsLoading) {
      setMigrationWorkflowsOptions(migrationWorkflows.content.map((workflow) => ({
        value: workflow.workflowId,
        label: workflow.displayName,
      })));
    }
  }, [migrationWorkflows, migrationWorkflowsLoading]);

  useEffect(() => {
    if (settingsSideModalFormCollector) {
      setSavedFormData(settingsSideModalFormCollector);
    }
  }, [settingsSideModalFormCollector]);

  useEffect(() => {
    if (settingsSideModalFormCollector && migrationWorkflowsOptions.length && !migrationWorkflowsLoading) {
      setTransformProcess(getDropdownOption(settingsSideModalFormCollector[SETTINGS_SIDE_MODAL_KEYS.TRANSFORM_PROCESS]));
      setNotifyProcess(getDropdownOption(settingsSideModalFormCollector[SETTINGS_SIDE_MODAL_KEYS.NOTIFY_PROCESS]));
      setExtractProcess(getDropdownOption(settingsSideModalFormCollector[SETTINGS_SIDE_MODAL_KEYS.EXTRACT_PROCESS]));
      setLoadProcess(getDropdownOption(settingsSideModalFormCollector[SETTINGS_SIDE_MODAL_KEYS.LOAD_PROCESS]));
    }
  }, [settingsSideModalFormCollector, migrationWorkflowsOptions, migrationWorkflowsLoading]);

  useEffect(() => {
    setSaveButtonConfigurations(SAVE_BUTTON_KEYS_SCHEMA);
  }, []);

  useEffect(() => {
    const getSubmitButton = document.getElementById(HIDDEN_BUTTON_ID);
    if (getSubmitButton && saveButtonConfigurations[SAVE_BUTTON_KEYS.TRIGGER_API]
      && !saveButtonConfigurations[SAVE_BUTTON_KEYS.IS_BUTTON_DISABLED]) {
      getSubmitButton.click();
    }
  }, [saveButtonConfigurations]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!checkIfArrayContainsTrue(Object.values(doesFormContainsError))
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
    }, [200]);

    return () => { clearTimeout(timer); };
  }, [isFormDirty, doesFormContainsError]);

  const getDropdownOption = (id) => migrationWorkflowsOptions.find((option) => option.value === id);

  const handleSaveButtonClick = () => {
    setSaveButtonConfigurations((prev) => ({
      ...prev,
      [SAVE_BUTTON_KEYS.TRIGGER_API]: true,
    }));
  };

  const yupValidation = Yup.object({
    [SETTINGS_SIDE_MODAL_KEYS.NAME]: Yup.string().required('A name is required'),
    [SETTINGS_SIDE_MODAL_KEYS.DESCRIPTION]: Yup.string().required('A description is required'),
    [SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_EXECUTIONS]: Yup.number().required('A number is required'),
    [SETTINGS_SIDE_MODAL_KEYS.MAX_RECORD_PER_TRANSFORM_BATCH]: Yup.string().required('A number is required'),
    [SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_TRANSFORM_BATCH]: Yup.number().required('A number is required'),
    [SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_TRANSFORM_BATCH_RECORDS]: Yup.string().required('A number is required'),
    [SETTINGS_SIDE_MODAL_KEYS.MAX_RECORD_PER_LOAD_BATCH]: Yup.number().required('A number is required'),
    [SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_PER_LOAD_BATCHES]: Yup.string().required('A number is required'),
    [SETTINGS_SIDE_MODAL_KEYS.LOAD_WAIT_TIMEOUT]: Yup.number().required('A number is required'),
    [SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_BATCHES]: Yup.string().required('A number is required'),
  });

  const selectDefaultOptions = {
    isSearchable: true,
    placeholder: 'Select Process to Execute During This Stage...',
    components: {
      DropdownIndicator: CustomIndicatorArrow,
    },
    closeMenuOnSelect: true,
    isClearable: false,
    maxMenuHeight: 220,
    withSeparator: true,
    mb: 0,
    borderRadius: '10px',
  };

  const handleFormSubmission = async (values) => {
    if (!values) return toast.error('Please correct the input values');

    try {
      setPostApiLoader(true);
      const res = await setAllMrManagerSettings({
        ...values,
        [SETTINGS_SIDE_MODAL_KEYS.EXTRACT_PROCESS]: extractProcess?.value || null,
        [SETTINGS_SIDE_MODAL_KEYS.TRANSFORM_PROCESS]: transformProcess?.value || null,
        [SETTINGS_SIDE_MODAL_KEYS.LOAD_PROCESS]: loadProcess?.value || null,
        [SETTINGS_SIDE_MODAL_KEYS.NOTIFY_PROCESS]: notifyProcess?.value || null,
      });

      if (res) {
        toast.success('The settings has been updated successfully..');
        settingSideModalDataRefetch();
      }
    } catch (error) {
      toast.error('Something went wrong...');
    } finally {
      setPostApiLoader(false);
      setSaveButtonConfigurations((prev) => ({
        ...prev,
        [SAVE_BUTTON_KEYS.TRIGGER_API]: false,
      }));
    }
  };

  return (
    <div
      className={classes.root}
    >
      <button
        className={`${classes.submitButton}
        ${saveButtonConfigurations?.[SAVE_BUTTON_KEYS.IS_BUTTON_DISABLED]
        && classes.disableSubmitButton}`}
        onClick={handleSaveButtonClick}
        type="submit"
      >
        Save
      </button>

      <Scrollbars className={classes.scrollbarRoot}>
        <div className={`${classes.upperSection}
        ${(!savedFormData || postApiLoader || settingSideModalDataFetching) && classes.loaderHeightUpperSection}`}
        >
          <div className={classes.titleRoot}>
            Settings
          </div>
          {!savedFormData || postApiLoader || settingSideModalDataFetching ? (
            <div className={classes.loaderHeight}>
              <Spinner inline />
            </div>
          )
            : (
              <div>
                <Formik
                  initialValues={savedFormData}
                  enableReinitialize
                  validationSchema={yupValidation}
                  onSubmit={handleFormSubmission}
                >

                  <Form>
                    <HeaderComponent
                      name="Project Info"
                    />

                    <div className={classes.textFieldRoot}>
                      <TextField
                        label="Name"
                        name={SETTINGS_SIDE_MODAL_KEYS.NAME}
                        type="text"
                        setIsFormDirty={setIsFormDirty}
                        setDoesFormContainsError={setDoesFormContainsError}
                      />

                      <TextField
                        label="Description"
                        name={SETTINGS_SIDE_MODAL_KEYS.DESCRIPTION}
                        type="text"
                        largeHeightInput
                        setIsFormDirty={setIsFormDirty}
                        setDoesFormContainsError={setDoesFormContainsError}
                      />
                    </div>

                    <HeaderComponent
                      name="Extraction Stage"
                    />

                    <StyledFlex width="100%" mb="24px">
                      <InputLabel label="Associated Process" isOptional={false} />
                      <CustomSelect
                        options={migrationWorkflowsOptions}
                        name={SETTINGS_SIDE_MODAL_KEYS.EXTRACT_PROCESS}
                        value={extractProcess}
                        onChange={(e) => setExtractProcess(e)}
                        {...selectDefaultOptions}
                      />
                    </StyledFlex>

                    <TextField
                      label="Max Concurrent Executions"
                      name={SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_EXECUTIONS}
                      type="text"
                      inputClassName={classes.reduceInputWidth}
                      setIsFormDirty={setIsFormDirty}
                      setDoesFormContainsError={setDoesFormContainsError}

                    />

                    <HeaderComponent
                      name="Transformation Stage"
                    />

                    <StyledFlex width="100%" mb="24px">
                      <InputLabel label="Associated Process" isOptional={false} />
                      <CustomSelect
                        options={migrationWorkflowsOptions}
                        name={SETTINGS_SIDE_MODAL_KEYS.TRANSFORM_PROCESS}
                        value={transformProcess}
                        onChange={(e) => setTransformProcess(e)}
                        {...selectDefaultOptions}
                      />
                    </StyledFlex>

                    <div className={classes.textFieldRoot}>
                      <TextField
                        label="Max Records per Transform Batch"
                        name={SETTINGS_SIDE_MODAL_KEYS.MAX_RECORD_PER_TRANSFORM_BATCH}
                        type="text"
                        inputClassName={classes.reduceInputWidth}
                        setIsFormDirty={setIsFormDirty}
                        setDoesFormContainsError={setDoesFormContainsError}

                      />

                      <TextField
                        label="Max Concurrent Transform Batches"
                        name={SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_TRANSFORM_BATCH}
                        type="text"
                        inputClassName={classes.reduceInputWidth}
                        setIsFormDirty={setIsFormDirty}
                        setDoesFormContainsError={setDoesFormContainsError}

                      />

                      <TextField
                        label="Max Concurrent Transform Batch Records"
                        name={SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_TRANSFORM_BATCH_RECORDS}
                        type="text"
                        inputClassName={classes.reduceInputWidth}
                        setIsFormDirty={setIsFormDirty}
                        setDoesFormContainsError={setDoesFormContainsError}

                      />
                    </div>

                    <HeaderComponent
                      name="Loading Stage"
                    />

                    <StyledFlex width="100%" mb="24px">
                      <InputLabel label="Associated Process" isOptional={false} />
                      <CustomSelect
                        options={migrationWorkflowsOptions}
                        name={SETTINGS_SIDE_MODAL_KEYS.LOAD_PROCESS}
                        value={loadProcess}
                        onChange={(e) => setLoadProcess(e)}
                        {...selectDefaultOptions}
                      />
                    </StyledFlex>

                    <div className={classes.textFieldRoot}>
                      <TextField
                        label="Max Records Per Load Batch"
                        name={SETTINGS_SIDE_MODAL_KEYS.MAX_RECORD_PER_LOAD_BATCH}
                        type="text"
                        inputClassName={classes.reduceInputWidth}
                        setIsFormDirty={setIsFormDirty}
                        setDoesFormContainsError={setDoesFormContainsError}

                      />

                      <TextField
                        label="Max Concurrent Load Batches"
                        name={SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_PER_LOAD_BATCHES}
                        type="text"
                        inputClassName={classes.reduceInputWidth}
                        setIsFormDirty={setIsFormDirty}
                        setDoesFormContainsError={setDoesFormContainsError}

                      />

                      <TextField
                        label="Load Wait Timeout (sec)"
                        name={SETTINGS_SIDE_MODAL_KEYS.LOAD_WAIT_TIMEOUT}
                        type="text"
                        inputClassName={classes.reduceInputWidth}
                        setIsFormDirty={setIsFormDirty}
                        setDoesFormContainsError={setDoesFormContainsError}

                      />
                    </div>

                    <HeaderComponent
                      name="Notification & Reconciliation Stage"
                    />

                    <StyledFlex width="100%" mb="24px">
                      <InputLabel label="Associated Process" isOptional={false} />
                      <CustomSelect
                        options={migrationWorkflowsOptions}
                        name={SETTINGS_SIDE_MODAL_KEYS.NOTIFY_PROCESS}
                        value={notifyProcess}
                        onChange={(e) => setNotifyProcess(e)}
                        {...selectDefaultOptions}
                      />
                    </StyledFlex>

                    <TextField
                      label="Max Concurrent Batches"
                      name={SETTINGS_SIDE_MODAL_KEYS.MAX_CONCURRENT_BATCHES}
                      type="text"
                      inputClassName={classes.reduceInputWidth}
                      setIsFormDirty={setIsFormDirty}
                      setDoesFormContainsError={setDoesFormContainsError}

                    />
                    <button
                      className={classes.hideBtn}
                      type="submit"
                      id={HIDDEN_BUTTON_ID}
                      onClick={() => console.log('fired')}
                    >
                      Confirm
                    </button>
                  </Form>
                </Formik>
              </div>
            )}
        </div>
      </Scrollbars>

    </div>
  );
};

export default Settings;

Settings.propTypes = {
  settingsSideModalFormCollector: PropTypes.object,
  settingSideModalDataFetching: PropTypes.bool,
  settingSideModalDataRefetch: PropTypes.func,
};

HeaderComponent.propTypes = {
  name: PropTypes.string,
};
