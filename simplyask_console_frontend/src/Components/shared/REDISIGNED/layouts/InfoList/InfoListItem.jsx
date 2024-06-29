import React from 'react';

import { StyledText } from '../../../styles/styled';

import { StyledInfoListItem, StyledInfoListItemKey, StyledInfoListItemValue } from './StyledInfoList';
import Spinner from '../../../Spinner/Spinner';

const InfoListItem = ({ children, name, alignItems, nameStyles = {}, subLabel, isLoading, wordBreak }) => (
  <StyledInfoListItem alignItems={alignItems}>
    <StyledInfoListItemKey>
      <StyledText as="span" weight={500} size={16} lh={20} {...nameStyles}>
        {name}
      </StyledText>
      {subLabel ? <StyledText size={14}>{subLabel}</StyledText> : null}
    </StyledInfoListItemKey>
    <StyledInfoListItemValue isLoading={isLoading} wordBreak={wordBreak}>
      {isLoading && <Spinner fadeBgParent small parent />}
      {children}
    </StyledInfoListItemValue>
  </StyledInfoListItem>
);

export default InfoListItem;
