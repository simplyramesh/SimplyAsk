import { useTheme } from '@emotion/react';
import React, { useState } from 'react';

import { StyledCheckoutAccordion } from '../Sell/Orders/ProductOfferings/ProductOfferingsCheckout/StyledProductOfferingsCheckout';
import { StyledDivider, StyledFlex, StyledText } from '../shared/styles/styled';

import TimeSelectionLine from './TimeSelectionLine';
import { TIME_RANGE_TYPES } from './utils/constants';
import {
  TIME_RANGE_PAST_DAYS_OPTIONS, TIME_RANGE_PRESENT_DAYS_OPTIONS, getFormikFiltersInitialValues, getShowFiltersType,
} from './utils/initialValuesHelpers';

const Overview = ({
  label,
  ConversationSection,
  timeRangeTab,
  filters,
  setFilters,
  filterTypes,
}) => {
  const { colors } = useTheme();

  const [timeSelection, setTimeSelection] = useState(timeRangeTab?.value || TIME_RANGE_TYPES.TODAY);

  return (
    <StyledCheckoutAccordion expanded>
      <StyledFlex minHeight="518px" gap="30px 0" px="23px">
        <StyledFlex gap="38px 0">
          <StyledFlex direction="row" gap="10px" alignItems="center" flex="1 1 auto">
            <StyledText size={19} weight={700} lh={23} color={colors.primary}>{label}</StyledText>
          </StyledFlex>
          <StyledFlex>
            <TimeSelectionLine
              currentSelection={timeSelection}
              handleChange={(timeRangeValue) => {
                const timeRange = TIME_RANGE_PAST_DAYS_OPTIONS?.find((range) => range.value === timeRangeValue);

                const newShowFiltersType = getShowFiltersType(filterTypes);
                const newFilterValue = getFormikFiltersInitialValues(newShowFiltersType, filters, timeRange);

                setTimeSelection(timeRangeValue);

                if (timeRangeValue === TIME_RANGE_TYPES.CUSTOM) {
                  setFilters((prev) => ({ ...prev, timeRange }));
                  return;
                }

                setFilters(({ ...newFilterValue, timeRange }));
              }}
              options={TIME_RANGE_PAST_DAYS_OPTIONS}
            />
            <StyledDivider borderWidth={2} color={colors.cardGridItemBorder} flexItem />
          </StyledFlex>
        </StyledFlex>
        <StyledFlex>
          <ConversationSection
            filters={filters}
            setFilters={setFilters}
            filterTypes={filterTypes}
            timeSelection={timeSelection}
            onTimeframeChange={(val, { name }) => {
              const customTimeRange = TIME_RANGE_PRESENT_DAYS_OPTIONS?.find((range) => range.value === TIME_RANGE_TYPES.CUSTOM);
              setFilters((prev) => ({ ...prev, [name]: val, timeRange: customTimeRange }));
              setTimeSelection(customTimeRange?.value);
            }}
          />
        </StyledFlex>
      </StyledFlex>
    </StyledCheckoutAccordion>
  );
};

export default React.memo(Overview);
