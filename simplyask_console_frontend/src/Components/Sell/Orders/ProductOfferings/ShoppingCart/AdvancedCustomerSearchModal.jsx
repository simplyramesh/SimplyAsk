import { useFormik } from 'formik';
import PropTypes from 'prop-types';

import BaseTextInput from '../../../../shared/REDISIGNED/controls/BaseTextInput/BaseTextInput';
import { StyledButton } from '../../../../shared/REDISIGNED/controls/Button/StyledButton';
import SearchIcon from '../../../../shared/REDISIGNED/icons/svgIcons/SearchIcon';
import CenterModalFixed from '../../../../shared/REDISIGNED/modals/CenterModalFixed/CenterModalFixed';
import { StyledFlex, StyledText } from '../../../../shared/styles/styled';

const AdvancedCustomerSearchModal = ({
  onClose,
  open,
  onSubmit,
}) => {
  const {
    values, setFieldValue, handleSubmit,
  } = useFormik({
    initialValues: {
      name: '',
      email: '',
      phoneNumber: '',
      postalCode: '',
      customerId: '',
      ban: '',
    },
    onSubmit,
  });

  return (
    <CenterModalFixed
      open={open}
      onClose={onClose}
      width="750px"
      enableScrollbar={false}
      title="Advanced Search"
      actions={(
        <StyledFlex direction="row" justifyContent="flex-end" width="100%">
          <StyledButton
            variant="contained"
            primary
            startIcon={<SearchIcon />}
            onClick={handleSubmit}
            minWidth="125px"
          >
            Search
          </StyledButton>
        </StyledFlex>
      )}
    >
      <StyledFlex flex="auto" p="25px">
        <StyledFlex direction="column" flex="auto" width="100%" mb="24px">
          <StyledText size={14} weight={500}>Use the Advanced Search below to search multiple values at once.</StyledText>
          <StyledText size={14} weight={500} mt={15}>
            When searching multiple values, it will show results that contain all the exact values entered. For example, if you enter "John"
            for the Customer Name, and "12" for the Customer ID, it will display all customers that have both "John" in their Customer Name and "12" in their Customer ID.
          </StyledText>
        </StyledFlex>

        <StyledFlex mb={2}>
          <StyledText weight={500}>Name</StyledText>
          <BaseTextInput
            name="Name"
            type="text"
            value={values.name}
            onChange={(e) => setFieldValue('name', e.target.value)}
          />
        </StyledFlex>

        <StyledFlex mb={2}>
          <StyledText weight={500}>Email</StyledText>
          <BaseTextInput
            name="Email"
            type="text"
            value={values.email}
            onChange={(e) => setFieldValue('email', e.target.value)}
          />
        </StyledFlex>

        <StyledFlex mb={2}>
          <StyledText weight={500}>Phone Number</StyledText>
          <BaseTextInput
            name="Phone Number"
            type="text"
            value={values.phoneNumber}
            onChange={(e) => setFieldValue('phoneNumber', e.target.value)}
          />
        </StyledFlex>

        <StyledFlex mb={2}>
          <StyledText weight={500}>Postal/Zip Code</StyledText>
          <BaseTextInput
            name="Postal/Zip Code"
            type="text"
            value={values.postalCode}
            onChange={(e) => setFieldValue('postalCode', e.target.value)}
          />
        </StyledFlex>

        <StyledFlex mb={2}>
          <StyledText weight={500}>Customer ID</StyledText>
          <BaseTextInput
            name="Customer ID"
            type="text"
            value={values.customerId}
            onChange={(e) => setFieldValue('customerId', e.target.value)}
          />
        </StyledFlex>
        <StyledFlex mb={2}>
          <StyledText weight={500}>BAN</StyledText>
          <BaseTextInput
            name="Billing Account Number (BAN)"
            type="text"
            value={values.ban}
            onChange={(e) => setFieldValue('ban', e.target.value)}
          />
        </StyledFlex>
      </StyledFlex>
    </CenterModalFixed>
  );
};

export default AdvancedCustomerSearchModal;

AdvancedCustomerSearchModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};
