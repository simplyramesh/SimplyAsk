import { useTheme } from '@mui/material/styles';
import { useQuery } from '@tanstack/react-query';

import { useUser } from '../../../../contexts/UserContext';
import { getBillingInfo, getBillingPlan } from '../../../../Services/axios/billing';
import { convertIsoWithOffsetToIso, getDaysLeft } from '../../../../utils/timeUtil';
import ContentLayout from '../../../shared/REDISIGNED/layouts/ContentLayout/ContentLayout';
import PageLayout from '../../../shared/REDISIGNED/layouts/PageLayout/PageLayout';
import Spinner from '../../../shared/Spinner/Spinner';
import { StyledFlex, StyledText } from '../../../shared/styles/styled';
import { billingUsageItemPrice, usageLimitKeyMapping } from './constants/usageEnums';
import { StyledUsageSubHeader } from './StyledUsage';
import UsageBarChartCard from './UsageChartCard/UsageBarChartCard';
import UsageSection from './UsageSection/UsageSection';
import { getYDomainMax } from './utils/helpers';

// The Billing Cycle text needs to be toggled on/off based on the user or organization
const toggleBillingCycleText = true;

const getFormattedDate = (isoDate, timezone, format = 'MMM do, yyyy') => {
  return convertIsoWithOffsetToIso(isoDate?.split('[')[0], timezone, format);
};

const Usage = () => {
  const { colors } = useTheme();
  // const {
  //   user: { timezone },
  // } = useUser();
  //
  // const { data: billingEstimate, isFetching: isFetchingBillingEstimate } = useQuery({
  //   queryKey: ['billingEstimate'],
  //   queryFn: getBillingInfo,
  // });

  const { data: billingPlan, isFetching: isFetchingBillingPlan } = useQuery({
    queryKey: ['billingPlan'],
    queryFn: getBillingPlan,
    select: (data) => {
      const limits = { ...data?.planFeatureLimits, ...data?.planLicenseTransactionLimits };

      const matchLimits = Object.entries(usageLimitKeyMapping).reduce((acc, [key, value]) => {
        if (typeof value === 'string') {
          acc[key] = limits?.[`max${value}`] ?? limits?.[`included${value}`] ?? null;
        }

        if (typeof value === 'object') {
          acc[key] = {
            iva: limits?.[`max${value.iva}`] ?? limits?.[`included${value.iva}`] ?? null,
            transferred: limits?.[`max${value.transferred}`] ?? limits?.[`included${value.transferred}`] ?? null,
          };
        }

        return acc;
      }, {});

      return {
        data,
        name: data?.planName || null,
        limits: matchLimits,
      };
    },
  });

  // const billingEndDate = getFormattedDate(billingEstimate?.billingPeriodEnd, timezone, "yyyy-MM-dd'T'HH:mm:ss.SS'Z'");
  // const daysLeft = getDaysLeft({ endDate: billingEstimate?.billingPeriodEnd?.split('[')[0] }, timezone);
  // const billingPeriodStartEndDates = `${getFormattedDate(billingEstimate?.billingPeriodStart, timezone)} - ${getFormattedDate(billingEstimate?.billingPeriodEnd, timezone)}`;

  const limitLineProps = (chartEnum, fill, textIndex) => ({
    color: fill ?? '',
    tierLimit: billingPlan?.limits[chartEnum] ?? null,
    text: ['Included in Free Tier', 'Plan Limit'][textIndex ?? 0],
  });

  const barProps = ({ color, hoverColor }, stackedId, stackedColor) => ({
    dataKey: 'totalUsage',
    color: color ?? '',
    hoverColor: hoverColor ?? '',
    stackId: stackedId ?? '',
    stackedBarProps: {
      dataKey: 'totalUsage',
      color: stackedColor ?? '',
      stackId: stackedId ?? '',
    },
  });

  const legendProps = {
    text: 'Month',
  };

  const chartProps = (chartEnum) => {
    const chartLimit = billingPlan?.limits[chartEnum];

    return {
      xAxisProps: {
        dataKey: 'date',
      },
      yAxisProps: {
        type: 'number',
        domain: ['auto', (dataMax) => getYDomainMax(dataMax, chartLimit)],
      },
    };
  };

  const transactionsColors = {
    color: colors.secondary,
    hoverColor: colors.rajah,
  };

  const addOnsColors = {
    color: colors.darkSky,
    hoverColor: colors.portage,
  };

  const limitLine = {
    color: colors.primary,
    textIndex: 0,
  };

  const renderUsageBarChartCard = (chartEnum, barColors, limitLine) => (
    <UsageBarChartCard
      chartEnum={chartEnum}
      barProps={barProps(barColors)}
      limitLineProps={
        billingPlan?.id?.includes('Explore') || chartEnum === billingUsageItemPrice.ACTIVE_USER_COUNT
          ? limitLineProps(chartEnum, limitLine.color, limitLine.textIndex)
          : null
      }
      legendProps={legendProps}
      chartProps={chartProps(chartEnum)}
      // billingEndDate={billingEndDate}
    />
  );

  /* const renderUsageSubHeader = () => (
    <StyledUsageSubHeader>
      <StyledFlex direction="row" gap="0 4px">
        <StyledText as="span" weight={600} lh={20}>{`${billingPlan?.name}`}</StyledText>
        {toggleBillingCycleText ? (
          <>
            <StyledFlex direction="row" mx="4px">
              <StyledText as="span" weight={500} lh={20}>
                |
              </StyledText>
            </StyledFlex>
            <StyledText as="span" weight={600} lh={20}>
              {'Current Billing Cycle: '}
            </StyledText>
            <StyledText as="span" lh={20}>
              {billingPeriodStartEndDates}
            </StyledText>
            <StyledText as="span" lh={20} color={colors.secondary}>{`(${daysLeft} days left)`}</StyledText>
          </>
        ) : null}
      </StyledFlex>
    </StyledUsageSubHeader>
  ); */

  return (
    <>
      {isFetchingBillingPlan ? (
        <Spinner global />
      ) : (
        <PageLayout /* top={renderUsageSubHeader()} */>
          <ContentLayout>
            <UsageSection title="Transactions">
              {renderUsageBarChartCard(billingUsageItemPrice.EXECUTED_WORKFLOW_STEPS, transactionsColors, limitLine)}
              {renderUsageBarChartCard(billingUsageItemPrice.SENT_OUTBOUND_EMAILS, transactionsColors, limitLine)}
              {renderUsageBarChartCard(billingUsageItemPrice.SENT_OUTBOUND_SMS, transactionsColors, limitLine)}
            </UsageSection>

            <UsageSection title="Add-Ons">
              {renderUsageBarChartCard(billingUsageItemPrice.ACTIVE_PHONE_NUMBERS, addOnsColors, limitLine)}
              {/* {renderUsageBarChartCard(billingUsageItemPrice.SHARED_FILE_STORAGE, addOnsColors, limitLine)} */}
              {/* {renderUsageBarChartCard(billingUsageItemPrice.ACTIVE_USER_COUNT, addOnsColors, { */}
              {/*   color: colors.secondary, */}
              {/*   textIndex: 1, */}
              {/* })} */}
            </UsageSection>
          </ContentLayout>
        </PageLayout>
      )}
    </>
  );
};

export default Usage;
