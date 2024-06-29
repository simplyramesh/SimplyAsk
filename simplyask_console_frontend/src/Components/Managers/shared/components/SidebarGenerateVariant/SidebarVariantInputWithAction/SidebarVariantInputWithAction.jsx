import { useTheme } from '@mui/system';
import React, { memo } from 'react';

import AIIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/AIIcon';
import TrashBinIcon from '../../../../../shared/REDISIGNED/icons/svgIcons/TrashBinIcon';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex, StyledIconButton, StyledText, StyledTextField } from '../../../../../shared/styles/styled';
import PhraseEditor from '../../../../../shared/REDISIGNED/controls/lexical/PhraseEditor';
import ExpressionBuilder from '../../../../../shared/REDISIGNED/controls/lexical/ExpressionBuilder';

const SidebarVariantInputWithAction = ({
  onDelete,
  inputProps,
  isGeneratedVariant,
  isDeleteDisabled = true,
  richTextEditorField = false,
  expressionBuilder = false,
  autocompleteParams = [],
}) => {
  const { colors } = useTheme();
  const { id, placeholder = '', value = '', invalid = false, onChange, maxLength } = inputProps;

  // TODO: Matching parameters is not supported (as required in Create Intent for example).
  return (
    <StyledFlex direction="row" gap="0 12px" alignItems="center" justifyContent="center">
      <StyledFlex position="relative" flex="auto">
        {expressionBuilder && (
          <ExpressionBuilder
            id={`expression-builder-${id}`}
            key={`expression-builder-${id}`} // required to re-render the component when the modal is closed
            placeholder={placeholder}
            onChange={(value) => onChange(JSON.stringify(value))}
            editorState={value}
            error={invalid}
            autocompleteParams={autocompleteParams}
          />
        )}

        {richTextEditorField && (
          <PhraseEditor
            id={id}
            placeholder={placeholder}
            onChange={(value) => onChange(JSON.stringify(value))}
            minHeight="68px"
            editorState={value}
            borderColor={invalid ? colors.validationError : colors.altoGray}
          />
        )}

        {!richTextEditorField && !expressionBuilder && (
          <StyledTextField
            id={id}
            name={id}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            variant="standard"
            p={isGeneratedVariant ? '10px 38px 10px 10px' : '10px'}
            multiline
            minRows={2}
            borderColor={invalid ? colors.validationError : colors.altoGray}
            inputProps={{ maxLength }}
          />
        )}

        {maxLength && (
          <StyledText size={14} textAlign="right">
            {value?.length}/{maxLength} characters
          </StyledText>
        )}

        {isGeneratedVariant ? (
          <StyledTooltip arrow placement="top" title="Generated Using AI" p="10px 15px" maxWidth="109px">
            <StyledFlex as="span" position="absolute" top="50%" right={10} transform="translateY(-50%)" fontSize="29px">
              <AIIcon fontSize="inherit" />
            </StyledFlex>
          </StyledTooltip>
        ) : null}
      </StyledFlex>
      <StyledTooltip arrow placement="top" title={!isDeleteDisabled ? 'Delete' : ''} p="10px 15px">
        <StyledFlex as="span">
          <StyledIconButton size="34px" iconSize="22px" onClick={onDelete} disabled={isDeleteDisabled}>
            <TrashBinIcon />
          </StyledIconButton>
        </StyledFlex>
      </StyledTooltip>
    </StyledFlex>
  );
};

export default memo(SidebarVariantInputWithAction);
