import { useTheme } from '@emotion/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { toast } from 'react-toastify';
import { useUser } from '../../../../../../../contexts/UserContext';
import { useCreateActivity } from '../../../../../../../hooks/activities/useCreateActivitiy';
import useUpdateIssueAdditionalFields from '../../../../../../../hooks/issue/useUpdateIssueAdditionalFields';
import { BASE_DATE_FORMAT, getInFormattedUserTimezone } from '../../../../../../../utils/timeUtil';
import FileUploadInput from '../../../../../../Managers/AgentManager/AgentEditor/components/shared/FileUploadInput';
import {
  RADIO_BUTTON_VALUE_NAME,
  VALIDATION_TYPE_RADIO_CLEAR_BUTTON_ID,
} from '../../../../../../Managers/AgentManager/AgentEditor/components/shared/RadioButtonBooleanInput';
import {
  ValidationTypeInput,
  getDataTypeInputValue,
} from '../../../../../../Managers/AgentManager/AgentEditor/utils/formatters';
import {
  VALIDATION_TYPES,
  VALIDATION_TYPE_PLACEHOLDERS,
} from '../../../../../../PublicFormPage/constants/validationTypes';
import FormErrorMessage from '../../../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import { toCamelCase } from '../../../../../../Settings/AccessManagement/utils/formatters';
import HiddenValue from '../../../../../../Settings/Components/FrontOffice/components/shared/HiddenValue';
import { additionalFieldsSchema } from '../../../../../../Settings/Components/FrontOffice/utils/validationSchemas';
import { ERROR_TYPES } from '../../../../../../WorkflowEditor/utils/validation';
import InfoListGroup from '../../../../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import InfoListItem from '../../../../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import JsonViewer from '../../../../../../shared/REDISIGNED/layouts/JsonViewer/JsonViewer';
import Spinner from '../../../../../../shared/Spinner/Spinner';
import { StyledEmptyValue, StyledFlex } from '../../../../../../shared/styles/styled';
import EditValueTrigger from '../../../../shared/EditValueTrigger/EditValueTrigger';
import ServiceTicketsEmptySectionDetail from '../ServiceTicketsEmptySectionDetail/ServiceTicketsEmptySectionDetail';

