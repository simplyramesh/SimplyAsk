import styled from '@emotion/styled';

import { StyledBaseTextInput } from '../../../../shared/REDISIGNED/controls/BaseTextInput/StyledBaseTextInput';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import { StyledFlex } from '../../../../shared/styles/styled';

export const StyledOrderSummary = styled(StyledFlex)`
    align-items: flex-start;
    min-width:417px;
    max-width:${({ width }) => width || '417px'};
    flex-shrink: 0;
    padding: 36px;
    border-radius:20px;
    border: 1.5px solid ${({ theme }) => theme.colors.oceanBlue};
`;

export const StyledPromoCodeInput = styled(StyledBaseTextInput, {
  shouldForwardProp: (prop) => prop !== 'invalid',
})`
    color:${({ theme }) => theme.colors.information};
    border: 1.5px solid ${({ theme, invalid }) => (!invalid ? theme.colors.black : theme.colors.statusOverdue)};
    border-radius: 5px;
    font-size: 15px;
    font-weight: 400;
    width:247px;
    padding:5px 10px;

    &:focus{
        border-color: ${({ theme, invalid }) => (!invalid ? theme.colors.black : theme.colors.statusOverdue)};
    }
`;

export const StyledSavingsApplied = styled(StyledFlex)`
    padding: 10px 15px;
    border-radius: 10px;
    border: 2px solid ${({ theme }) => theme.colors.grassGreen};
    background: ${({ theme }) => theme.colors.white};
`;

export const StyledCheckoutButton = styled(StyledButton)`
&:disabled{
    color: ${({ theme }) => theme.colors.disabledLinkColor}
}
  `;
