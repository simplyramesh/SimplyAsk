import { useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import useIsWorkflowPsfPasswordValid from '../../hooks/process/useIsWorkflowPsfPasswordValid';
import useIsWorkflowPsfProtected from '../../hooks/process/useIsWorkflowPsfProtected';
import useSubmitPublicProcessExecution from '../../hooks/process/useSubmitPublicProcessExecution';
import useGetWorkflowSettingsDto from '../shared/ManagerComponents/SideModals/SettingsSideDrawer/hooks/useGetWorkflowSettingsDtoById';
import ContentLayout from '../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import Spinner from '../shared/Spinner/Spinner';

import FormNotFound from './FormNotFound/FormNotFound';
import PublicForm from './PublicForm';
import PublicFormPasswordModal from './PublicFormPasswordModal/PublicFormPasswordModal';
import PublicFormSuccessModal from './PublicFormSuccessModal/PublicFormSuccessModal';
import { StyledPublicFormPage, StyledPublicBG } from './StyledPublicFormPage';
import { passwordValidationSchema } from './utils/schemas';

const PublicFormPage = () => {
  const { processId } = useParams();

  const { colors } = useTheme();

  const [isFormReceivedOpen, setIsFormReceivedOpen] = useState(false);

  const { values, errors, setFieldValue, setFieldError } = useFormik({
    initialValues: {
      password: '',
      confirmedPassword: null,
    },
    validationSchema: passwordValidationSchema,
  });

  const { isWorkflowPsfProtected } = useIsWorkflowPsfProtected({ processId });
  const { isWorkflowPsfPasswordValid } = useIsWorkflowPsfPasswordValid({
    processId,
    password: values.confirmedPassword,
    enabled: isWorkflowPsfProtected && !!values.confirmedPassword,
  });

  const { workflowDtoSettings: psfData, isLoading: isPfcConfigurationLoading } = useGetWorkflowSettingsDto({
    workflowId: processId,
    options: {
      enabled: !!processId,
      select: (data) => ({
        workflowName: data?.deploymentId,
        pfcConfiguration: data?.psfConfiguration,
        psfSettings: data?.psfSettings,
        fields: data?.inputParamSets?.[0]?.dynamicInputParams?.reduce(
          (acc, item) => [
            ...acc,
            {
              workflowName: 'GENERIC',
              fieldName: item.paramName,
              displayName: item.displayName,
              description: item.description,
              componentType: item.componentType,
              fileType: item.fileType,
              fileSize: item.fileSize,
              fileTypeList: item.fileTypeList,
              options: item.options,
              placeholder: item.placeholder,
              fieldCriteria: item.isRequired ? 'M' : 'O',
              isProtected: item.isProtected,
              fieldValidationType: item.validationType,
            },
          ],
          []
        ),
      }),
    },
  });

  const { submitPublicExecution, isSubmitPublicExecutionLoading } = useSubmitPublicProcessExecution({
    onSuccess: () => {
      setIsFormReceivedOpen(true);
    },
    onError: (error) => {
      toast.error(error?.message || 'Something went wrong.');
    },
  });

  useEffect(() => {
    if (!values.confirmedPassword) return;

    if (!isWorkflowPsfPasswordValid) {
      setFieldError('password', 'Password is incorrect');
    }
  }, [isWorkflowPsfPasswordValid, values.confirmedPassword]);

  const {
    accentColourHex,
    pageColourHex,
    headerColourHex,
    logo,
    backgroundImage,
    buttonColourHex,
    buttonTextColourHex,
    font,
    theme,
  } = psfData?.pfcConfiguration || {};

  const isDarkTheme = theme === 'DARK';
  const headerColor = isDarkTheme ? colors.blackEel : headerColourHex;

  if (isPfcConfigurationLoading) return <Spinner global />;

  const renderFormNotFound = () => (
    <StyledPublicFormPage pageColour={colors.white}>
      <StyledPublicBG headerColourHex={colors.symphonaLighBlue} />
      <FormNotFound />
    </StyledPublicFormPage>
  );

  return (
    <PageLayout fullPage>
      <ContentLayout fullHeight noPadding>
        {!psfData?.psfSettings?.title ? (
          renderFormNotFound()
        ) : (
          <StyledPublicFormPage pageColour={isDarkTheme ? colors.darkerGray : pageColourHex} font={font}>
            <StyledPublicBG headerColourHex={!backgroundImage ? headerColor : pageColourHex} url={backgroundImage} />
            <PublicForm
              workflowName={psfData?.workflowName}
              fields={psfData?.fields}
              psfSettings={psfData?.psfSettings}
              logo={logo}
              font={font}
              accentColourHex={accentColourHex}
              buttonColourHex={buttonColourHex}
              buttonTextColourHex={buttonTextColourHex}
              onSubmit={submitPublicExecution}
              isDarkTheme={isDarkTheme}
              isDisabled={!isWorkflowPsfPasswordValid && isWorkflowPsfProtected}
              isSubmitPublicExecutionLoading={isSubmitPublicExecutionLoading}
            />
          </StyledPublicFormPage>
        )}
      </ContentLayout>
      <PublicFormPasswordModal
        isOpen={!isWorkflowPsfPasswordValid && isWorkflowPsfProtected}
        onConfirm={() => {
          setFieldValue('confirmedPassword', values.password);
        }}
        onPasswordChange={(e) => setFieldValue('password', e.target.value)}
        isDarkTheme={isDarkTheme}
        password={values.password}
        error={errors?.password}
      />
      <PublicFormSuccessModal
        isOpen={isFormReceivedOpen}
        onClose={() => setIsFormReceivedOpen(false)}
        iconColor={accentColourHex}
        buttonColourHex={buttonColourHex}
        buttonTextColourHex={buttonTextColourHex}
        isDarkTheme={isDarkTheme}
      />
    </PageLayout>
  );
};

export default PublicFormPage;
