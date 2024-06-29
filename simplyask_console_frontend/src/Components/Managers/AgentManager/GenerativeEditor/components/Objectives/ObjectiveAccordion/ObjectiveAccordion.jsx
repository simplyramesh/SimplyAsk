import React, { memo, useState } from 'react';
import { StyledObjectiveAccordion, StyledObjectiveAccordionContent } from './StyledObjectiveAccordion';
import ObjectiveHead from './ObjectiveAccordionHead';

const ObjectiveAccordion = ({ children, name, index }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <StyledObjectiveAccordion>
      <ObjectiveHead name={name} expanded={expanded} setExpanded={setExpanded} index={index} />
      {expanded && <StyledObjectiveAccordionContent>{children}</StyledObjectiveAccordionContent>}
    </StyledObjectiveAccordion>
  );
};

export default memo(ObjectiveAccordion);
