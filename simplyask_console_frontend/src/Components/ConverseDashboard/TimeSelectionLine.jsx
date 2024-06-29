import PropTypes from 'prop-types';
import React from 'react';

import { StyledButton } from '../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledFlex, StyledText } from '../shared/styles/styled';

const TimeSelectionLine = ({ currentSelection, handleChange, options }) => (
  <StyledFlex direction="row" gap="31px">
    {
      options.map((data) => {
        const selected = currentSelection && currentSelection === data.value;

        return (
          <StyledFlex
            key={data.label}
            borderBottom={selected ? '4px solid' : 'none'}
            pb="9px"
          >
            <StyledButton
              variant="text"
              fontWeight={selected ? 700 : 400}
              color="primary"
              onClick={() => handleChange(data.value)}
            >
              <StyledText size={16} weight={selected ? 700 : 400} lh={20}>
                {data.label}
              </StyledText>
            </StyledButton>
          </StyledFlex>
        );
      })
    }

  </StyledFlex>
);

export default TimeSelectionLine;

TimeSelectionLine.propTypes = {
  currentSelection: PropTypes.string,
  handleChange: PropTypes.func,
  options: PropTypes.array,
};