const TicketDetailsAdditionalFields = ({ ticket, additionalFields, ticketType }) => {
  const { colors } = useTheme();

  const [editParam, setEditParam] = useState(null);
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const [newParam, setNewParam] = useState(null);
  const [fileInputValue, setFileInputValue] = useState(null);

  const keys = Object.keys(additionalFields);

  const params = useMemo(() => {
    return (
      ticketType?.parameters
        .filter((param) => param.isVisible)
        .map(({ type, isMandatory, name, isMasked }) => {
          const key = keys.find((k) => toCamelCase(name) === k);
          const value = key ? additionalFields[key] : additionalFields[name] || '';

          return {
            key: key || name,
            value,
            label: name,
            type,
            isMandatory,
            isMasked,
            error: '',
          };
        }) ?? []
    );
  }, [ticketType, additionalFields, keys]);

  const editableInputRef = useRef(null);

  const { user } = useUser();
  const { createActionPerformedActivity } = useCreateActivity();

  const onAdditionalFieldsUpdateSuccess = () => {
    createActionPerformedActivity({
      issueId: ticket?.id,
      oldValue: ticket?.additionalFields[newParam.key],
      newValue: `${newParam.label} updated to ${newParam.value}`,
      userId: user.id,
    });
    setNewParam(null);
  };

  const { updateIssueAdditionalFields } = useUpdateIssueAdditionalFields({
    onSuccess: () => {
      onAdditionalFieldsUpdateSuccess();
    },
    onError: () => {
      toast.error('Error updating additional field');
      setNewParam(null);
    },
    onSettled: () => {
      setIsEditingLoading(false);
      setEditParam(null);
    },
  });

  const updateAdditionalParam = (newParam) => {
    setIsEditingLoading(true);
    setNewParam(newParam);

    updateIssueAdditionalFields({
      params: { issueId: ticket.id },
      body: {
        [newParam.key]: newParam.value,
      },
    });
  };

  const getAdditionalFieldError = async (param, value) => {
    const { type, isMandatory, label } = param;

    if (!value) return isMandatory ? 'A valid input is required' : '';

    try {
      await additionalFieldsSchema.validate({ name: label, type, defaultValue: value }, { abortEarly: false });
      return '';
    } catch (validationError) {
      return validationError.errors[0];
    }
  };

  const handleDataTypeValueChange = async ({ val, param, setEditing }) => {
    const { type, value: oldValue } = param;

    const value = getDataTypeInputValue(val, type);

    const error = await getAdditionalFieldError(param, value);

    const isSingleSelectDataType = [
      VALIDATION_TYPES.ADDRESS,
      VALIDATION_TYPES.DATE_OF_BIRTH,
      VALIDATION_TYPES.BOOLEAN,
    ].includes(type);

    if (isSingleSelectDataType) {
      if (error) {
        toast.error('Please enter valid input');
      } else if (oldValue !== value) {
        updateAdditionalParam({ ...editParam, value, error });
      }
      setEditing(false);
      setEditParam(null);
    } else {
      setEditParam((prev) => ({ ...prev, value, error }));
    }
  };

  const handleBlur = (setEditing, value) => {
    if (editParam?.error) {
      toast.error('Please enter valid input');
    } else if (editParam?.value !== value) {
      updateAdditionalParam(editParam);
    }

    setEditing(false);
    setEditParam(null);
  };

  const renderAdditionalFieldValue = ({ value, type }) => {
    switch (type) {
      case VALIDATION_TYPES.FILE:
        try {
          return JSON.parse(value).name;
        } catch {
          return <StyledEmptyValue />;
        }
      case VALIDATION_TYPES.DATE_OF_BIRTH:
        return getInFormattedUserTimezone(value, user?.timezone, BASE_DATE_FORMAT);
      case VALIDATION_TYPES.JSON: {
        if (!value) return <StyledEmptyValue />;

        try {
          const jsonValue = JSON.parse(value);

          return (
            <StyledFlex textAlign="left">
              <JsonViewer
                jsonData={jsonValue}
                styles={{ backgroundColor: 'transparent', cursor: 'pointer' }}
                displayArrayKey={false}
                indentWidth={2}
                theme={{ base0D: 'transparent' }}
              />
            </StyledFlex>
          );
        } catch {
          return <StyledEmptyValue />;
        }
      }
      case VALIDATION_TYPES.PHONE_NUMBER:
        return value ? value.replace(/(\+\d)(\d{3})(\d{3})(\d{4})/, '($2) - $3 - $4') : <StyledEmptyValue />;
      default:
        return value || <StyledEmptyValue />;
    }
  };

  useEffect(() => {
    if (editParam && editableInputRef?.current) {
      editableInputRef?.current?.focus();
    }
  }, [editParam, editableInputRef]);

  const renderFileInput = ({ param }) => {
    const { value, isMandatory, type } = param;

    const isError = value && fileInputValue === null ? false : isMandatory && !fileInputValue;

    return (
      <StyledFlex>
        <FileUploadInput
          value={fileInputValue ?? value}
          onChange={(val) => {
            const newValue = getDataTypeInputValue(val, type);
            setFileInputValue(newValue);

            if (newValue) {
              updateAdditionalParam({ ...param, value: newValue });
            }
          }}
          error={isError}
        />
        {isError ? <FormErrorMessage>A valid input is required</FormErrorMessage> : null}
      </StyledFlex>
    );
  };

  return (
    <InfoListGroup title="Additional Fields" noPaddings>
      <StyledFlex position="relative">
        {isEditingLoading && <Spinner medium fadeBgParent />}
        {params.length > 0 ? (
          params.map((param, idx) => {
            const { type, isMandatory, label, value, isMasked } = param;
            const subLabel = isMandatory ? 'Mandatory Field' : 'Optional Field';
            const isFileTypeInput = type === VALIDATION_TYPES.FILE;

            return (
              <InfoListItem key={idx} name={label} subLabel={subLabel} alignItems="center">
                {isFileTypeInput ? (
                  renderFileInput({ param })
                ) : (
                  <EditValueTrigger
                    onEdit={() => {
                      setEditParam(param);
                    }}
                    editableComponent={(setEditing) => (
                      <StyledFlex
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleBlur(setEditing, value);
                          }
                        }}
                        onBlur={(e) => {
                          if (type === VALIDATION_TYPES.BOOLEAN) {
                            const isRadioBtnRelatedTarget = e?.relatedTarget?.name === RADIO_BUTTON_VALUE_NAME;

                            const shouldNotBlur =
                              e?.relatedTarget?.id === VALIDATION_TYPE_RADIO_CLEAR_BUTTON_ID || isRadioBtnRelatedTarget;

                            if (shouldNotBlur) return;

                            handleBlur(setEditing, value);
                          }
                          if (type === VALIDATION_TYPES.FILE) handleBlur(setEditing, value);
                        }}
                        width="100%"
                      >
                        {editParam && (
                          <ValidationTypeInput
                            value={editParam?.value}
                            onChange={(val) => handleDataTypeValueChange({ val, param, setEditing })}
                            fieldValidationType={type}
                            fieldCriteria={isMandatory ? 'M' : 'O'}
                            fieldName={label}
                            isProtected={isMasked}
                            inputFieldProps={{
                              placeholder: VALIDATION_TYPE_PLACEHOLDERS?.[type] || 'Enter Value...',
                              error: { type: editParam?.error ? ERROR_TYPES.ERROR : null },
                            }}
                            addressAutocompleteProps={{
                              menuPortalTarget: document.body,
                            }}
                            onBlur={() => handleBlur(setEditing, value)}
                            error={editParam?.error}
                            inputRef={editableInputRef}
                            autoFocus
                            inputBorderColor={colors.linkColor}
                          />
                        )}
                        {editParam?.error ? <FormErrorMessage>{editParam?.error}</FormErrorMessage> : null}
                      </StyledFlex>
                    )}
                  >
                    <StyledFlex textAlign="right">
                      {isMasked && value ? <HiddenValue /> : renderAdditionalFieldValue({ value, type })}
                    </StyledFlex>
                  </EditValueTrigger>
                )}
              </InfoListItem>
            );
          })
        ) : (
          <ServiceTicketsEmptySectionDetail title="There Are No Additional Fields" />
        )}
      </StyledFlex>
    </InfoListGroup>
  );
};

export default TicketDetailsAdditionalFields;
