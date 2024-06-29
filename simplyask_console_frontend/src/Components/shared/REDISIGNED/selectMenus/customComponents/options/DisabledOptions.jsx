import { useTheme } from '@emotion/react';
import { components } from 'react-select';

import { StyledFlex, StyledText } from '../../../../styles/styled';

const DisabledOptions = ({ children, data, ...rest }) => {
  const { colors } = useTheme();
  const { disabled, label } = data;

  return (
    <components.Option
      {...rest}
    >
      <StyledFlex>
        <StyledText size={15} lh={22} color={disabled ? colors.inputBorder : colors.primary}>{label}</StyledText>
      </StyledFlex>
    </components.Option>
  );
};

export default DisabledOptions;
