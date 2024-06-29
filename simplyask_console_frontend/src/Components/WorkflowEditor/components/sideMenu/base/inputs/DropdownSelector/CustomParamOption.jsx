import React from 'react';
import { components } from 'react-select';
import { PARAM_TYPES } from "../../../../../constants/layout";
import { StyledFlex, StyledText } from "../../../../../../shared/styles/styled";
import { getFrom } from "../../../../../../shared/REDISIGNED/controls/lexical/utils/helpers";
import { StyledTooltip } from "../../../../../../shared/REDISIGNED/tooltip/StyledTooltip";
import { StyledParamsDropdownDot } from "../../../../../../shared/REDISIGNED/controls/lexical/StyledExpressionBuilder";

const CustomParamOption = ({
  data,
  children,
  ...rest
}) => {
  const renderDot = (title, isFully) => (
    <StyledTooltip title={title} arrow placement="top" p="10px 15px" maxWidth="auto">
      <StyledParamsDropdownDot green={isFully} />
    </StyledTooltip>
  )

  const from = getFrom(data.source, data.stepId, data.stepName);

  return (
    <components.Option {...rest} data={data} >
      <StyledFlex minWidth={0} direction="row" alignItems="center" gap="10px">
        {data.type === PARAM_TYPES.FULLY_AVAILABLE
          ? renderDot('Fully Available', true)
          : renderDot('Potentially Available')}
        <StyledFlex minWidth={0}>
          <StyledText title={children} size={16} weight={600} lh={24} ellipsis>{children}</StyledText>
          <StyledText title={from} size={14} ellipsis>{from}</StyledText>
        </StyledFlex>
      </StyledFlex>
    </components.Option>
  );
};

export default CustomParamOption;
