import { useTheme } from '@emotion/react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
import { Collapse, FormControlLabel } from '@mui/material';
import { useFormik } from 'formik';
import { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useNavigate } from 'react-router-dom';

import { MANAGER_API_KEYS } from '../../../../../../../../config/managerKeys';
import routes from '../../../../../../../../config/routes';
import useIsWorkflowPsfProtected, { IS_WORKFLOW_PSF_PROTECTED_QUERY_KEY } from '../../../../../../../../hooks/process/useIsWorkflowPsfProtected';
import useCopyToClipboard from '../../../../../../../../hooks/useCopyToClipboard';
import { useGetCurrentUser } from '../../../../../../../../hooks/useGetCurrentUser';
import FormErrorMessage from '../../../../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import BaseTextInput from '../../../../../../REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../../../REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../../../REDISIGNED/controls/InputLabel/InputLabel';
import PasswordInput from '../../../../../../REDISIGNED/controls/PasswordInput/PasswordInput';
import OpenIcon from '../../../../../../REDISIGNED/icons/svgIcons/OpenIcon';
import ConfirmationModal from '../../../../../../REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import { StyledTooltip } from '../../../../../../REDISIGNED/tooltip/StyledTooltip';
import {
  StyledDivider,
  StyledFlex,
  StyledIconButton,
  StyledSwitch,
  StyledText,
  StyledTextField,
} from '../../../../../../styles/styled';
import useGetWorkflowSettingsDto, { WORKFLOW_SETTINGS_DTO_QUERY_KEY } from '../../../hooks/useGetWorkflowSettingsDtoById';
import useSavePsfSettings from '../../../hooks/useSavePsfSettings';
import { CHANGE_PROCESS_MANAGER_MENUS } from '../../../SettingsSideDrawer';

import { PUBLIC_SUBMISSION_FORM, PUBLIC_SUBMISSION_FORM_INITIAL_VALUES } from './formConstants';
import { publicSubmissionFormValidationSchema } from './validationSchema';

