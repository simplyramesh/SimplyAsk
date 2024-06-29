import styled from '@emotion/styled';

import { StyledBaseTextInput } from '../../../../../shared/REDISIGNED/controls/BaseTextInput/StyledBaseTextInput';

export const StyledPhoneNumberInput = styled(StyledBaseTextInput)`
  padding: 10px 16px 10px 46px;
`;

export const StyledPlusOne = styled.p`
  position: absolute;
  top: 1px;
  left: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 35px;
  border: ${({ theme }) => `1px solid ${theme.colors.phonePlusOneBg}`};
  border-radius: ${({ plusOneBorderRadius }) => plusOneBorderRadius || '10px 0px 0px 10px'};
  background: ${({ theme }) => theme.colors.phonePlusOneBg};
`;
