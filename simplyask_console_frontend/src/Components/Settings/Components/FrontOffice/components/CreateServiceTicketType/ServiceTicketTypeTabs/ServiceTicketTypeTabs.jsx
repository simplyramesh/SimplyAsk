// import { FormControlLabel } from '@mui/material';
import { useTheme } from '@mui/system';
import {
  StyledCard,
  StyledCheckbox,
  StyledDivider,
  StyledFlex,
  StyledFormControlLabel,
  StyledText,
} from '../../../../../../shared/styles/styled';
import { SERVICE_TICKET_TABS_CONFIG } from '../../../../../../Issues/components/ServiceTickets/constants/core';

const ServiceTicketTypeTabs = ({ setFieldValue, values }) => {
  const { colors } = useTheme();

  const handleTabCheckboxChange = (e) => {
    const { checked, value } = e.target;
    const newTabs = checked ? [...values, value] : values.filter((t) => t !== value);

    setFieldValue('tabs', newTabs);
  };

  const renderCheckboxWithLabel = ({ label, checked, onChange, value }) => (
    <StyledFormControlLabel
      control={<StyledCheckbox name={label} checked={checked} onChange={onChange} value={value} />}
      label={label}
    />
  );

  return (
    <StyledCard>
      <StyledFlex p="8px 12px">
        <StyledFlex>
          <StyledText size={19} weight={600} lh={29}>
            Tabs
          </StyledText>
          <StyledText lh={24}>Configure the tabs that will appear on the detailed view for this ticket type</StyledText>
        </StyledFlex>
        <StyledDivider m="30px 0 30px 0" color={colors.cardGridItemBorder} />
        <StyledFlex direction="row" gap="0 44px">
          {Object.keys(SERVICE_TICKET_TABS_CONFIG).map((key) =>
            renderCheckboxWithLabel({
              label: SERVICE_TICKET_TABS_CONFIG[key].label,
              checked: values.includes(SERVICE_TICKET_TABS_CONFIG[key].value),
              onChange: handleTabCheckboxChange,
              value: SERVICE_TICKET_TABS_CONFIG[key].value,
            })
          )}
        </StyledFlex>
      </StyledFlex>
    </StyledCard>
  );
};

export default ServiceTicketTypeTabs;
