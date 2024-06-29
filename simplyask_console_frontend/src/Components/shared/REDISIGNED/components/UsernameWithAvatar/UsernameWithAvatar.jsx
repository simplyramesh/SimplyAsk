import React from 'react';

import UserAvatar from '../../../../UserAvatar';
import { StyledFlex, StyledText } from '../../../styles/styled';

const UsernameWithAvatar = ({
  imgSrc,
  firstName = '',
  lastName = '',
  color = '#F57B20',
  placeholder = 'Unassigned',
}) => {
  const nameFirstOrLast = firstName || lastName;
  const clr = nameFirstOrLast ? color : '#AAAEB6';

  return (
    <StyledFlex direction="row" gap="14px" alignItems="center">
      <UserAvatar
        imgSrc={imgSrc}
        customUser={{ firstName, lastName }}
        size="30"
        color={clr}
      />
      <StyledText size={14} weight={400}>{nameFirstOrLast ? `${firstName} ${lastName}` : placeholder}</StyledText>
    </StyledFlex>
  );
};

export default UsernameWithAvatar;
