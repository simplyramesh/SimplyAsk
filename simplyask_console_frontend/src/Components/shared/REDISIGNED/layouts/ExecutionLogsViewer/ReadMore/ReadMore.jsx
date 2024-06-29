import { useTheme } from '@emotion/react';
import { useState } from 'react';

import { StyledFlex } from '../../../../styles/styled';
import { StyledButton } from '../../../controls/Button/StyledButton';

const ReadMore = ({ text, limit = 300 }) => {
  const { colors } = useTheme();
  const shortText = text?.slice(0, limit);
  const [isReadMore, setIsReadMore] = useState(false);

  const handleToggleReadMore = () => {
    setIsReadMore((prev) => !prev);
  };

  return text ? (
    <StyledFlex padding="5px" marginTop="10px" backgroundColor={colors.accordionHover}>
      {isReadMore ? text : `${shortText}...`}
      {' '}
      {text.length > limit && (
        <StyledButton
          variant="text"
          onClick={handleToggleReadMore}
        >
          {isReadMore ? 'Less...' : 'More...'}
        </StyledButton>
      )}
    </StyledFlex>
  ) : null;
};

export default ReadMore;
