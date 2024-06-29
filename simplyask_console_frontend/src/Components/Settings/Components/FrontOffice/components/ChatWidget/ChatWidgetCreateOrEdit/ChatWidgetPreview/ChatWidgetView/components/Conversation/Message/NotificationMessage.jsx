import React from 'react';

import { StyledFlex, StyledHr, StyledFlexText } from '../../shared/styles/styled';

const NotificationMessage = ({ text }) => (
  <StyledFlex direction="row" alignItems="center" textAlign="center" mb="15px" gap="10px">
    <StyledHr />
    <StyledFlexText
      size={12}
      wordBreak="break-word"
      textAlign="center"
    >
      {text.replace('Notification: ', '')}

    </StyledFlexText>
    <StyledHr />
  </StyledFlex>
);

export default NotificationMessage;
