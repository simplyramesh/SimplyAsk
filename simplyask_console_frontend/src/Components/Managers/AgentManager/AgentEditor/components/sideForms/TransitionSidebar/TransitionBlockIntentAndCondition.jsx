import React from 'react'
import TransitionBlockConditionOnly from './TransitionBlockConditionOnly'
import TransitionBlockIntentOnly from './TransitionBlockIntentOnly'
import { StyledFlex } from '../../../../../../shared/styles/styled'

const TransitionBlockIntentAndCondition = ({
  intents,
  isIntentLoading,
  stepItemOpened,
  stepItem,
  onChange,
}) => {
  return (
    <StyledFlex display="flex" gap="30px">
      <TransitionBlockIntentOnly
        intents={intents}
        isIntentLoading={isIntentLoading}
        stepItemOpened={stepItemOpened}
        stepItem={stepItem}
        onChange={onChange}
      />
      <TransitionBlockConditionOnly
        stepItemOpened={stepItemOpened}
        stepItem={stepItem}
        onChange={onChange}
      />
    </StyledFlex>
  )
}

export default TransitionBlockIntentAndCondition