const PublicSubmissionForm = ({ setActiveMenu, clickedProcess }) => {
  const navigate = useNavigate();

  const { colors } = useTheme();

  const { copyToClipboard } = useCopyToClipboard();
  const { currentUser } = useGetCurrentUser();

  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState(false);

  const { isWorkflowPsfProtected, isWorkflowPsfProtectedFetching, isWorkflowPsfProtectedFetched } = useIsWorkflowPsfProtected({
    processId: clickedProcess[MANAGER_API_KEYS.WORKFLOW_ID],
    enabled: !!clickedProcess[MANAGER_API_KEYS.WORKFLOW_ID],
  });

  const { savePsfSettings } = useSavePsfSettings();
  const {
    workflowDtoSettings,
  } = useGetWorkflowSettingsDto({
    workflowId: clickedProcess[MANAGER_API_KEYS.WORKFLOW_ID],
    options: {
      enabled: !!clickedProcess[MANAGER_API_KEYS.WORKFLOW_ID] && !isWorkflowPsfProtectedFetching && isWorkflowPsfProtectedFetched,
      select: (data) => ({
        ...data?.psfSettings,
        isPasswordEnabled: isWorkflowPsfProtected,
      }),
    },
  });

  const {
    values, setFieldValue, errors, touched, handleSubmit, handleBlur, dirty,
  } = useFormik({
    enableReinitialize: true,
    validateOnBlur: true,
    initialValues: {
      ...PUBLIC_SUBMISSION_FORM_INITIAL_VALUES,
      ...workflowDtoSettings,
      isEnabled: !!workflowDtoSettings?.[PUBLIC_SUBMISSION_FORM.TITLE] || !!workflowDtoSettings?.[PUBLIC_SUBMISSION_FORM.DESCRIPTION] || false,
      isPasswordEnabled: workflowDtoSettings?.isPasswordEnabled || false,
      link: `${window.location.origin}/forms/${currentUser?.organization?.id}/${clickedProcess?.workflowId}`,
      showPassword: false,
      isCopied: false,
    },
    validationSchema: publicSubmissionFormValidationSchema,
    onSubmit: (submitValues) => {
      savePsfSettings({
        invalidateQueries: [WORKFLOW_SETTINGS_DTO_QUERY_KEY, IS_WORKFLOW_PSF_PROTECTED_QUERY_KEY],
        workflowId: clickedProcess.workflowId,
        payload: {
          [PUBLIC_SUBMISSION_FORM.TITLE]: submitValues[PUBLIC_SUBMISSION_FORM.IS_ENABLED] ? submitValues[PUBLIC_SUBMISSION_FORM.TITLE] : '',
          [PUBLIC_SUBMISSION_FORM.DESCRIPTION]: submitValues[PUBLIC_SUBMISSION_FORM.IS_ENABLED] ? submitValues[PUBLIC_SUBMISSION_FORM.DESCRIPTION] : '',
          [PUBLIC_SUBMISSION_FORM.IS_ENABLED]: submitValues[PUBLIC_SUBMISSION_FORM.IS_ENABLED],
          [PUBLIC_SUBMISSION_FORM.PASSWORD]: submitValues[PUBLIC_SUBMISSION_FORM.IS_ENABLED] && submitValues.isPasswordEnabled
            ? submitValues[PUBLIC_SUBMISSION_FORM.PASSWORD]
            : null,
        },
      });
      setActiveMenu((prev) => ({
        ...prev,
        ...CHANGE_PROCESS_MANAGER_MENUS.PRIMARY_MENU,
      }));
    },
  });

  const renderInfoTooltipIcon = (text) => (
    <StyledTooltip
      title={(
        <StyledFlex alignItems="center">
          <StyledText size="14" weight="500" width="259px" textAlign="center" color={colors.white}>
            {text}
          </StyledText>
        </StyledFlex>
      )}
      arrow
      placement="top"
      p="10px 15px"
      maxWidth="auto"
    >
      <StyledFlex as="span"><InfoOutlinedIcon /></StyledFlex>
    </StyledTooltip>
  );

  const renderSwitchWithLabel = (name, label, tooltipText = '') => (
    <StyledFlex ml="10px">
      <FormControlLabel
        control={(
          <StyledSwitch
            name={name}
            value={values[name]}
            onChange={(e) => setFieldValue(name, e.target.checked)}
            checked={values[name]}
          />
        )}
        label={(
          <StyledFlex direction="row" gap="0 10px" ml="10px" alignItems="center">
            <StyledText weight={500}>{label}</StyledText>
            {tooltipText ? renderInfoTooltipIcon(tooltipText) : null}
          </StyledFlex>
        )}
      />
    </StyledFlex>
  );

  const renderErrorMessage = (message) => (message
    ? (
      <StyledFlex position="absolute" bottom="-20px" left="0">
        <FormErrorMessage>{message}</FormErrorMessage>
      </StyledFlex>
    )
    : null);

  return (
    <>
      <StyledFlex position="relative" height="100%" pb="100px" ml="-18px">
        <StyledFlex position="absolute" top="-40px" right="20px">
          <StyledButton
            primary
            variant="contained"
            position="absolute"
            onClick={handleSubmit}
          >
            Save
          </StyledButton>
        </StyledFlex>
        <StyledFlex direction="row" gap="15px" p="20px 24px" alignItems="center">
          <StyledIconButton
            size="32px"
            iconSize="27px"
            bgColor="transparent"
            hoverBgColor={colors.galleryGray}
            onClick={() => {
              dirty
                ? setIsUnsavedChangesModalOpen(true)
                : setActiveMenu((prev) => ({
                  ...prev,
                  ...CHANGE_PROCESS_MANAGER_MENUS.PRIMARY_MENU,
                }));
            }}
          >
            <KeyboardBackspaceRoundedIcon />
          </StyledIconButton>
          <StyledText as="h2" size={19} weight={600} lh={25}>Public Submission Form</StyledText>
        </StyledFlex>
        <StyledDivider m="30px 0 30px 0" borderWidth={2} color={colors.cardGridItemBorder} />
        <StyledFlex height="100%">
          <Scrollbars autoHide>
            <StyledFlex gap="30px 0">
              <StyledFlex px="20px">
                {renderSwitchWithLabel(PUBLIC_SUBMISSION_FORM.IS_ENABLED, 'Enable Form', 'Add title and description to your form')}
              </StyledFlex>
              <StyledFlex alignItems="flex-start" px="20px">
                <StyledButton
                  variant="text"
                  startIcon={<OpenIcon />}
                  onClick={() => navigate(routes.SETTINGS_BACK_OFFICE_TAB)}
                >
                  <StyledText weight={600} lh={20} color="inherit" wrap="nowrap">Manage Form Branding</StyledText>
                </StyledButton>
              </StyledFlex>
              <Collapse in={values.isEnabled}>
                <StyledDivider borderWidth={2} color={colors.cardGridItemBorder} />
                <StyledFlex px="20px" gap="30px 0" mt="30px">
                  <StyledFlex position="relative">
                    <InputLabel label="Title" size={16} lh={24} />
                    <BaseTextInput
                      name={PUBLIC_SUBMISSION_FORM.TITLE}
                      id={PUBLIC_SUBMISSION_FORM.TITLE}
                      maxLength={200}
                      value={values[PUBLIC_SUBMISSION_FORM.TITLE]}
                      onChange={(e) => setFieldValue(PUBLIC_SUBMISSION_FORM.TITLE, e.target.value)}
                      showLength
                      invalid={touched?.[PUBLIC_SUBMISSION_FORM.TITLE] && errors?.[PUBLIC_SUBMISSION_FORM.TITLE]}
                      onBlur={handleBlur}
                    />
                    {touched?.[PUBLIC_SUBMISSION_FORM.TITLE] && renderErrorMessage(errors?.[PUBLIC_SUBMISSION_FORM.TITLE])}
                  </StyledFlex>
                  <StyledFlex position="relative">
                    <InputLabel label="Description" size={16} lh={24} />
                    <StyledTextField
                      multiline
                      variant="standard"
                      fontSize="16px"
                      lineHeight="16px"
                      id={PUBLIC_SUBMISSION_FORM.DESCRIPTION}
                      name={PUBLIC_SUBMISSION_FORM.DESCRIPTION}
                      helperText={`${values[PUBLIC_SUBMISSION_FORM.DESCRIPTION].length}/200 characters`}
                      maxLength={200}
                      minRows={8}
                      value={values[PUBLIC_SUBMISSION_FORM.DESCRIPTION]}
                      onChange={(e) => setFieldValue(PUBLIC_SUBMISSION_FORM.DESCRIPTION, e.target.value)}
                      invalid={touched?.[PUBLIC_SUBMISSION_FORM.DESCRIPTION] && errors?.[PUBLIC_SUBMISSION_FORM.DESCRIPTION]}
                      onBlur={handleBlur}
                    />
                    {touched?.[PUBLIC_SUBMISSION_FORM.DESCRIPTION] && renderErrorMessage(errors?.[PUBLIC_SUBMISSION_FORM.DESCRIPTION])}
                  </StyledFlex>
                  <StyledFlex pt="10px" gap="17px 0">
                    <StyledFlex direction="row" pt="10px" gap="0 10px">
                      <StyledText as="h3" size={16} weight={600} lh={24}>Password</StyledText>
                      {renderInfoTooltipIcon('Add a password to your form to restrict access to it.')}
                    </StyledFlex>
                    {renderSwitchWithLabel('isPasswordEnabled', 'Enable Password')}
                    <Collapse in={values.isPasswordEnabled}>
                      <PasswordInput
                        id={PUBLIC_SUBMISSION_FORM.PASSWORD}
                        initialValue={values[PUBLIC_SUBMISSION_FORM.PASSWORD]}
                        error={errors?.[PUBLIC_SUBMISSION_FORM.PASSWORD]}
                        onChange={(e) => setFieldValue(PUBLIC_SUBMISSION_FORM.PASSWORD, e.target.value, true)}
                        onBlur={handleBlur}
                        maxCharCount={52}
                      />
                    </Collapse>
                  </StyledFlex>
                  <StyledFlex width="100%">
                    <InputLabel label="Link" size={16} lh={24} />
                    <StyledFlex direction="row" gap="0 10px" alignItems="center" justifyContent="stretch">
                      <StyledFlex flex="1 1 auto">
                        <BaseTextInput
                          value={values.link}
                          disabled
                        />
                      </StyledFlex>
                      <StyledTooltip
                        title={(
                          <StyledFlex alignItems="center">
                            <StyledText size={14} weight={500} textAlign="center" color={colors.white} lh={17}>
                              {values.isCopied ? 'Copied!' : 'Copy Link'}
                            </StyledText>
                          </StyledFlex>
                        )}
                        arrow={!values.isCopied}
                        placement="top"
                        p="10px 15px"
                        maxWidth="auto"
                      >
                        <StyledButton
                          variant="contained"
                          tertiary
                          onClick={() => {
                            copyToClipboard(values.link);

                            if (values.link) setFieldValue('isCopied', true);
                          }}
                          onMouseLeave={() => setFieldValue('isCopied', false)}
                        >
                          Copy Link
                        </StyledButton>
                      </StyledTooltip>
                    </StyledFlex>
                  </StyledFlex>
                </StyledFlex>
              </Collapse>
            </StyledFlex>
          </Scrollbars>
        </StyledFlex>
      </StyledFlex>
      <ConfirmationModal
        isOpen={isUnsavedChangesModalOpen}
        onCloseModal={() => setIsUnsavedChangesModalOpen(false)}
        alertType="WARNING"
        successBtnText="Save Changes"
        onSuccessClick={handleSubmit}
        title="You Have Unsaved Changes"
        text="Do you want to save the changes you have made?"
      />
    </>
  );
};

export default PublicSubmissionForm;
