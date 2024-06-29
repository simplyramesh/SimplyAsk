import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import Scrollbars from 'react-custom-scrollbars-2';

import { StyledDivider, StyledFlex, StyledText } from '../../../../styles/styled';
import { StyledParamsDropdown, StyledParamsDropdownBody } from '../StyledExpressionBuilder';

const ParamsAutocompleteDropdown = ({ children }) => {
  const sharedTextProps = {
    as: 'span',
    color: '#000',
    size: 14,
    lh: 19.6,
  };

  return (
    <StyledParamsDropdown>
      <StyledParamsDropdownBody>
        <Scrollbars autoHeight autoHeightMax={380} autoHide>
          {children}
        </Scrollbars>
      </StyledParamsDropdownBody>
      <StyledFlex p="0 8px">
        <StyledDivider color="#cfd3da" flexItem />
        <StyledFlex as="p" direction="row" alignItems="center" gap="4px" p="14px 5px">
          <StyledText {...sharedTextProps} weight={600}>
            Enter
          </StyledText>
          <StyledText {...sharedTextProps}>to select.</StyledText>
          <StyledFlex as="span" direction="row" alignItems="center" color="#000">
            <ArrowUpwardRoundedIcon fontSize="inherit" />
            <ArrowDownwardRoundedIcon fontSize="inherit" />
          </StyledFlex>
          <StyledText {...sharedTextProps}>to navigate.</StyledText>
        </StyledFlex>
      </StyledFlex>
    </StyledParamsDropdown>
  );
};

export default ParamsAutocompleteDropdown;
