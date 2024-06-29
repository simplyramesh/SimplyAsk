import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import React from 'react';

import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import ParamList from './ParamList';

const RpaForumParamList = ({ param, onDeleteClick, onEditClick }) => {
  const { colors } = useTheme();

  const fieldValue = param.value.actionValue.label || param.value.actionValue;
  const locatorType = param.value.attributeType;
  const locatorValue = param.value.attributeValue.label || param.value.attributeValue;

  const renderLabelValue = (label, value) => (
    <StyledText wordBreak="break-all" color={colors.information} as="span" weight={400} size={14} lh={20} maxLines={1}>
      <StyledText color={colors.information} display="inline" as="span" weight={600} size={14} lh={20}>
        {label}
      </StyledText>
      {value}
    </StyledText>
  );

  return (
    <ParamList onDeleteClick={onDeleteClick} onEditClick={onEditClick}>
      <StyledFlex pb="12px">
        <StyledText as="span" weight={700} size={16} lh={22} mt={11}>
          {fieldValue}
        </StyledText>
        {renderLabelValue('Field Value: ', fieldValue)}
        {renderLabelValue('Locator Type: ', locatorType)}
        {renderLabelValue('Locator Value: ', locatorValue)}
      </StyledFlex>
    </ParamList>
  );
};

export default RpaForumParamList;

RpaForumParamList.propTypes = {
  param: PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.shape({
      actionValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      attributeType: PropTypes.string,
      attributeValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    }),
  }),
  onDeleteClick: PropTypes.func,
  onEditClick: PropTypes.func,
};
