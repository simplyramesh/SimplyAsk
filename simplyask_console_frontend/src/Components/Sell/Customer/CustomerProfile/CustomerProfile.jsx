import { useTheme } from '@emotion/react';
import { KeyboardArrowLeftRounded, KeyboardArrowRightRounded } from '@mui/icons-material';
import { useMemo, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { Panel, PanelGroup } from 'react-resizable-panels';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';

import routes from '../../../../config/routes';
import { useFilter } from '../../../../hooks/useFilter';
import { useGetCurrentUser } from '../../../../hooks/useGetCurrentUser';
import { useTableSortAndFilter } from '../../../../hooks/useTableSortAndFilter';
import { getProductInventoryPageable } from '../../../../Services/axios/productInventory';
import { modifiedCurrentPageDetails } from '../../../../store';
import InfoList from '../../../shared/REDISIGNED/layouts/InfoList/InfoList';
import InfoListGroup from '../../../shared/REDISIGNED/layouts/InfoList/InfoListGroup';
import InfoListItem from '../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import TableV2 from '../../../shared/REDISIGNED/table-v2/Table-v2';
import { StyledExpandButton, StyledFlex, StyledResizeHandle, StyledText } from '../../../shared/styles/styled';
import {
  PRODUCT_FILTERS,
  PRODUCT_INVENTORY_INITIAL_VALUES,
  PRODUCT_INVENTORY_SIDE_FILTER_INITIAL_VALUES,
  PRODUCT_ORDERS_FILTER_KEY,
} from '../../constants/productInitialValues';
import { PRODUCT_QUERY_KEYS } from '../../constants/productQueryKeys';
import { PRODUCT_CUSTOMER_PROFILE_TABLE_PROPS } from '../../constants/tableProps';
import useGetProductCustomer from '../../hooks/useGetProductCustomer';
import GoACustomerProfileOrgDetails from '../../Orders/govOfAlberta/components/GoACustomer/GoACustomerProfileOrgDetails';
import ProductsDetailsSidebar from '../../Orders/OrderDetails/ProductsDetailsSidebar';
import { GOVERNMENT_OF_ALBERTA } from '../../Orders/ProductOfferings/ProductOfferings';
import { CUSTOMER_PROFILE, GOA_CUSTOMER_PROFILE } from '../../utils/formatters';
import { getCustomerAddress } from '../../utils/helpers';
import { customerProfileFormatter, selectedCustomerProfileMeta } from '../utils/helpers';

import CustomerProfileFilters from './CustomerProfileFilters/CustomerProfileFilters';

const CustomerProfile = () => {
  const setCurrentPageDetailsState = useSetRecoilState(modifiedCurrentPageDetails);

  const { CustomerId: customerId } = useParams();

  const theme = useTheme();

  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isCustomerProfileFiltersOpen, setIsCustomerProfileFiltersOpen] = useState(false);
  const [customerProduct, setCustomerProduct] = useState(null);

  const { currentUser } = useGetCurrentUser();

  const isGoACustomer = currentUser?.organization?.name === GOVERNMENT_OF_ALBERTA;
  const columns = useMemo(() => (isGoACustomer ? GOA_CUSTOMER_PROFILE : CUSTOMER_PROFILE), []);

  const { customers } = useGetProductCustomer({
    filterParams: {
      [PRODUCT_FILTERS.ID]: [customerId],
    },
    options: {
      enabled: !!customerId,
      select: (data) => {
        const orderCustomer = data?.[0];
        const name = orderCustomer?.name
          ? orderCustomer?.name
          : `${orderCustomer?.firstName} ${orderCustomer?.lastName}`;

        setCurrentPageDetailsState({
          pageUrlPath: routes.CUSTOMER_PROFILE,
          breadCrumbLabel: name,
        });

        return {
          ...orderCustomer,
          name,
        };
      },
    },
  });

  const { sourceFilterValue, setFilterFieldValue, submitFilterValue, initialFilterValues } = useFilter({
    formikProps: {
      initialValues: {
        ...PRODUCT_INVENTORY_INITIAL_VALUES,
        [PRODUCT_FILTERS.RELATED_PARTY_ID]: customerId,
      },
    },
    onSubmit: ({ filterValue, selectedFilters }) => {
      setColumnFilters(filterValue);
      setSelectedFiltersBar(selectedFilters);
    },
    formatter: customerProfileFormatter,
    selectedFiltersMeta: selectedCustomerProfileMeta,
  });

  const {
    setColumnFilters,
    setSearchText,
    pagination,
    setPagination,
    data,
    isFetching,
    selectedFiltersBar,
    setSelectedFiltersBar,
    refetch,
  } = useTableSortAndFilter({
    queryFn: (params) => {
      const query = Object.fromEntries(new URLSearchParams(params));
      const newQueryParams = Object.entries(query).reduce((acc, [key, value]) => {
        if (key === 'pageSize') return { ...acc, limit: value };
        if (key === 'pageNumber') return { ...acc, offset: value * query.pageSize };

        return {
          ...acc,
          [key]: value,
        };
      }, {});

      return getProductInventoryPageable(newQueryParams);
    },
    queryKey: PRODUCT_QUERY_KEYS.PRODUCT_INVENTORY,
    initialFilters: initialFilterValues,
    initialSorting: [
      {
        id: 'dateCreated',
        desc: false,
      },
    ],
    options: {
      enabled: !!customerId,
    },
    pageSize: 25,
  });

  const handleClearAll = () => {
    setFilterFieldValue(PRODUCT_ORDERS_FILTER_KEY, PRODUCT_INVENTORY_SIDE_FILTER_INITIAL_VALUES);
    submitFilterValue();
  };

  const handleClearFilterField = (key) => {
    setFilterFieldValue(PRODUCT_ORDERS_FILTER_KEY, {
      ...sourceFilterValue[PRODUCT_ORDERS_FILTER_KEY],
      [key]: PRODUCT_INVENTORY_SIDE_FILTER_INITIAL_VALUES[key],
    });
    submitFilterValue();
  };

  const renderAddressDetails = (item) => (
    <StyledFlex alignItems="flex-end">
      <StyledText as="p" size={16} weight={400} lh={24}>
        {item?.[PRODUCT_FILTERS.STREET_NAME] || ''}
      </StyledText>
      <StyledText as="p" size={16} weight={400} lh={24}>
        {`${item?.[PRODUCT_FILTERS.CITY] ? `${item?.[PRODUCT_FILTERS.CITY]},` : ''} ${item?.[PRODUCT_FILTERS.PROVINCE] || ''} `}
      </StyledText>
      <StyledText as="p" size={16} weight={400} lh={24}>
        {`${item?.[PRODUCT_FILTERS.COUNTRY] ? `${item?.[PRODUCT_FILTERS.COUNTRY]}, ` : ''}${item?.[PRODUCT_FILTERS.POSTAL_CODE] || ''}`}
      </StyledText>
    </StyledFlex>
  );

  return (
    <>
      <PanelGroup autoSaveId="customer-profile-view" direction="horizontal">
        <Panel defaultSize={70}>
          <StyledFlex bgcolor={theme.colors.white} height="100%" boxShadow={theme.boxShadows.box}>
            <Scrollbars id="customer-profile-view-main">
              <StyledFlex height="100%">
                <StyledFlex p="30px" gap="16px">
                  <StyledText weight="600" size="24" lh="29">
                    {customers?.[PRODUCT_FILTERS.NAME]}
                  </StyledText>
                </StyledFlex>
                <TableV2
                  data={data}
                  columns={columns}
                  title="Assigned Products"
                  entityName="Products"
                  searchPlaceholder="Search Product Names..."
                  onSearch={(e) => setSearchText(e.target.value)}
                  pagination={pagination}
                  setPagination={setPagination}
                  isLoading={isFetching}
                  enableStickyHeader
                  enablePageSizeChange
                  enableRowSelection={false}
                  meta={{
                    onOrderDetails: (row) => {
                      setCustomerProduct(row);
                    },
                    timezone: currentUser?.timezone,
                    theme,
                  }}
                  tableProps={PRODUCT_CUSTOMER_PROFILE_TABLE_PROPS}
                  selectedFilters={selectedFiltersBar}
                  onShowFilters={() => setIsCustomerProfileFiltersOpen(true)}
                  onClearAllFilters={handleClearAll}
                  onClearFilter={handleClearFilterField}
                  pinColumns={['productName']}
                  onTableRefresh={refetch}
                />
              </StyledFlex>
            </Scrollbars>
          </StyledFlex>
        </Panel>
        <StyledResizeHandle>
          <StyledExpandButton top="75%" right="0" onClick={() => setIsPanelOpen((prev) => !prev)}>
            {isPanelOpen ? <KeyboardArrowRightRounded /> : <KeyboardArrowLeftRounded />}
          </StyledExpandButton>
        </StyledResizeHandle>
        {isPanelOpen && (
          <Panel defaultSize={30} minSize={30} maxSize={40}>
            <Scrollbars id="customer-profile-view-panel">
              <StyledFlex padding="30px 10px" bgcolor={theme.colors.white} height="100%">
                <InfoList>
                  <InfoListGroup title="Customer Details" noPaddings>
                    <InfoListItem name="Customer ID">{`#${customers?.[PRODUCT_FILTERS.ID]}`}</InfoListItem>
                    {!isGoACustomer ? <InfoListItem name="BAN">{customers?.ban || ''}</InfoListItem> : null}
                    <InfoListItem name="Email">{customers?.[PRODUCT_FILTERS.EMAIL] || ''}</InfoListItem>
                    <InfoListItem name="Phone Number">
                      {customers?.[PRODUCT_FILTERS.PHONE_NUMBER]
                        ? customers?.[PRODUCT_FILTERS.PHONE_NUMBER]?.replace(
                            /(\+\d)(\d{3})(\d{3})(\d{4})/,
                            '$1 ($2) $3-$4'
                          )
                        : ''}
                    </InfoListItem>
                    <InfoListItem name={isGoACustomer ? 'Address' : 'Shipping Address'}>
                      {renderAddressDetails(
                        getCustomerAddress(customers?.place, PRODUCT_FILTERS.SHIPPING_ADDRESS_ROLE)
                      )}
                    </InfoListItem>
                    {!isGoACustomer ? (
                      <>
                        <InfoListItem name="Service Address">
                          {renderAddressDetails(
                            getCustomerAddress(customers?.place, PRODUCT_FILTERS.SERVICE_ADDRESS_ROLE)
                          )}
                        </InfoListItem>
                        <InfoListItem name="Billing Address">
                          {renderAddressDetails(
                            getCustomerAddress(customers?.place, PRODUCT_FILTERS.BILLING_ADDRESS_ROLE)
                          )}
                        </InfoListItem>
                      </>
                    ) : null}
                  </InfoListGroup>
                </InfoList>
                {isGoACustomer ? <GoACustomerProfileOrgDetails customers={customers} /> : null}
              </StyledFlex>
            </Scrollbars>
          </Panel>
        )}
      </PanelGroup>
      <CustomerProfileFilters
        isOpen={isCustomerProfileFiltersOpen}
        onClose={() => setIsCustomerProfileFiltersOpen(false)}
        initialValues={sourceFilterValue[PRODUCT_ORDERS_FILTER_KEY]}
        onApplyFilters={(sideFilter) => {
          setIsCustomerProfileFiltersOpen(false);
          setFilterFieldValue(PRODUCT_ORDERS_FILTER_KEY, sideFilter);
          submitFilterValue();
        }}
      />
      <ProductsDetailsSidebar
        isOpen={!!customerProduct}
        onClose={() => setCustomerProduct(null)}
        customerProducts={customerProduct}
      />
    </>
  );
};

export default CustomerProfile;
