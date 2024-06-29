import React from 'react';

import { StyledParamsDropdownDot, StyledParamsDropdownItem } from '../StyledExpressionBuilder';
import { PARAM_TYPES } from "../../../../../WorkflowEditor/constants/layout";
import { StyledFlex, StyledText } from "../../../../styles/styled";
import { StyledTooltip } from "../../../tooltip/StyledTooltip";
import { getFrom } from "../utils/helpers";

export const ParamsAutocompleteDropdownItem = ({
  index, isSelected, onClick, onMouseEnter, option,
}) => {

  const renderDot = (title, isFully) => (
    <StyledTooltip title={title} arrow placement="top" p="10px 15px" maxWidth="auto">
      <StyledParamsDropdownDot green={isFully} />
    </StyledTooltip>
  )

  const from = getFrom(option.source, option.stepId, option.stepName);

  return (
    <StyledParamsDropdownItem
      key={option.key}
      selected={isSelected}
      tabIndex={-1}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={`typeahead-item-${index}`}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {option.type === PARAM_TYPES.FULLY_AVAILABLE
        ? renderDot('Fully Available', true)
        : renderDot('Potentially Available')}
      <StyledFlex minWidth={0}>
        <StyledText title={option.label} size={16} weight={600} lh={24} ellipsis>{option.label}</StyledText>
        <StyledText title={from} size={14} ellipsis>{from}</StyledText>
      </StyledFlex>
    </StyledParamsDropdownItem>
  );
};
