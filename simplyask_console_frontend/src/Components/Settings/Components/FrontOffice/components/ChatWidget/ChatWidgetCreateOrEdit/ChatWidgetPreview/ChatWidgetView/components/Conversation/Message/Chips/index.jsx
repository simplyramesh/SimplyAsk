import { useTheme } from '@mui/system';
import React from 'react';

import { getLighterOpacityOfColor } from '../../../../utils/helperFunctions';
import { StyledFlex, StyledText } from '../../../shared/styles/styled';

const Chips = ({ data, hidden, onClick, appearances }) => {
  const { colors } = useTheme();

  if (!data) return null;

  return (
    <StyledFlex
      direction="row"
      maxWidth="75%"
      flexWrap="wrap"
      gap="4px"
      marginTop="5px"
      marginBottom="10px"
      margin="5px auto 10px 40px"
    >
      {!hidden &&
        data.map((chip, i) => (
          <StyledFlex
            padding="5px 9px"
            border={`1px solid ${appearances.primaryColourHex || colors.primary}`}
            borderRadius="8px"
            cursor="pointer"
            key={i}
            hoverBg={getLighterOpacityOfColor(appearances.primaryColourHex)}
          >
            <StyledText
              key={i}
              onClick={() => onClick?.(chip)}
              size={11}
              smSize={10}
              weight={500}
              color={appearances.primaryColourHex || colors.primary}
            >
              {chip}
            </StyledText>
          </StyledFlex>
        ))}
    </StyledFlex>
  );
};

export default Chips;
