import { useTheme } from '@emotion/react';

import CustomDropdownIndicator from '../../../../shared/ManagerComponents/Modals/TestManagerModals/ExecuteTestSuiteModal/CustomDropdownIndicator';
import InputLabel from '../../../../shared/REDISIGNED/controls/InputLabel/InputLabel';
import CustomSelect from '../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import {
  StyledSwitch,
  StyledFlex, StyledDivider,
} from '../../../../shared/styles/styled';
import { StyledStaticDynamicButton } from '../../../../WorkflowEditor/components/sideMenu/Settings/StyledSettings';
import {
  BAR_OR_LINE_GRAPH_TYPES, CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS, NUMBER_OR_PERCENTAGE_GRAPH_TYPES,
} from '../../../utils/constants';
import { ALL_CHANNELS_OPTIONS } from '../../../utils/initialValuesHelpers';
import { sharedDropdownProps } from '../ChartFilters';

const ChartFiltersSettings = ({
  showFiltersType,
  values,
  setFieldValue,
}) => {
  const { colors } = useTheme();

  const isBarGraphActive = values[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.BAR_OR_LINE_GRAPH] === BAR_OR_LINE_GRAPH_TYPES.BAR_GRAPH;
  const isNumberGraphActive = values[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.NUMBER_OR_PERCENTAGE_GRAPH] === NUMBER_OR_PERCENTAGE_GRAPH_TYPES.NUMBER;

  const handleBarLineGraphChange = (e) => {
    if (e.target.id === BAR_OR_LINE_GRAPH_TYPES.BAR_GRAPH && !isBarGraphActive) {
      setFieldValue(CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.BAR_OR_LINE_GRAPH, BAR_OR_LINE_GRAPH_TYPES.BAR_GRAPH);
    }
    if (e.target.id === BAR_OR_LINE_GRAPH_TYPES.LINE_GRAPH && isBarGraphActive) {
      setFieldValue(CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.BAR_OR_LINE_GRAPH, BAR_OR_LINE_GRAPH_TYPES.LINE_GRAPH);
    }
  };

  const handleNumPercentGraphChange = (e) => {
    if (e.target.id === NUMBER_OR_PERCENTAGE_GRAPH_TYPES.NUMBER && !isNumberGraphActive) {
      setFieldValue(CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.NUMBER_OR_PERCENTAGE_GRAPH, NUMBER_OR_PERCENTAGE_GRAPH_TYPES.NUMBER);
    }
    if (e.target.id === NUMBER_OR_PERCENTAGE_GRAPH_TYPES.PERCENTAGE && isNumberGraphActive) {
      setFieldValue(CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.NUMBER_OR_PERCENTAGE_GRAPH, NUMBER_OR_PERCENTAGE_GRAPH_TYPES.PERCENTAGE);
    }
  };

  const handleGroupChannelFilterChange = (val, action) => {
    setFieldValue(action.name, val);
  };

  const renderDivider = () => <StyledDivider orientation="vertical" variant="middle" m="0 15px" borderWidth={3} flexItem height="38px" />;

  const renderSwitch = (label, key) => (
    <StyledFlex direction="row">
      {renderDivider()}

      <StyledFlex direction="row" alignItems="center" gap="15px">
        <StyledSwitch
          name={key}
          checked={values[key]}
          onChange={(e) => {
            setFieldValue(key, (e.target.checked));
          }}
          withCheck
        />
        <InputLabel label={label} size={15} mb={0} />

      </StyledFlex>
    </StyledFlex>
  );

  return (
    <StyledFlex
      backgroundColor={colors.background}
      width="100%"
      padding="17px 26px"
      direction="row"
      alignItems="center"
      gap="20px 0"
      flexWrap="wrap"
    >
      {showFiltersType?.settings?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.NUMBER_OR_PERCENTAGE_GRAPH] && (
        <StyledFlex direction="row" alignItems="center">
          <StyledFlex direction="row" height="35px">
            <StyledStaticDynamicButton
              id={NUMBER_OR_PERCENTAGE_GRAPH_TYPES.NUMBER}
              name={NUMBER_OR_PERCENTAGE_GRAPH_TYPES.NUMBER}
              variant="outlined"
              primary={!isNumberGraphActive}
              secondary={isNumberGraphActive}
              onClick={handleNumPercentGraphChange}
              isLeft
            >
              Number
            </StyledStaticDynamicButton>
            <StyledStaticDynamicButton
              id={NUMBER_OR_PERCENTAGE_GRAPH_TYPES.PERCENTAGE}
              name={NUMBER_OR_PERCENTAGE_GRAPH_TYPES.PERCENTAGE}
              variant="outlined"
              primary={isNumberGraphActive}
              secondary={!isNumberGraphActive}
              onClick={handleNumPercentGraphChange}
              isRight
            >
              Percentage
            </StyledStaticDynamicButton>
          </StyledFlex>

          {renderDivider()}
        </StyledFlex>
      )}

      {showFiltersType?.settings?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.BAR_OR_LINE_GRAPH] && (
        <StyledFlex direction="row" height="35px" alignItems="center">
          <StyledStaticDynamicButton
            id={BAR_OR_LINE_GRAPH_TYPES.BAR_GRAPH}
            name={BAR_OR_LINE_GRAPH_TYPES.BAR_GRAPH}
            variant="outlined"
            primary={!isBarGraphActive}
            secondary={isBarGraphActive}
            onClick={handleBarLineGraphChange}
            isLeft
          >
            Bar Graph
          </StyledStaticDynamicButton>
          <StyledStaticDynamicButton
            id={BAR_OR_LINE_GRAPH_TYPES.LINE_GRAPH}
            name={BAR_OR_LINE_GRAPH_TYPES.LINE_GRAPH}
            variant="outlined"
            primary={isBarGraphActive}
            secondary={!isBarGraphActive}
            onClick={handleBarLineGraphChange}
            isRight
          >
            Line Graph
          </StyledStaticDynamicButton>
        </StyledFlex>
      )}

      {showFiltersType?.settings?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_INDIVIDUAL_CHANNEL_POSITION_1] &&
        renderSwitch(
          'Show Individual Channels',
          CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_INDIVIDUAL_CHANNEL
        )}

      {showFiltersType?.settings?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.CHANNELS] && (
        <StyledFlex direction="row">
          {renderDivider()}

          <StyledFlex direction="row" alignItems="center" gap="15px" width="341px">
            <InputLabel label="Channels" size={15} mb={0} />

            <CustomSelect
              name={CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.CHANNELS}
              value={values[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.CHANNELS]}
              components={{
                DropdownIndicator: CustomDropdownIndicator,
              }}
              {...sharedDropdownProps}
              options={ALL_CHANNELS_OPTIONS}
              closeMenuOnSelect={false}
              onChange={handleGroupChannelFilterChange}
              menuWidth="254px"
              menuInputWidth="254px"
              placeholder="Select Channels..."
            />
          </StyledFlex>
        </StyledFlex>
      )}

      {showFiltersType?.settings?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_MOVING_AVERAGE]
        && renderSwitch('Show Moving Average', CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_MOVING_AVERAGE)}

      {showFiltersType?.settings?.[CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_INDIVIDUAL_CHANNEL_POSITION_2]
        && renderSwitch('Show Individual Channels', CONVERSE_DASHBOARD_FILTER_USE_FORMIK_KEYS.SETTINGS.SHOW_INDIVIDUAL_CHANNEL)}

    </StyledFlex>
  );
};

export default ChartFiltersSettings;
