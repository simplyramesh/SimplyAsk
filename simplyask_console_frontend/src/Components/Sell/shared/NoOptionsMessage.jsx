import CustomTableIcons from '../../shared/REDISIGNED/icons/CustomTableIcons';
import { StyledFlex, StyledText } from '../../shared/styles/styled';

const NoOptionsMessage = ( props ) =>
{
  const getTextColor = (props) =>
  {
    return props?.selectProps?.textColor ? props.selectProps.textColor : undefined;
  }

  return (<StyledFlex height="240px" alignItems="center" justifyContent="center">
    <CustomTableIcons color={getTextColor(props)} icon="EMPTY" width={88}/>
    <StyledText color={getTextColor(props)} weight={600}>No Results Found</StyledText>
  </StyledFlex>)
};

export default NoOptionsMessage;
