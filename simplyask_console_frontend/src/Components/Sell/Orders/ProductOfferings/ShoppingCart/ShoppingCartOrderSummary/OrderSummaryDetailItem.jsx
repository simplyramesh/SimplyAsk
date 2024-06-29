import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';

const OrderSummaryDetailItem = ({ label, value, color }) => (
  <StyledFlex direction="row" justifyContent="space-between">
    <StyledText weight={500}>
      {label}
    </StyledText>
    <StyledText weight={600} color={color}>
      {value}
    </StyledText>
  </StyledFlex>
);
export default OrderSummaryDetailItem;
