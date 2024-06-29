import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';

import Spinner from '../../../../shared/Spinner/Spinner';
import { StyledCard, StyledFlex, StyledText } from '../../../../shared/styles/styled';
import { billingUsageItemPrice } from '../constants/usageEnums';
import { StyledUsageIcon } from '../StyledUsage';

const UsageChartCard = ({ title, Icon = 'div', chartEnum, maxUsers, isFetching, children }) => {
  const { colors } = useTheme();

  const sharedTextProps = {
    as: 'span',
    size: 16,
    lh: 21,
    display: 'inline',
  };

  const renderChartCardTitle = (isGettingData, altCondition) => (
    <>
      {!isGettingData ? (
        <StyledFlex
          direction="row"
          alignItems="center"
          gap="0 10px"
          pl="7px"
          mb={altCondition ? '0' : '8px'}
          fontSize="54px"
        >
          <StyledUsageIcon as="span">
            <Icon />
          </StyledUsageIcon>
          <StyledText size={19} weight={600} lh={25} cursor="default" capitalize>
            {title}
          </StyledText>
        </StyledFlex>
      ) : null}
    </>
  );

  const renderUserPlanMaxText = (isGettingData, altCondition) => (
    <>
      {!isGettingData && altCondition ? (
        <StyledFlex as="p" direction="row" pl="14px" flexWrap="wrap" mt="-10px" mb="15px" width="100%">
          <StyledFlex as="span" width="100%" display="inline" cursor="default">
            <StyledText {...sharedTextProps}>Your plan limits you to</StyledText>
            <StyledText {...sharedTextProps} weight={500}>{` ${maxUsers} `}</StyledText>
            <StyledText {...sharedTextProps}>users max. To increase your user limit,</StyledText>
            <StyledText
              {...sharedTextProps}
              weight={700}
              color={colors.linkColor}
              cursor="pointer"
              onClick={() => window.open('https://symphona.ai/company/#contact', '_blank')}
            >
              {' contact customer support.'}
            </StyledText>
          </StyledFlex>
        </StyledFlex>
      ) : null}
    </>
  );

  return (
    <StyledFlex minWidth="558px">
      <StyledCard>
        <StyledFlex height="467px">
          {renderChartCardTitle(isFetching, chartEnum === billingUsageItemPrice.ACTIVE_USER_COUNT)}
          {renderUserPlanMaxText(isFetching, chartEnum === billingUsageItemPrice.ACTIVE_USER_COUNT)}
          <StyledFlex height="435px" alignItems="center" justifyContent="center" pr="4px" ml="-14px" mb="-8px">
            {!isFetching ? children : <Spinner inline />}
          </StyledFlex>
        </StyledFlex>
      </StyledCard>
    </StyledFlex>
  );
};

export default UsageChartCard;

UsageChartCard.propTypes = {
  title: PropTypes.string,
  Icon: PropTypes.elementType,
  chartEnum: PropTypes.string,
  maxUsers: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isFetching: PropTypes.bool,
  children: PropTypes.node,
};
