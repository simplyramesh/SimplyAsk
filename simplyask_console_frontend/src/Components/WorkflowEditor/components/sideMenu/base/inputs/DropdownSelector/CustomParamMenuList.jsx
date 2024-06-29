import { components } from 'react-select';
import { StyledDivider, StyledFlex, StyledText } from "../../../../../../shared/styles/styled";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import Scrollbars from "react-custom-scrollbars-2";


const sharedTextProps = {
  as: 'span',
  color: '#000',
  size: 14,
  lh: 19.6,
};

const CustomParamMenuList = (props) => {
  return (
    <components.Menu {...props}>
      {props.children}
      <StyledFlex p="0 8px">
        <StyledDivider color="#cfd3da" flexItem />
        <StyledFlex
          as="p"
          direction="row"
          alignItems="center"
          gap="4px"
          p="14px 5px"
        >
          <StyledText {...sharedTextProps} weight={600}>Enter</StyledText>
          <StyledText {...sharedTextProps}>to select.</StyledText>
          <StyledFlex
            as="span"
            direction="row"
            alignItems="center"
            color="#000"
          >
            <ArrowUpwardRoundedIcon fontSize="inherit" />
            <ArrowDownwardRoundedIcon fontSize="inherit" />
          </StyledFlex>
          <StyledText {...sharedTextProps}>to navigate.</StyledText>
        </StyledFlex>
      </StyledFlex>
    </components.Menu>
  );
};

export default CustomParamMenuList;
