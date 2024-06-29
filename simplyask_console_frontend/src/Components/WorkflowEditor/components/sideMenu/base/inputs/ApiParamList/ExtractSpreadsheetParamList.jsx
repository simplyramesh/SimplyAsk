import { useTheme } from '@emotion/react';
import PropTypes from 'prop-types';
import React from 'react';

import { StyledText } from '../../../../../../shared/styles/styled';
import ParamList from './ParamList';
import { getStringifiedEditorState } from '../../../../../../shared/REDISIGNED/controls/lexical/utils/helpers';

const ExtractSpreadsheetParamList = ({ param, onDeleteClick, onEditClick }) => {
  const { colors } = useTheme();

  const paramName = param.value.paramName.label || param.value.paramName;
  const targetCell = param.value.targetCell.label || param.value.targetCell;

  return (
    <ParamList onDeleteClick={onDeleteClick} onEditClick={onEditClick}>
      <StyledText as="span" weight={600} size={16} lh={20} maxWidth="100%" ellipsis maxLines={2}>
        {paramName}
      </StyledText>
      <StyledText wordBreak="break-all" color={colors.information} as="span" weight={400} size={14} lh={20}>
        <StyledText color={colors.information} display="inline" as="span" weight={600} size={14} lh={17}>
          Target Cell (Static):
        </StyledText>{' '}
        {getStringifiedEditorState(targetCell)}
      </StyledText>
      <StyledText wordBreak="break-all" color={colors.information} as="span" weight={400} size={14} lh={20}>
        <StyledText color={colors.information} display="inline" as="span" weight={600} size={14} lh={20}>
          Data Type:
        </StyledText>{' '}
        {param.value.dataType}
      </StyledText>
    </ParamList>
  );
};

export default ExtractSpreadsheetParamList;

ExtractSpreadsheetParamList.propTypes = {
  param: PropTypes.object,
  onDeleteClick: PropTypes.func,
  onEditClick: PropTypes.func,
};
