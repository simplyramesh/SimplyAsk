import { FormControlLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useFormik } from 'formik';
import { useMemo, useState } from 'react';
import { Portal } from 'react-portal';

import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomSidebar from '../../../../../shared/REDISIGNED/sidebars/CustomSidebar/CustomSidebar';
import {
  StyledCheckbox, StyledDivider, StyledFlex, StyledText,
} from '../../../../../shared/styles/styled';
import { PRODUCT_CATEGORY_FILTER_HEADINGS } from '../../../../constants/constants';

import ProductOfferingPlanFilterItem from './ProductOfferingPlanFilterItem';

const createInnerObject = (contentArray) => contentArray.reduce((contentAcc, content) => ({
  ...contentAcc,
  [content]: false,
}), {});

const ProductOfferingsPlanFilter = ({ filterOptions, onClose, onConfirm }) => {
  const { colors } = useTheme();

  const [filterAccordionExpanded, setFilterAccordionExpanded] = useState(PRODUCT_CATEGORY_FILTER_HEADINGS.NAME);

  const initialValues = useMemo(() => (filterOptions
    ? filterOptions.reduce((acc, opt) => ({
      ...acc,
      [opt.heading]: createInnerObject(opt.content),
    }), {})
    : {}), [filterOptions]);

  const {
    values,
    setFieldValue,
    handleSubmit,
    handleReset,
  } = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: (val, { resetForm }) => {
      onConfirm(val);
      resetForm();
      onClose();
    },
  });

  const renderFilters = (filterValues, updateFieldValue) => Object.keys(filterValues).map((opt) => (
    <ProductOfferingPlanFilterItem
      key={opt}
      heading={opt}
      expanded={filterAccordionExpanded === opt}
      onExpand={(e, isExpanded) => setFilterAccordionExpanded(isExpanded ? opt : false)}
    >
      <StyledFlex>
        {Object.entries(filterValues[opt]).map(([key, value]) => (
          <FormControlLabel
            key={key}
            control={<StyledCheckbox checked={value} />}
            label={<StyledText size={15} lh={21} cursor="inherit">{key}</StyledText>}
            value={value}
            onChange={() => updateFieldValue(`${opt}.${key}`, !value)}
          />
        ))}
        <StyledDivider color={colors.geyser} borderWidth={1.5} m="16px 0 16px 0" />
      </StyledFlex>
    </ProductOfferingPlanFilterItem>
  ));

  return (
    <CustomSidebar
      open={!!filterOptions}
      onClose={onClose}
      headStyleType="filter"
    >
      {({ customActionsRef }) => (
        <>
          <StyledFlex flex="1 1 auto" p="0 20px 20px 0px">
            <StyledFlex direction="row" alignItems="center" pl="20px" justifyContent="space-between" mb="18px" w="100%">
              <StyledText size={18} weight={500}>Filter By</StyledText>
              <StyledButton
                variant="text"
                onClick={handleReset}
              >
                Clear All Filters
              </StyledButton>
            </StyledFlex>
            {renderFilters(values, setFieldValue)}
          </StyledFlex>
          <Portal node={customActionsRef?.current}>
            <StyledButton
              width="125px"
              onClick={handleSubmit}
              variant="contained"
              primary
            >
              Confirm
            </StyledButton>
          </Portal>
        </>
      )}
    </CustomSidebar>
  );
};

export default ProductOfferingsPlanFilter;
