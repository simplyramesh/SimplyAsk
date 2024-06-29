import CustomScrollbar from '../../../shared/REDISIGNED/layouts/CustomScrollbar/CustomScrollbar';
import { StyledFlex } from '../../../shared/styles/styled';

const OrderingLayout = ({ leftSlot, rightSlot, scrollableMaxWidth }) => (
  <StyledFlex direction="row" height="100%">
    <StyledFlex flex={{ sm: '0 0 0', lg: '1 1 auto' }} />
    <StyledFlex flex={`1 1 ${scrollableMaxWidth || '800px'}`} maxWidth={`${scrollableMaxWidth || '800px'}`}>
      <CustomScrollbar>
        <StyledFlex px="36px" pb="36px" gap="22px 0">
          {leftSlot}
        </StyledFlex>
        <StyledFlex ml="36px" display={{ sm: 'flex', lg: 'none' }}>
          {rightSlot}
        </StyledFlex>
      </CustomScrollbar>
    </StyledFlex>
    <StyledFlex flex="1 1 auto" mt="36px" mr="36px" display={{ sm: 'none', lg: 'flex' }}>
      {rightSlot}
    </StyledFlex>
  </StyledFlex>
);
export default OrderingLayout;
