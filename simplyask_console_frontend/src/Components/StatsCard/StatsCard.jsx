import PropTypes from 'prop-types';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from 'simplexiar_react_components';

import AutomationIcon from '../../Assets/icons/automation.svg?component';
import CallDurationIcon from '../../Assets/icons/call_duration.svg?component';
import CommentsIcon from '../../Assets/icons/comments.svg?component';
import CallTransferIcon from '../../Assets/icons/transfer_call.svg?component';
import { getAutomationPercentageOfDay, getNumberChatsOfDay } from '../../Services/axios/foaDashboard';
import Spinner from '../shared/Spinner/Spinner';
import classes from './StatsCard.module.css';

const STATS_ICONS = {
  AUTOMATION: AutomationIcon,
  CALL_DURATION: CallDurationIcon,
  CALL_TRANSFER: CallTransferIcon,
  COMMENTS: CommentsIcon,
};

const StatsCard = ({ type, channel }) => {
  const { data: automationPercentage, isAutomationLoading } = useQuery({
    queryKey: ['URLForAutomationPercentageOfDay'],
    queryFn: getAutomationPercentageOfDay,
  });

  const { data: numberChatsOfDay, isChatsLoading } = useQuery({
    queryKey: ['URLForNumberChatsOfDay'],
    queryFn: getNumberChatsOfDay,
  });

  let Icon;
  let unit;

  if (type === 'automationPercentageOfDay') {
    Icon = STATS_ICONS.AUTOMATION;
    unit = '%';
  } else if (type === 'averageCallDurationOfDay') {
    Icon = STATS_ICONS.CALL_DURATION;
    unit = 'minutes';
  } else if (type === 'percentageTransferCallsOfDay') {
    if (channel === 'chat') {
      Icon = STATS_ICONS.COMMENTS;
      unit = 'chats';
    } else {
      Icon = STATS_ICONS.CALL_TRANSFER;
      unit = 'calls';
    }
  } else if (type === 'numberCallsOfDay') {
    if (channel === 'chat') {
      Icon = STATS_ICONS.COMMENTS;
      unit = 'chats';
    } else {
      Icon = STATS_ICONS.CALL_TRANSFER;
      unit = 'calls';
    }
  }

  return (
    <Card className={classes.root}>
      {isAutomationLoading || isChatsLoading ? (
        <Spinner inline />
      ) : (
        <div className={classes.Title}>
          <div className={classes.Icon}>{Icon && <Icon />}</div>
          <div className={classes.Data}>
            <div className={classes.Name_parent}>
              <p className={classes.Name}>
                {type === 'automationPercentageOfDay' ? automationPercentage?.data.name : null}
                {type === 'numberCallsOfDay' && channel === 'voice' ? 'Number of calls today' : null}
                {type === 'numberCallsOfDay' && channel === 'chat' ? numberChatsOfDay?.data.name : null}
              </p>
            </div>

            <div className={classes.Stats}>
              <p className={classes.Number}>
                {type === 'automationPercentageOfDay' ? automationPercentage?.data.data : null}
                {type === 'numberCallsOfDay' && channel === 'voice' ? 0 : null}
                {type === 'numberCallsOfDay' && channel === 'chat' ? numberChatsOfDay?.data.data : null}
              </p>
              <p className={classes.Unit}>{unit}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default StatsCard;

StatsCard.propTypes = {
  type: PropTypes.string,
  channel: PropTypes.string,
};
