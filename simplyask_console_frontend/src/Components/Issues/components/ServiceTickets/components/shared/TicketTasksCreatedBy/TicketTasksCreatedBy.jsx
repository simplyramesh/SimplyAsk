import React from 'react';

import { StyledFlex, StyledText } from '../../../../../../shared/styles/styled';
import { ISSUE_ENTITY_TYPE } from '../../../../../constants/core';

const TicketTasksCreatedBy = ({ value, relatedEntities }) => {
  const name = value?.toLowerCase();
  let additionalInfo = '';

  if (value === ISSUE_ENTITY_TYPE.PROCESS) {
    additionalInfo = relatedEntities
      .find((entity) => entity.type === ISSUE_ENTITY_TYPE.PROCESS)?.relatedEntity?.projectName;
  }

  return (
    <StyledFlex>
      <StyledText capitalize weight={600}>{name}</StyledText>
      {additionalInfo && (<StyledText weight={400}>{additionalInfo}</StyledText>)}
    </StyledFlex>
  );
};

export default TicketTasksCreatedBy;
