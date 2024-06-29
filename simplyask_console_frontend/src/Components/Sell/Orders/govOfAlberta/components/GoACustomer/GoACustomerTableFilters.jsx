import { useFormik } from 'formik';
import { Portal } from 'react-portal';

import LoadingMessage from '../../../../../shared/REDISIGNED/controls/AddressAutocomplete/LoadingMessage';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomIndicatorArrow from '../../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import NoOptionsMessage from '../../../../../shared/REDISIGNED/selectMenus/customComponents/options/NoOptionsMessage';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { PRODUCT_FILTERS } from '../../../../constants/productInitialValues';
import { GOA_CUSTOMER_SIDE_FILTER_INITIAL_VALUES } from '../../../../Customer/utils/helpers';
import useGetProductCustomer from '../../../../hooks/useGetProductCustomer';
import useGetProductOrganization from '../../../../hooks/useGetProductOrganization';

const GoACustomerTableFilters = ({
  sidebarActionsRef,
  initialValues = GOA_CUSTOMER_SIDE_FILTER_INITIAL_VALUES,
  onApplyFilters,
  isOpen,
}) => {
  const {
    values, setFieldValue, submitForm, setValues,
  } = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (val, meta) => {
      onApplyFilters?.(val);
      meta.resetForm();
    },
  });

  const { customers } = useGetProductCustomer({
    options: {
      enabled: isOpen,
    },
  });

  const { organizations } = useGetProductOrganization({
    options: {
      enabled: isOpen,
      select: (data) => ({
        org: data,
        departments: data?.reduce((acc, curr) => [...acc, ...(curr?.departments || [])], []),
      }),
    },
  });

  return (
    <StyledFlex flex="1 1 auto" p="0 24px">
      <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
        <StyledText size={18} weight={500}>Filter By</StyledText>
        <StyledButton
          variant="text"
          onClick={() => setValues(GOA_CUSTOMER_SIDE_FILTER_INITIAL_VALUES)}
        >
          Clear All Filters
        </StyledButton>
      </StyledFlex>
      <StyledFlex gap={2}>
        <CustomSelect
          options={customers}
          placeholder="Search Customer ID"
          value={values[PRODUCT_FILTERS.CUSTOMER_ID]}
          closeMenuOnSelect
          closeMenuOnScroll
          getOptionLabel={(option) => `${option[PRODUCT_FILTERS.ID]} - ${option?.[PRODUCT_FILTERS.FIRST_NAME] || ''} ${option?.[PRODUCT_FILTERS.LAST_NAME] || ''}`}
          getOptionValue={(option) => option[PRODUCT_FILTERS.ID]}
          onChange={(val) => setFieldValue(PRODUCT_FILTERS.CUSTOMER_ID, val)}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            NoOptionsMessage,
            LoadingMessage,
          }}
          maxHeight={30}
          menuPadding={0}
          menuPlacement="auto"
          withSeparator
        />
        <CustomSelect
          options={customers}
          placeholder="Search Email"
          value={values[PRODUCT_FILTERS.EMAIL]}
          closeMenuOnSelect
          closeMenuOnScroll
          getOptionLabel={(option) => option[PRODUCT_FILTERS.EMAIL]}
          getOptionValue={(option) => option[PRODUCT_FILTERS.ID]}
          onChange={(val) => setFieldValue(PRODUCT_FILTERS.EMAIL, val)}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            NoOptionsMessage,
            LoadingMessage,
          }}
          maxHeight={30}
          menuPadding={0}
          menuPlacement="auto"
          withSeparator
        />
        <CustomSelect
          options={customers}
          placeholder="Search Phone Number"
          value={values[PRODUCT_FILTERS.PHONE_NUMBER]}
          closeMenuOnSelect
          closeMenuOnScroll
          onChange={(val) => setFieldValue(PRODUCT_FILTERS.PHONE_NUMBER, val)}
          getOptionLabel={(option) => option[PRODUCT_FILTERS.PHONE_NUMBER]}
          getOptionValue={(option) => option[PRODUCT_FILTERS.ID]}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            NoOptionsMessage,
            LoadingMessage,
          }}
          maxHeight={30}
          menuPadding={0}
          menuPlacement="auto"
          withSeparator
        />
        <CustomSelect
          options={organizations?.org}
          placeholder="Search Organization"
          value={values[PRODUCT_FILTERS.ORGANIZATION]}
          closeMenuOnSelect
          closeMenuOnScroll
          onChange={(val) => setFieldValue(PRODUCT_FILTERS.ORGANIZATION, val)}
          getOptionLabel={(option) => option[PRODUCT_FILTERS.NAME]}
          getOptionValue={(option) => option[PRODUCT_FILTERS.EXTERNAL_ID]}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            NoOptionsMessage,
            LoadingMessage,
          }}
          maxHeight={30}
          menuPadding={0}
          menuPlacement="auto"
          withSeparator
        />
        <CustomSelect
          options={organizations?.departments}
          placeholder="Search Department"
          value={values[PRODUCT_FILTERS.DEPARTMENT]}
          closeMenuOnSelect
          closeMenuOnScroll
          onChange={(val) => setFieldValue(PRODUCT_FILTERS.DEPARTMENT, val)}
          getOptionLabel={(option) => option[PRODUCT_FILTERS.NAME]}
          getOptionValue={(option) => option[PRODUCT_FILTERS.EXTERNAL_ID]}
          components={{
            DropdownIndicator: CustomIndicatorArrow,
            NoOptionsMessage,
            LoadingMessage,
          }}
          maxHeight={30}
          menuPadding={0}
          menuPlacement="auto"
          withSeparator
        />
      </StyledFlex>
      <Portal node={sidebarActionsRef?.current}>
        <StyledButton
          primary
          variant="contained"
          onClick={submitForm}
        >
          Confirm
        </StyledButton>
      </Portal>
    </StyledFlex>
  );
};

export default GoACustomerTableFilters;
