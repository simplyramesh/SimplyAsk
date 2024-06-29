import styled from '@emotion/styled';
import { StyledFlex } from '../../../../../../shared/styles/styled';

export const StyledValidationTypeInputWrapper = styled(StyledFlex, {
    shouldForwardProp: (prop) => !['error'].includes(prop)
})`
    border: ${({ theme, error }) => `1px solid ${error ? theme.colors.statusOverdue : theme.colors.transparentWhite}`};
    border-radius: 10px;
`;