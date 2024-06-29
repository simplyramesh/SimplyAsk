import { useFormik } from 'formik';
import { useState } from 'react';
import { Portal } from 'react-portal';

import CustomCalendarIndicator from '../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomIndicatorArrow from '../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCalendarMenu from '../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu';
import CustomCheckboxOption from '../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import CustomSelect from '../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomSidebar from '../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import { StyledFlex, StyledText } from '../../../shared/styles/styled';
import { PRODUCT_FILTERS, PRODUCT_ORDERS_SIDE_FILTER_INITIAL_VALUES } from '../../constants/productInitialValues';
import { PRODUCT_ORDER_HISTORY_STATUS_MAP, SHARED_DROPDOWN_PROPS } from '../../constants/productOptions';
import useGetProductOrder from '../../hooks/useGetProductOrder';
import LoadingMessage from '../../shared/LoadingMessage';
import NoOptionsMessage from '../../shared/NoOptionsMessage';

const OrderManagerFilters = ({
  isOpen,
  onClose,
  initialValues = PRODUCT_ORDERS_SIDE_FILTER_INITIAL_VALUES,
  onApplyFilters,
}) => {
  const [filterParams, setFilterParams] = useState({});

  const { orders, isFetching: isOrderFetching } = useGetProductOrder({
    filterParams,
    options: {
      enabled: isOpen,
      select: (data) => {
        const customerInfo = data?.reduce((acc, item) => {
          const relatedParty = item?.productOrderItem?.[0]?.product?.relatedParty?.[0];
          const firstName = relatedParty?.[PRODUCT_FILTERS.FIRST_NAME] || '';
          const lastName = relatedParty?.[PRODUCT_FILTERS.LAST_NAME] || '';

          const customerId = `${relatedParty?.[PRODUCT_FILTERS.ID]} - ${firstName} ${lastName}`;

          const customer = relatedParty?.name || ((firstName || lastName) && `${firstName} ${lastName}`);

          if (!customer) return acc;

          return {
            ...acc,
            ids: [...new Set([...acc.ids, customerId])],
            names: [...new Set([...acc.names, customer])],
          };
        }, { ids: [], names: [] });

        return {
          data,
          [PRODUCT_FILTERS.CUSTOMER]: customerInfo?.names?.map((item) => ({ label: item, value: item })),
          [PRODUCT_FILTERS.CUSTOMER_ID]: customerInfo?.ids?.map((item) => ({ label: item, value: item.split(' ')?.[0] })),
        };
      },
    },
  });

  const {
    values, setFieldValue, submitForm, setValues,
  } = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (val, meta) => {
      onApplyFilters(val);
      meta.resetForm(PRODUCT_ORDERS_SIDE_FILTER_INITIAL_VALUES);
    },
  });

  const handleDropdownFilterChange = (val, action) => {
    if (Object.values(filterParams).length) setFilterParams({});

    setFieldValue(action.name, val);
  };

  return (
    <CustomSidebar
      open={isOpen}
      onClose={onClose}
      headStyleType="filter"
    >
      {({ customActionsRef }) => (
        <StyledFlex flex="1 1 auto" p="0 24px 24px 24px">
          <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
            <StyledText size={18} weight={500}>Filter By</StyledText>
            <StyledButton
              variant="text"
              onClick={() => setValues(PRODUCT_ORDERS_SIDE_FILTER_INITIAL_VALUES)}
            >
              Clear All Filters
            </StyledButton>
          </StyledFlex>
          <StyledFlex>
            <StyledFlex mb="16px">
              <CustomSelect
                name={PRODUCT_FILTERS.ORDER_DATE}
                menuPlacement="auto"
                placeholder="Select Order Date"
                onChange={handleDropdownFilterChange}
                value={values[PRODUCT_FILTERS.ORDER_DATE]}
                components={{
                  DropdownIndicator: CustomCalendarIndicator,
                  Menu: CustomCalendarMenu,
                }}
                menuPortalTarget={document.body}
                isSearchable={false}
                calendar
                radioLabels={[
                  {
                    label: 'Order Date',
                    value: [PRODUCT_FILTERS.ORDER_END_DATE, PRODUCT_FILTERS.ORDER_START_DATE],
                    default: true,
                  },

                ]}
                showDateFilterType={false}
                {...SHARED_DROPDOWN_PROPS}
              />
              <CustomSelect
                name={PRODUCT_FILTERS.CUSTOMER}
                value={values[PRODUCT_FILTERS.CUSTOMER]}
                onChange={handleDropdownFilterChange}
                placeholder="Search Customer"
                options={orders?.[PRODUCT_FILTERS.CUSTOMER] || []}
                closeMenuOnSelect
                closeMenuOnScroll
                components={{
                  DropdownIndicator: CustomIndicatorArrow,
                  NoOptionsMessage,
                  LoadingMessage,
                }}
                maxHeight={30}
                menuPadding={0}
                menuPlacement="auto"
                withSeparator
                isLoading={isOrderFetching}
                filterOption={null}
                isClearable
              />
              <CustomSelect
                name={PRODUCT_FILTERS.CUSTOMER_ID}
                options={orders?.[PRODUCT_FILTERS.CUSTOMER_ID] || []}
                placeholder="Search Customer ID"
                value={values[PRODUCT_FILTERS.CUSTOMER_ID]}
                closeMenuOnSelect
                closeMenuOnScroll
                onChange={handleDropdownFilterChange}
                components={{
                  DropdownIndicator: CustomIndicatorArrow,
                  NoOptionsMessage,
                  LoadingMessage,
                }}
                maxHeight={30}
                menuPadding={0}
                menuPlacement="auto"
                withSeparator
                isClearable
                isLoading={isOrderFetching}
                filterOption={null}
              />
              <CustomSelect
                name={PRODUCT_FILTERS.STATUS}
                options={Object.values(PRODUCT_ORDER_HISTORY_STATUS_MAP)}
                value={values[PRODUCT_FILTERS.STATUS]}
                onChange={handleDropdownFilterChange}
                placeholder="Select Status"
                components={{
                  DropdownIndicator: CustomIndicatorArrow,
                  Option: CustomCheckboxOption,
                }}
                isSearchable={false}
                isMulti
                {...SHARED_DROPDOWN_PROPS}
              />

            </StyledFlex>
          </StyledFlex>
          <Portal node={customActionsRef?.current}>
            <StyledButton
              width="125px"
              onClick={submitForm}
              variant="contained"
              primary
            >
              Confirm
            </StyledButton>
          </Portal>
        </StyledFlex>
      )}
    </CustomSidebar>
  );
};

export default OrderManagerFilters;
