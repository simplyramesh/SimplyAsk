import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';

import { getHistoricalDataUsage } from '../../../../../Services/axios/billing';
import { getSubtractedMonthsInUtc } from '../../../../../utils/timeUtil';
import EmailGradientIcon from '../../../../shared/REDISIGNED/icons/svgIcons/EmailGradientIcon';
import ExecutedWorkflowGradientIcon from '../../../../shared/REDISIGNED/icons/svgIcons/ExecutedWorkflowGradientIcon';
import PhoneGradientIcon from '../../../../shared/REDISIGNED/icons/svgIcons/PhoneGradientIcon';
import SmsGradientIcon from '../../../../shared/REDISIGNED/icons/svgIcons/SmsGradientIcon';
import StorageGradientIcon from '../../../../shared/REDISIGNED/icons/svgIcons/StorageGradientIcon';
import UserGradientIcon from '../../../../shared/REDISIGNED/icons/svgIcons/UserGradientIcon';
import { billingUsageItemPrice } from '../constants/usageEnums';
import UsageBarChart from '../UsageBarChart/UsageBarChart';
import UsageChartCard from './UsageChartCard';

const icons = {
  [billingUsageItemPrice.EXECUTED_WORKFLOW_STEPS]: ExecutedWorkflowGradientIcon,
  [billingUsageItemPrice.SENT_OUTBOUND_EMAILS]: EmailGradientIcon,
  [billingUsageItemPrice.SENT_OUTBOUND_SMS]: SmsGradientIcon,
  [billingUsageItemPrice.ACTIVE_PHONE_NUMBERS]: PhoneGradientIcon,
  [billingUsageItemPrice.SHARED_FILE_STORAGE]: StorageGradientIcon,
  [billingUsageItemPrice.ACTIVE_USER_COUNT]: UserGradientIcon,
};

const UsageBarChartCard = ({
  chartEnum,
  billingEndDate = new Date().toISOString(),
  limitLineProps,
  barProps,
  legendProps,
  chartProps,
}) => {
  const { startDate, endDate } = getSubtractedMonthsInUtc({ endDate: billingEndDate, monthsToSubtract: 2 });

  const usageParams = {
    billUsageItemPrice: chartEnum,
    startDate,
    endDate,
  };

  const { data: accountUsage, isFetching } = useQuery({
    queryKey: ['getHistoricalDataUsage', usageParams],
    queryFn: () => getHistoricalDataUsage(usageParams),
    enabled: !!chartEnum,
    placeholderData: [],
    select: (data) => data || [],
  });

  const yAxisLabel = (usageUnits) => {
    switch (usageUnits) {
      case 'Numbers':
        return 'Numbers used';
      case 'GB':
        return 'Gigabytes (GB) Used';
      default:
        return `Number of ${usageUnits ?? 'units'}`;
    }
  };

  const Icon = icons[chartEnum] ?? 'div';

  return (
    <>
      <UsageChartCard
        Icon={Icon}
        chartEnum={chartEnum}
        title={accountUsage?.[0]?.itemName ?? chartEnum.replace(/_/g, ' ').toLowerCase()}
        maxUsers={chartEnum === billingUsageItemPrice.ACTIVE_USER_COUNT ? limitLineProps?.tierLimit : null}
        isFetching={isFetching}
      >
        <UsageBarChart
          data={accountUsage}
          limitLineProps={limitLineProps}
          barProps={barProps}
          legendProps={legendProps}
          chartProps={{
            ...chartProps,
            responsiveContainerProps: {
              // alternatively, add same condition to BarChart margin.bottom (without 434)
              height: chartEnum === billingUsageItemPrice.ACTIVE_USER_COUNT ? 434 - 32 - 38 : 434 - 32,
            },
            yAxisProps: {
              ...chartProps.yAxisProps,
              label: `${yAxisLabel(accountUsage?.[0]?.totalUsageUnits)}`,
            },
          }}
        />
      </UsageChartCard>
    </>
  );
};

export default UsageBarChartCard;

UsageBarChartCard.propTypes = {
  chartEnum: PropTypes.string,
  billingEndDate: PropTypes.string,
  limitLineProps: PropTypes.object,
  barProps: PropTypes.object,
  legendProps: PropTypes.object,
  chartProps: PropTypes.object,
};
