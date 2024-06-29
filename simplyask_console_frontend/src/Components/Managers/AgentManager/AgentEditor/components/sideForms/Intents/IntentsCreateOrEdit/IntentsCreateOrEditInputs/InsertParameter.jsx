import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { HelpOutlineOutlined } from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { $createTextNode, $getSelection } from 'lexical';
import React, { memo, useContext, useState } from 'react';

import { StyledButton } from '../../../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { $createColoredParamTextNode } from '../../../../../../../../shared/REDISIGNED/controls/lexical/nodes/ColoredParamTextNode';
import { getSelectedNode } from '../../../../../../../../shared/REDISIGNED/controls/lexical/plugins/OnSelectionPlugin';
import CustomIndicatorArrow from '../../../../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import { IconOption } from '../../../../../../../../shared/REDISIGNED/selectMenus/customComponents/options/IconOption';
import NoOptionsMessage from '../../../../../../../../shared/REDISIGNED/selectMenus/customComponents/options/NoOptionsMessage';
import CustomSelect from '../../../../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledTooltip } from '../../../../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledCard, StyledFlex } from '../../../../../../../../shared/styles/styled';
import { IntentsContext } from '../../IntentsContex';

const InsertParameter = () => {
  const [editor] = useLexicalComposerContext();
  const { colors } = useTheme();
  const [selectParameter, setSelectParameter] = useState();
  const { parameters } = useContext(IntentsContext);
  const options = parameters.filter((param) => param.paramName && param.paramType)

  const isInsertParamButtonDisabled = !selectParameter;
  const insertEditButtonToolTipTitle = `Select a parameter name and parameter type to insert the parameter`;

  const onInsertSaveParamHandler = () => {
    setSelectParameter(null);

    editor.update(() => {
      let lowerSelectedTextOffsetPointer = '';
      let higherSelectedTextOffsetPointer = '';

      const selection = $getSelection();

      if (selection.anchor.offset > selection.focus.offset) {
        lowerSelectedTextOffsetPointer = selection.focus.offset;
        higherSelectedTextOffsetPointer = selection.anchor.offset;
      } else {
        lowerSelectedTextOffsetPointer = selection.anchor.offset;
        higherSelectedTextOffsetPointer = selection.focus.offset;
      }

      const selectedNode = getSelectedNode(selection);
      const textContent = selectedNode.__text;
      const selectedText = selectedNode.__text.substring(lowerSelectedTextOffsetPointer, higherSelectedTextOffsetPointer);

      selectedNode.replace(
        $createTextNode(textContent.substring(0, lowerSelectedTextOffsetPointer)),
      ).insertAfter($createColoredParamTextNode(
        selectedText,
        selectParameter?.paramName,
        selectParameter?.paramType,
        selectParameter?.bgColor,
        selectParameter?.id,
      ))
        .insertAfter($createTextNode(textContent.substring(higherSelectedTextOffsetPointer, textContent.length) || ' '));
    })
  };

  const stopCardClicksPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <StyledCard width="399px" p="15px" borderRadius="10px" onClick={stopCardClicksPropagation}>
      <StyledFlex display="flex" gap="20px">
        <CustomSelect
          menuPlacement="auto"
          placeholder="Select parameter"
          getOptionLabel={(option) => option.paramName}
          getOptionValue={(option) => option.paramType}
          options={options || []}
          closeMenuOnSelect
          isSearchable
          value={selectParameter}
          onChange={setSelectParameter}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            Option: IconOption,
            NoOptionsMessage,
          }}
          maxHeight={30}
          menuPadding={0}
          controlTextHidden
          menuPortalTarget={document.body}
          form
          onMouseDown={(e) => e.stopPropagation()}
        />

        <StyledTooltip
          title={isInsertParamButtonDisabled ? insertEditButtonToolTipTitle : ''}
          arrow
          placement="top"
          p="10px 15px"
          maxWidth="auto"
          sx={{ zIndex: 9999 }}
        >
          <StyledFlex as="span">
            <StyledButton
              variant="contained"
              secondary
              onClick={onInsertSaveParamHandler}
              disabled={isInsertParamButtonDisabled}
              disabledbgcolor={colors.secondary}
            >
              Insert Parameter
              {isInsertParamButtonDisabled && <HelpOutlineOutlined sx={{ marginLeft: '15px' }} />}
            </StyledButton>
          </StyledFlex>
        </StyledTooltip>
      </StyledFlex>
    </StyledCard>
  );
};

export default memo(InsertParameter);
