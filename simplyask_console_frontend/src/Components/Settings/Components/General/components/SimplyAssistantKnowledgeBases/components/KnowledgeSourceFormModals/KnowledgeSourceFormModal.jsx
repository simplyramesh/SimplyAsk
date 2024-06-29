import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { StyledFlex, StyledText, StyledTextField } from '../../../../../../../shared/styles/styled';
import InputLabel from '../../../../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CenterModalFixed from '../../../../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import { StyledButton } from '../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomSelect from '../../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomIndicatorArrow from '../../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import { createKnowledgeSourceValidationSchema } from '../../utils/validationSchema';
import FormErrorMessage from '../../../../../../AccessManagement/components/FormErrorMessage/FormErrorMessage';
import KnowledgeSourceFormWebsiteModal from './KnowledgeSourceFormWebsiteModal';
import KnowledgeSourceFormTextModal from './KnowledgeSourceFormTextModal';
import { MODAL_TYPE } from '../../utils/constants';
import ConfirmationModal from '../../../../../../../shared/REDISIGNED/modals/ConfirmationModal/ConfirmationModal';
import KnowledgeSourceFormApiModal from './KnowledgeSourceFormApiModal';
import KnowledgeSourceFormFileModal from './KnowledgeSourceFormFileModal';

const KnowledgeSourceFormModal = ({ open, onClose, onSubmit, modalProps, knowledgeSources }) => {
  const [shouldStayOpen, setShouldStayOpen] = useState(false);
  const [isUnsavedChangesModalOpen, setIsUnsavedChangesModalOpen] = useState(false);
  const { isEditMode, modalValues } = modalProps;
  const [shouldCrawlWebsite, setShouldCrawlWebsite] = useState(false);
  const [shouldAutoUpdateFrequency, setShouldAutoUpdateFrequency] = useState(false);

  const initialValues = {
    name: '',
    type: '',
    autoUpdateFrequency: 28,
    maxCrawlDepth: 1,
    maxCrawlPages: 50,
    shouldCrawlEncounteredFiles: false,
    source: {
      url: '',
      plainText: '',
      fileId: [],
      fileName: '',
    },
    bodyParameter: [],
    headerParameter: [],
  };

  const { values, setFieldValue, errors, touched, handleBlur, resetForm, submitForm, dirty, setValues } = useFormik({
    initialValues,
    validationSchema: () => createKnowledgeSourceValidationSchema(values, knowledgeSources, isEditMode),
    onSubmit: (values) => {
      resetForm();
      return onSubmit(
        {
          ...values,
          autoUpdateFrequency: shouldAutoUpdateFrequency ? values.autoUpdateFrequency : null,
          maxCrawlDepth: shouldCrawlWebsite ? values.maxCrawlDepth : null,
          maxCrawlPages: shouldCrawlWebsite ? values.maxCrawlPages : null,
        },
        shouldStayOpen,
        modalValues?.id
      );
    },
  });

  useEffect(() => {
    setShouldCrawlWebsite(!!modalValues?.maxCrawlDepth || !!modalValues?.maxCrawlPages);
    setShouldAutoUpdateFrequency(!!modalValues?.autoUpdateFrequency);
    setValues(
      modalValues
        ? {
            ...initialValues,
            ...modalValues,
            source: typeof modalValues.source === 'string' ? JSON.parse(modalValues.source) : modalValues.source,
            autoUpdateFrequency: modalValues.autoUpdateFrequency ?? 28,
            maxCrawlDepth: modalValues.maxCrawlDepth ?? 1,
            maxCrawlPages: modalValues.maxCrawlPages ?? 50,
            textFiles: modalValues.source?.fileId
              ? [
                  {
                    name: modalValues.source?.fileId,
                  },
                ]
              : [],
          }
        : initialValues
    );
  }, [modalValues]);

  const handleSubmit = (shouldStay) => {
    setShouldStayOpen(shouldStay);

    if (values.type.length) {
      submitForm();
    } else {
      toast.warning('Please select any type');
    }
  };

  const commonModalProps = {
    values: values,
    setFieldValue: setFieldValue,
    errors: errors,
    touched: touched,
    handleBlur: handleBlur,
  };

  const renderModal = (modalType) => {
    switch (modalType) {
      case MODAL_TYPE.WEBSITE:
        return (
          <KnowledgeSourceFormWebsiteModal
            {...commonModalProps}
            shouldCrawlWebsite={shouldCrawlWebsite}
            setShouldCrawlWebsite={setShouldCrawlWebsite}
            shouldAutoUpdateFrequency={shouldAutoUpdateFrequency}
            setShouldAutoUpdateFrequency={setShouldAutoUpdateFrequency}
          />
        );
      case MODAL_TYPE.TEXT:
        return <KnowledgeSourceFormTextModal {...commonModalProps} />;
      case MODAL_TYPE.API:
        return (
          <KnowledgeSourceFormApiModal
            {...commonModalProps}
            shouldAutoUpdateFrequency={shouldAutoUpdateFrequency}
            setShouldAutoUpdateFrequency={setShouldAutoUpdateFrequency}
          />
        );
      case MODAL_TYPE.FILE:
        return <KnowledgeSourceFormFileModal {...commonModalProps} />;
      default:
        return null;
    }
  };

  return (
    <>
      <CenterModalFixed
        open={open}
        onClose={() => (dirty ? setIsUnsavedChangesModalOpen(true) : onClose())}
        maxWidth="775px"
        title={
          <StyledText size={19} weight={600}>
            {isEditMode ? 'Edit' : 'Create'} Knowledge Source
          </StyledText>
        }
        actions={
          <StyledFlex direction="row" gap="15px">
            {!isEditMode && (
              <StyledButton primary variant="outlined" onClick={() => handleSubmit(true)}>
                Create and Start Another Source
              </StyledButton>
            )}
            <StyledButton primary variant="contained" onClick={() => handleSubmit(false)}>
              {isEditMode ? 'Save' : 'Create'}
            </StyledButton>
          </StyledFlex>
        }
      >
        <StyledFlex p="30px">
          <StyledFlex gap="25px">
            <StyledFlex gap="12px">
              <InputLabel size={16} label="Name" mb={0} />
              <StyledFlex>
                <StyledTextField
                  id="Name"
                  name="name"
                  placeholder="Enter name..."
                  variant="standard"
                  value={values.name}
                  onChange={(e) => setFieldValue('name', e.target.value)}
                  invalid={errors.name && touched.name}
                  onBlur={handleBlur}
                />
                {errors.name && touched.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
              </StyledFlex>
            </StyledFlex>
            <StyledFlex gap="12px">
              <InputLabel size={16} label="Type" mb={0} />
              <CustomSelect
                placeholder="Select type"
                value={values.type ? { value: values.type, label: values.type } : null}
                onChange={(selectedOption) => {
                  setFieldValue('type', selectedOption.value);
                }}
                options={[
                  { value: 'WEBSITE', label: 'Website' },
                  { value: 'TEXT', label: 'Text' },
                  { value: 'API', label: 'API' },
                  { value: 'FILE', label: 'File' },
                ]}
                closeMenuOnSelect
                isClearable={false}
                isSearchable={false}
                maxHeight={30}
                menuPadding={0}
                components={{
                  DropdownIndicator: CustomIndicatorArrow,
                }}
                menuPortalTarget={document.body}
                form
              />
            </StyledFlex>
            {renderModal(values.type)}
          </StyledFlex>
        </StyledFlex>
      </CenterModalFixed>
      <ConfirmationModal
        isOpen={isUnsavedChangesModalOpen}
        successBtnText="Confirm"
        alertType="WARNING"
        onCloseModal={() => setIsUnsavedChangesModalOpen(false)}
        onSuccessClick={() => {
          if (!isEditMode) resetForm();
          onClose();
          setIsUnsavedChangesModalOpen(false);
        }}
        title="You Have Unsaved Changes"
        text="All changes you have made will be lost, and the ticket type will not be created."
      />
    </>
  );
};

export default KnowledgeSourceFormModal;
