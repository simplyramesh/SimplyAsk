import PropTypes from 'prop-types';
import React from 'react';

import { StyledText } from '../../../styles/styled';

import { StyledInfoListGroup, StyledInfoListItems, StyledInfoListTitle } from './StyledInfoList';

const InfoListGroup = ({ children, title, bigTitle, noPaddings }) => (
  <StyledInfoListGroup noPaddings={noPaddings}>
    {title && (
      <StyledInfoListTitle>
        <StyledText as="span" weight={600} size={bigTitle ? 22 : 19} lh={24} wordBreak="break-word">
          {title}
        </StyledText>
      </StyledInfoListTitle>
    )}
    <StyledInfoListItems>{children}</StyledInfoListItems>
  </StyledInfoListGroup>
);

InfoListGroup.propTypes = {
  title: PropTypes.any,
  bigTitle: PropTypes.bool,
  children: PropTypes.node,
};

export default InfoListGroup;
