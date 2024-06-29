import PropTypes from 'prop-types';
import React from 'react';

import {
  StyledAdditionalInfo,
  StyledAdditionalInfoHead,
  StyledAdditionalInfoHeadIcon,
  StyledAdditionalInfoHeadText,
  StyledAdditionalInfoList,
  StyledAdditionalInfoListItem,
  StyledAdditionalInfoListItemSub,
} from './StyledAdditionalInfo';

const AdditionalInfo = ({ opened, onToggle, outputs }) => (
  <StyledAdditionalInfo onClick={onToggle} opened={opened}>
    <StyledAdditionalInfoHead>
      <StyledAdditionalInfoHeadIcon />
      <StyledAdditionalInfoHeadText>
        Additional info
      </StyledAdditionalInfoHeadText>
    </StyledAdditionalInfoHead>
    <StyledAdditionalInfoList>
      {outputs.map((item, index) => (
        <StyledAdditionalInfoListItem key={index}>
          {item?.split('|||').map((i, idx) => (i ? <StyledAdditionalInfoListItemSub key={idx}>{i}</StyledAdditionalInfoListItemSub> : null))}
        </StyledAdditionalInfoListItem>
      ))}
    </StyledAdditionalInfoList>
  </StyledAdditionalInfo>
);

AdditionalInfo.propTypes = {
  opened: PropTypes.bool,
  onToggle: PropTypes.func,
  outputs: PropTypes.array,
};

export default AdditionalInfo;
