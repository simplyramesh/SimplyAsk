import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import React from 'react';

import useEditableField from '../../../../../../../../hooks/useEditableField';
import { VALIDATION_TYPES } from '../../../../../../../PublicFormPage/constants/validationTypes';
import { StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';
import ExecutionParamField from './ExecutionParamField';
import {
  StyledExecutionParameterItem,
  StyledExecutionParameterTitleHolder,
  StyledExecutionParameterValue,
  StyledExecutionParameterValueHolder,
} from './StyledExecutionParameterItem';

const ExecutionParameterItem = ({ item, isEditable, handleUpdate }) => {
  const { colors } = useTheme();

  const { isEditing, wrapperRef, childRef, handleFocusEdit, handleEditBlur } = useEditableField();

  const value = item?.currentValue
    ? typeof item.currentValue === 'string'
      ? item.currentValue
      : JSON.stringify(item.currentValue)
    : '';

  const hasChanged = item?.currentValue !== item?.initialValue;

  const onKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    handleEditBlur();
  };

  return (
    <StyledExecutionParameterItem>
      <StyledExecutionParameterTitleHolder>
        <StyledText size={16} lh={22} weight={600} color={colors.charcoal}>
          {item?.title}
        </StyledText>
        <StyledFlex direction="row" gap="4px">
          <StyledText size={14} lh={20} weight={500} color={colors.information} capitalize>
            ({item?.dataType})
          </StyledText>
          {hasChanged && (
            <>
              <StyledText size={14} lh={20} weight={500} color={colors.information}>
                |
              </StyledText>
              <StyledText size={14} lh={20} weight={500} color={colors.statusOverdue}>
                Modified
              </StyledText>
            </>
          )}
        </StyledFlex>
      </StyledExecutionParameterTitleHolder>
      <StyledExecutionParameterValueHolder>
        {isEditing || item.fieldValidationType === VALIDATION_TYPES.SIGNATURE ? (
          <StyledFlex tabIndex={0} ref={wrapperRef} onBlur={handleEditBlur} outline="none" width="100%">
            <ExecutionParamField
              id={item.id}
              value={value}
              options={item.options}
              componentType={item.componentType}
              displayName={item.displayName}
              onBlur={handleEditBlur}
              onKeyDown={onKeyDown}
              dataType={item.fieldValidationType}
              isEditable={isEditable}
              onUpdate={handleUpdate}
              onError={() => {}}
              isError={false}
              childRef={childRef}
            />
          </StyledFlex>
        ) : (
          <StyledExecutionParameterValue onClick={() => isEditable && handleFocusEdit()} {...{ isEditable }}>
            {value.split('-;-').map((v) => (
              <StyledText>{v}</StyledText>
            ))}
          </StyledExecutionParameterValue>
        )}
      </StyledExecutionParameterValueHolder>
    </StyledExecutionParameterItem>
  );
};

export default ExecutionParameterItem;

ExecutionParameterItem.propTypes = {
  item: PropTypes.shape({
    dataType: PropTypes.string,
    isModified: PropTypes.bool,
    title: PropTypes.string,
    initialValue: PropTypes.string,
    currentValue: PropTypes.string,
    modifiedBy: PropTypes.string,
    modifiedDate: PropTypes.string,
  }),
  isEditable: PropTypes.bool,
  handleUpdate: PropTypes.func,
};
