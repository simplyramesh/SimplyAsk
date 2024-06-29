import { endOfDay } from 'date-fns';
import { useState } from 'react';

import { useGetCurrentUser } from '../../../../../../hooks/useGetCurrentUser';
import { StyledButton } from '../../../../../shared/REDISIGNED/controls/Button/StyledButton';
import CustomTableIcons from '../../../../../shared/REDISIGNED/icons/CustomTableIcons';
import CustomSelect from '../../../../../shared/REDISIGNED/selectMenus/CustomSelect';
import { StyledTooltip } from '../../../../../shared/REDISIGNED/tooltip/StyledTooltip';
import { StyledFlex, StyledText, StyledTextField } from '../../../../../shared/styles/styled';

import OrderConfigDatePicker from './OrderConfigDatePicker';

const CheckoutOrderConfigurations = ({
  isConfigEditable, orderConfig, setFieldValue, handleSubmit,
}) => {
  const { currentUser } = useGetCurrentUser();
  const [selectedReasonType, setSelectedReasonType] = useState(null);

  const reasonOptions = [
    { label: 'Lorum Ipsuim 1', value: 'Lorum Ipsuim 1' },
    { label: 'Lorum Ipsuim 2', value: 'Lorum Ipsuim 2' },
  ];

  const renderLabelWithTooltip = (labelTitle, tooltipTitle) => (
    <StyledFlex direction="row">
      <StyledText size={16} weight={600} lh={24}>{labelTitle}</StyledText>
      <StyledTooltip title={tooltipTitle} arrow placement="top" size="12px" lh="1.5" weight="500" radius="67px">
        <CustomTableIcons icon="INFO" width={16} display="inline" margin="4px 0 0 10px" style={{ zIndex: 0 }} />
      </StyledTooltip>
    </StyledFlex>
  );

  return (
    <StyledFlex direction="column" gap="30px">
      <StyledFlex direction={isConfigEditable ? 'row' : 'column'} gap="25px">
        <StyledFlex gap="17px" width="100%">
          {renderLabelWithTooltip('Service Request Date', 'Lorum Ipsum')}
          <OrderConfigDatePicker
            label="Service Request Date"
            selectedDate={orderConfig.requestedStartDate}
            onDateChange={(val) => setFieldValue('requestedStartDate', val)}
            isEditable={isConfigEditable}
            currentUser={currentUser}
            minDate={endOfDay(new Date())}
          />
        </StyledFlex>
        <StyledFlex gap="17px" width="100%">
          {renderLabelWithTooltip('Application Date', 'Lorum Ipsum')}
          <OrderConfigDatePicker
            label="Application Date"
            selectedDate={orderConfig.orderDate}
            onDateChange={(val) => setFieldValue('orderDate', val)}
            isEditable={isConfigEditable}
            currentUser={currentUser}
          />
        </StyledFlex>
      </StyledFlex>
      <StyledFlex gap="17px">
        {renderLabelWithTooltip('Reason', 'Lorum Ipsum')}
        <StyledFlex position="relative" flex="auto">
          {isConfigEditable ? (
            <StyledFlex>
              <CustomSelect
                name="reason"
                placeholder="Select Reason"
                options={reasonOptions}
                value={selectedReasonType}
                mb={0}
                closeMenuOnSelect
                form
                onChange={(selectedOption) => {
                  setSelectedReasonType(selectedOption);
                  setFieldValue('reason', selectedOption.value);
                }}
                isClearable={false}
                isSearchable={false}
              />
            </StyledFlex>
          ) : (
            <StyledText size={16} weight={400} lh={24}>{orderConfig?.reason}</StyledText>
          )}
        </StyledFlex>
      </StyledFlex>
      <StyledFlex gap="17px">
        {renderLabelWithTooltip('Reason Description', 'Lorum Ipsum')}
        <StyledFlex position="relative" flex="auto">
          {isConfigEditable ? (
            <StyledTextField
              name="description"
              placeholder="Enter Description..."
              value={orderConfig.description}
              onChange={(e) => setFieldValue('description', e.target.value)}
              variant="standard"
              multiline
              minRows={4}
            />
          ) : (
            <StyledText size={16} weight={400} lh={24}>{orderConfig.description}</StyledText>
          )}
        </StyledFlex>
      </StyledFlex>
      <StyledFlex alignItems="flex-start">
        {isConfigEditable && (
          <StyledButton
            secondary
            variant="contained"
            onClick={handleSubmit}
          >
            Save and Continue
          </StyledButton>
        )}
      </StyledFlex>
    </StyledFlex>
  );
};
export default CheckoutOrderConfigurations;
