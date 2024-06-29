import { useFormik } from 'formik';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { Portal } from 'react-portal';

import { getProductOrderCustomers } from '../../../../Services/axios/productOrder';
import { StyledButton } from '../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomIndicatorArrow from '../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomSelect from '../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledFlex, StyledText } from '../../../shared/styles/styled';
import { PRODUCT_FILTERS } from '../../constants/productInitialValues';
import LoadingMessage from '../../shared/LoadingMessage';
import NoOptionsMessage from '../../shared/NoOptionsMessage';
import { CUSTOMER_FILTERS, CUSTOMER_SIDE_FILTER_INITIAL_VALUES } from '../utils/helpers';

const CustomerFilters = ({
  sidebarActionsRef, initialValues = CUSTOMER_SIDE_FILTER_INITIAL_VALUES, onApplyFilters,
}) => {
  const {
    values, setFieldValue, submitForm, setValues,
  } = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (val, meta) => {
      onApplyFilters(val);
      meta.resetForm();
    },
  });

  const customerItemsLoadFn = debounce((inputValue, setOptions, key) => {
    getProductOrderCustomers({ [key]: inputValue }).then((resp) => setOptions(resp));
  }, 300);

  return (
    <StyledFlex flex="1 1 auto" p="0 24px">
      <StyledFlex direction="row" alignItems="center" justifyContent="space-between" mb="18px" w="100%">
        <StyledText size={18} weight={500}>Filter By</StyledText>
        <StyledButton
          variant="text"
          onClick={() => setValues(CUSTOMER_SIDE_FILTER_INITIAL_VALUES)}
        >
          Clear All Filters
        </StyledButton>
      </StyledFlex>
      <StyledFlex gap={2}>
        <CustomSelect
          defaultOptions={[]}
          isAsync
          loadOptions={(v, setOptions) => customerItemsLoadFn(v, setOptions, PRODUCT_FILTERS.ID)}
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
          defaultOptions={[]}
          isAsync
          loadOptions={(v, setOptions) => customerItemsLoadFn(v, setOptions, CUSTOMER_FILTERS.BAN)}
          placeholder="Search Billing Account Number (BAN)"
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
        />
        <CustomSelect
          defaultOptions={[]}
          isAsync
          loadOptions={(v, setOptions) => customerItemsLoadFn(v, setOptions, PRODUCT_FILTERS.EMAIL)}
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
          defaultOptions={[]}
          isAsync
          loadOptions={(v, setOptions) => customerItemsLoadFn(v, setOptions, PRODUCT_FILTERS.PHONE_NUMBER)}
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

export default CustomerFilters;

CustomerFilters.propTypes = {
  sidebarActionsRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  initialValues: PropTypes.shape({
    customerId: PropTypes.string,
  }),
  onApplyFilters: PropTypes.func,
};
