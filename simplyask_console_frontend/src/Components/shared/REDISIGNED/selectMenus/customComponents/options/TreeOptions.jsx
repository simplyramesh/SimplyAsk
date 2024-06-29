import { useTheme } from '@emotion/react';
import { components } from 'react-select';

import { StyledFlex, StyledText } from '../../../../styles/styled';

const TreeOptions = ({ children, data, ...rest }) => {
  const { colors } = useTheme();
  const { disabled, label } = data;

  return (
    <components.Option
      {...rest}
    >
      <StyledFlex>
        {disabled && <StyledText size={15} lh={22} weight={700} color={colors.primary}>{label}</StyledText>}
        {!disabled && <StyledText p="0 0 0 20px" size={15} lh={22} color={colors.primary}>{label}</StyledText>}
      </StyledFlex>
    </components.Option>
  );
};

export default TreeOptions;
