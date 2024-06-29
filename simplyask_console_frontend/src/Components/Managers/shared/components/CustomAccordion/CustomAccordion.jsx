import React, { useState } from 'react';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const CustomAccordion = ({ title, children }) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  return (
    <StyledFlex>
      <StyledFlex
        direction="row"
        gap="5px"
        alignItems="center"
        cursor="pointer"
        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
      >
        {isAccordionOpen ? <KeyboardArrowUpIcon fontSize="large" /> : <KeyboardArrowDownIcon fontSize="large" />}
        <StyledText size={19} weight={600}>{title}</StyledText>
      </StyledFlex>
      {isAccordionOpen && (
        <StyledFlex p="20px 0">
          {children}
        </StyledFlex>
      )}

    </StyledFlex>
  );
};

export default CustomAccordion;
