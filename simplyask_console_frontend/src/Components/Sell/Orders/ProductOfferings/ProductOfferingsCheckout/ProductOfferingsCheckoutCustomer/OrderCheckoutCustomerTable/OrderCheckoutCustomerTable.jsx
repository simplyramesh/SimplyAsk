import routes from '../../../../../../../config/routes';
import { StyledButton } from '../../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import TableV2 from '../../../../../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { PRODUCT_ORDER_CUSTOMER_SEARCH_TABLE_PROPS } from '../../../../../constants/tableProps';
import { PRODUCT_ORDER_CUSTOMER } from '../../../../../utils/formatters';
import OrderCheckoutCustomerSearch from '../OrderCheckoutCustomerSearch/OrderCheckoutCustomerSearch';

const OrderCheckoutCustomerTable = ({
  sortAndFilter,
  customerSearchInput,
  setCustomerSearchInput,
  selectSearchBy,
  setSelectSearchBy,
  setShowAdvancedSearchModal,
  setCustomer,
  onSearch,
  onNewCustomer,
}) => (
  <StyledFlex>
    <StyledFlex p="30px" gap="30px 0">
      <StyledFlex gap="4px 0">
        <StyledFlex flex="1 1 auto">
          <StyledText as="h3" size={19} weight={600} lh={29}>
            Select a Customer
          </StyledText>
        </StyledFlex>
        <StyledFlex flex="1 1 auto" justifyContent="center">
          <StyledText as="p" size={16} weight={400} lh={24}>
            Don't see a customer that works for you?
            <StyledButton
              variant="text"
              onClick={onNewCustomer}
              fontSize="16px"
              fontWeight="500"
            >
              {' Click Here '}
            </StyledButton>
            to create a new customer to add to your order
          </StyledText>
        </StyledFlex>
      </StyledFlex>
      <OrderCheckoutCustomerSearch
        searchValue={customerSearchInput}
        onSearchValue={(e) => setCustomerSearchInput(e.target.value)}
        searchByValue={selectSearchBy}
        onSearchBy={(option) => setSelectSearchBy(option)}
        onSearch={onSearch}
        onAdvancedSearchOpen={() => setShowAdvancedSearchModal(true)}
      />
    </StyledFlex>
    <TableV2
      data={{ content: sortAndFilter.data }}
      columns={PRODUCT_ORDER_CUSTOMER}
      enableHeader={false}
      sorting={sortAndFilter.sorting}
      setSorting={sortAndFilter.setSorting}
      pinSelectColumn
      pinColumns={['name']}
      pinRowHoverActionColumns={['openCustomerProfile']}
      tableProps={PRODUCT_ORDER_CUSTOMER_SEARCH_TABLE_PROPS}
      meta={{
        onCustomer: (c) => setCustomer(c),
        onCustomerProfile: (customer) => {
          const url = `${routes.CUSTOMER_MANAGER}/${customer?.id}`;
          window.open(url, '_blank');
        },
      }}
      enableFooter={false}
      isLoading={sortAndFilter.isFetching}
    />
  </StyledFlex>
);

export default OrderCheckoutCustomerTable;
