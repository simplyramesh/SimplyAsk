import { useTheme } from '@emotion/react';
import Scrollbars from 'react-custom-scrollbars-2';

import { useGetCurrentUser } from '../../../../../../hooks/useGetCurrentUser';
import InfoListItem from '../../../../../shared/REDISIGNED/layouts/InfoList/InfoListItem';
import { StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import {
  renderInputData, renderFrequency, renderDate, renderDateTime, renderAssignee, renderGroupName,
} from '../../../../utils/formatters';

const ScheduledProcessEditorSummary = ({ selectedProcess }) => {
  const { colors } = useTheme();
  const { currentUser } = useGetCurrentUser();

  return (
    <Scrollbars>
      <StyledFlex padding="30px 10px">
        <StyledText weight={600} p="0 14px 5px 14px">Current Execution Details</StyledText>

        <InfoListItem name="Process" alignItems="center">
          {selectedProcess?.workflowName}
        </InfoListItem>

        <InfoListItem name="Group Name" alignItems="center">
          {renderGroupName(
            {},
            selectedProcess,
          )}
        </InfoListItem>
        <InfoListItem name="Input Data" alignItems="center">
          <StyledFlex>
            {renderInputData(
              {},
              selectedProcess,
            )}
          </StyledFlex>
        </InfoListItem>

        <InfoListItem name="Frequency" alignItems="center">
          <StyledFlex>
            {renderFrequency(
              {},
              selectedProcess,
            )}
          </StyledFlex>
        </InfoListItem>

        <InfoListItem name="Next Execution" alignItems="center">
          <StyledFlex>
            {renderDate(
              {},
              {
                ...selectedProcess,
                time: selectedProcess?.nextExecutionAt,
                timezone: currentUser?.timezone,
              },
            )}
          </StyledFlex>
        </InfoListItem>

        <InfoListItem name="Last Execution" alignItems="center">
          <StyledFlex>
            {renderDate(
              {},
              {
                ...selectedProcess,
                time: selectedProcess?.completedAt || selectedProcess?.executedAt,
                timezone: currentUser?.timezone,
              },
            )}
          </StyledFlex>
        </InfoListItem>

        <InfoListItem name="Created On" alignItems="center">
          <StyledFlex>
            {renderDateTime(
              {},
              {
                ...selectedProcess,
                time: selectedProcess?.createdAt,
                timezone: currentUser?.timezone,
              },
            )}
          </StyledFlex>
        </InfoListItem>

        <InfoListItem name="Created By" alignItems="center">
          <StyledFlex>
            {renderAssignee(
              {},
              {
                color: colors.primary,
                ...selectedProcess,
              },
            )}
          </StyledFlex>
        </InfoListItem>
      </StyledFlex>
    </Scrollbars>
  );
};

export default ScheduledProcessEditorSummary;
