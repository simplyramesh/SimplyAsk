import { useTheme } from '@mui/material/styles';
import moment from 'moment';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';

import routes from '../../../../../config/routes';
import { getAllExecutions } from '../../../../../Services/axios/migrate';
import { constructUrlSearchString } from '../../../../Settings/AccessManagement/utils/formatters';
import { StyledFlex, StyledStatus, StyledText } from '../../../../shared/styles/styled';
import { STATUS_MAP } from '../../../utils/mappers';

const SecondaryTopbar = () => {
  const { colors, boxShadows } = useTheme();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const executionId = searchParams.get('executionId');

  const executionIdParam = constructUrlSearchString({ ids: [`${executionId}`] });

  const { data: executionSummary } = useQuery({
    queryKey: ['getAllExecutions', executionId],
    queryFn: () => getAllExecutions(executionIdParam),
    enabled: !!executionId,
    select: (data) => data?.content?.[0],
  });

  const executionStatus = STATUS_MAP[executionSummary?.executionStatus];

  return (
    <StyledFlex
      position="relative"
      zIndex={2}
      direction="row"
      p="16px 40px 20px 36px"
      backgroundColor={colors.white}
      boxShadow={boxShadows.box}
      justifyContent="space-between"
    >
      <StyledFlex gap="18px 0" flex="1 1 auto">
        <StyledFlex direction="row" gap="0 36px">
          <StyledText lh={18} weight={600}>
            Execution ID
          </StyledText>
          <StyledText lh={18}>{`#${executionId}`}</StyledText>
        </StyledFlex>
        <StyledText
          lh={22.5}
          color={colors.linkColor}
          weight={600}
          cursor="pointer"
          onClick={() => {
            const status = executionStatus?.label;

            if (status === 'Processing' || status === 'Fallout') {
              navigate({
                pathname: routes.MR_MANAGER,
                search: 'executions',
              });
            }
          }}
        >
          {executionStatus?.label === 'Processing' && 'View detailed processing status'}
          {executionStatus?.label === 'Fallout' && 'View execution details'}
        </StyledText>
      </StyledFlex>

      <StyledFlex flex="1 1 auto" alignItems="center">
        <StyledFlex direction="row" gap="0 36px">
          <StyledText lh={18} weight={600}>
            Number of Records
          </StyledText>
          <StyledText lh={18}>{executionSummary?.numRecords}</StyledText>
        </StyledFlex>
      </StyledFlex>

      <StyledFlex direction="row" gap="6px 44px" flex="1 1 auto" justifyContent="flex-end">
        {executionStatus?.label !== 'Fallout' && (
          <StyledFlex gap="16px 0" justifyContent="center" mt="6px">
            <StyledText lh={18} weight={600} textAlign="right">
              Status
            </StyledText>
            <StyledText lh={18} size={14} weight={600} textAlign="right">
              Estimated End Time
            </StyledText>
          </StyledFlex>
        )}

        <StyledFlex gap="8px 0" justifyContent="flex-end">
          <StyledFlex direction="row" justifyContent="center">
            <StyledStatus color={executionStatus?.color}>{executionStatus?.label}</StyledStatus>
          </StyledFlex>
          <StyledFlex direction="row" justifyContent="center">
            {executionStatus?.label !== 'Processing' && executionStatus?.label !== 'Fallout' && (
              <StyledText lh={18} size={14}>
                {moment(executionSummary?.finishedAt).format('LL')}
              </StyledText>
            )}
            {executionStatus?.label === 'Fallout' && (
              <StyledText
                lh={22.5}
                color={colors.linkColor}
                weight={600}
                cursor="pointer"
                onClick={() => {
                  navigate({
                    pathname: routes.FALLOUT_TICKETS,
                  });
                }}
              >
                View fallout ticket details
              </StyledText>
            )}
          </StyledFlex>
        </StyledFlex>
      </StyledFlex>
    </StyledFlex>
  );
};

export default SecondaryTopbar;
