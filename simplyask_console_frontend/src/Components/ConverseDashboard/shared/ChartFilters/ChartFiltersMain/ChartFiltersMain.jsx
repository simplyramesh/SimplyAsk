import { useTheme } from '@emotion/react';
import { InfoOutlined } from '@mui/icons-material';

import SettingsIcon from '../../../../../Assets/icons/processManagerSettingsIcon.svg?component';
import CustomCalendarIndicator from '../../../../Settings/AccessManagement/components/dropdowns/customComponents/calendarIndicator/CustomCalendarIndicator';
import FilterIcon from '../../../../shared/REDISIGNED/icons/svgIcons/FilterIcon';
import CustomIndicatorArrow from '../../../../shared/REDISIGNED/selectMenus/customComponents/indicators/CustomIndicatorArrow';
import CustomCalendarMenu from '../../../../shared/REDISIGNED/selectMenus/customComponents/menus/CustomCalendarMenu';
import DisabledOptions from '../../../../shared/REDISIGNED/selectMenus/customComponents/options/DisabledOptions';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledTooltip } from '../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex, StyledText, StyledIconButton } from '../../../../shared/styles/styled';
import { CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS } from '../../../utils/constants';
import { sharedDropdownProps } from '../ChartFilters';

const ChartFiltersMain = ({
  values,
  frequencyOptions,
  toggleSettingsExpand,
  handleOpenFilters,
  handleDropdownFilterChange,
  handleFrequencyChange,
  showFilterBtn,
  showSettingsBtn,
}) => {
  const { colors } = useTheme();

  return (
    <StyledFlex direction="row" gap="25px" justifyContent="space-between" flexWrap="wrap">
      <StyledFlex direction="row" gap="25px" flexWrap="wrap">
        <StyledFlex direction="row" gap="13px" alignItems="center" width="700px">
          <StyledText weight={600}>Timeframe</StyledText>
          <CustomSelect
            name={CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.TIME_FRAME}
            value={values[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.TIME_FRAME]}
            onChange={handleDropdownFilterChange}
            placeholder="Select Date range"
            components={{
              DropdownIndicator: CustomCalendarIndicator,
              Menu: CustomCalendarMenu,
            }}
            {...sharedDropdownProps}
            radioLabels={[
              {
                label: 'Time Frame',
                value: ['endTime', 'startTime'],
                default: true,
              },
            ]}
            showDateFilterType={false}
          />
        </StyledFlex>
        {frequencyOptions ? (
          <StyledFlex direction="row" gap="14px" alignItems="center" width="362px">
            <StyledText weight={600}>Frequency</StyledText>
            <StyledFlex direction="row" gap="0 9px" alignItems="center" flex="1 0 0">
              <CustomSelect
                name={CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.FREQUENCY}
                value={values[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.MAIN.FREQUENCY]}
                options={frequencyOptions}
                onChange={handleFrequencyChange}
                placeholder="Select Frequency"
                components={{
                  DropdownIndicator: CustomIndicatorArrow,
                  Option: DisabledOptions,
                }}
                isOptionDisabled={(option) => option.disabled}
                {...sharedDropdownProps}
              />
              <StyledTooltip
                arrow
                placement="top"
                title="The unit of time of the x-axis will change based on the selected “Frequency” option"
                p="10px 15px"
                maxWidth="325px"
              >
                <InfoOutlined fontSize="inherit" />
              </StyledTooltip>
            </StyledFlex>
          </StyledFlex>
        ) : null}
      </StyledFlex>

      <StyledFlex direction="row" gap="15px">
        {showFilterBtn && (
          <StyledTooltip arrow placement="top" title="View All Filters" p="10px 15px">
            <StyledIconButton
              onClick={handleOpenFilters}
              iconSize="18px"
              size="34px"
              bgColor={colors.tableEditableCellBg}
              hoverBgColor={colors.darkGrayHoverFilterIcon}
            >
              <FilterIcon sx={{ width: '18px', height: '18px' }} />
            </StyledIconButton>
          </StyledTooltip>
        )}

        {showSettingsBtn && (
          <StyledTooltip arrow placement="top" title="Graph Settings" p="10px 15px">
            <StyledIconButton
              iconSize="25px"
              size="34px"
              bgColor={colors.tableEditableCellBg}
              hoverBgColor={colors.darkGrayHoverFilterIcon}
              onClick={toggleSettingsExpand}
            >
              <SettingsIcon />
            </StyledIconButton>
          </StyledTooltip>
        )}
      </StyledFlex>
    </StyledFlex>
  );
};

export default ChartFiltersMain;
