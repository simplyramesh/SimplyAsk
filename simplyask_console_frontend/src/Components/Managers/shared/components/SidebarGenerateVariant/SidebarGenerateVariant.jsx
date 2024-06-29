import styled from '@emotion/styled';
import { AddRounded, ArrowForwardIosRounded, HelpOutlineOutlined, InfoOutlined } from '@mui/icons-material';
import { useTheme } from '@mui/system';
import { memo, useState } from 'react';

import FormErrorMessage from '../../../../Settings/AccessManagement/components/FormErrorMessage/FormErrorMessage';
import { generateUUID } from '../../../../Settings/AccessManagement/utils/helpers';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import { StyledTooltip } from '../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { StyledGenerateVariantsButton } from '../../../AgentManager/AgentEditor/components/sideForms/Sidebar/StyledStepItemSidebar';
import { ContextMenuItem } from '../ContextMenus/StyledContextMenus';

import SidebarVariantInputWithAction from './SidebarVariantInputWithAction/SidebarVariantInputWithAction';

export const StyledButtonWrapper = styled(StyledFlex)`
  & > button {
    pointer-events: none;
  }

  &:hover > button {
    pointer-events: none;
    background-color: ${({ theme }) => theme.colors.darkOrangeShadeSecond};
    border-color: ${({ theme }) => theme.colors.darkOrangeShadeSecond};
    color: ${({ theme }) => theme.colors.white};
    box-shadow: none;
  }
`;

const SidebarGenerateVariant = ({
  values = [],
  onChange,
  inputPlaceholder = '',
  label = '',
  isOptional = false,
  addButtonText = '',
  labelTooltipTitle = '',
  btnTooltipTitle = '',
  isGenerateVariantDisabled = true,
  isGenerateVariantVisible = true,
  autoGenerateBtnType = 'Variants',
  maxVariants,
  onGenerateVariant = () => {},
  errors,
  touched,
  richTextEditorField,
  expressionBuilder,
  autocompleteParams,
  inputProps,
  minItems = 1,
}) => {
  const isDeleteDisabled = values.length <= minItems;
  const numberOfVariantsToGenerate = [5, 10, 20];
  const { colors, boxShadows } = useTheme();

  const [showToolTip, setShowToolTip] = useState(false);

  const handleDelete = (id) => {
    onChange(values.filter((item) => item?.id !== id));
  };

  const handleAdd = () => {
    onChange([...values, { id: generateUUID(), value: '' }]);
  };

  const handleChange = (id, value) => {
    onChange(values.map((item) => (item?.id === id ? { ...item, value, isGeneratedVariant: false } : item)));
  };

  const handleGenerate = (num) => {
    setShowToolTip(false);
    onGenerateVariant(num);
  };

  const handleMenuTooltipOnOpen = () => {
    if (isGenerateVariantDisabled) return;
    setShowToolTip(true);
  };

  return (
    <>
      <StyledFlex direction="column" flex="auto">
        <StyledFlex direction="row" alignItems="center" justifyContent="space-between" fontSize="15px">
          <StyledFlex direction="row" alignItems="center" justifyContent="center" gap="0 10px">
            <InputLabel
              label={label || ''}
              name={label?.toLowerCase()}
              isOptional={isOptional}
              size={15}
              weight={600}
              mb={0}
              lh={24}
            />
            <StyledTooltip arrow placement="top" title={labelTooltipTitle} maxWidth="auto" p="10px 15px">
              <InfoOutlined fontSize="inherit" />
            </StyledTooltip>
          </StyledFlex>
          <StyledButton
            startIcon={<AddRounded />}
            variant="text"
            onClick={handleAdd}
            disabled={values.length >= maxVariants}
          >
            {addButtonText}
          </StyledButton>
        </StyledFlex>

        {/* Text Area(s) */}
        <StyledFlex direction="column" flex="auto" width="100%" position="relative" marginTop="10px">
          <StyledFlex gap="17px">
            {values.map((item) => (
              <SidebarVariantInputWithAction
                key={item?.id}
                isGeneratedVariant={item?.isGeneratedVariant}
                isDeleteDisabled={isDeleteDisabled}
                onDelete={() => handleDelete(item?.id)}
                inputProps={{
                  id: item.id,
                  placeholder: inputPlaceholder,
                  value: item.value,
                  onChange: (value) => handleChange(item?.id, value),
                  invalid: errors && touched,
                  ...inputProps,
                }}
                richTextEditorField={richTextEditorField}
                expressionBuilder={expressionBuilder}
                autocompleteParams={autocompleteParams}
              />
            ))}
          </StyledFlex>
          {errors && touched && (
            <FormErrorMessage rootMargin="6px 0 0 0" iconMarginTop={0}>
              {errors}
            </FormErrorMessage>
          )}
        </StyledFlex>
      </StyledFlex>

      {/* Add Generated Variants Button */}
      {isGenerateVariantVisible && (
        <StyledFlex mt="17px">
          <StyledTooltip
            arrow
            placement="top"
            title={isGenerateVariantDisabled ? btnTooltipTitle : ''}
            maxWidth="285px"
            p="10px 15px"
          >
            <StyledFlex as="span" flex="auto">
              <StyledTooltip
                placement="bottom-start"
                open={showToolTip}
                onOpen={handleMenuTooltipOnOpen}
                onClose={() => setShowToolTip(false)}
                title={
                  <StyledFlex>
                    {numberOfVariantsToGenerate.map((num) => (
                      <ContextMenuItem key={num} onClick={() => handleGenerate(num)}>
                        <StyledText lh={20}>{`Generate ${num} Variants`}</StyledText>
                      </ContextMenuItem>
                    ))}
                  </StyledFlex>
                }
                p="0px"
                radius="5px"
                boxShadow={boxShadows.table}
                bgTooltip={colors.white}
                maxWidth="none"
                width="458px"
              >
                <StyledButtonWrapper>
                  <StyledGenerateVariantsButton
                    endIcon={isGenerateVariantDisabled ? <HelpOutlineOutlined /> : <ArrowForwardIosRounded />}
                    disabled={isGenerateVariantDisabled}
                  >
                    {`Auto-Generate ${autoGenerateBtnType} With SimplyAssistant`}
                  </StyledGenerateVariantsButton>
                </StyledButtonWrapper>
              </StyledTooltip>
            </StyledFlex>
          </StyledTooltip>
        </StyledFlex>
      )}
    </>
  );
};

export default memo(SidebarGenerateVariant);
