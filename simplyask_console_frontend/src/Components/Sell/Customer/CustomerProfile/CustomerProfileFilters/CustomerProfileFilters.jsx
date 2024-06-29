import { useFormik } from 'formik';
import { useState } from 'react';
import { Portal } from 'react-portal';
import { useParams } from 'react-router-dom';

import CustomCalendarIndicator from '../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCalendarMenu from '../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu';
import CustomCheckboxOption from '../../../../shared/REDISIGNED/selectMenus/customComponents/options/CustomCheckboxOption';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import CustomSidebar from '../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { PRODUCT_FILTERS, PRODUCT_INVENTORY_SIDE_FILTER_INITIAL_VALUES } from '../../../constants/productInitialValues';
import { PRODUCT_CUSTOMER_PROFILE_STATUS_MAP, SHARED_DROPDOWN_PROPS } from '../../../constants/productOptions';

const CustomerProfileFilters = ({
  isOpen,
  onClose,
  initialValues = PRODUCT_INVENTORY_SIDE_FILTER_INITIAL_VALUES,
  onApplyFilters,
}) => {
  const { CustomerId: customerId } = useParams();

  const [filterParams, setFilterParams] = useState({
    [PRODUCT_FILTERS.RELATED_PARTY_ID]: customerId,
  });

  const {
    values, setFieldValue, submitForm, setValues,
  } = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (val, meta) => {
      onApplyFilters(val);
      meta.resetForm(PRODUCT_INVENTORY_SIDE_FILTER_INITIAL_VALUES);
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
              onClick={() => setValues(PRODUCT_INVENTORY_SIDE_FILTER_INITIAL_VALUES)}
            >
              Clear All Filters
            </StyledButton>
          </StyledFlex>
          <StyledFlex>
            <StyledFlex mb="16px">
              <CustomSelect
                name={PRODUCT_FILTERS.PURCHASE_DATE}
                menuPlacement="auto"
                placeholder="Select Purchase Date"
                onChange={handleDropdownFilterChange}
                value={values[PRODUCT_FILTERS.PURCHASE_DATE]}
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
                    value: [PRODUCT_FILTERS.PURCHASE_BEFORE, PRODUCT_FILTERS.PURCHASE_AFTER],
                    default: true,
                  },

                ]}
                showDateFilterType={false}
                {...SHARED_DROPDOWN_PROPS}
              />
              <CustomSelect
                name={PRODUCT_FILTERS.STATUS}
                options={PRODUCT_CUSTOMER_PROFILE_STATUS_MAP}
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

export default CustomerProfileFilters;
