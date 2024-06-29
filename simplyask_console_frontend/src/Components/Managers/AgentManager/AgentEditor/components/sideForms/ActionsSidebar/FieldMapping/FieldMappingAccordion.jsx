import React, { useState } from 'react';
import { StyledFlex, StyledText } from '../../../../../../../shared/styles/styled';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useTheme } from '@mui/material';

const FieldMappingAccordion = ({ label, fields }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { colors } = useTheme();

  return (
    <StyledFlex>
      <StyledFlex
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        cursor="pointer"
        sx={{
          '&:hover': {
            backgroundColor: colors.grayishBlue,
            borderRadius: '5px',
          },
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <StyledText size={14} weight={600}>
          {label}
        </StyledText>
        {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </StyledFlex>
      {isExpanded && (
        <StyledFlex>
          {fields.map((field, index) => (
            <StyledText size={14} key={index}>
              <StyledFlex direction="row" alignItems="center">
                <StyledFlex width="20px" as="span">
                  {index + 1}.
                </StyledFlex>{' '}
                {field.fieldName} {' -> '} {field.value.length ? JSON.stringify(field.value) : '---'}
              </StyledFlex>
            </StyledText>
          ))}
        </StyledFlex>
      )}
    </StyledFlex>
  );
};

export default FieldMappingAccordion;
