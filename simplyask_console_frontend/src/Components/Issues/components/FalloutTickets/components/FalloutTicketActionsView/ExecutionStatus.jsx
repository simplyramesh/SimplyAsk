import { useTheme } from '@emotion/react';
import React from 'react';
import { accessObjectProperty } from '../../../../../../utils/helperFunctions';
import { StyledEmptyValue, StyledFlex, StyledText } from '../../../../../shared/styles/styled';
import { ActionsExecutionSectionContent, ActionsExecutionSectionItem } from './StyledFalloutTicketActionsView';

const BRACKETS_REGEX_FAILED_TASK_AT = /[\[\]]/g;

const ExecutionStatus = ({ ticket = {} }) => {
  const { colors } = useTheme();
  const failedTaskAt = ticket?.additionalFields?.failedTaskAt ?? '';

  const data = [
    { status: 'Incident Activity ID', key: 'failedActivityId' },
    { status: 'Error Type', key: 'additionalFields.errorType' },
    { status: 'Error Details', key: 'additionalFields.errorDetails' },
    { status: 'Failed Step', key: 'additionalFields.failedTaskStep' },
    { status: 'Fallout Message', key: 'additionalFields.incidentMessage' },
  ];

  const parseFailedTaskStepString = () => {
    const [stepName = '', stepId = ''] = (ticket?.additionalFields?.failedTaskStep ?? '')
      .split('*')
      .map((part) => part.trim());
    return { stepName: stepName || <StyledEmptyValue />, stepId };
  };

  const parseFailedTaskAtString = () => {
    const [failedTaskAtName = '', failedTaskAtId = ''] = failedTaskAt
      .replace(BRACKETS_REGEX_FAILED_TASK_AT, '')
      .split('*')
      .map((part) => part.trim());
    return { failedTaskAtName, failedTaskAtId };
  };

  const { stepName, stepId } = parseFailedTaskStepString();
  const { failedTaskAtName, failedTaskAtId } = parseFailedTaskAtString();

  return (
    <ActionsExecutionSectionContent>
      {data.map((item, index) => (
        <ActionsExecutionSectionItem key={index}>
          <StyledFlex direction="column">
            <StyledText size={16} lh={22} weight={600}>
              {item.status}
            </StyledText>
            {item.key !== 'additionalFields.failedTaskStep' ? (
              <StyledText size={16} lh={22} wordBreak="break-all">
                {accessObjectProperty(ticket, item.key) || <StyledEmptyValue />}
              </StyledText>
            ) : (
              <>
                <StyledText size={16} lh={22} wordBreak="break-all">
                  {stepName}
                </StyledText>
                <StyledText size={16} lh={22} color={colors.linkColor}>
                  {stepId}
                </StyledText>
                {failedTaskAt?.length > 0 && (
                  <>
                    <StyledFlex ml={2} mt={1} flexDirection="row">
                      <StyledText size={16} lh={22} weight={600}>
                        &bull; Failed At:
                      </StyledText>
                      <StyledFlex ml={1} as="span">
                        <StyledText size={16} lh={22} wordBreak="break-all">
                          {failedTaskAtName}
                        </StyledText>
                      </StyledFlex>
                    </StyledFlex>
                    <StyledFlex ml={3} flexDirection="row">
                      <StyledText size={16} lh={22} color={colors.linkColor}>
                        {failedTaskAtId}
                      </StyledText>
                    </StyledFlex>
                  </>
                )}
              </>
            )}
          </StyledFlex>
        </ActionsExecutionSectionItem>
      ))}
    </ActionsExecutionSectionContent>
  );
};

export default ExecutionStatus;
